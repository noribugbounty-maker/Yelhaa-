"""
Test de fumée — vérifie la chaîne sans lancer d'entraînement.

    python ai-training/scripts/smoke_test.py
    python ai-training/scripts/smoke_test.py --config ai-training/configs/qwen3-1.7b-lora.yaml
    python ai-training/scripts/smoke_test.py --load-model   # charge vraiment les poids (~7 GiB en float32)

Contrôles :
  1. le jeu de données se charge (train.jsonl, sinon les exemples de format) ;
  2. le tokenizer Qwen3 se charge et embarque un chat_template ;
  3. la configuration LoRA est valide (PEFT) ;
  4. l'architecture est compatible : model_type Qwen3 et modules cibles présents
     — vérifiés sur le squelette du modèle (device « meta », zéro mémoire) ;
  5. un exemple s'encode avec le gabarit officiel, préfixe masqué.

Avec `--load-model`, les poids sont chargés, LoRA injecté, et un passage avant
est exécuté sur un exemple court : c'est lent (quelques minutes) mais c'est la
preuve définitive que la machine tient la charge mémoire.
"""

from __future__ import annotations

import argparse
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from yelhaa_training import paths  # noqa: E402
from yelhaa_training.config import ConfigError, load_config, resolve_cpu_threads  # noqa: E402
from yelhaa_training.console import ensure_utf8_output  # noqa: E402
from yelhaa_training.dataset import load_examples_strict  # noqa: E402
from yelhaa_training.formatting import IGNORE_INDEX, SkippedExample, encode_example  # noqa: E402
from yelhaa_training.hardware import configure_torch, set_thread_env, torch_dtype  # noqa: E402
from yelhaa_training.lora import (  # noqa: E402
    IncompatibleTargetModulesError,
    UnsupportedArchitectureError,
    build_lora_config,
    check_model_type,
    describe_parameters,
    verify_target_modules,
)

FORMAT_SAMPLES = paths.EXAMPLES_DIR / "format-samples.jsonl"


class Check:
    def __init__(self) -> None:
        self.passed = 0
        self.failed = 0

    def ok(self, label: str, detail: str = "") -> None:
        self.passed += 1
        print(f"  PASS  {label}" + (f" — {detail}" if detail else ""))

    def fail(self, label: str, detail: str = "") -> None:
        self.failed += 1
        print(f"  FAIL  {label}" + (f"\n        {detail}" if detail else ""))


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--config", default=str(paths.DEFAULT_CONFIG))
    parser.add_argument("--load-model", action="store_true", help="charger les poids et exécuter un passage avant")
    ensure_utf8_output()  # avant parse_args : l'aide contient des caractères hors CP1252
    args = parser.parse_args(argv)
    check = Check()
    print("Test de fumée — ai-training")

    # 0. configuration
    try:
        config = load_config(args.config)
        check.ok("configuration", paths.display(args.config))
    except ConfigError as error:
        check.fail("configuration", str(error))
        return 1

    threads = resolve_cpu_threads(config)
    set_thread_env(threads)

    # 1. jeu de données
    dataset_path = config.train_path if config.train_path.is_file() else FORMAT_SAMPLES
    try:
        examples = load_examples_strict(dataset_path)
        note = "" if dataset_path == config.train_path else " (train.jsonl absent : exemples de format utilisés)"
        check.ok("jeu de données", f"{len(examples)} exemple(s) depuis {paths.display(dataset_path)}{note}")
    except (FileNotFoundError, ValueError) as error:
        check.fail("jeu de données", str(error))
        return 1

    # 2. tokenizer
    try:
        from transformers import AutoConfig, AutoModelForCausalLM, AutoTokenizer
    except ImportError as error:
        check.fail("import transformers", f"{error} — pip install -r ai-training/requirements.txt")
        return 1
    try:
        tokenizer = AutoTokenizer.from_pretrained(config.model_name)
    except Exception as error:  # noqa: BLE001 - réseau, cache, nom erroné : tout se rapporte pareil
        check.fail("tokenizer", f"{config.model_name} : {error}")
        return 1
    if getattr(tokenizer, "chat_template", None):
        check.ok("tokenizer", f"{config.model_name}, chat_template présent, vocabulaire {len(tokenizer):,}".replace(",", " "))
    else:
        check.fail("tokenizer", "aucun chat_template embarqué — le formatage ne serait pas celui de Qwen3")

    # 3. configuration LoRA
    try:
        lora_config = build_lora_config(config)
        check.ok("configuration LoRA", f"r={lora_config.r} α={lora_config.lora_alpha} dropout={lora_config.lora_dropout}")
    except ImportError as error:
        check.fail("configuration LoRA", f"peft manquant : {error}")
        lora_config = None
    except ValueError as error:
        check.fail("configuration LoRA", str(error))
        lora_config = None

    # 4. architecture
    torch = configure_torch(threads)
    try:
        model_config = AutoConfig.from_pretrained(config.model_name)
        check_model_type(getattr(model_config, "model_type", ""))
        with torch.device("meta"):
            skeleton = AutoModelForCausalLM.from_config(model_config)
        available = verify_target_modules(skeleton, config.lora_target_modules)
        params = sum(p.numel() for p in skeleton.parameters())
        check.ok(
            "architecture",
            f"{model_config.model_type}, {model_config.num_hidden_layers} couches, "
            f"{params / 1e9:.2f} G paramètres, cibles LoRA présentes ({len(available)} types de couches linéaires)",
        )
        del skeleton
    except (UnsupportedArchitectureError, IncompatibleTargetModulesError) as error:
        check.fail("architecture", str(error))
    except Exception as error:  # noqa: BLE001
        check.fail("architecture", f"{type(error).__name__}: {error}")

    # 5. encodage d'un exemple
    try:
        system_prompt = config.resolved_system_prompt()
        encoded = encode_example(
            tokenizer, examples[0], max_seq_length=config.max_seq_length,
            system_prompt=system_prompt, include_metadata=config.train_on_metadata,
            enable_thinking=config.enable_thinking,
        )
        if isinstance(encoded, SkippedExample):
            check.fail("encodage d'un exemple", encoded.reason)
        else:
            masked = sum(1 for label in encoded.labels if label == IGNORE_INDEX)
            assert masked == encoded.prompt_tokens, "le masque ne couvre pas exactement le préfixe"
            assert encoded.labels[-1] != IGNORE_INDEX, "la cible est vide"
            tail = tokenizer.decode(encoded.input_ids[-3:])
            check.ok(
                "encodage d'un exemple",
                f"{len(encoded)} jetons dont {encoded.target_tokens} supervisés ; fin décodée {tail!r}",
            )
    except Exception as error:  # noqa: BLE001
        check.fail("encodage d'un exemple", f"{type(error).__name__}: {error}")

    # 6. optionnel : vrais poids + LoRA + passage avant
    if args.load_model and check.failed == 0 and lora_config is not None:
        from peft import get_peft_model

        print(f"  …    chargement des poids ({config.torch_dtype}, {threads} fils) — patience")
        started = time.monotonic()
        try:
            model = AutoModelForCausalLM.from_pretrained(
                config.model_name, torch_dtype=torch_dtype(config.torch_dtype), low_cpu_mem_usage=True,
            )
            model.config.use_cache = False
            verify_target_modules(model, config.lora_target_modules)
            model = get_peft_model(model, lora_config)
            check.ok("modèle + LoRA", f"{describe_parameters(model)} en {time.monotonic() - started:.0f} s")

            short = encode_example(tokenizer, examples[0], max_seq_length=256, system_prompt=system_prompt)
            assert not isinstance(short, SkippedExample)
            batch = {
                "input_ids": torch.tensor([short.input_ids]),
                "attention_mask": torch.tensor([short.attention_mask]),
                "labels": torch.tensor([short.labels]),
            }
            model.train()
            started = time.monotonic()
            output = model(**batch)
            output.loss.backward()
            check.ok("passage avant + arrière", f"loss {output.loss.item():.3f} sur {len(short)} jetons en {time.monotonic() - started:.0f} s")
        except Exception as error:  # noqa: BLE001
            check.fail("modèle + LoRA", f"{type(error).__name__}: {error}")

    print()
    print(f"{check.passed} réussite(s), {check.failed} échec(s)")
    if check.failed == 0 and not args.load_model:
        print("Pour la preuve mémoire complète : python ai-training/scripts/smoke_test.py --load-model")
    return 0 if check.failed == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
