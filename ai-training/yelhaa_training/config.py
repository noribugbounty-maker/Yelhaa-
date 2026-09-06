"""
Configuration d'entraînement — chargement, valeurs par défaut, validation.

Le YAML est la seule source des hyperparamètres ; aucun script n'en fixe en
dur. Une clé inconnue est une **erreur**, pas un avertissement : une faute de
frappe sur `learning_rate` ferait tourner l'entraînement sur le défaut sans que
personne ne s'en aperçoive avant la fin.
"""

from __future__ import annotations

import os
from dataclasses import dataclass, field, fields
from pathlib import Path
from typing import Any

from . import paths

# Nombre de fils raisonnable par défaut : on garde deux fils au système et au
# navigateur, et on ne dépasse jamais 6 même sur une machine plus large — la
# cible est un Ryzen 5 7520U (4 cœurs / 8 fils), pas un serveur.
MAX_DEFAULT_THREADS = 6
THREADS_ENV = "YELHAA_TRAIN_THREADS"

VALID_EVALUATION_STRATEGIES = ("no", "steps", "epoch")
VALID_DTYPES = ("float32", "bfloat16")
VALID_SCHEDULERS = (
    "linear",
    "cosine",
    "cosine_with_restarts",
    "polynomial",
    "constant",
    "constant_with_warmup",
)

# Modules linéaires de Qwen3 (attention + MLP). Vérifiés contre le modèle
# réellement chargé par `lora.verify_target_modules` : la liste ci-dessous est
# un défaut, pas une certitude.
DEFAULT_TARGET_MODULES = [
    "q_proj",
    "k_proj",
    "v_proj",
    "o_proj",
    "gate_proj",
    "up_proj",
    "down_proj",
]


class ConfigError(ValueError):
    """Configuration illisible ou invalide. Le message liste tous les problèmes."""


@dataclass
class TrainingConfig:
    # --- modèle et chemins ------------------------------------------------
    model_name: str = "Qwen/Qwen3-1.7B"
    output_dir: str = "outputs/checkpoints"
    adapter_dir: str = "outputs/adapter"
    train_file: str = "dataset/splits/train.jsonl"
    validation_file: str = "dataset/splits/validation.jsonl"

    # --- optimisation -----------------------------------------------------
    learning_rate: float = 2e-4
    num_train_epochs: float = 2.0
    max_steps: int | None = None
    batch_size: int = 1
    gradient_accumulation_steps: int = 8
    max_seq_length: int = 2048
    warmup_ratio: float = 0.05
    weight_decay: float = 0.01
    lr_scheduler_type: str = "cosine"
    max_grad_norm: float = 1.0

    # --- LoRA -------------------------------------------------------------
    lora_r: int = 16
    lora_alpha: int = 32
    lora_dropout: float = 0.05
    lora_target_modules: list[str] = field(
        default_factory=lambda: list(DEFAULT_TARGET_MODULES)
    )

    # --- journalisation, checkpoints, évaluation ---------------------------
    logging_steps: int = 1
    save_steps: int = 10
    save_total_limit: int = 3
    evaluation_strategy: str = "epoch"
    eval_steps: int | None = None
    eval_max_examples: int = 32

    # --- reproductibilité et matériel ------------------------------------
    seed: int = 42
    gradient_checkpointing: bool = True
    cpu_threads: int | None = None
    torch_dtype: str = "float32"

    # --- formatage --------------------------------------------------------
    # Message système ajouté aux exemples qui n'en ont pas. `system_prompt_file`
    # l'emporte sur `system_prompt` quand les deux sont donnés.
    system_prompt: str | None = None
    system_prompt_file: str | None = None
    # Les métadonnées ne deviennent jamais du texte d'entraînement, sauf ici,
    # explicitement. Même à `true`, elles ne sont injectées que dans le message
    # utilisateur, jamais dans la cible.
    train_on_metadata: bool = False
    enable_thinking: bool = False

    # ---------------------------------------------------------------------
    def resolve(self, value: str) -> Path:
        return paths.resolve(value)

    @property
    def output_path(self) -> Path:
        return self.resolve(self.output_dir)

    @property
    def adapter_path(self) -> Path:
        return self.resolve(self.adapter_dir)

    @property
    def train_path(self) -> Path:
        return self.resolve(self.train_file)

    @property
    def validation_path(self) -> Path:
        return self.resolve(self.validation_file)

    def resolved_system_prompt(self) -> str | None:
        if self.system_prompt_file:
            file_path = self.resolve(self.system_prompt_file)
            if not file_path.is_file():
                raise ConfigError(
                    f"system_prompt_file introuvable : {paths.display(file_path)}"
                )
            text = file_path.read_text(encoding="utf-8").strip()
            return text or None
        if self.system_prompt:
            text = self.system_prompt.strip()
            return text or None
        return None

    def to_dict(self) -> dict[str, Any]:
        return {f.name: getattr(self, f.name) for f in fields(self)}


def _known_keys() -> set[str]:
    return {f.name for f in fields(TrainingConfig)}


def _coerce(name: str, value: Any, target: Any, problems: list[str]) -> Any:
    """Coercition prudente : YAML lit `2e-4` comme flottant mais `1` comme entier."""
    if value is None:
        return None
    if target is float:
        if isinstance(value, bool) or not isinstance(value, (int, float, str)):
            problems.append(f"{name} : nombre attendu, obtenu {value!r}")
            return value
        try:
            return float(value)
        except ValueError:
            problems.append(f"{name} : nombre attendu, obtenu {value!r}")
            return value
    if target is int:
        if isinstance(value, bool):
            problems.append(f"{name} : entier attendu, obtenu {value!r}")
            return value
        if isinstance(value, int):
            return value
        if isinstance(value, float) and value.is_integer():
            return int(value)
        if isinstance(value, str) and value.strip().lstrip("-").isdigit():
            return int(value.strip())
        problems.append(f"{name} : entier attendu, obtenu {value!r}")
        return value
    if target is bool:
        if isinstance(value, bool):
            return value
        problems.append(f"{name} : booléen attendu (true/false), obtenu {value!r}")
        return value
    if target is str:
        if isinstance(value, str):
            return value
        problems.append(f"{name} : chaîne attendue, obtenu {value!r}")
        return value
    if target is list:
        if isinstance(value, list) and all(isinstance(item, str) for item in value):
            return value
        if isinstance(value, str):
            return [part.strip() for part in value.split(",") if part.strip()]
        problems.append(f"{name} : liste de chaînes attendue, obtenu {value!r}")
        return value
    return value


_FIELD_TYPES: dict[str, Any] = {
    "model_name": str,
    "output_dir": str,
    "adapter_dir": str,
    "train_file": str,
    "validation_file": str,
    "learning_rate": float,
    "num_train_epochs": float,
    "max_steps": int,
    "batch_size": int,
    "gradient_accumulation_steps": int,
    "max_seq_length": int,
    "warmup_ratio": float,
    "weight_decay": float,
    "lr_scheduler_type": str,
    "max_grad_norm": float,
    "lora_r": int,
    "lora_alpha": int,
    "lora_dropout": float,
    "lora_target_modules": list,
    "logging_steps": int,
    "save_steps": int,
    "save_total_limit": int,
    "evaluation_strategy": str,
    "eval_steps": int,
    "eval_max_examples": int,
    "seed": int,
    "gradient_checkpointing": bool,
    "cpu_threads": int,
    "torch_dtype": str,
    "system_prompt": str,
    "system_prompt_file": str,
    "train_on_metadata": bool,
    "enable_thinking": bool,
}


def config_from_mapping(raw: dict[str, Any]) -> TrainingConfig:
    """Construit et valide la configuration depuis un dictionnaire déjà lu."""
    if not isinstance(raw, dict):
        raise ConfigError("le fichier de configuration doit être un objet YAML (clé: valeur)")

    problems: list[str] = []
    unknown = sorted(set(raw) - _known_keys())
    if unknown:
        problems.append(
            "clé(s) inconnue(s) : " + ", ".join(unknown)
            + " — vérifier l'orthographe, aucune clé n'est ignorée silencieusement"
        )

    values: dict[str, Any] = {}
    for name, value in raw.items():
        if name in _FIELD_TYPES:
            values[name] = _coerce(name, value, _FIELD_TYPES[name], problems)

    if problems:
        raise ConfigError("configuration invalide :\n  - " + "\n  - ".join(problems))

    config = TrainingConfig(**values)
    problems = validate_config(config)
    if problems:
        raise ConfigError("configuration invalide :\n  - " + "\n  - ".join(problems))
    return config


def validate_config(config: TrainingConfig) -> list[str]:
    """Liste les incohérences. Vide = configuration acceptable."""
    problems: list[str] = []

    if not config.model_name.strip():
        problems.append("model_name est vide")
    if config.learning_rate <= 0:
        problems.append("learning_rate doit être > 0")
    if config.learning_rate > 1e-2:
        problems.append("learning_rate > 1e-2 : bien trop élevé pour LoRA (repère : 2e-4)")
    if config.num_train_epochs <= 0 and config.max_steps is None:
        problems.append("num_train_epochs doit être > 0 (ou fixer max_steps)")
    if config.max_steps is not None and config.max_steps <= 0:
        problems.append("max_steps doit être > 0 quand il est donné")
    if config.batch_size < 1:
        problems.append("batch_size doit être >= 1")
    if config.gradient_accumulation_steps < 1:
        problems.append("gradient_accumulation_steps doit être >= 1")
    if config.max_seq_length < 64:
        problems.append("max_seq_length doit être >= 64")
    if not 0 <= config.warmup_ratio < 1:
        problems.append("warmup_ratio doit être dans [0, 1)")
    if config.weight_decay < 0:
        problems.append("weight_decay doit être >= 0")
    if config.lr_scheduler_type not in VALID_SCHEDULERS:
        problems.append(
            f"lr_scheduler_type {config.lr_scheduler_type!r} inconnu ; "
            f"valeurs : {', '.join(VALID_SCHEDULERS)}"
        )
    if config.max_grad_norm <= 0:
        problems.append("max_grad_norm doit être > 0")

    problems.extend(validate_lora_hyperparameters(
        config.lora_r, config.lora_alpha, config.lora_dropout, config.lora_target_modules,
    ))

    if config.logging_steps < 1:
        problems.append("logging_steps doit être >= 1")
    if config.save_steps < 1:
        problems.append("save_steps doit être >= 1")
    if config.save_total_limit < 1:
        problems.append("save_total_limit doit être >= 1 (sinon aucun checkpoint reprenable)")
    if config.evaluation_strategy not in VALID_EVALUATION_STRATEGIES:
        problems.append(
            f"evaluation_strategy {config.evaluation_strategy!r} inconnue ; "
            f"valeurs : {', '.join(VALID_EVALUATION_STRATEGIES)}"
        )
    if config.evaluation_strategy == "steps" and (config.eval_steps is None or config.eval_steps < 1):
        problems.append("evaluation_strategy: steps exige eval_steps >= 1")
    if config.eval_max_examples < 1:
        problems.append("eval_max_examples doit être >= 1")
    if config.cpu_threads is not None and config.cpu_threads < 1:
        problems.append("cpu_threads doit être >= 1 (ou null pour la valeur automatique)")
    if config.torch_dtype not in VALID_DTYPES:
        problems.append(
            f"torch_dtype {config.torch_dtype!r} non pris en charge sur CPU ; "
            f"valeurs : {', '.join(VALID_DTYPES)}"
        )
    return problems


def validate_lora_hyperparameters(
    r: int, alpha: int, dropout: float, target_modules: list[str],
) -> list[str]:
    """Contrôles purs sur les hyperparamètres LoRA, sans importer PEFT."""
    problems: list[str] = []
    if r < 1:
        problems.append("lora_r doit être >= 1")
    if r > 256:
        problems.append("lora_r > 256 : mémoire et temps explosent pour un gain nul sur CPU")
    if alpha < 1:
        problems.append("lora_alpha doit être >= 1")
    if not 0 <= dropout < 1:
        problems.append("lora_dropout doit être dans [0, 1)")
    if not target_modules:
        problems.append("lora_target_modules ne peut pas être vide")
    else:
        duplicates = sorted({m for m in target_modules if target_modules.count(m) > 1})
        if duplicates:
            problems.append("lora_target_modules contient des doublons : " + ", ".join(duplicates))
        empty = [m for m in target_modules if not m.strip()]
        if empty:
            problems.append("lora_target_modules contient une entrée vide")
    return problems


def load_config(path: str | Path) -> TrainingConfig:
    """Lit le YAML et rend une configuration validée."""
    try:
        import yaml  # PyYAML — la seule dépendance de ce module.
    except ImportError as error:  # pragma: no cover - dépend de l'environnement
        raise ConfigError(
            "PyYAML manquant : `pip install pyyaml` (ou `pip install -r ai-training/requirements.txt`)"
        ) from error

    file_path = paths.resolve(path)
    if not file_path.is_file():
        raise ConfigError(f"fichier de configuration introuvable : {paths.display(file_path)}")

    with file_path.open("r", encoding="utf-8") as handle:
        try:
            raw = yaml.safe_load(handle)
        except yaml.YAMLError as error:
            raise ConfigError(f"YAML illisible ({paths.display(file_path)}) : {error}") from error

    if raw is None:
        raw = {}
    return config_from_mapping(raw)


def default_thread_count(cpu_count: int | None = None) -> int:
    """Valeur sûre : jamais tous les fils, jamais plus de MAX_DEFAULT_THREADS."""
    total = cpu_count if cpu_count is not None else (os.cpu_count() or 2)
    return max(1, min(MAX_DEFAULT_THREADS, total - 2))


def resolve_cpu_threads(config: TrainingConfig, environ: dict[str, str] | None = None) -> int:
    """
    Nombre de fils CPU : variable d'environnement > YAML > défaut sûr.

    `YELHAA_TRAIN_THREADS` illisible ou <= 0 est signalé et ignoré plutôt que de
    planter : une faute de frappe ne doit pas empêcher un entraînement de
    démarrer, mais elle ne doit pas non plus passer inaperçue.
    """
    env = os.environ if environ is None else environ
    raw = env.get(THREADS_ENV, "").strip()
    if raw:
        try:
            value = int(raw)
        except ValueError:
            value = 0
        if value >= 1:
            return value
        print(
            f"[config] {THREADS_ENV}={raw!r} ignoré (entier >= 1 attendu) ; "
            "repli sur la configuration."
        )
    if config.cpu_threads is not None:
        return config.cpu_threads
    return default_thread_count()
