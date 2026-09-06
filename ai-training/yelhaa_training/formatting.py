"""
Formatage des exemples avec le gabarit de chat **officiel** du tokenizer Qwen3.

Aucun jeton spécial n'est écrit à la main ici : `<|im_start|>`, `<think>` et
consorts viennent du `chat_template` embarqué dans le tokenizer. Le module se
contente de deux appels à `apply_chat_template` :

  1. la conversation complète → texte intégral ;
  2. la conversation sans la dernière réponse, avec `add_generation_prompt`
     → le préfixe exactement tel qu'Ollama le présentera au modèle.

La cible supervisée est ce qui suit le préfixe : la réponse de l'assistant et
son jeton de fin. Les jetons du préfixe reçoivent l'étiquette `-100` et ne
contribuent pas à la perte. Les métadonnées n'entrent jamais dans la cible.

Le tokenizer est manipulé par « duck typing » : les tests fournissent un faux
tokenizer minuscule, ce qui permet de vérifier le masquage sans télécharger
Qwen.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Protocol

from .dataset import Example

IGNORE_INDEX = -100
MIN_TARGET_TOKENS = 8


class ChatTokenizer(Protocol):
    def apply_chat_template(self, conversation: list[dict[str, str]], **kwargs: Any) -> Any: ...
    def __call__(self, text: str, **kwargs: Any) -> Any: ...


class ChatTemplateError(RuntimeError):
    """Le gabarit du tokenizer ne se comporte pas comme attendu."""


@dataclass
class EncodedExample:
    input_ids: list[int]
    labels: list[int]
    attention_mask: list[int]
    prompt_tokens: int
    target_tokens: int
    truncated: bool
    source: str = ""

    def __len__(self) -> int:
        return len(self.input_ids)


@dataclass
class SkippedExample:
    source: str
    reason: str
    prompt_tokens: int


def metadata_block(metadata: dict[str, Any]) -> str:
    """Rendu textuel des métadonnées, utilisé uniquement sur demande explicite."""
    if not metadata:
        return ""
    parts = [f"{key}: {value}" for key, value in sorted(metadata.items()) if value not in (None, "")]
    return "[" + "; ".join(parts) + "]"


def build_conversation(
    example: Example,
    *,
    system_prompt: str | None = None,
    include_metadata: bool = False,
) -> list[dict[str, str]]:
    """
    Messages prêts pour le gabarit.

    - `system_prompt` n'est ajouté que si l'exemple n'a pas déjà de `system`.
    - `include_metadata=True` préfixe le **premier message utilisateur** d'un
      bloc `[category: saas; style: premium]`. Jamais la réponse.
    """
    messages = [dict(m) for m in example.messages]
    if system_prompt and messages[0]["role"] != "system":
        messages.insert(0, {"role": "system", "content": system_prompt})
    if include_metadata and example.metadata:
        for message in messages:
            if message["role"] == "user":
                block = metadata_block(example.metadata)
                if block:
                    message["content"] = f"{block}\n{message['content']}"
                break
    return messages


def render_prompt_and_target(
    tokenizer: ChatTokenizer,
    messages: list[dict[str, str]],
    *,
    enable_thinking: bool = False,
) -> tuple[str, str]:
    """(préfixe présenté au modèle, texte cible) — tous deux issus du gabarit officiel."""
    if len(messages) < 2 or messages[-1]["role"] != "assistant":
        raise ChatTemplateError("la conversation doit se terminer par un message assistant")

    full_text = tokenizer.apply_chat_template(
        messages, tokenize=False, add_generation_prompt=False,
    )
    prompt_text = tokenizer.apply_chat_template(
        messages[:-1], tokenize=False, add_generation_prompt=True, enable_thinking=enable_thinking,
    )
    if not isinstance(full_text, str) or not isinstance(prompt_text, str):
        raise ChatTemplateError("apply_chat_template(tokenize=False) doit rendre une chaîne")
    if not full_text.startswith(prompt_text):
        raise ChatTemplateError(
            "le gabarit ne rend pas le préfixe de génération comme début de la conversation "
            "complète ; le masquage des étiquettes serait faux. Vérifier la version du tokenizer "
            f"(préfixe : {prompt_text[-80:]!r} / complet : {full_text[len(prompt_text) - 80:len(prompt_text) + 20]!r})"
        )
    return prompt_text, full_text[len(prompt_text):]


def _token_ids(tokenizer: ChatTokenizer, text: str) -> list[int]:
    encoded = tokenizer(text, add_special_tokens=False)
    if isinstance(encoded, list):
        return list(encoded)
    # `BatchEncoding` de transformers, ou un dict équivalent.
    return list(encoded["input_ids"])


def encode_example(
    tokenizer: ChatTokenizer,
    example: Example,
    *,
    max_seq_length: int,
    system_prompt: str | None = None,
    include_metadata: bool = False,
    enable_thinking: bool = False,
) -> EncodedExample | SkippedExample:
    """
    Encode un exemple ; le préfixe est masqué, la cible est supervisée.

    Un préfixe qui ne laisse pas au moins `MIN_TARGET_TOKENS` jetons à la cible
    est **écarté** (avec raison) plutôt que tronqué : tronquer le brief
    apprendrait au modèle à répondre à une question qu'il n'a pas lue.
    Une cible trop longue est coupée par la droite et signalée.
    """
    messages = build_conversation(
        example, system_prompt=system_prompt, include_metadata=include_metadata,
    )
    prompt_text, target_text = render_prompt_and_target(
        tokenizer, messages, enable_thinking=enable_thinking,
    )
    prompt_ids = _token_ids(tokenizer, prompt_text)
    target_ids = _token_ids(tokenizer, target_text)

    room = max_seq_length - len(prompt_ids)
    if room < MIN_TARGET_TOKENS:
        return SkippedExample(
            source=example.source,
            reason=f"prompt de {len(prompt_ids)} jetons pour max_seq_length={max_seq_length}",
            prompt_tokens=len(prompt_ids),
        )

    truncated = len(target_ids) > room
    if truncated:
        target_ids = target_ids[:room]

    input_ids = prompt_ids + target_ids
    labels = [IGNORE_INDEX] * len(prompt_ids) + list(target_ids)
    return EncodedExample(
        input_ids=input_ids,
        labels=labels,
        attention_mask=[1] * len(input_ids),
        prompt_tokens=len(prompt_ids),
        target_tokens=len(target_ids),
        truncated=truncated,
        source=example.source,
    )


def pad_batch(
    items: list[EncodedExample],
    pad_token_id: int,
) -> dict[str, list[list[int]]]:
    """Collation à droite. Avec batch_size = 1 c'est un passe-plat."""
    width = max(len(item) for item in items)
    input_ids, labels, attention = [], [], []
    for item in items:
        missing = width - len(item)
        input_ids.append(item.input_ids + [pad_token_id] * missing)
        labels.append(item.labels + [IGNORE_INDEX] * missing)
        attention.append(item.attention_mask + [0] * missing)
    return {"input_ids": input_ids, "labels": labels, "attention_mask": attention}
