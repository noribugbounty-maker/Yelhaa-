"""Configuration LoRA, compatibilité d'architecture, Modelfile Ollama, heuristiques."""

from __future__ import annotations

import pytest

from yelhaa_training.config import TrainingConfig, validate_lora_hyperparameters
from yelhaa_training.lora import (
    SUPPORTED_MODEL_TYPES,
    UnsupportedArchitectureError,
    check_model_type,
    missing_targets,
)
from yelhaa_training.modelfile import (
    QWEN3_OLLAMA_PARAMETERS,
    QWEN3_OLLAMA_TEMPLATE,
    TemplateBundle,
    build_modelfile,
    embedded_template,
    parse_modelfile,
)
from yelhaa_training.scoring import score_output

# --- LoRA -------------------------------------------------------------------


def test_lora_hyperparameters_pure_validation():
    assert validate_lora_hyperparameters(16, 32, 0.05, ["q_proj", "v_proj"]) == []
    problems = validate_lora_hyperparameters(0, 0, 1.0, [])
    assert len(problems) == 4
    assert any("lora_target_modules" in p for p in problems)
    assert validate_lora_hyperparameters(8, 16, 0.0, ["q_proj", " "]) == ["lora_target_modules contient une entrée vide"]


def test_target_module_check_reports_missing_names():
    available = {"q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"}
    assert missing_targets(available, TrainingConfig().lora_target_modules) == []
    assert missing_targets(available, ["q_proj", "query_key_value"]) == ["query_key_value"]


def test_model_type_gate():
    for model_type in SUPPORTED_MODEL_TYPES:
        check_model_type(model_type)
    with pytest.raises(UnsupportedArchitectureError, match="llama"):
        check_model_type("llama")


def test_build_lora_config_with_peft():
    peft = pytest.importorskip("peft", reason="peft non installé")
    from yelhaa_training.lora import build_lora_config

    config = build_lora_config(TrainingConfig())
    assert isinstance(config, peft.LoraConfig)
    assert config.r == 16 and config.lora_alpha == 32 and config.lora_dropout == pytest.approx(0.05)
    assert set(config.target_modules) == set(TrainingConfig().lora_target_modules)
    assert config.task_type == peft.TaskType.CAUSAL_LM
    assert config.bias == "none"


def test_meta_skeleton_exposes_qwen3_linear_layers():
    """Sans poids ni réseau : un mini Qwen3 construit sur le device meta."""
    torch = pytest.importorskip("torch")
    transformers = pytest.importorskip("transformers")
    from yelhaa_training.lora import linear_module_names, verify_target_modules, IncompatibleTargetModulesError

    if not hasattr(transformers, "Qwen3Config"):
        pytest.skip("transformers trop ancien pour Qwen3 (>= 4.51 requis)")
    tiny = transformers.Qwen3Config(
        hidden_size=64, intermediate_size=128, num_hidden_layers=2, num_attention_heads=4,
        num_key_value_heads=2, head_dim=16, vocab_size=512, max_position_embeddings=256, tie_word_embeddings=True,
    )
    with torch.device("meta"):
        model = transformers.AutoModelForCausalLM.from_config(tiny)
    names = linear_module_names(model)
    assert {"q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"} <= names
    assert "lm_head" not in names
    assert verify_target_modules(model, TrainingConfig().lora_target_modules) == names
    with pytest.raises(IncompatibleTargetModulesError, match="query_key_value"):
        verify_target_modules(model, ["query_key_value"])


# --- Modelfile ---------------------------------------------------------------


def test_embedded_template_matches_local_qwen3_shape():
    bundle = embedded_template()
    assert bundle.template == QWEN3_OLLAMA_TEMPLATE
    assert "<|im_start|>" in bundle.template and "<think>" in bundle.template
    assert ("stop", '"<|im_end|>"') in bundle.parameters


def test_parse_modelfile_extracts_template_and_parameters():
    text = (
        'FROM qwen3:4b\nTEMPLATE """{{ .Prompt }}\nline two"""\n'
        'PARAMETER stop "<|im_end|>"\nPARAMETER temperature 0.6\nLICENSE """abc"""\n'
    )
    bundle = parse_modelfile(text)
    assert bundle is not None
    assert bundle.template == "{{ .Prompt }}\nline two"
    assert bundle.parameters == [("stop", '"<|im_end|>"'), ("temperature", "0.6")]
    assert parse_modelfile("FROM x\n") is None


def test_build_modelfile_never_targets_the_existing_model():
    bundle = TemplateBundle(template="T", parameters=list(QWEN3_OLLAMA_PARAMETERS), origin="test")
    modelfile = build_modelfile("./yelhaa-qwen-q8_0.gguf", bundle, num_ctx=8192)
    assert modelfile.startswith("# yelhaa-qwen")
    assert "FROM ./yelhaa-qwen-q8_0.gguf\n" in modelfile
    assert 'TEMPLATE """T"""' in modelfile
    assert "PARAMETER num_ctx 8192" in modelfile
    assert 'PARAMETER stop "<|im_start|>"' in modelfile
    assert "SYSTEM" not in modelfile
    assert "qwen3:4b" not in modelfile.split("\n", 2)[2]  # jamais dans FROM

    with_system = build_modelfile("./merged", bundle, system="You assemble prompts.")
    assert 'SYSTEM """You assemble prompts."""' in with_system


# --- heuristiques d'évaluation ------------------------------------------------


def test_scoring_prefers_concrete_structured_text_over_filler():
    generic = "Create a modern and beautiful website with nice animations and a sleek, user-friendly design that is engaging."
    concrete = (
        "ART DIRECTION\n- Palette: #0B0E14 background, #3DDC97 accent, WCAG AA contrast.\n"
        "- Typography: Inter 16/20/28/40px, letter-spacing -0.02em.\n"
        "LAYOUT\n1. 12-column grid, 1200px container, 24px gutters.\n2. Hero split 7/5 with two CTAs.\n"
        "RESPONSIVE\n- Breakpoints 640/1024px; stack under 1024px.\n"
        "MOTION\n- Fade-up 20px over 500ms ease-out; respect prefers-reduced-motion.\n"
        "PERFORMANCE\n- LCP under 2s, fonts self-hosted with font-display swap.\n"
    )
    g = score_output(generic, art_direction=["dark", "editorial"], must_cover=["pricing"])
    c = score_output(concrete, art_direction=["dark", "grid"], must_cover=["hero", "cta"])
    assert g.filler < 0.6 and c.filler == 1.0
    assert "beautiful" in g.filler_found
    assert c.coverage > g.coverage
    assert c.specificity > g.specificity
    assert c.structure > g.structure
    assert g.art_direction == 0.0 and g.art_direction_missed == ["dark", "editorial"]
    assert c.completeness == 1.0 and c.must_cover_missed == []
    assert 0.0 <= c.overall <= 1.0


def test_scoring_repetition_lowers_consistency():
    line = "Use a 12-column grid with 24px gutters and a compact navigation bar.\n"
    repeated = score_output(line * 12)
    varied = score_output(
        "Use a 12-column grid with 24px gutters.\nNavigation: compact 56px bar.\n"
        "Hero: two columns 7/5.\nFooter: 4 columns with legal links.\nMotion: 400ms fades only.\n"
        "Accessibility: AA contrast and 2px focus rings.\nPerformance: LCP under 2s.\n"
        "Components: Button, Card, NavBar with hover and focus states.\n"
    )
    assert repeated.consistency < varied.consistency
