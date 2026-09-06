"""
Compare le Qwen de base et le Qwen Yelhaa affiné sur les mêmes briefs.

Via Ollama (rapide, après export) :
    python ai-training/scripts/evaluate.py --backend ollama --base qwen3:4b --candidate yelhaa-qwen

Via transformers (avant export, lent sur CPU — l'adaptateur est appliqué au modèle de base) :
    python ai-training/scripts/evaluate.py --backend transformers --adapter ai-training/outputs/adapter --limit 3

Perte sur le jeu de validation (transformers uniquement) :
    python ai-training/scripts/evaluate.py --backend transformers --adapter ai-training/outputs/adapter --loss --no-generate

Le rapport (`outputs/eval/<horodatage>/report.md`) juxtapose, pour chaque
brief, des indices lisibles : couverture des dimensions d'un prompt de site,
concret, structure, formules creuses, respect de la direction artistique
demandée, éléments requis, répétitions. Ce sont des heuristiques ; le rapport
ne conclut jamais qu'un modèle est « meilleur » — il met les deux sorties
côte à côte pour qu'une personne tranche.
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import time
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Callable

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from yelhaa_training import paths  # noqa: E402
from yelhaa_training.config import ConfigError, load_config, resolve_cpu_threads  # noqa: E402
from yelhaa_training.console import ensure_utf8_output  # noqa: E402
from yelhaa_training.dataset import Rejection, iter_raw_records, load_examples_strict  # noqa: E402
from yelhaa_training.formatting import EncodedExample, SkippedExample, encode_example  # noqa: E402
from yelhaa_training.hardware import (  # noqa: E402
    configure_torch,
    missing_dependency_message,
    set_thread_env,
    torch_dtype,
)
from yelhaa_training.scoring import DIMENSION_LABELS, Scores, format_delta, score_output  # noqa: E402

Generator = Callable[[str, str | None], str]


# ---------------------------------------------------------------------------
# Jeu d'évaluation
# ---------------------------------------------------------------------------


def load_eval_set(path: Path, limit: int | None) -> list[dict[str, Any]]:
    items: list[dict[str, Any]] = []
    for record in iter_raw_records(path):
        if isinstance(record, Rejection):
            raise ValueError(f"{record.source}: {record.reason} {record.detail}")
        raw, source = record
        if not isinstance(raw, dict) or not isinstance(raw.get("brief"), str):
            raise ValueError(f"{source}: chaque ligne doit avoir un champ `brief` (chaîne)")
        items.append({
            "id": str(raw.get("id") or f"item-{len(items) + 1}"),
            "brief": raw["brief"].strip(),
            "art_direction": [str(t) for t in raw.get("art_direction", [])],
            "must_cover": [str(t) for t in raw.get("must_cover", [])],
            "category": str(raw.get("category", "")),
            "source": source,
        })
    if limit:
        items = items[:limit]
    if not items:
        raise ValueError(f"jeu d'évaluation vide : {paths.display(path)}")
    return items


# ---------------------------------------------------------------------------
# Générateurs
# ---------------------------------------------------------------------------


def ollama_generator(model: str, *, host: str, api_key: str | None, max_new_tokens: int, temperature: float) -> Generator:
    def generate(brief: str, system: str | None) -> str:
        messages = ([{"role": "system", "content": system}] if system else []) + [{"role": "user", "content": brief}]
        payload = json.dumps({
            "model": model,
            "messages": messages,
            "stream": False,
            "think": False,
            "options": {"num_predict": max_new_tokens, "temperature": temperature},
        }).encode("utf-8")
        request = urllib.request.Request(
            host.rstrip("/") + "/api/chat", data=payload, method="POST",
            headers={"Content-Type": "application/json", **({"Authorization": f"Bearer {api_key}"} if api_key else {})},
        )
        try:
            with urllib.request.urlopen(request, timeout=1800) as response:
                body = json.loads(response.read().decode("utf-8"))
        except urllib.error.HTTPError as error:
            detail = error.read().decode("utf-8", errors="replace")
            raise RuntimeError(f"Ollama {error.code} pour {model!r} : {detail[:300]}") from error
        except urllib.error.URLError as error:
            raise RuntimeError(f"Ollama injoignable sur {host} : {error.reason}") from error
        return str(body.get("message", {}).get("content", "")).strip()

    return generate


def transformers_generator(model: Any, tokenizer: Any, torch: Any, *, max_new_tokens: int, temperature: float, enable_thinking: bool) -> Generator:
    def generate(brief: str, system: str | None) -> str:
        messages = ([{"role": "system", "content": system}] if system else []) + [{"role": "user", "content": brief}]
        prompt = tokenizer.apply_chat_template(
            messages, tokenize=False, add_generation_prompt=True, enable_thinking=enable_thinking,
        )
        inputs = tokenizer(prompt, return_tensors="pt", add_special_tokens=False)
        kwargs: dict[str, Any] = {"max_new_tokens": max_new_tokens, "pad_token_id": tokenizer.pad_token_id}
        if temperature > 0:
            kwargs.update({"do_sample": True, "temperature": temperature, "top_p": 0.95, "top_k": 20})
        else:
            kwargs["do_sample"] = False
        with torch.inference_mode():
            output = model.generate(**inputs, **kwargs)
        generated = output[0][inputs["input_ids"].shape[1]:]
        return tokenizer.decode(generated, skip_special_tokens=True).strip()

    return generate


def strip_thinking(text: str) -> str:
    """Retire un éventuel bloc <think>…</think> laissé en tête de réponse."""
    if "</think>" in text:
        return text.split("</think>", 1)[1].strip()
    return text


# ---------------------------------------------------------------------------
# Perte de validation
# ---------------------------------------------------------------------------


def mean_validation_loss(model: Any, torch: Any, items: list[EncodedExample]) -> float:
    model.eval()
    total_loss = 0.0
    total_tokens = 0
    with torch.inference_mode():
        for item in items:
            batch = {
                "input_ids": torch.tensor([item.input_ids]),
                "attention_mask": torch.tensor([item.attention_mask]),
                "labels": torch.tensor([item.labels]),
            }
            output = model(**batch)
            supervised = item.target_tokens
            total_loss += float(output.loss) * supervised
            total_tokens += supervised
    return total_loss / max(1, total_tokens)


# ---------------------------------------------------------------------------
# Rapport
# ---------------------------------------------------------------------------


def render_report(
    *,
    base_label: str,
    candidate_label: str,
    rows: list[dict[str, Any]],
    losses: dict[str, float] | None,
    backend: str,
) -> str:
    lines = [
        "# Évaluation — Qwen de base vs Qwen Yelhaa",
        "",
        f"- Généré le {datetime.now(timezone.utc).isoformat(timespec='seconds')} · backend `{backend}`",
        f"- Base : `{base_label}` · Candidat : `{candidate_label}`",
        f"- {len(rows)} brief(s) identiques envoyés aux deux modèles",
        "",
        "> Les scores sont des **heuristiques de lecture** (0 à 1), pas des mesures de qualité. "
        "Un Δ positif signale une différence à regarder, pas une victoire. Lire les deux sorties avant de conclure.",
        "",
    ]
    if losses:
        lines += ["## Perte sur le jeu de validation (moyenne par jeton supervisé)", ""]
        lines += [f"- `{name}` : {value:.4f}" for name, value in losses.items()]
        lines += ["", "Une perte plus basse veut dire que le modèle prédit mieux *ces* réponses de validation — "
                  "c'est attendu après affinage et cela ne mesure pas l'utilité des prompts.", ""]

    dims = list(DIMENSION_LABELS)
    averages_base = {d: sum(r["base"]["scores"][d] for r in rows) / len(rows) for d in dims}
    averages_cand = {d: sum(r["candidate"]["scores"][d] for r in rows) / len(rows) for d in dims}
    lines += ["## Moyennes sur tous les briefs", "", "| dimension | base | candidat | Δ |", "|---|---|---|---|"]
    for d in dims:
        lines.append(f"| {DIMENSION_LABELS[d]} | {averages_base[d]:.2f} | {averages_cand[d]:.2f} | {format_delta(averages_base[d], averages_cand[d])} |")
    lines.append("")

    for row in rows:
        lines += [f"## {row['id']}" + (f" · {row['category']}" if row["category"] else ""), "", f"**Brief.** {row['brief']}", ""]
        if row["art_direction"]:
            lines.append(f"Direction artistique attendue : {', '.join(row['art_direction'])}  ")
        if row["must_cover"]:
            lines.append(f"Doit couvrir : {', '.join(row['must_cover'])}")
        lines += ["", "| dimension | base | candidat | Δ |", "|---|---|---|---|"]
        for d in dims:
            b, c = row["base"]["scores"][d], row["candidate"]["scores"][d]
            lines.append(f"| {DIMENSION_LABELS[d]} | {b:.2f} | {c:.2f} | {format_delta(b, c)} |")
        lines.append("")
        for side in ("base", "candidate"):
            detail = row[side]
            lines.append(f"- {side} : {detail['words']} mots, {detail['seconds']:.0f} s"
                         + (f" ; dimensions absentes : {', '.join(detail['aspects_missed'])}" if detail["aspects_missed"] else "")
                         + (f" ; formules creuses : {', '.join(detail['filler_found'])}" if detail["filler_found"] else "")
                         + (f" ; DA manquée : {', '.join(detail['art_direction_missed'])}" if detail["art_direction_missed"] else "")
                         + (f" ; non couvert : {', '.join(detail['must_cover_missed'])}" if detail["must_cover_missed"] else ""))
        lines.append("")
        for side, label in (("base", base_label), ("candidate", candidate_label)):
            lines += [f"<details><summary>Sortie {side} — {label}</summary>", "", "```text", row[side]["output"] or "(vide)", "```", "", "</details>", ""]
    return "\n".join(lines)


# ---------------------------------------------------------------------------
# Programme principal
# ---------------------------------------------------------------------------


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--backend", choices=("ollama", "transformers"), default="ollama")
    parser.add_argument("--eval-set", default=str(paths.DEFAULT_EVAL_SET))
    parser.add_argument("--limit", type=int, help="ne traiter que les N premiers briefs")
    parser.add_argument("--config", default=str(paths.DEFAULT_CONFIG), help="YAML (modèle de base, dtype, system_prompt)")
    parser.add_argument("--system-file", help="message système à envoyer aux deux modèles (défaut : celui du YAML, sinon aucun)")
    parser.add_argument("--max-new-tokens", type=int, default=700)
    parser.add_argument("--temperature", type=float, default=0.0, help="0 = glouton/déterministe")
    parser.add_argument("--output-dir", default=str(paths.EVAL_OUTPUT_DIR))
    # Ollama
    parser.add_argument("--base", default="qwen3:4b", help="[ollama] tag du modèle de base")
    parser.add_argument("--candidate", default=os.environ.get("YELHAA_QWEN_MODEL") or "yelhaa-qwen", help="[ollama] tag du modèle affiné")
    parser.add_argument("--host", default=os.environ.get("OLLAMA_HOST") or "http://localhost:11434")
    # transformers
    parser.add_argument("--adapter", default=str(paths.ADAPTER_DIR), help="[transformers] dossier de l'adaptateur LoRA")
    parser.add_argument("--base-model", help="[transformers] surcharge model_name du YAML")
    parser.add_argument("--loss", action="store_true", help="[transformers] perte moyenne sur le jeu de validation")
    parser.add_argument("--loss-examples", type=int, default=16)
    parser.add_argument("--no-generate", action="store_true", help="sauter la génération (avec --loss)")
    ensure_utf8_output()  # avant parse_args : l'aide contient des caractères hors CP1252
    args = parser.parse_args(argv)

    try:
        config = load_config(args.config)
    except ConfigError as error:
        print(f"[evaluate] {error}")
        return 2
    try:
        eval_items = load_eval_set(paths.resolve(args.eval_set), args.limit)
    except (ValueError, FileNotFoundError) as error:
        print(f"[evaluate] {error}")
        return 2

    system: str | None
    if args.system_file:
        system = paths.resolve(args.system_file).read_text(encoding="utf-8").strip() or None
    else:
        system = config.resolved_system_prompt()

    run_dir = paths.resolve(args.output_dir) / datetime.now().strftime("%Y%m%d-%H%M%S")
    run_dir.mkdir(parents=True, exist_ok=True)
    losses: dict[str, float] | None = None

    if args.backend == "ollama":
        if args.no_generate:
            print("[evaluate] --no-generate n'a de sens qu'avec --backend transformers --loss")
            return 2
        base_label, candidate_label = args.base, args.candidate
        api_key = os.environ.get("OLLAMA_API_KEY") or None
        base_gen = ollama_generator(args.base, host=args.host, api_key=api_key, max_new_tokens=args.max_new_tokens, temperature=args.temperature)
        cand_gen = ollama_generator(args.candidate, host=args.host, api_key=api_key, max_new_tokens=args.max_new_tokens, temperature=args.temperature)
        print(f"[evaluate] Ollama {args.host} — base {args.base} · candidat {args.candidate}")
        rows = run_pairs(eval_items, base_gen, cand_gen, system)
    else:
        adapter_dir = paths.resolve(args.adapter)
        if not (adapter_dir / "adapter_config.json").is_file():
            print(f"[evaluate] adaptateur introuvable : {paths.display(adapter_dir)} (adapter_config.json absent) — entraîner d'abord")
            return 2
        model_name = args.base_model or config.model_name
        threads = resolve_cpu_threads(config)
        set_thread_env(threads)
        try:
            torch = configure_torch(threads)
            from peft import PeftModel
            from transformers import AutoModelForCausalLM, AutoTokenizer
        except ModuleNotFoundError as error:
            print(f"[evaluate] {missing_dependency_message(error)}")
            return 1

        print(f"[evaluate] transformers CPU ({threads} fils) — chargement de {model_name} en {config.torch_dtype}…")
        tokenizer = AutoTokenizer.from_pretrained(model_name)
        if tokenizer.pad_token_id is None:
            tokenizer.pad_token = tokenizer.eos_token
        model = AutoModelForCausalLM.from_pretrained(model_name, torch_dtype=torch_dtype(config.torch_dtype), low_cpu_mem_usage=True)
        model.eval()
        base_label, candidate_label = model_name, paths.display(adapter_dir)

        validation_items: list[EncodedExample] = []
        if args.loss:
            try:
                examples = load_examples_strict(config.validation_path)[: args.loss_examples]
            except (FileNotFoundError, ValueError) as error:
                print(f"[evaluate] --loss ignoré : {error}")
                examples = []
            for example in examples:
                encoded = encode_example(tokenizer, example, max_seq_length=config.max_seq_length, system_prompt=system, enable_thinking=config.enable_thinking)
                if not isinstance(encoded, SkippedExample):
                    validation_items.append(encoded)

        rows: list[dict[str, Any]] = []
        base_outputs: dict[str, tuple[str, float]] = {}
        if not args.no_generate:
            base_gen = transformers_generator(model, tokenizer, torch, max_new_tokens=args.max_new_tokens, temperature=args.temperature, enable_thinking=config.enable_thinking)
            for item in eval_items:
                base_outputs[item["id"]] = timed(base_gen, item["brief"], system, f"base · {item['id']}")
        if validation_items:
            losses = {f"base ({model_name})": mean_validation_loss(model, torch, validation_items)}
            print(f"[evaluate] perte base : {losses[f'base ({model_name})']:.4f} sur {len(validation_items)} exemple(s)")

        print(f"[evaluate] application de l'adaptateur {paths.display(adapter_dir)}…")
        model = PeftModel.from_pretrained(model, str(adapter_dir))
        model.eval()
        if validation_items and losses is not None:
            losses["fine-tuned (adaptateur)"] = mean_validation_loss(model, torch, validation_items)
            print(f"[evaluate] perte affinée : {losses['fine-tuned (adaptateur)']:.4f}")
        if not args.no_generate:
            cand_gen = transformers_generator(model, tokenizer, torch, max_new_tokens=args.max_new_tokens, temperature=args.temperature, enable_thinking=config.enable_thinking)
            for item in eval_items:
                cand_output = timed(cand_gen, item["brief"], system, f"candidat · {item['id']}")
                rows.append(build_row(item, base_outputs[item["id"]], cand_output))

    result = {
        "backend": args.backend,
        "base": base_label,
        "candidate": candidate_label,
        "system_prompt_used": bool(system),
        "losses": losses,
        "rows": rows,
    }
    (run_dir / "results.json").write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    if rows:
        report = render_report(base_label=base_label, candidate_label=candidate_label, rows=rows, losses=losses, backend=args.backend)
        (run_dir / "report.md").write_text(report, encoding="utf-8")
        print()
        print_summary(rows)
        print(f"\n[evaluate] rapport → {paths.display(run_dir / 'report.md')}")
    else:
        print(f"[evaluate] résultats → {paths.display(run_dir / 'results.json')}")
    print("[evaluate] rappel : les indices n'établissent pas qu'un modèle est meilleur — lire les sorties.")
    return 0


def timed(generate: Generator, brief: str, system: str | None, label: str) -> tuple[str, float]:
    print(f"  → {label}…", flush=True)
    started = time.monotonic()
    output = strip_thinking(generate(brief, system))
    seconds = time.monotonic() - started
    print(f"    {len(output.split())} mots en {seconds:.0f} s")
    return output, seconds


def run_pairs(items: list[dict[str, Any]], base_gen: Generator, cand_gen: Generator, system: str | None) -> list[dict[str, Any]]:
    rows = []
    for item in items:
        base = timed(base_gen, item["brief"], system, f"base · {item['id']}")
        cand = timed(cand_gen, item["brief"], system, f"candidat · {item['id']}")
        rows.append(build_row(item, base, cand))
    return rows


def build_row(item: dict[str, Any], base: tuple[str, float], candidate: tuple[str, float]) -> dict[str, Any]:
    def side(output: str, seconds: float) -> dict[str, Any]:
        scores: Scores = score_output(output, art_direction=item["art_direction"], must_cover=item["must_cover"])
        return {
            "output": output,
            "seconds": seconds,
            "words": scores.words,
            "scores": scores.as_row(),
            "aspects_missed": scores.aspects_missed,
            "filler_found": scores.filler_found,
            "art_direction_missed": scores.art_direction_missed,
            "must_cover_missed": scores.must_cover_missed,
        }

    return {
        "id": item["id"],
        "category": item["category"],
        "brief": item["brief"],
        "art_direction": item["art_direction"],
        "must_cover": item["must_cover"],
        "base": side(*base),
        "candidate": side(*candidate),
    }


def print_summary(rows: list[dict[str, Any]]) -> None:
    dims = list(DIMENSION_LABELS)
    print(f"{'dimension':<32} {'base':>6} {'cand.':>6} {'Δ':>6}")
    for d in dims:
        b = sum(r["base"]["scores"][d] for r in rows) / len(rows)
        c = sum(r["candidate"]["scores"][d] for r in rows) / len(rows)
        print(f"{DIMENSION_LABELS[d]:<32} {b:>6.2f} {c:>6.2f} {format_delta(b, c):>6}")


if __name__ == "__main__":
    sys.exit(main())
