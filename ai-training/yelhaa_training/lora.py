"""
LoRA : configuration PEFT et vérification contre l'architecture **réelle**.

Les noms de modules (`q_proj`, `gate_proj`…) sont ceux de Qwen3 dans
transformers, mais ils ne sont jamais tenus pour acquis : avant d'injecter
les adaptateurs, on énumère les couches linéaires du modèle chargé et on
refuse toute cible absente, avec la liste de ce qui existe vraiment.
"""

from __future__ import annotations

from typing import Any, Iterable

from .config import TrainingConfig, validate_lora_hyperparameters

SUPPORTED_MODEL_TYPES = ("qwen3", "qwen2")

# Couches linéaires à ne jamais adapter : la tête de sortie partage ses poids
# avec les embeddings (`tie_word_embeddings`) sur Qwen3-1.7B.
EXCLUDED_LINEAR_NAMES = {"lm_head"}


class IncompatibleTargetModulesError(RuntimeError):
    """Une ou plusieurs cibles LoRA n'existent pas dans le modèle chargé."""


class UnsupportedArchitectureError(RuntimeError):
    """Le `model_type` n'est pas un Qwen3/Qwen2."""


def check_model_type(model_type: str) -> None:
    if model_type not in SUPPORTED_MODEL_TYPES:
        raise UnsupportedArchitectureError(
            f"model_type {model_type!r} : ce pipeline est réglé pour Qwen3 "
            f"({', '.join(SUPPORTED_MODEL_TYPES)}). Changer model_name ou adapter lora_target_modules."
        )


def linear_module_names(model: Any) -> set[str]:
    """Noms courts (dernier segment) des `nn.Linear` du modèle, hors tête de sortie."""
    import torch

    names: set[str] = set()
    for name, module in model.named_modules():
        if isinstance(module, torch.nn.Linear):
            short = name.rsplit(".", 1)[-1]
            if short not in EXCLUDED_LINEAR_NAMES:
                names.add(short)
    return names


def missing_targets(available: Iterable[str], targets: Iterable[str]) -> list[str]:
    pool = set(available)
    return [target for target in targets if target not in pool]


def verify_target_modules(model: Any, targets: list[str]) -> set[str]:
    """Rend les noms disponibles ; lève une erreur explicite si une cible manque."""
    available = linear_module_names(model)
    missing = missing_targets(available, targets)
    if missing:
        raise IncompatibleTargetModulesError(
            "lora_target_modules incompatibles avec le modèle chargé.\n"
            f"  manquants   : {', '.join(missing)}\n"
            f"  disponibles : {', '.join(sorted(available)) or '(aucune couche linéaire)'}\n"
            "Corriger `lora_target_modules` dans le YAML."
        )
    return available


def build_lora_config(config: TrainingConfig) -> Any:
    """`peft.LoraConfig` depuis le YAML, après les contrôles purs."""
    problems = validate_lora_hyperparameters(
        config.lora_r, config.lora_alpha, config.lora_dropout, config.lora_target_modules,
    )
    if problems:
        raise ValueError("hyperparamètres LoRA invalides : " + " ; ".join(problems))

    from peft import LoraConfig, TaskType

    return LoraConfig(
        r=config.lora_r,
        lora_alpha=config.lora_alpha,
        lora_dropout=config.lora_dropout,
        target_modules=list(config.lora_target_modules),
        bias="none",
        task_type=TaskType.CAUSAL_LM,
    )


def count_parameters(model: Any) -> tuple[int, int]:
    """(entraînables, total)."""
    trainable = sum(p.numel() for p in model.parameters() if p.requires_grad)
    total = sum(p.numel() for p in model.parameters())
    return trainable, total


def describe_parameters(model: Any) -> str:
    trainable, total = count_parameters(model)
    share = (100.0 * trainable / total) if total else 0.0
    return f"{trainable:,} paramètres entraînables sur {total:,} ({share:.3f} %)".replace(",", " ")
