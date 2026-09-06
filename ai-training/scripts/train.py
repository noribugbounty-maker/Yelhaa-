"""
Affinage LoRA de Qwen3-1.7B sur CPU.

    python ai-training/scripts/train.py --config ai-training/configs/qwen3-1.7b-lora.yaml
    py     ai-training/scripts/train.py --config ai-training/configs/qwen3-1.7b-lora.yaml

Reprise :
    python ai-training/scripts/train.py --config ... --resume auto
    python ai-training/scripts/train.py --config ... --resume ai-training/outputs/checkpoints/checkpoint-40

Arrêt propre pendant l'entraînement (depuis un autre terminal) :
    New-Item ai-training/outputs/STOP
→ un checkpoint reprenable est écrit à la fin du pas en cours, puis le script
  s'arrête. Ctrl+C sauvegarde l'adaptateur en cours dans outputs/adapter/interrupted
  (non reprenable) et indique le dernier checkpoint reprenable.

Ce script ne touche jamais à CUDA, bitsandbytes, flash-attention ni xformers.
"""

from __future__ import annotations

import argparse
import json
import shutil
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from yelhaa_training import paths  # noqa: E402
from yelhaa_training.config import ConfigError, TrainingConfig, load_config, resolve_cpu_threads  # noqa: E402
from yelhaa_training.console import ensure_utf8_output  # noqa: E402
from yelhaa_training.dataset import Example, load_examples_strict  # noqa: E402
from yelhaa_training.formatting import EncodedExample, SkippedExample, encode_example, pad_batch  # noqa: E402
from yelhaa_training.hardware import (  # noqa: E402
    configure_torch,
    describe_environment,
    estimate_weights_gib,
    missing_dependency_message,
    set_thread_env,
    torch_dtype,
)
from yelhaa_training.lora import (  # noqa: E402
    IncompatibleTargetModulesError,
    UnsupportedArchitectureError,
    build_lora_config,
    check_model_type,
    count_parameters,
    describe_parameters,
    verify_target_modules,
)

TRAIN_LOG = "train-log.jsonl"


def log(message: str = "") -> None:
    print(f"[train] {message}" if message else "", flush=True)


# ---------------------------------------------------------------------------
# Données
# ---------------------------------------------------------------------------


def encode_split(
    tokenizer: Any,
    examples: list[Example],
    config: TrainingConfig,
    system_prompt: str | None,
    label: str,
) -> list[EncodedExample]:
    encoded: list[EncodedExample] = []
    skipped: list[SkippedExample] = []
    truncated = 0
    for example in examples:
        result = encode_example(
            tokenizer,
            example,
            max_seq_length=config.max_seq_length,
            system_prompt=system_prompt,
            include_metadata=config.train_on_metadata,
            enable_thinking=config.enable_thinking,
        )
        if isinstance(result, SkippedExample):
            skipped.append(result)
            continue
        if result.truncated:
            truncated += 1
        encoded.append(result)

    lengths = sorted(len(e) for e in encoded)
    log(f"{label} : {len(encoded)} exemple(s) encodé(s), {len(skipped)} écarté(s), {truncated} tronqué(s)")
    if lengths:
        log(f"  longueur (jetons) min {lengths[0]} · médiane {lengths[len(lengths) // 2]} · max {lengths[-1]}")
        supervised = sum(e.target_tokens for e in encoded)
        log(f"  jetons supervisés au total : {supervised:,}".replace(",", " "))
    for item in skipped[:10]:
        log(f"  écarté {item.source} : {item.reason}")
    if len(skipped) > 10:
        log(f"  … {len(skipped) - 10} autre(s) écarté(s)")
    return encoded


def make_torch_dataset(torch: Any, items: list[EncodedExample]) -> Any:
    class EncodedDataset(torch.utils.data.Dataset):
        def __len__(self) -> int:
            return len(items)

        def __getitem__(self, index: int) -> EncodedExample:
            return items[index]

    return EncodedDataset()


def make_collator(torch: Any, pad_token_id: int) -> Any:
    def collate(batch: list[EncodedExample]) -> dict[str, Any]:
        padded = pad_batch(batch, pad_token_id)
        return {key: torch.tensor(value, dtype=torch.long) for key, value in padded.items()}

    return collate


# ---------------------------------------------------------------------------
# Rappels d'entraînement
# ---------------------------------------------------------------------------


def build_callbacks(transformers: Any, log_path: Path, stop_file: Path) -> list[Any]:
    TrainerCallback = transformers.TrainerCallback

    class ProgressCallback(TrainerCallback):
        """Journal compact : pas, perte, taux, temps écoulé, estimation restante."""

        def __init__(self) -> None:
            self.started = time.monotonic()
            self.step_started = self.started
            self.substeps = 0
            self.resumed_from = 0

        def on_train_begin(self, args, state, control, **kwargs):  # noqa: ANN001
            self.started = time.monotonic()
            self.step_started = self.started
            self.resumed_from = state.global_step
            log(f"début — {state.max_steps} pas d'optimisation prévus"
                + (f" (reprise au pas {state.global_step})" if state.global_step else ""))
            return control

        def on_substep_end(self, args, state, control, **kwargs):  # noqa: ANN001
            self.substeps += 1
            elapsed = time.monotonic() - self.step_started
            print(
                f"        pas {state.global_step + 1}/{state.max_steps} · micro-lot "
                f"{self.substeps}/{args.gradient_accumulation_steps} · {elapsed:.0f} s",
                flush=True,
            )
            return control

        def on_step_end(self, args, state, control, **kwargs):  # noqa: ANN001
            self.substeps = 0
            self.step_started = time.monotonic()
            if stop_file.exists():
                log(f"fichier {paths.display(stop_file)} détecté : checkpoint puis arrêt propre")
                control.should_save = True
                control.should_training_stop = True
            return control

        def on_log(self, args, state, control, logs=None, **kwargs):  # noqa: ANN001
            logs = dict(logs or {})
            elapsed = time.monotonic() - self.started
            done = state.global_step - self.resumed_from
            eta = ""
            if done > 0 and state.max_steps:
                remaining = (state.max_steps - state.global_step) * (elapsed / done)
                eta = f" · reste ≈ {_human_duration(remaining)}"
            loss = logs.get("loss", logs.get("eval_loss"))
            lr = logs.get("learning_rate")
            parts = [f"pas {state.global_step}/{state.max_steps}"]
            if loss is not None:
                parts.append(f"{'eval_loss' if 'eval_loss' in logs else 'loss'} {loss:.4f}")
            if lr is not None:
                parts.append(f"lr {lr:.2e}")
            if "epoch" in logs:
                parts.append(f"époque {logs['epoch']:.2f}")
            parts.append(f"écoulé {_human_duration(elapsed)}{eta}")
            log(" · ".join(parts))
            logs.update({"step": state.global_step, "elapsed_s": round(elapsed, 1),
                         "at": datetime.now(timezone.utc).isoformat(timespec="seconds")})
            with log_path.open("a", encoding="utf-8") as handle:
                handle.write(json.dumps(logs, ensure_ascii=False) + "\n")
            return control

        def on_save(self, args, state, control, **kwargs):  # noqa: ANN001
            log(f"checkpoint écrit : {paths.display(Path(args.output_dir) / f'checkpoint-{state.global_step}')}")
            return control

    return [ProgressCallback()]


def _human_duration(seconds: float) -> str:
    seconds = max(0, int(seconds))
    hours, rest = divmod(seconds, 3600)
    minutes, secs = divmod(rest, 60)
    if hours:
        return f"{hours} h {minutes:02d} min"
    if minutes:
        return f"{minutes} min {secs:02d} s"
    return f"{secs} s"


# ---------------------------------------------------------------------------
# Programme principal
# ---------------------------------------------------------------------------


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--config", default=str(paths.DEFAULT_CONFIG), help="YAML d'entraînement")
    parser.add_argument("--resume", help="'auto' (dernier checkpoint de output_dir) ou chemin d'un checkpoint")
    parser.add_argument("--max-steps", type=int, help="surcharge max_steps (utile pour un essai court)")
    parser.add_argument("--output-dir", help="surcharge output_dir")
    parser.add_argument("--threads", type=int, help="surcharge le nombre de fils CPU (sinon YELHAA_TRAIN_THREADS / YAML)")
    parser.add_argument("--dry-run", action="store_true", help="tout préparer (données, tokenizer) sans charger le modèle")
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    ensure_utf8_output()  # avant parse_args : l'aide contient des caractères hors CP1252
    args = parse_args(argv)

    try:
        config = load_config(args.config)
    except ConfigError as error:
        log(str(error))
        return 2
    if args.max_steps is not None:
        config.max_steps = args.max_steps
    if args.output_dir:
        config.output_dir = args.output_dir

    threads = args.threads or resolve_cpu_threads(config)
    set_thread_env(threads)  # avant tout import de torch

    try:
        torch = configure_torch(threads)
        import transformers
        from transformers import AutoConfig, AutoModelForCausalLM, AutoTokenizer, Trainer, TrainingArguments
        from transformers.trainer_utils import get_last_checkpoint
    except ModuleNotFoundError as error:
        log(missing_dependency_message(error))
        return 1

    transformers.set_seed(config.seed)
    transformers.logging.set_verbosity_warning()

    log(f"configuration : {paths.display(args.config)}")
    print(describe_environment(torch, threads, config.torch_dtype))

    try:
        system_prompt = config.resolved_system_prompt()
    except ConfigError as error:
        log(str(error))
        return 2
    if system_prompt:
        log(f"message système appliqué aux exemples sans `system` ({len(system_prompt)} caractères)")
    if config.train_on_metadata:
        log("train_on_metadata: true — les métadonnées préfixent le message utilisateur (jamais la cible)")

    # --- tokenizer et données ------------------------------------------------
    log(f"tokenizer : {config.model_name}")
    tokenizer = AutoTokenizer.from_pretrained(config.model_name)
    if not getattr(tokenizer, "chat_template", None):
        log("ce tokenizer n'embarque pas de chat_template : impossible de formater fidèlement")
        return 2
    if tokenizer.pad_token_id is None:
        tokenizer.pad_token = tokenizer.eos_token

    try:
        train_examples = load_examples_strict(config.train_path)
    except (FileNotFoundError, ValueError) as error:
        log(f"{error}")
        log("→ prepare_dataset.py, validate_dataset.py puis split_dataset.py")
        return 2
    validation_examples: list[Example] = []
    if config.validation_path.is_file():
        try:
            validation_examples = load_examples_strict(config.validation_path)
        except ValueError as error:
            log(f"validation ignorée : {error}")
    validation_examples = validation_examples[: config.eval_max_examples]

    train_items = encode_split(tokenizer, train_examples, config, system_prompt, "train")
    if not train_items:
        log("aucun exemple d'entraînement exploitable après encodage")
        return 2
    eval_items = encode_split(tokenizer, validation_examples, config, system_prompt, "validation") if validation_examples else []

    eval_strategy = config.evaluation_strategy if eval_items else "no"
    if eval_strategy == "no" and config.evaluation_strategy != "no":
        log("pas d'exemple de validation : evaluation_strategy forcée à 'no'")

    micro_batches = len(train_items) * config.num_train_epochs
    optimizer_steps = config.max_steps or max(1, int(micro_batches / (config.batch_size * config.gradient_accumulation_steps)))
    log(f"{len(train_items)} exemple(s) × {config.num_train_epochs:g} époque(s) / "
        f"({config.batch_size} × {config.gradient_accumulation_steps}) ≈ {optimizer_steps} pas d'optimisation")
    log("rappel : sur CPU, chaque exemple de ~1 000 jetons prend de l'ordre d'une à plusieurs minutes "
        "(aller + retour + recalcul du checkpointing) — compter des heures, voire des jours.")

    output_dir = config.output_path
    output_dir.mkdir(parents=True, exist_ok=True)
    (output_dir / "training-config.json").write_text(
        json.dumps({**config.to_dict(), "cpu_threads_resolved": threads}, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    if args.dry_run:
        log("--dry-run : données et tokenizer prêts, modèle non chargé. Fin.")
        return 0

    # --- modèle -------------------------------------------------------------
    model_config = AutoConfig.from_pretrained(config.model_name)
    try:
        check_model_type(getattr(model_config, "model_type", ""))
    except UnsupportedArchitectureError as error:
        log(str(error))
        return 2

    dtype = torch_dtype(config.torch_dtype)
    log(f"chargement de {config.model_name} en {config.torch_dtype} (CPU)…")
    model = AutoModelForCausalLM.from_pretrained(
        config.model_name,
        torch_dtype=dtype,
        low_cpu_mem_usage=True,
    )
    model.config.use_cache = False
    _, total_params = count_parameters(model)
    log(f"poids chargés : ≈ {estimate_weights_gib(total_params, config.torch_dtype):.1f} GiB")

    try:
        verify_target_modules(model, config.lora_target_modules)
    except IncompatibleTargetModulesError as error:
        log(str(error))
        return 2

    if config.gradient_checkpointing:
        model.gradient_checkpointing_enable(gradient_checkpointing_kwargs={"use_reentrant": False})
        model.enable_input_require_grads()

    from peft import get_peft_model

    model = get_peft_model(model, build_lora_config(config))
    log(f"LoRA r={config.lora_r} α={config.lora_alpha} dropout={config.lora_dropout} "
        f"sur {', '.join(config.lora_target_modules)}")
    log(describe_parameters(model))

    # --- Trainer ------------------------------------------------------------
    training_args = TrainingArguments(
        output_dir=str(output_dir),
        per_device_train_batch_size=config.batch_size,
        per_device_eval_batch_size=1,
        gradient_accumulation_steps=config.gradient_accumulation_steps,
        learning_rate=config.learning_rate,
        num_train_epochs=config.num_train_epochs,
        max_steps=config.max_steps if config.max_steps is not None else -1,
        warmup_ratio=config.warmup_ratio,
        weight_decay=config.weight_decay,
        lr_scheduler_type=config.lr_scheduler_type,
        max_grad_norm=config.max_grad_norm,
        logging_steps=config.logging_steps,
        logging_first_step=True,
        save_strategy="steps",
        save_steps=config.save_steps,
        save_total_limit=config.save_total_limit,
        eval_strategy=eval_strategy,
        eval_steps=config.eval_steps if eval_strategy == "steps" else None,
        seed=config.seed,
        data_seed=config.seed,
        gradient_checkpointing=config.gradient_checkpointing,
        gradient_checkpointing_kwargs={"use_reentrant": False} if config.gradient_checkpointing else None,
        use_cpu=True,
        bf16=False,
        fp16=False,
        dataloader_num_workers=0,
        dataloader_pin_memory=False,
        remove_unused_columns=False,
        label_names=["labels"],
        optim="adamw_torch",
        report_to="none",
        disable_tqdm=True,
        save_safetensors=True,
        load_best_model_at_end=False,
    )

    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=make_torch_dataset(torch, train_items),
        eval_dataset=make_torch_dataset(torch, eval_items) if eval_items else None,
        data_collator=make_collator(torch, tokenizer.pad_token_id),
        processing_class=tokenizer,
        callbacks=build_callbacks(transformers, output_dir / TRAIN_LOG, paths.STOP_FILE),
    )
    # Sans tqdm, Trainer imprime chaque dict de journal brut : notre rappel s'en charge déjà.
    trainer.remove_callback(transformers.PrinterCallback)

    resume_from: str | None = None
    if args.resume:
        if args.resume.lower() == "auto":
            resume_from = get_last_checkpoint(str(output_dir))
            if resume_from is None:
                log(f"--resume auto : aucun checkpoint dans {paths.display(output_dir)}, départ de zéro")
        else:
            candidate = paths.resolve(args.resume)
            if not (candidate / "trainer_state.json").is_file():
                log(f"checkpoint invalide : {paths.display(candidate)} (trainer_state.json absent)")
                return 2
            resume_from = str(candidate)
        if resume_from:
            log(f"reprise depuis {paths.display(resume_from)}")

    stop_requested_before = paths.STOP_FILE.exists()
    if stop_requested_before:
        paths.STOP_FILE.unlink()
        log("ancien fichier STOP retiré avant le départ")

    started = time.monotonic()
    try:
        result = trainer.train(resume_from_checkpoint=resume_from)
    except KeyboardInterrupt:
        interrupted_dir = config.adapter_path / "interrupted"
        interrupted_dir.mkdir(parents=True, exist_ok=True)
        trainer.model.save_pretrained(str(interrupted_dir))
        tokenizer.save_pretrained(str(interrupted_dir))
        last = get_last_checkpoint(str(output_dir))
        log("")
        log("interrompu (Ctrl+C).")
        log(f"  adaptateur partiel (non reprenable) : {paths.display(interrupted_dir)}")
        if last:
            log(f"  dernier checkpoint reprenable       : {paths.display(last)}")
            log(f"  reprendre : python ai-training/scripts/train.py --config {paths.display(args.config)} --resume auto")
        else:
            log("  aucun checkpoint reprenable encore écrit (save_steps non atteint)")
        return 130

    stopped_by_file = paths.STOP_FILE.exists()
    if stopped_by_file:
        paths.STOP_FILE.unlink()

    # --- sauvegardes finales ------------------------------------------------
    adapter_dir = config.adapter_path
    adapter_dir.mkdir(parents=True, exist_ok=True)
    trainer.save_model(str(adapter_dir))
    tokenizer.save_pretrained(str(adapter_dir))
    shutil.copyfile(paths.resolve(args.config), adapter_dir / "training-config.yaml")
    summary = {
        "model_name": config.model_name,
        "finished_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "duration_s": round(time.monotonic() - started, 1),
        "global_step": trainer.state.global_step,
        "stopped_by_stop_file": stopped_by_file,
        "train_examples": len(train_items),
        "validation_examples": len(eval_items),
        "cpu_threads": threads,
        "metrics": getattr(result, "metrics", {}),
        "config": config.to_dict(),
    }
    (adapter_dir / "training-summary.json").write_text(
        json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8",
    )

    log("")
    if stopped_by_file:
        log(f"arrêt propre au pas {trainer.state.global_step} — reprendre avec --resume auto")
    else:
        log(f"terminé en {_human_duration(time.monotonic() - started)} ({trainer.state.global_step} pas)")
    log(f"adaptateur LoRA + tokenizer → {paths.display(adapter_dir)}")
    log(f"checkpoints                → {paths.display(output_dir)}")
    log("suite : evaluate.py pour comparer, export.py pour fusionner et produire le GGUF")
    return 0


if __name__ == "__main__":
    sys.exit(main())
