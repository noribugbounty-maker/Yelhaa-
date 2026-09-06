"""Chargement du YAML, défauts, validation, fils CPU."""

from __future__ import annotations

from pathlib import Path

import pytest

from yelhaa_training import paths
from yelhaa_training.config import (
    DEFAULT_TARGET_MODULES,
    MAX_DEFAULT_THREADS,
    THREADS_ENV,
    ConfigError,
    TrainingConfig,
    config_from_mapping,
    default_thread_count,
    load_config,
    resolve_cpu_threads,
    validate_config,
)

yaml = pytest.importorskip("yaml", reason="PyYAML requis (pip install -r ai-training/requirements.txt)")


def test_repository_config_loads_with_requested_defaults():
    config = load_config(paths.DEFAULT_CONFIG)
    assert config.model_name == "Qwen/Qwen3-1.7B"
    assert config.learning_rate == pytest.approx(2e-4)
    assert config.num_train_epochs == 2
    assert config.batch_size == 1
    assert config.gradient_accumulation_steps == 8
    assert config.max_seq_length == 2048
    assert (config.lora_r, config.lora_alpha, config.lora_dropout) == (16, 32, pytest.approx(0.05))
    assert config.warmup_ratio == pytest.approx(0.05)
    assert config.weight_decay == pytest.approx(0.01)
    assert config.gradient_checkpointing is True
    assert config.torch_dtype == "float32"
    assert config.cpu_threads is None
    assert config.train_on_metadata is False
    assert config.lora_target_modules == DEFAULT_TARGET_MODULES
    assert config.output_path == paths.TRAINING_ROOT / "outputs" / "checkpoints"
    assert config.train_path == paths.TRAINING_ROOT / "dataset" / "splits" / "train.jsonl"
    assert config.resolved_system_prompt() is None


def test_defaults_match_the_yaml_when_keys_are_omitted():
    config = config_from_mapping({})
    assert config.to_dict()["learning_rate"] == pytest.approx(2e-4)
    assert validate_config(config) == []


def test_unknown_key_is_an_error(tmp_path: Path):
    path = tmp_path / "bad.yaml"
    path.write_text("learning_rte: 0.001\n", encoding="utf-8")
    with pytest.raises(ConfigError, match="learning_rte"):
        load_config(path)


def test_type_coercion_and_type_errors():
    config = config_from_mapping({"learning_rate": "1e-4", "num_train_epochs": 3, "lora_target_modules": "q_proj, v_proj"})
    assert config.learning_rate == pytest.approx(1e-4)
    assert config.num_train_epochs == 3.0
    assert config.lora_target_modules == ["q_proj", "v_proj"]
    with pytest.raises(ConfigError, match="batch_size"):
        config_from_mapping({"batch_size": "one"})
    with pytest.raises(ConfigError, match="gradient_checkpointing"):
        config_from_mapping({"gradient_checkpointing": "yes"})


@pytest.mark.parametrize(
    "overrides, fragment",
    [
        ({"learning_rate": 0}, "learning_rate"),
        ({"learning_rate": 0.5}, "learning_rate"),
        ({"batch_size": 0}, "batch_size"),
        ({"max_seq_length": 16}, "max_seq_length"),
        ({"warmup_ratio": 1.0}, "warmup_ratio"),
        ({"lora_r": 0}, "lora_r"),
        ({"lora_dropout": 1.0}, "lora_dropout"),
        ({"lora_target_modules": []}, "lora_target_modules"),
        ({"lora_target_modules": ["q_proj", "q_proj"]}, "doublons"),
        ({"evaluation_strategy": "sometimes"}, "evaluation_strategy"),
        ({"evaluation_strategy": "steps"}, "eval_steps"),
        ({"torch_dtype": "float16"}, "torch_dtype"),
        ({"lr_scheduler_type": "banana"}, "lr_scheduler_type"),
        ({"save_total_limit": 0}, "save_total_limit"),
        ({"cpu_threads": 0}, "cpu_threads"),
    ],
)
def test_invalid_values_are_rejected(overrides, fragment):
    with pytest.raises(ConfigError, match=fragment):
        config_from_mapping(overrides)


def test_max_steps_allows_zero_epochs():
    config = config_from_mapping({"num_train_epochs": 0, "max_steps": 5})
    assert validate_config(config) == []


def test_system_prompt_file_wins_over_inline(tmp_path: Path):
    prompt_file = tmp_path / "system.txt"
    prompt_file.write_text("  You assemble prompts.  \n", encoding="utf-8")
    config = config_from_mapping({"system_prompt": "inline", "system_prompt_file": str(prompt_file)})
    assert config.resolved_system_prompt() == "You assemble prompts."
    missing = config_from_mapping({"system_prompt_file": str(tmp_path / "absent.txt")})
    with pytest.raises(ConfigError, match="system_prompt_file"):
        missing.resolved_system_prompt()


def test_default_thread_count_is_conservative():
    assert default_thread_count(cpu_count=8) == 6
    assert default_thread_count(cpu_count=4) == 2
    assert default_thread_count(cpu_count=2) == 1
    assert default_thread_count(cpu_count=64) == MAX_DEFAULT_THREADS


def test_resolve_cpu_threads_precedence():
    config = TrainingConfig(cpu_threads=3)
    assert resolve_cpu_threads(config, environ={}) == 3
    assert resolve_cpu_threads(config, environ={THREADS_ENV: "5"}) == 5
    assert resolve_cpu_threads(config, environ={THREADS_ENV: " 7 "}) == 7
    # Valeur illisible ou nulle : signalée et ignorée, on retombe sur le YAML.
    assert resolve_cpu_threads(config, environ={THREADS_ENV: "many"}) == 3
    assert resolve_cpu_threads(config, environ={THREADS_ENV: "0"}) == 3
    automatic = TrainingConfig(cpu_threads=None)
    assert resolve_cpu_threads(automatic, environ={}) == default_thread_count()
