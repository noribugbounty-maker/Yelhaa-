"""
Valide un JSONL canonique et rend un rapport structurel + qualité.

    python ai-training/scripts/validate_dataset.py
    python ai-training/scripts/validate_dataset.py dataset/splits/train.jsonl --tokenizer Qwen/Qwen3-1.7B

Code de sortie :
  0  jeu de données structurellement valide
  1  au moins une ligne invalide (JSON illisible, rôles faux, message vide…)
  2  fichier introuvable ou vide
  3  `--strict` et un avertissement qualité bloquant (trop peu d'exemples, doublons excessifs)

Sans `--tokenizer`, les longueurs sont **estimées** (~3,6 caractères/jeton,
borne haute). Avec, elles sont mesurées par le vrai tokenizer Qwen — utile
pour caler `max_seq_length`.
"""

from __future__ import annotations

import argparse
import json
import sys
from collections import Counter
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from yelhaa_training import paths  # noqa: E402
from yelhaa_training.console import ensure_utf8_output  # noqa: E402
from yelhaa_training.dataset import Example, dedupe_key, example_lengths, read_examples  # noqa: E402
from yelhaa_training.quality import (  # noqa: E402
    DUPLICATION_WARNING_RATE,
    MIN_EXAMPLES_RECOMMENDED,
    build_quality_report,
    format_quality_report,
)

STRUCTURAL = {
    "missing-user": ("missing-user-message", "roles-not-alternating", "missing-messages"),
    "missing-assistant": ("missing-assistant-message",),
    "empty-prompt": ("empty-user-message", "empty-system-message"),
    "empty-response": ("empty-assistant-message",),
    "malformed-json": ("malformed-json", "not-an-object", "unsupported-file"),
}


def measured_lengths(examples: list[Example], tokenizer_name: str) -> list[tuple[int, int, int]]:
    """(jetons du préfixe, jetons de la cible, total) mesurés avec le gabarit officiel."""
    from transformers import AutoTokenizer

    from yelhaa_training.formatting import render_prompt_and_target

    tokenizer = AutoTokenizer.from_pretrained(tokenizer_name)
    rows: list[tuple[int, int, int]] = []
    for example in examples:
        prompt_text, target_text = render_prompt_and_target(tokenizer, example.messages)
        prompt = len(tokenizer(prompt_text, add_special_tokens=False)["input_ids"])
        target = len(tokenizer(target_text, add_special_tokens=False)["input_ids"])
        rows.append((prompt, target, prompt + target))
    return rows


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("dataset", nargs="?", default=str(paths.PROCESSED_DATASET), help="JSONL à valider")
    parser.add_argument("--tokenizer", help="nom HF du tokenizer pour des longueurs exactes (ex. Qwen/Qwen3-1.7B)")
    parser.add_argument("--max-seq-length", type=int, default=2048, help="borne utilisée pour compter les dépassements")
    parser.add_argument("--report", help="écrire le rapport JSON à ce chemin")
    parser.add_argument("--strict", action="store_true", help="échouer aussi sur les alertes qualité bloquantes")
    parser.add_argument(
        "--min-examples", type=int, default=MIN_EXAMPLES_RECOMMENDED,
        help=f"minimum exigé par --strict (défaut {MIN_EXAMPLES_RECOMMENDED})",
    )
    ensure_utf8_output()  # avant parse_args : l'aide contient des caractères hors CP1252
    args = parser.parse_args(argv)

    dataset_path = paths.resolve(args.dataset)
    if not dataset_path.is_file():
        print(f"[validate] introuvable : {paths.display(dataset_path)} — lancer prepare_dataset.py d'abord")
        return 2

    examples, rejections = read_examples(dataset_path)
    total = len(examples) + len(rejections)
    if total == 0:
        print(f"[validate] fichier vide : {paths.display(dataset_path)}")
        return 2

    reasons = Counter(r.reason for r in rejections)
    buckets = {name: sum(reasons.get(r, 0) for r in codes) for name, codes in STRUCTURAL.items()}

    # Doublons au sein du fichier validé (sans les retirer).
    seen: dict[str, str] = {}
    duplicates: list[tuple[str, str]] = []
    for example in examples:
        key = dedupe_key(example)
        if key in seen:
            duplicates.append((example.source, seen[key]))
        else:
            seen[key] = example.source

    if args.tokenizer:
        try:
            rows = measured_lengths(examples, args.tokenizer)
            length_mode = f"mesurées ({args.tokenizer})"
        except ImportError:
            print("[validate] transformers indisponible : longueurs estimées à la place")
            rows = [(i, o, i + o) for i, o in (example_lengths(e) for e in examples)]
            length_mode = "estimées"
    else:
        rows = [(i, o, i + o) for i, o in (example_lengths(e) for e in examples)]
        length_mode = "estimées"

    inputs = [r[0] for r in rows]
    outputs = [r[1] for r in rows]
    totals = [r[2] for r in rows]
    avg = lambda values: (sum(values) / len(values)) if values else 0.0  # noqa: E731
    over_limit = sum(1 for t in totals if t > args.max_seq_length)

    quality = build_quality_report(
        examples,
        duplicate_count=len(duplicates),
        malformed_json=buckets["malformed-json"],
        empty_responses=buckets["empty-response"],
    )

    print(f"Validation — {paths.display(dataset_path)}")
    print(f"  exemples (lignes)             {total}")
    print(f"  valides                       {len(examples)}")
    print(f"  invalides                     {len(rejections)}")
    print(f"  sans message user             {buckets['missing-user']}")
    print(f"  sans message assistant        {buckets['missing-assistant']}")
    print(f"  prompts vides                 {buckets['empty-prompt']}")
    print(f"  réponses vides                {buckets['empty-response']}")
    print(f"  JSON illisible                {buckets['malformed-json']}")
    print(f"  doublons                      {len(duplicates)}")
    print(f"  longueurs {length_mode}")
    print(f"    entrée moyenne              {avg(inputs):.0f} jetons")
    print(f"    sortie moyenne              {avg(outputs):.0f} jetons")
    print(f"    séquence max                {max(totals) if totals else 0} jetons")
    print(f"    > max_seq_length ({args.max_seq_length})   {over_limit}")
    if rejections:
        print("  premiers rejets :")
        for rejection in rejections[:15]:
            detail = f" — {rejection.detail}" if rejection.detail else ""
            print(f"    · {rejection.source}: {rejection.reason}{detail}")
        if len(rejections) > 15:
            print(f"    … {len(rejections) - 15} autre(s)")
    if duplicates:
        print("  doublons :")
        for source, original in duplicates[:10]:
            print(f"    · {source} = {original}")
    print()
    print(format_quality_report(quality))

    if args.report:
        report_path = paths.resolve(args.report)
        report_path.parent.mkdir(parents=True, exist_ok=True)
        report_path.write_text(
            json.dumps(
                {
                    "dataset": paths.display(dataset_path),
                    "total": total,
                    "valid": len(examples),
                    "invalid": len(rejections),
                    "structural": buckets,
                    "duplicates": [{"source": s, "duplicate_of": o} for s, o in duplicates],
                    "lengths": {
                        "mode": length_mode,
                        "avg_input": round(avg(inputs), 1),
                        "avg_output": round(avg(outputs), 1),
                        "max_sequence": max(totals) if totals else 0,
                        "over_limit": over_limit,
                        "max_seq_length": args.max_seq_length,
                    },
                    "rejections": [r.to_record() for r in rejections],
                    "quality": quality.to_dict(),
                },
                ensure_ascii=False,
                indent=2,
            ),
            encoding="utf-8",
        )
        print(f"\n[validate] rapport → {paths.display(report_path)}")

    if rejections:
        print(f"\n[validate] ÉCHEC : {len(rejections)} ligne(s) structurellement invalide(s)")
        return 1
    if not examples:
        print("\n[validate] ÉCHEC : aucun exemple valide")
        return 2
    if args.strict:
        blocking: list[str] = []
        if len(examples) < args.min_examples:
            blocking.append(f"{len(examples)} exemple(s) < --min-examples {args.min_examples}")
        if quality.duplication_rate > DUPLICATION_WARNING_RATE:
            blocking.append(f"taux de doublons {quality.duplication_rate:.0%}")
        if quality.repeated_outputs:
            blocking.append(f"{len(quality.repeated_outputs)} réponse(s) recopiée(s)")
        if blocking:
            print("\n[validate] ÉCHEC (--strict) : " + " ; ".join(blocking))
            return 3
    print("\n[validate] OK")
    return 0


if __name__ == "__main__":
    sys.exit(main())
