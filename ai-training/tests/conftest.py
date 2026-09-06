"""Fixtures partagées — aucun modèle, aucun réseau."""

from __future__ import annotations

import sys
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from yelhaa_training.dataset import Example  # noqa: E402


class FakeTokenizer:
    """
    Tokenizer minuscule au comportement du gabarit Qwen : un jeton par caractère,
    `apply_chat_template` rend un préfixe de génération qui est bien le début de
    la conversation complète. Suffisant pour tester le masquage sans Qwen.
    """

    chat_template = "fake"
    pad_token_id = 0
    eos_token = "<eos>"

    def apply_chat_template(self, conversation, tokenize=False, add_generation_prompt=False, **kwargs):
        assert tokenize is False
        rendered = ""
        last = len(conversation) - 1
        for index, message in enumerate(conversation):
            role, content = message["role"], message["content"]
            # Comme Qwen3 : la dernière réponse porte un bloc de réflexion vide.
            think = "<think></think>" if (role == "assistant" and index == last) else ""
            rendered += f"<{role}>{think}{content}</{role}>\n"
        if add_generation_prompt:
            rendered += "<assistant>"
            if kwargs.get("enable_thinking") is False:
                rendered += "<think></think>"
        return rendered

    def __call__(self, text, add_special_tokens=False, **kwargs):
        return {"input_ids": [ord(ch) for ch in text]}

    def decode(self, ids, **kwargs):
        return "".join(chr(i) for i in ids)


@pytest.fixture
def fake_tokenizer() -> FakeTokenizer:
    return FakeTokenizer()


@pytest.fixture
def example() -> Example:
    return Example(
        messages=[
            {"role": "user", "content": "Build a dark SaaS landing page."},
            {"role": "assistant", "content": "Create a dark SaaS landing page with a 12-column grid."},
        ],
        metadata={"category": "saas", "style": "dark"},
        source="test:1",
    )


@pytest.fixture
def samples_path() -> Path:
    return ROOT / "dataset" / "examples" / "format-samples.jsonl"
