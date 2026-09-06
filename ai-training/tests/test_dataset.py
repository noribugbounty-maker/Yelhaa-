"""Normalisation, validation, doublons, qualité et découpe — sans modèle."""

from __future__ import annotations

import json
import sys
from pathlib import Path

import pytest

from yelhaa_training.dataset import (
    Example,
    Rejection,
    dedupe,
    dedupe_key,
    estimate_tokens,
    iter_raw_records,
    load_examples_strict,
    normalize_example,
    normalize_whitespace,
    read_examples,
    write_jsonl,
)
from yelhaa_training.quality import build_quality_report

SCRIPTS = Path(__file__).resolve().parents[1] / "scripts"
if str(SCRIPTS) not in sys.path:
    sys.path.insert(0, str(SCRIPTS))

import split_dataset  # noqa: E402
import validate_dataset  # noqa: E402
import prepare_dataset  # noqa: E402


# --- normalisation -----------------------------------------------------------


def test_normalize_whitespace_keeps_indentation_and_collapses_blank_lines():
    text = "Title  \r\n\r\n\r\n\r\n  - item   one\t\ttwo  \n"
    assert normalize_whitespace(text) == "Title\n\n  - item one two"


def test_normalize_example_accepts_canonical_shape():
    example, rejection = normalize_example(
        {"messages": [{"role": "user", "content": " Brief "}, {"role": "assistant", "content": "Answer\n\n\n\nMore"}],
         "metadata": {"category": "saas", "complexity": "high"}},
        "raw.jsonl:1",
    )
    assert rejection is None
    assert example is not None
    assert example.messages == [
        {"role": "user", "content": "Brief"},
        {"role": "assistant", "content": "Answer\n\nMore"},
    ]
    assert example.metadata == {"category": "saas", "complexity": "high"}
    assert example.source == "raw.jsonl:1"


def test_normalize_example_accepts_pair_shapes():
    for user_key, assistant_key in (("prompt", "completion"), ("input", "output"), ("brief", "prompt")):
        example, rejection = normalize_example({user_key: "u", assistant_key: "a", "system": "s"}, "x")
        assert rejection is None, (user_key, assistant_key)
        assert [m["role"] for m in example.messages] == ["system", "user", "assistant"]


@pytest.mark.parametrize(
    "raw, reason",
    [
        ("not an object", "not-an-object"),
        ({"foo": "bar"}, "missing-messages"),
        ({"messages": []}, "missing-messages"),
        ({"messages": [{"role": "narrator", "content": "x"}]}, "invalid-role"),
        ({"messages": [{"role": "user", "content": 42}]}, "invalid-content"),
        ({"messages": [{"role": "user", "content": "   "}, {"role": "assistant", "content": "a"}]}, "empty-user-message"),
        ({"messages": [{"role": "user", "content": "u"}, {"role": "assistant", "content": "\n\n"}]}, "empty-assistant-message"),
        ({"messages": [{"role": "user", "content": "u"}]}, "missing-assistant-message"),
        ({"messages": [{"role": "assistant", "content": "a"}]}, "roles-not-alternating"),
        ({"messages": [{"role": "user", "content": "u"}, {"role": "user", "content": "u2"}, {"role": "assistant", "content": "a"}]}, "roles-not-alternating"),
        ({"messages": [{"role": "system", "content": "s"}]}, "missing-user-message"),
        ({"messages": [{"role": "user", "content": "u"}, {"role": "system", "content": "s"}, {"role": "assistant", "content": "a"}]}, "misplaced-system"),
        ({"messages": [{"role": "user", "content": "u"}, {"role": "assistant", "content": "a"}], "metadata": "saas"}, "invalid-metadata"),
        ({"messages": [{"role": "user", "content": "u"}, {"role": "assistant", "content": "a"}], "metadata": {"tags": ["a"]}}, "invalid-metadata"),
    ],
)
def test_normalize_example_rejects_with_reason(raw, reason):
    example, rejection = normalize_example(raw, "src")
    assert example is None
    assert rejection is not None
    assert rejection.reason == reason
    assert rejection.source == "src"


# --- lecture -----------------------------------------------------------------


def test_iter_raw_records_reports_malformed_lines_without_stopping(tmp_path: Path):
    path = tmp_path / "raw.jsonl"
    path.write_text('{"a": 1}\n\nnot json\n{"b": 2}\n', encoding="utf-8")
    items = list(iter_raw_records(path))
    assert len(items) == 3
    assert items[0][1] == f"{path.as_posix()}:1"
    assert isinstance(items[1], Rejection) and items[1].reason == "malformed-json"
    assert items[2][0] == {"b": 2}


def test_iter_raw_records_reads_json_arrays_and_wrapped_objects(tmp_path: Path):
    array_path = tmp_path / "a.json"
    array_path.write_text('[{"x": 1}, {"x": 2}]', encoding="utf-8")
    wrapped_path = tmp_path / "b.json"
    wrapped_path.write_text('{"examples": [{"x": 3}]}', encoding="utf-8")
    assert [r[0]["x"] for r in iter_raw_records(array_path)] == [1, 2]
    assert [r[0]["x"] for r in iter_raw_records(wrapped_path)] == [3]


def test_format_samples_are_valid(samples_path: Path):
    examples, rejections = read_examples(samples_path)
    assert rejections == []
    assert len(examples) == 3
    assert all(e.metadata.get("category") for e in examples)
    assert all(len(e.assistant_text.split()) > 150 for e in examples)


# --- doublons ----------------------------------------------------------------


def _ex(user: str, assistant: str, source: str = "s") -> Example:
    return Example(messages=[{"role": "user", "content": user}, {"role": "assistant", "content": assistant}], source=source)


def test_dedupe_is_case_and_whitespace_insensitive():
    a = _ex("Build a  SaaS", "Create it", "a")
    b = _ex("build a saas", "create IT", "b")
    c = _ex("Something else", "Create it", "c")
    assert dedupe_key(a) == dedupe_key(b)
    kept, rejected = dedupe([a, b, c])
    assert [e.source for e in kept] == ["a", "c"]
    assert rejected[0].reason == "duplicate" and "a" in rejected[0].detail


# --- écriture / relecture ----------------------------------------------------


def test_write_then_load_strict_roundtrip(tmp_path: Path, example: Example):
    path = tmp_path / "out.jsonl"
    assert write_jsonl(path, [example]) == 1
    loaded = load_examples_strict(path)
    assert loaded[0].messages == example.messages
    assert loaded[0].metadata == example.metadata
    # Une ligne cassée rend le fichier inutilisable pour l'entraînement.
    path.write_text(path.read_text(encoding="utf-8") + "{broken\n", encoding="utf-8")
    with pytest.raises(ValueError):
        load_examples_strict(path)


def test_estimate_tokens_is_an_upper_bound_shape():
    assert estimate_tokens("") == 0
    assert estimate_tokens("a" * 40) == 12


# --- qualité -----------------------------------------------------------------


def test_quality_report_flags_short_repeated_and_imbalanced():
    long_answer = " ".join(["word"] * 60)
    examples = [
        _ex("Brief one about a bakery site", long_answer, "1"),
        _ex("Brief two about a fintech dashboard", long_answer, "2"),
        _ex("Short", "tiny answer", "3"),
        _ex(" ".join(["a very long brief"] * 80), "ok " * 45, "4"),
    ]
    report = build_quality_report(examples, duplicate_count=2, malformed_json=1)
    assert report.total == 4
    assert [r["source"] for r in report.short_outputs] == ["3"]
    assert report.repeated_outputs and report.repeated_outputs[0]["sources"] == ["1", "2"]
    assert any(r["source"] == "4" and r["kind"] == "output-shorter-than-input" for r in report.length_imbalance)
    assert report.duplication_rate == pytest.approx(2 / 6)
    assert any("doublons" in w for w in report.warnings)
    assert any("recopi" in w for w in report.warnings)
    assert report.categories == {"(none)": 4}


# --- découpe -----------------------------------------------------------------


def test_split_is_deterministic_and_disjoint():
    examples = [_ex(f"brief {i}", f"answer {i} " * 10, str(i)) for i in range(50)]
    train_a, val_a = split_dataset.split_examples(examples, validation_ratio=0.1, seed=42)
    train_b, val_b = split_dataset.split_examples(examples, validation_ratio=0.1, seed=42)
    assert [e.source for e in train_a] == [e.source for e in train_b]
    assert [e.source for e in val_a] == [e.source for e in val_b]
    assert len(val_a) == 5 and len(train_a) == 45
    assert set(e.source for e in train_a).isdisjoint(e.source for e in val_a)
    train_c, _ = split_dataset.split_examples(examples, validation_ratio=0.1, seed=7)
    assert [e.source for e in train_c] != [e.source for e in train_a]


def test_split_keeps_at_least_one_validation_example_when_possible():
    assert split_dataset.validation_count(1, 0.1) == 0
    assert split_dataset.validation_count(2, 0.1) == 1
    assert split_dataset.validation_count(5, 0.1) == 1
    assert split_dataset.validation_count(100, 0.1) == 10
    assert split_dataset.validation_count(3, 0.9) == 2


def test_split_stratifies_by_metadata():
    examples = []
    for i in range(20):
        examples.append(Example(
            messages=[{"role": "user", "content": f"b{i}"}, {"role": "assistant", "content": f"a{i}"}],
            metadata={"category": "saas" if i < 10 else "agency"}, source=str(i),
        ))
    _, validation = split_dataset.split_examples(examples, validation_ratio=0.1, seed=1, stratify_by="category")
    assert sorted(e.metadata["category"] for e in validation) == ["agency", "saas"]


# --- scripts de bout en bout (fichiers temporaires) ---------------------------


def test_prepare_validate_split_pipeline(tmp_path: Path, samples_path: Path, monkeypatch: pytest.MonkeyPatch):
    raw = tmp_path / "raw.jsonl"
    lines = samples_path.read_text(encoding="utf-8").splitlines()
    lines.append(lines[0])  # doublon exact
    lines.append('{"messages": [{"role": "user", "content": ""}, {"role": "assistant", "content": "x"}]}')
    lines.append("{not json")
    raw.write_text("\n".join(lines) + "\n", encoding="utf-8")

    processed = tmp_path / "processed.jsonl"
    report = tmp_path / "report.json"
    assert prepare_dataset.main(["--input", str(raw), "--output", str(processed), "--report", str(report)]) == 0
    written = processed.read_text(encoding="utf-8").strip().splitlines()
    assert len(written) == 3
    payload = json.loads(report.read_text(encoding="utf-8"))
    assert payload["rejection_reasons"] == {"duplicate": 1, "empty-user-message": 1, "malformed-json": 1}
    assert len(payload["rejections"]) == 3

    assert validate_dataset.main([str(processed)]) == 0
    assert validate_dataset.main([str(processed), "--strict", "--min-examples", "50"]) == 3

    broken = tmp_path / "broken.jsonl"
    broken.write_text(written[0] + "\n" + '{"messages": [{"role": "user", "content": "u"}]}\n', encoding="utf-8")
    assert validate_dataset.main([str(broken)]) == 1
    assert validate_dataset.main([str(tmp_path / "absent.jsonl")]) == 2

    train = tmp_path / "splits" / "train.jsonl"
    validation = tmp_path / "splits" / "validation.jsonl"
    assert split_dataset.main([
        "--input", str(processed), "--train-output", str(train), "--validation-output", str(validation),
    ]) == 0
    assert len(train.read_text(encoding="utf-8").strip().splitlines()) == 2
    assert len(validation.read_text(encoding="utf-8").strip().splitlines()) == 1
    # Le manifeste est écrit à côté de train.jsonl, jamais dans le dépôt.
    manifest = json.loads((tmp_path / "splits" / "split-manifest.json").read_text(encoding="utf-8"))
    assert manifest["seed"] == 42 and manifest["train"] == 2 and manifest["validation"] == 1
