"""Résolution des chemins : depuis ai-training/, depuis la racine du dépôt, absolus."""

from __future__ import annotations

from pathlib import Path

from yelhaa_training import paths


def test_absolute_paths_are_returned_unchanged(tmp_path: Path) -> None:
    target = tmp_path / "anything.jsonl"
    assert paths.resolve(target) == target


def test_config_style_paths_resolve_from_training_root(monkeypatch) -> None:
    # Depuis la racine du dépôt (là où `python ai-training/scripts/...` est tapé),
    # un chemin de configuration reste relatif à ai-training/.
    monkeypatch.chdir(paths.REPO_ROOT)
    assert paths.resolve("dataset/splits/train.jsonl") == paths.TRAIN_SPLIT
    assert paths.resolve("outputs/does-not-exist-yet") == paths.OUTPUTS_DIR / "does-not-exist-yet"


def test_repo_root_style_paths_are_accepted(monkeypatch) -> None:
    monkeypatch.chdir(paths.REPO_ROOT)
    # Existant : trouvé depuis le dossier courant.
    assert paths.resolve("ai-training/dataset/examples/format-samples.jsonl") == (
        paths.EXAMPLES_DIR / "format-samples.jsonl"
    )
    # Pas encore créé : le préfixe ai-training/ suffit à lever l'ambiguïté.
    assert paths.resolve("ai-training/outputs/new-run") == paths.OUTPUTS_DIR / "new-run"


def test_paths_typed_from_inside_training_root(monkeypatch) -> None:
    monkeypatch.chdir(paths.TRAINING_ROOT)
    assert paths.resolve("dataset/raw") == paths.RAW_DIR
    assert paths.resolve("configs/qwen3-1.7b-lora.yaml") == paths.DEFAULT_CONFIG


def test_display_is_relative_to_repo_root() -> None:
    assert paths.display(paths.TRAIN_SPLIT) == "ai-training/dataset/splits/train.jsonl"
