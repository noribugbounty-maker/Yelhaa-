"""Formatage par gabarit de chat et masquage des étiquettes (faux tokenizer)."""

from __future__ import annotations

import os

import pytest

from yelhaa_training.dataset import Example
from yelhaa_training.formatting import (
    IGNORE_INDEX,
    ChatTemplateError,
    EncodedExample,
    SkippedExample,
    build_conversation,
    encode_example,
    metadata_block,
    pad_batch,
    render_prompt_and_target,
)


def test_build_conversation_adds_system_prompt_only_when_absent(example: Example):
    with_system = build_conversation(example, system_prompt="SYS")
    assert with_system[0] == {"role": "system", "content": "SYS"}
    assert with_system[1:] == example.messages

    already = Example(messages=[{"role": "system", "content": "own"}] + example.messages, source="x")
    assert build_conversation(already, system_prompt="SYS")[0]["content"] == "own"
    assert build_conversation(example, system_prompt=None) == example.messages


def test_metadata_never_enters_the_conversation_by_default(example: Example):
    messages = build_conversation(example)
    assert "saas" not in messages[0]["content"]
    assert "saas" not in messages[-1]["content"]


def test_metadata_opt_in_prefixes_the_user_message_never_the_target(example: Example):
    messages = build_conversation(example, include_metadata=True)
    assert messages[0]["content"].startswith("[category: saas; style: dark]\n")
    assert messages[-1]["content"] == example.messages[-1]["content"]
    assert metadata_block({}) == ""
    assert metadata_block({"b": None, "a": 1}) == "[a: 1]"


def test_render_prompt_and_target_splits_at_generation_prompt(fake_tokenizer, example: Example):
    prompt, target = render_prompt_and_target(fake_tokenizer, example.messages)
    assert prompt == "<user>Build a dark SaaS landing page.</user>\n<assistant><think></think>"
    assert target == "Create a dark SaaS landing page with a 12-column grid.</assistant>\n"
    prompt_thinking, _ = render_prompt_and_target(fake_tokenizer, example.messages, enable_thinking=True)
    assert prompt_thinking.endswith("<assistant>")


def test_render_rejects_conversations_not_ending_with_assistant(fake_tokenizer):
    with pytest.raises(ChatTemplateError):
        render_prompt_and_target(fake_tokenizer, [{"role": "user", "content": "u"}])


def test_render_detects_template_prefix_mismatch(fake_tokenizer, example: Example):
    class BrokenTokenizer:
        def apply_chat_template(self, conversation, add_generation_prompt=False, **kwargs):
            return "PREFIX" if add_generation_prompt else "something else entirely"

        def __call__(self, text, **kwargs):
            return {"input_ids": [1]}

    with pytest.raises(ChatTemplateError, match="préfixe"):
        render_prompt_and_target(BrokenTokenizer(), example.messages)


def test_encode_masks_exactly_the_prompt(fake_tokenizer, example: Example):
    encoded = encode_example(fake_tokenizer, example, max_seq_length=4096)
    assert isinstance(encoded, EncodedExample)
    prompt, target = render_prompt_and_target(fake_tokenizer, example.messages)
    assert encoded.prompt_tokens == len(prompt)
    assert encoded.target_tokens == len(target)
    assert len(encoded) == len(prompt) + len(target)
    assert encoded.labels[: len(prompt)] == [IGNORE_INDEX] * len(prompt)
    assert encoded.labels[len(prompt):] == encoded.input_ids[len(prompt):]
    assert fake_tokenizer.decode(encoded.labels[len(prompt):]) == target
    assert encoded.attention_mask == [1] * len(encoded)
    assert encoded.truncated is False
    assert encoded.source == "test:1"


def test_encode_truncates_target_from_the_right(fake_tokenizer, example: Example):
    prompt, _ = render_prompt_and_target(fake_tokenizer, example.messages)
    limit = len(prompt) + 12
    encoded = encode_example(fake_tokenizer, example, max_seq_length=limit)
    assert isinstance(encoded, EncodedExample)
    assert encoded.truncated is True
    assert len(encoded) == limit
    assert encoded.target_tokens == 12


def test_encode_skips_when_prompt_leaves_no_room(fake_tokenizer, example: Example):
    prompt, _ = render_prompt_and_target(fake_tokenizer, example.messages)
    skipped = encode_example(fake_tokenizer, example, max_seq_length=len(prompt) + 3)
    assert isinstance(skipped, SkippedExample)
    assert skipped.prompt_tokens == len(prompt)
    assert "max_seq_length" in skipped.reason


def test_pad_batch_right_pads_with_ignore_index(fake_tokenizer, example: Example):
    short = Example(messages=[{"role": "user", "content": "a"}, {"role": "assistant", "content": "bb"}], source="s")
    items = [encode_example(fake_tokenizer, example, max_seq_length=4096), encode_example(fake_tokenizer, short, max_seq_length=4096)]
    batch = pad_batch(items, pad_token_id=0)
    width = len(items[0])
    assert all(len(row) == width for row in batch["input_ids"])
    assert batch["attention_mask"][1][len(items[1]):] == [0] * (width - len(items[1]))
    assert batch["labels"][1][len(items[1]):] == [IGNORE_INDEX] * (width - len(items[1]))
    assert batch["input_ids"][1][len(items[1]):] == [0] * (width - len(items[1]))


@pytest.mark.skipif(
    os.environ.get("YELHAA_RUN_MODEL_TESTS") != "1",
    reason="télécharge le tokenizer Qwen3 : YELHAA_RUN_MODEL_TESTS=1 pour l'activer",
)
def test_real_qwen3_template_matches_generation_prefix(example: Example):
    transformers = pytest.importorskip("transformers")
    tokenizer = transformers.AutoTokenizer.from_pretrained("Qwen/Qwen3-1.7B")
    prompt, target = render_prompt_and_target(tokenizer, example.messages, enable_thinking=False)
    assert prompt.endswith("<|im_start|>assistant\n<think>\n\n</think>\n\n")
    assert target.startswith("Create a dark SaaS landing page")
    assert target.rstrip("\n").endswith("<|im_end|>")
    encoded = encode_example(tokenizer, example, max_seq_length=2048)
    assert isinstance(encoded, EncodedExample)
    assert tokenizer.decode(encoded.labels[encoded.prompt_tokens:]).rstrip("\n").endswith("<|im_end|>")
