"""
Fusionne l'adaptateur LoRA dans Qwen3-1.7B, convertit en GGUF, prépare Ollama.

    python ai-training/scripts/export.py                 # fusion + GGUF (si llama.cpp présent) + Modelfile
    python ai-training/scripts/export.py --check         # seulement l'état de l'outillage, rien n'est écrit
    python ai-training/scripts/export.py --skip-merge    # réutiliser outputs/exported/merged
    python ai-training/scripts/export.py --create        # …et exécuter `ollama create yelhaa-qwen`

Chaîne :  Qwen3-1.7B + adaptateur → modèle fusionné (Safetensors, tokenizer
préservé) → GGUF (convert_hf_to_gguf.py de llama.cpp) → Modelfile → Ollama.

Rien n'est simulé : si llama.cpp ou le paquet `gguf` manquent, le script le dit,
donne la commande exacte à lancer et s'arrête. Le modèle `qwen3:4b` existant
n'est jamais modifié ; `yelhaa-qwen` est un modèle séparé.
"""

from __future__ import annotations

import argparse
import importlib.util
import json
import os
import shutil
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from yelhaa_training import paths  # noqa: E402
from yelhaa_training.config import ConfigError, load_config, resolve_cpu_threads  # noqa: E402
from yelhaa_training.console import ensure_utf8_output  # noqa: E402
from yelhaa_training.hardware import configure_torch, missing_dependency_message, set_thread_env  # noqa: E402
from yelhaa_training.modelfile import (  # noqa: E402
    DEFAULT_MODEL_TAG,
    DEFAULT_NUM_CTX,
    DEFAULT_TEMPLATE_SOURCE,
    build_modelfile,
    find_ollama,
    resolve_template,
)

LLAMA_CPP_ENV = "LLAMA_CPP_DIR"
CONVERT_SCRIPT = "convert_hf_to_gguf.py"
LLAMA_CPP_CLONE = "git clone --depth 1 https://github.com/ggml-org/llama.cpp ai-training/tools/llama.cpp"
PROTECTED_TAG_PREFIXES = ("qwen3", "qwen2", "qwen")
GGUF_OUTTYPES = ("q8_0", "f16", "bf16", "f32")


def log(message: str = "") -> None:
    print(f"[export] {message}" if message else "", flush=True)


# ---------------------------------------------------------------------------
# Détection de l'outillage
# ---------------------------------------------------------------------------


def find_llama_cpp(explicit: str | None) -> Path | None:
    candidates: list[Path] = []
    if explicit:
        candidates.append(paths.resolve(explicit))
    env = os.environ.get(LLAMA_CPP_ENV)
    if env:
        candidates.append(Path(env).expanduser())
    candidates += [
        paths.TRAINING_ROOT / "tools" / "llama.cpp",
        paths.REPO_ROOT / "llama.cpp",
        Path.home() / "llama.cpp",
        Path.home() / "src" / "llama.cpp",
    ]
    for candidate in candidates:
        if (candidate / CONVERT_SCRIPT).is_file():
            return candidate
    return None


def find_quantize_binary(llama_cpp: Path | None) -> str | None:
    found = shutil.which("llama-quantize")
    if found:
        return found
    if llama_cpp:
        for relative in ("build/bin/llama-quantize.exe", "build/bin/Release/llama-quantize.exe",
                         "build/bin/llama-quantize", "llama-quantize.exe", "llama-quantize"):
            candidate = llama_cpp / relative
            if candidate.is_file():
                return str(candidate)
    return None


def gguf_package_available() -> bool:
    return importlib.util.find_spec("gguf") is not None


def report_tooling(llama_cpp: Path | None, quantize: str | None, ollama: str | None) -> None:
    log("outillage :")
    log(f"  llama.cpp / {CONVERT_SCRIPT}  {'✓ ' + paths.display(llama_cpp) if llama_cpp else '✗ absent'}")
    log(f"  paquet python gguf               {'✓' if gguf_package_available() else '✗ absent'}")
    log(f"  llama-quantize                   {'✓ ' + quantize if quantize else '✗ absent (optionnel, Q4_K_M)'}")
    log(f"  ollama                           {'✓ ' + ollama if ollama else '✗ introuvable dans PATH ni %LOCALAPPDATA%\\Programs\\Ollama'}")


def missing_tooling_instructions(llama_cpp: Path | None) -> list[str]:
    steps: list[str] = []
    if llama_cpp is None:
        steps.append(LLAMA_CPP_CLONE)
    if not gguf_package_available():
        steps.append("pip install -r ai-training/requirements-export.txt")
    steps.append("python ai-training/scripts/export.py --skip-merge")
    return steps


# ---------------------------------------------------------------------------
# Fusion
# ---------------------------------------------------------------------------


def merge_adapter(adapter_dir: Path, base_model: str, merged_dir: Path, *, save_dtype: str, threads: int) -> None:
    set_thread_env(threads)
    try:
        torch = configure_torch(threads)
        from peft import PeftModel
        from transformers import AutoModelForCausalLM, AutoTokenizer
    except ModuleNotFoundError as error:
        raise RuntimeError(missing_dependency_message(error)) from error

    log(f"chargement de {base_model} en float32 ({threads} fils) — la fusion se fait en pleine précision…")
    base = AutoModelForCausalLM.from_pretrained(base_model, torch_dtype=torch.float32, low_cpu_mem_usage=True)
    log(f"application de l'adaptateur {paths.display(adapter_dir)}…")
    model = PeftModel.from_pretrained(base, str(adapter_dir))
    merged = model.merge_and_unload()
    merged.config.use_cache = True

    dtype = {"float32": torch.float32, "float16": torch.float16, "bfloat16": torch.bfloat16}[save_dtype]
    if dtype != torch.float32:
        log(f"conversion des poids fusionnés en {save_dtype}…")
        merged = merged.to(dtype)

    if merged_dir.exists():
        shutil.rmtree(merged_dir)
    merged_dir.mkdir(parents=True)
    merged.save_pretrained(str(merged_dir), safe_serialization=True, max_shard_size="2GB")

    # Tokenizer : celui sauvegardé avec l'adaptateur (identique au base), sinon le base.
    # (chaîne et non Path : sous Windows, Path("Qwen/Qwen3-1.7B") deviendrait Qwen\Qwen3-1.7B)
    tokenizer_source = str(adapter_dir) if (adapter_dir / "tokenizer_config.json").is_file() else base_model
    tokenizer = AutoTokenizer.from_pretrained(tokenizer_source)
    tokenizer.save_pretrained(str(merged_dir))
    ensure_chat_template_in_config(merged_dir)
    log(f"modèle fusionné → {paths.display(merged_dir)}")


def ensure_chat_template_in_config(model_dir: Path) -> None:
    """
    Les versions récentes de transformers écrivent le gabarit dans
    `chat_template.jinja` ; certains convertisseurs ne lisent que
    `tokenizer_config.json`. On garantit les deux.
    """
    config_path = model_dir / "tokenizer_config.json"
    jinja_path = model_dir / "chat_template.jinja"
    if not config_path.is_file():
        raise RuntimeError(f"tokenizer_config.json absent de {model_dir} : tokenizer non préservé")
    config = json.loads(config_path.read_text(encoding="utf-8"))
    if not config.get("chat_template") and jinja_path.is_file():
        config["chat_template"] = jinja_path.read_text(encoding="utf-8")
        config_path.write_text(json.dumps(config, ensure_ascii=False, indent=2), encoding="utf-8")
        log("chat_template recopié dans tokenizer_config.json")
    if not config.get("chat_template") and not jinja_path.is_file():
        raise RuntimeError("aucun chat_template dans le tokenizer exporté : la conversation Ollama serait fausse")


def verify_merged_dir(merged_dir: Path) -> None:
    required = ["config.json", "tokenizer_config.json"]
    missing = [name for name in required if not (merged_dir / name).is_file()]
    weights = list(merged_dir.glob("*.safetensors"))
    if missing or not weights:
        raise RuntimeError(
            f"dossier fusionné incomplet ({paths.display(merged_dir)}) : "
            + (", ".join(missing) + " manquant(s)" if missing else "aucun .safetensors")
        )


# ---------------------------------------------------------------------------
# GGUF
# ---------------------------------------------------------------------------


def convert_to_gguf(llama_cpp: Path, merged_dir: Path, gguf_path: Path, outtype: str) -> None:
    command = [sys.executable, str(llama_cpp / CONVERT_SCRIPT), str(merged_dir), "--outfile", str(gguf_path), "--outtype", outtype]
    log("conversion GGUF : " + " ".join(command))
    completed = subprocess.run(command, text=True, encoding="utf-8", errors="replace")
    if completed.returncode != 0 or not gguf_path.is_file():
        raise RuntimeError(f"{CONVERT_SCRIPT} a échoué (code {completed.returncode}) — voir la sortie ci-dessus")
    log(f"GGUF → {paths.display(gguf_path)} ({gguf_path.stat().st_size / 2**30:.2f} GiB)")


def quantize_gguf(binary: str, source: Path, target: Path, quant: str) -> None:
    command = [binary, str(source), str(target), quant]
    log("quantification : " + " ".join(command))
    completed = subprocess.run(command, text=True, encoding="utf-8", errors="replace")
    if completed.returncode != 0 or not target.is_file():
        raise RuntimeError(f"llama-quantize a échoué (code {completed.returncode})")
    log(f"GGUF quantifié → {paths.display(target)} ({target.stat().st_size / 2**30:.2f} GiB)")


# ---------------------------------------------------------------------------
# Programme principal
# ---------------------------------------------------------------------------


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--config", default=str(paths.DEFAULT_CONFIG))
    parser.add_argument("--adapter", default=str(paths.ADAPTER_DIR))
    parser.add_argument("--base-model", help="surcharge model_name du YAML")
    parser.add_argument("--exported-dir", default=str(paths.EXPORTED_DIR))
    parser.add_argument("--merge-dtype", choices=("bfloat16", "float16", "float32"), default="bfloat16",
                        help="dtype des poids fusionnés sauvegardés (fusion toujours en float32)")
    parser.add_argument("--skip-merge", action="store_true", help="réutiliser <exported>/merged")
    parser.add_argument("--llama-cpp", help=f"dossier llama.cpp (sinon ${LLAMA_CPP_ENV}, ai-training/tools/llama.cpp, ~/llama.cpp)")
    parser.add_argument("--gguf-outtype", choices=GGUF_OUTTYPES, default="q8_0",
                        help="type produit par convert_hf_to_gguf.py (q8_0 : ~1,8 GiB, bon compromis CPU)")
    parser.add_argument("--quantize", help="quantification supplémentaire via llama-quantize (ex. Q4_K_M)")
    parser.add_argument("--model-tag", default=DEFAULT_MODEL_TAG)
    parser.add_argument("--template-from", default=DEFAULT_TEMPLATE_SOURCE, help="modèle Ollama dont on reprend TEMPLATE/PARAMETER")
    parser.add_argument("--num-ctx", type=int, default=DEFAULT_NUM_CTX)
    parser.add_argument("--create", action="store_true", help="exécuter `ollama create` à la fin")
    parser.add_argument("--check", action="store_true", help="afficher l'état de l'outillage et sortir")
    parser.add_argument("--force-tag", action="store_true", help="autoriser un tag commençant par qwen*")
    ensure_utf8_output()  # avant parse_args : l'aide contient des caractères hors CP1252
    args = parser.parse_args(argv)

    if args.model_tag.lower().startswith(PROTECTED_TAG_PREFIXES) and not args.force_tag:
        log(f"tag {args.model_tag!r} refusé : il écraserait un modèle Qwen existant. Garder {DEFAULT_MODEL_TAG} ou --force-tag.")
        return 2

    llama_cpp = find_llama_cpp(args.llama_cpp)
    quantize_binary = find_quantize_binary(llama_cpp)
    ollama = find_ollama()
    report_tooling(llama_cpp, quantize_binary, ollama)
    if args.check:
        if llama_cpp is None or not gguf_package_available():
            log("pour rendre la conversion GGUF possible :")
            for step in missing_tooling_instructions(llama_cpp):
                log(f"  {step}")
        return 0

    try:
        config = load_config(args.config)
    except ConfigError as error:
        log(str(error))
        return 2
    base_model = args.base_model or config.model_name
    adapter_dir = paths.resolve(args.adapter)
    exported_dir = paths.resolve(args.exported_dir)
    merged_dir = exported_dir / "merged"
    exported_dir.mkdir(parents=True, exist_ok=True)

    # 1. fusion --------------------------------------------------------------
    if args.skip_merge:
        try:
            verify_merged_dir(merged_dir)
        except RuntimeError as error:
            log(f"{error} — relancer sans --skip-merge")
            return 2
        log(f"fusion sautée, réutilisation de {paths.display(merged_dir)}")
    else:
        if not (adapter_dir / "adapter_config.json").is_file():
            log(f"adaptateur introuvable : {paths.display(adapter_dir)} (adapter_config.json absent). Entraîner d'abord.")
            return 2
        try:
            merge_adapter(adapter_dir, base_model, merged_dir, save_dtype=args.merge_dtype, threads=resolve_cpu_threads(config))
            verify_merged_dir(merged_dir)
        except Exception as error:  # noqa: BLE001 - tout échec doit être lisible, pas une trace
            log(f"fusion échouée : {type(error).__name__}: {error}")
            return 1

    # 2. Modelfile Safetensors (voie alternative, toujours écrite) ----------
    bundle = resolve_template(args.template_from)
    log(f"gabarit de chat : {bundle.origin}")
    safetensors_modelfile = exported_dir / "Modelfile.safetensors"
    safetensors_modelfile.write_text(build_modelfile("./merged", bundle, num_ctx=args.num_ctx), encoding="utf-8")

    # 3. GGUF ----------------------------------------------------------------
    gguf_path = exported_dir / f"{args.model_tag}-{args.gguf_outtype}.gguf"
    gguf_ready = False
    if llama_cpp is None or not gguf_package_available():
        log("")
        log("conversion GGUF impossible pour l'instant :")
        if llama_cpp is None:
            log(f"  - {CONVERT_SCRIPT} introuvable (llama.cpp non cloné)")
        if not gguf_package_available():
            log("  - paquet python `gguf` absent")
        log("  prochaines commandes, dans l'ordre :")
        for step in missing_tooling_instructions(llama_cpp):
            log(f"    {step}")
        log("")
        log("  en attendant, voie alternative (selon la version d'Ollama, l'import Safetensors de Qwen3 peut être pris en charge) :")
        log(f"    cd {paths.display(exported_dir)}")
        log(f"    ollama create {args.model_tag} -f Modelfile.safetensors")
        log("  si Ollama répond « unsupported architecture », la voie GGUF ci-dessus est nécessaire.")
    else:
        try:
            convert_to_gguf(llama_cpp, merged_dir, gguf_path, args.gguf_outtype)
            gguf_ready = True
        except RuntimeError as error:
            log(str(error))
            return 1
        if args.quantize:
            if quantize_binary is None:
                log(f"--quantize {args.quantize} ignoré : llama-quantize introuvable. "
                    "Binaire précompilé : https://github.com/ggml-org/llama.cpp/releases (llama-bXXXX-bin-win-cpu-x64.zip), "
                    "à extraire dans ai-training/tools/llama.cpp/build/bin/")
            else:
                quantized = exported_dir / f"{args.model_tag}-{args.quantize.lower()}.gguf"
                try:
                    quantize_gguf(quantize_binary, gguf_path, quantized, args.quantize)
                    gguf_path = quantized
                except RuntimeError as error:
                    log(str(error))
                    return 1

    # 4. Modelfile GGUF + création --------------------------------------------
    modelfile_path = exported_dir / "Modelfile"
    if gguf_ready:
        modelfile_path.write_text(build_modelfile(f"./{gguf_path.name}", bundle, num_ctx=args.num_ctx), encoding="utf-8")
        log(f"Modelfile → {paths.display(modelfile_path)} (FROM ./{gguf_path.name})")
    log(f"Modelfile.safetensors → {paths.display(safetensors_modelfile)} (FROM ./merged)")

    create_target = "Modelfile" if gguf_ready else "Modelfile.safetensors"
    log("")
    log("installation dans Ollama (n'écrase pas qwen3:4b) :")
    log(f"  cd {paths.display(exported_dir)}")
    log(f"  ollama create {args.model_tag} -f {create_target}")
    log(f"  ollama run {args.model_tag} \"Build a premium cybersecurity SaaS landing page.\"")

    if args.create:
        if ollama is None:
            log("--create : ollama introuvable, création non exécutée")
            return 1
        command = [ollama, "create", args.model_tag, "-f", create_target]
        log("exécution : " + " ".join(command))
        completed = subprocess.run(command, cwd=str(exported_dir), text=True, encoding="utf-8", errors="replace")
        if completed.returncode != 0:
            log(f"ollama create a échoué (code {completed.returncode})")
            if not gguf_ready:
                log("→ l'import Safetensors n'est pas pris en charge par cette version d'Ollama : passer par GGUF (voir plus haut)")
            return 1
        log(f"modèle {args.model_tag} créé. Test : ollama run {args.model_tag}")
        log(f"puis dans .env.local : YELHAA_QWEN_MODEL={args.model_tag}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
