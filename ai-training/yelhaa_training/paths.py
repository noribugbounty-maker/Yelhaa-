"""Emplacements canoniques du pipeline. Tout est relatif à `ai-training/`."""

from __future__ import annotations

from pathlib import Path

TRAINING_ROOT = Path(__file__).resolve().parents[1]
REPO_ROOT = TRAINING_ROOT.parent

DATASET_DIR = TRAINING_ROOT / "dataset"
RAW_DIR = DATASET_DIR / "raw"
PROCESSED_DIR = DATASET_DIR / "processed"
SPLITS_DIR = DATASET_DIR / "splits"
EVAL_DIR = DATASET_DIR / "eval"
EXAMPLES_DIR = DATASET_DIR / "examples"

CONFIGS_DIR = TRAINING_ROOT / "configs"
DEFAULT_CONFIG = CONFIGS_DIR / "qwen3-1.7b-lora.yaml"

OUTPUTS_DIR = TRAINING_ROOT / "outputs"
CHECKPOINTS_DIR = OUTPUTS_DIR / "checkpoints"
ADAPTER_DIR = OUTPUTS_DIR / "adapter"
EXPORTED_DIR = OUTPUTS_DIR / "exported"
EVAL_OUTPUT_DIR = OUTPUTS_DIR / "eval"

PROCESSED_DATASET = PROCESSED_DIR / "dataset.jsonl"
PREPARE_REPORT = PROCESSED_DIR / "prepare-report.json"
TRAIN_SPLIT = SPLITS_DIR / "train.jsonl"
VALIDATION_SPLIT = SPLITS_DIR / "validation.jsonl"
SPLIT_MANIFEST = SPLITS_DIR / "split-manifest.json"
DEFAULT_EVAL_SET = EVAL_DIR / "yelhaa-eval.jsonl"

# Fichier sentinelle : sa présence arrête l'entraînement proprement à la fin du
# pas en cours, après avoir écrit un checkpoint reprenable.
STOP_FILE = OUTPUTS_DIR / "STOP"


def resolve(path: str | Path) -> Path:
    """Chemin absolu.

    Convention des fichiers de configuration : un chemin relatif s'entend depuis
    `ai-training/`. Sur la ligne de commande on tape aussi naturellement des
    chemins depuis la racine du dépôt (`ai-training/dataset/raw`) ou depuis le
    dossier courant ; ces formes sont acceptées, dans cet ordre :

    1. chemin absolu, tel quel ;
    2. chemin qui existe depuis le dossier courant ;
    3. chemin commençant par `ai-training/`, depuis la racine du dépôt ;
    4. sinon, relatif à `ai-training/`.
    """
    candidate = Path(path)
    if candidate.is_absolute():
        return candidate
    from_cwd = Path.cwd() / candidate
    if from_cwd.exists():
        return from_cwd.resolve()
    if candidate.parts and candidate.parts[0] == TRAINING_ROOT.name:
        return (REPO_ROOT / candidate).resolve()
    return (TRAINING_ROOT / candidate).resolve()


def display(path: str | Path) -> str:
    """Chemin lisible dans les messages : relatif au dépôt quand c'est possible."""
    absolute = resolve(path)
    try:
        return absolute.relative_to(REPO_ROOT).as_posix()
    except ValueError:
        return str(absolute)
