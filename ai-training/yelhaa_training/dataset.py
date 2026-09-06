"""
Lecture, normalisation, validation et écriture des exemples.

Format canonique — une ligne JSON par exemple :

    {"messages": [{"role": "user", "content": "..."},
                  {"role": "assistant", "content": "..."}],
     "metadata": {"category": "saas", "style": "premium"}}

Rien n'est supprimé en silence : chaque exemple écarté produit une `Rejection`
avec sa provenance (`fichier:ligne`) et sa raison. Les fichiers bruts ne sont
jamais modifiés.

Ce module n'a **aucune dépendance** hors bibliothèque standard : il doit
tourner sur une machine où PyTorch n'est pas installé, et être testable en
une fraction de seconde.
"""

from __future__ import annotations

import hashlib
import json
import math
import re
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Iterable, Iterator

ROLES = ("system", "user", "assistant")
SCALAR_TYPES = (str, int, float, bool, type(None))

# Formats de commodité acceptés en entrée et convertis vers `messages`.
PAIR_KEYS = (
    ("prompt", "completion"),
    ("input", "output"),
    ("user", "assistant"),
    ("instruction", "response"),
    ("brief", "prompt"),
)

_WHITESPACE_RUN = re.compile(r"[ \t\f\v]+")
_TRAILING_SPACES = re.compile(r"[ \t]+\n")
_BLANK_LINES = re.compile(r"\n{3,}")


@dataclass
class Example:
    messages: list[dict[str, str]]
    metadata: dict[str, Any] = field(default_factory=dict)
    source: str = ""

    @property
    def user_text(self) -> str:
        return "\n".join(m["content"] for m in self.messages if m["role"] == "user")

    @property
    def assistant_text(self) -> str:
        return "\n".join(m["content"] for m in self.messages if m["role"] == "assistant")

    @property
    def system_text(self) -> str | None:
        first = self.messages[0]
        return first["content"] if first["role"] == "system" else None

    def to_record(self) -> dict[str, Any]:
        record: dict[str, Any] = {"messages": self.messages}
        if self.metadata:
            record["metadata"] = self.metadata
        return record


@dataclass
class Rejection:
    source: str
    reason: str
    detail: str = ""

    def to_record(self) -> dict[str, str]:
        return {"source": self.source, "reason": self.reason, "detail": self.detail}


# ---------------------------------------------------------------------------
# Lecture
# ---------------------------------------------------------------------------


def iter_raw_records(path: Path) -> Iterator[tuple[Any, str] | Rejection]:
    """
    Itère les enregistrements d'un `.jsonl` (un objet par ligne) ou d'un `.json`
    (tableau d'objets, ou objet avec une clé `examples`/`data`/`items`).

    Une ligne JSON illisible rend une `Rejection` au lieu d'interrompre la
    lecture : un fichier de mille lignes ne doit pas être bloqué par la 412e.
    """
    label = path.as_posix()
    suffix = path.suffix.lower()

    if suffix == ".jsonl":
        with path.open("r", encoding="utf-8") as handle:
            for number, line in enumerate(handle, start=1):
                stripped = line.strip()
                if not stripped:
                    continue
                try:
                    yield json.loads(stripped), f"{label}:{number}"
                except json.JSONDecodeError as error:
                    yield Rejection(f"{label}:{number}", "malformed-json", str(error))
        return

    if suffix == ".json":
        try:
            with path.open("r", encoding="utf-8") as handle:
                payload = json.load(handle)
        except json.JSONDecodeError as error:
            yield Rejection(label, "malformed-json", str(error))
            return
        if isinstance(payload, dict):
            for key in ("examples", "data", "items"):
                if isinstance(payload.get(key), list):
                    payload = payload[key]
                    break
            else:
                # Un objet seul : traité comme un exemple unique.
                payload = [payload]
        if not isinstance(payload, list):
            yield Rejection(label, "malformed-json", "un tableau d'exemples était attendu")
            return
        for index, item in enumerate(payload):
            yield item, f"{label}[{index}]"
        return

    yield Rejection(label, "unsupported-file", f"extension {suffix!r} : .json ou .jsonl attendu")


# ---------------------------------------------------------------------------
# Normalisation
# ---------------------------------------------------------------------------


def normalize_whitespace(text: str) -> str:
    """
    Blancs normalisés sans toucher au sens : fins de ligne unifiées, espaces
    multiples réduits, espaces de fin de ligne retirés, jamais plus d'une ligne
    vide consécutive. L'indentation en début de ligne est conservée — un
    prompt peut contenir du code ou une liste imbriquée.
    """
    text = text.replace("\r\n", "\n").replace("\r", "\n").replace("\u00a0", " ")
    lines = []
    for line in text.split("\n"):
        leading = len(line) - len(line.lstrip(" \t"))
        body = _WHITESPACE_RUN.sub(" ", line[leading:])
        lines.append(line[:leading] + body)
    text = "\n".join(lines)
    text = _TRAILING_SPACES.sub("\n", text)
    text = _BLANK_LINES.sub("\n\n", text)
    return text.strip()


def _messages_from_pair(raw: dict[str, Any]) -> list[Any] | None:
    for user_key, assistant_key in PAIR_KEYS:
        if user_key in raw and assistant_key in raw:
            messages: list[Any] = []
            if isinstance(raw.get("system"), str):
                messages.append({"role": "system", "content": raw["system"]})
            messages.append({"role": "user", "content": raw[user_key]})
            messages.append({"role": "assistant", "content": raw[assistant_key]})
            return messages
    return None


def normalize_example(raw: Any, source: str) -> tuple[Example | None, Rejection | None]:
    """
    Rend `(exemple, None)` ou `(None, rejet)`. Jamais les deux, jamais aucun.

    Règles : un `system` optionnel en tête, puis une alternance stricte
    `user`/`assistant` se terminant par `assistant`. Un contenu vide après
    normalisation est un rejet, pas une correction.
    """
    if not isinstance(raw, dict):
        return None, Rejection(source, "not-an-object", f"type {type(raw).__name__}")

    messages = raw.get("messages")
    if messages is None:
        messages = _messages_from_pair(raw)
    if messages is None:
        return None, Rejection(
            source, "missing-messages",
            "ni `messages`, ni une paire reconnue (prompt/completion, input/output, user/assistant…)",
        )
    if not isinstance(messages, list) or not messages:
        return None, Rejection(source, "missing-messages", "`messages` doit être une liste non vide")

    normalized: list[dict[str, str]] = []
    for index, message in enumerate(messages):
        if not isinstance(message, dict):
            return None, Rejection(source, "invalid-message", f"messages[{index}] n'est pas un objet")
        role = message.get("role")
        content = message.get("content")
        if role not in ROLES:
            return None, Rejection(source, "invalid-role", f"messages[{index}].role = {role!r}")
        if not isinstance(content, str):
            return None, Rejection(
                source, "invalid-content", f"messages[{index}].content doit être une chaîne",
            )
        content = normalize_whitespace(content)
        if not content:
            reason = {
                "user": "empty-user-message",
                "assistant": "empty-assistant-message",
                "system": "empty-system-message",
            }[role]
            return None, Rejection(source, reason, f"messages[{index}]")
        normalized.append({"role": role, "content": content})

    body = normalized
    if body[0]["role"] == "system":
        body = body[1:]
    if any(m["role"] == "system" for m in body):
        return None, Rejection(source, "misplaced-system", "un seul message system, en première position")
    if not body:
        return None, Rejection(source, "missing-user-message", "aucun message user")

    expected = "user"
    for message in body:
        if message["role"] != expected:
            return None, Rejection(
                source, "roles-not-alternating",
                f"attendu {expected!r}, trouvé {message['role']!r}",
            )
        expected = "assistant" if expected == "user" else "user"
    if body[-1]["role"] != "assistant":
        return None, Rejection(source, "missing-assistant-message", "le dernier message doit être assistant")

    metadata = raw.get("metadata", {})
    if metadata is None:
        metadata = {}
    if not isinstance(metadata, dict):
        return None, Rejection(source, "invalid-metadata", "`metadata` doit être un objet")
    for key, value in metadata.items():
        if not isinstance(key, str) or not isinstance(value, SCALAR_TYPES):
            return None, Rejection(
                source, "invalid-metadata",
                f"metadata.{key} : seules des valeurs scalaires sont conservées",
            )

    return Example(messages=normalized, metadata=dict(metadata), source=source), None


# ---------------------------------------------------------------------------
# Doublons et statistiques
# ---------------------------------------------------------------------------


def _fingerprint(text: str) -> str:
    return " ".join(text.lower().split())


def dedupe_key(example: Example) -> str:
    """Empreinte de la conversation entière, insensible à la casse et aux blancs."""
    joined = "\n".join(f"{m['role']}:{_fingerprint(m['content'])}" for m in example.messages)
    return hashlib.sha1(joined.encode("utf-8")).hexdigest()


def output_key(example: Example) -> str:
    """Empreinte de la seule réponse — sert à repérer les sorties recopiées."""
    return hashlib.sha1(_fingerprint(example.assistant_text).encode("utf-8")).hexdigest()


def dedupe(examples: Iterable[Example]) -> tuple[list[Example], list[Rejection]]:
    """Garde la première occurrence ; les suivantes sont rejetées avec leur original."""
    kept: list[Example] = []
    rejected: list[Rejection] = []
    seen: dict[str, str] = {}
    for example in examples:
        key = dedupe_key(example)
        if key in seen:
            rejected.append(Rejection(example.source, "duplicate", f"identique à {seen[key]}"))
            continue
        seen[key] = example.source
        kept.append(example)
    return kept, rejected


def word_count(text: str) -> int:
    return len(text.split())


def estimate_tokens(text: str) -> int:
    """
    Estimation sans tokenizer : ~4 caractères par jeton en anglais, un peu
    moins en français ou avec du code. Borne haute volontaire (`ceil`). Pour
    une mesure exacte, `validate_dataset.py --tokenizer`.
    """
    if not text:
        return 0
    return int(math.ceil(len(text) / 3.6))


def example_lengths(example: Example) -> tuple[int, int]:
    """(jetons estimés côté entrée, jetons estimés côté cible)."""
    prompt_side = "\n".join(
        m["content"] for m in example.messages if m["role"] != "assistant"
    )
    return estimate_tokens(prompt_side), estimate_tokens(example.assistant_text)


# ---------------------------------------------------------------------------
# Écriture et relecture du format canonique
# ---------------------------------------------------------------------------


def write_jsonl(path: Path, examples: Iterable[Example]) -> int:
    path.parent.mkdir(parents=True, exist_ok=True)
    count = 0
    with path.open("w", encoding="utf-8", newline="\n") as handle:
        for example in examples:
            handle.write(json.dumps(example.to_record(), ensure_ascii=False))
            handle.write("\n")
            count += 1
    return count


def read_examples(path: Path) -> tuple[list[Example], list[Rejection]]:
    """Relit un JSONL canonique en revalidant chaque ligne."""
    examples: list[Example] = []
    rejections: list[Rejection] = []
    for item in iter_raw_records(path):
        if isinstance(item, Rejection):
            rejections.append(item)
            continue
        raw, source = item
        example, rejection = normalize_example(raw, source)
        if example is not None:
            examples.append(example)
        elif rejection is not None:
            rejections.append(rejection)
    return examples, rejections


def load_examples_strict(path: Path) -> list[Example]:
    """Pour l'entraînement : la moindre ligne invalide est une erreur."""
    if not path.is_file():
        raise FileNotFoundError(f"jeu de données introuvable : {path}")
    examples, rejections = read_examples(path)
    if rejections:
        first = rejections[0]
        raise ValueError(
            f"{len(rejections)} ligne(s) invalide(s) dans {path.name} — "
            f"première : {first.source} ({first.reason} {first.detail}). "
            "Relancer prepare_dataset.py puis validate_dataset.py."
        )
    if not examples:
        raise ValueError(f"aucun exemple dans {path}")
    return examples


def sha256_of_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1 << 20), b""):
            digest.update(chunk)
    return digest.hexdigest()
