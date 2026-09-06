"""
Modelfile Ollama pour `yelhaa-qwen`.

Le TEMPLATE et les PARAMETER sont ceux du `qwen3:4b` déjà installé — lus au
moment de l'export via `ollama show qwen3:4b --modelfile` pour rester alignés
sur la version d'Ollama de la machine. La copie embarquée ci-dessous sert de
repli quand Ollama n'est pas joignable ; elle a été relevée sur cette même
installation.

`qwen3:4b` n'est jamais touché : on crée un modèle **séparé**.
"""

from __future__ import annotations

import os
import re
import shutil
import subprocess
from dataclasses import dataclass, field
from pathlib import Path

DEFAULT_MODEL_TAG = "yelhaa-qwen"
DEFAULT_TEMPLATE_SOURCE = "qwen3:4b"
DEFAULT_NUM_CTX = 8192

# Relevé sur l'installation locale (manifest registry.ollama.ai/library/qwen3:4b).
QWEN3_OLLAMA_TEMPLATE = '''{{- $lastUserIdx := -1 -}}
{{- range $idx, $msg := .Messages -}}
{{- if eq $msg.Role "user" }}{{ $lastUserIdx = $idx }}{{ end -}}
{{- end }}
{{- if or .System .Tools }}<|im_start|>system
{{ if .System }}{{ .System }}

{{ end }}
{{- if .Tools }}# Tools

You may call one or more functions to assist with the user query.

You are provided with function signatures within <tools></tools> XML tags:
<tools>
{{- range .Tools }}
{"type": "function", "function": {{ .Function }}}
{{- end }}
</tools>

For each function call, return a json object with function name and arguments within <tool_call></tool_call> XML tags:
<tool_call>
{"name": <function-name>, "arguments": <args-json-object>}
</tool_call>
{{- end -}}
<|im_end|>
{{ end }}
{{- range $i, $_ := .Messages }}
{{- $last := eq (len (slice $.Messages $i)) 1 -}}
{{- if eq .Role "user" }}<|im_start|>user
{{ .Content }}<|im_end|>
{{ else if eq .Role "assistant" }}<|im_start|>assistant
{{ if (and $.IsThinkSet (and .Thinking (or $last (gt $i $lastUserIdx)))) -}}
<think>{{ .Thinking }}</think>
{{ end -}}
{{ if .Content }}{{ .Content }}{{ end }}
{{- if .ToolCalls }}
{{- range .ToolCalls }}
<tool_call>
{"name": "{{ .Function.Name }}", "arguments": {{ .Function.Arguments }}}
</tool_call>
{{- end }}
{{- end }}{{ if not $last }}<|im_end|>
{{ end }}
{{- else if eq .Role "tool" }}<|im_start|>user
<tool_response>
{{ .Content }}
</tool_response><|im_end|>
{{ end }}
{{- if and (ne .Role "assistant") $last }}<|im_start|>assistant
<think>
{{ end }}
{{- end }}'''

# PARAMETER du qwen3:4b local. `stop` protège la fin de tour ; les réglages
# d'échantillonnage sont ceux recommandés par Qwen pour le mode réflexion.
QWEN3_OLLAMA_PARAMETERS: list[tuple[str, str]] = [
    ("stop", '"<|im_start|>"'),
    ("stop", '"<|im_end|>"'),
    ("temperature", "0.6"),
    ("top_k", "20"),
    ("top_p", "0.95"),
    ("repeat_penalty", "1"),
]


@dataclass
class TemplateBundle:
    template: str
    parameters: list[tuple[str, str]] = field(default_factory=list)
    origin: str = "embedded"


def find_ollama() -> str | None:
    """Binaire `ollama` : PATH d'abord, puis l'emplacement standard sous Windows."""
    found = shutil.which("ollama")
    if found:
        return found
    local_app = os.environ.get("LOCALAPPDATA")
    if local_app:
        candidate = Path(local_app) / "Programs" / "Ollama" / "ollama.exe"
        if candidate.is_file():
            return str(candidate)
    return None


_TEMPLATE_RE = re.compile(r'^TEMPLATE\s+"""(.*?)"""', re.S | re.M)
_PARAMETER_RE = re.compile(r"^PARAMETER\s+(\S+)\s+(.+?)\s*$", re.M)


def parse_modelfile(text: str) -> TemplateBundle | None:
    """Extrait TEMPLATE et PARAMETER d'un Modelfile tel que `ollama show --modelfile` le rend."""
    match = _TEMPLATE_RE.search(text)
    if not match:
        return None
    parameters = [(name, value) for name, value in _PARAMETER_RE.findall(text)]
    return TemplateBundle(template=match.group(1), parameters=parameters, origin="ollama")


def read_template_from_ollama(tag: str, ollama: str | None = None, timeout: float = 20.0) -> TemplateBundle | None:
    """`ollama show <tag> --modelfile`, ou None si Ollama est absent ou muet."""
    binary = ollama or find_ollama()
    if not binary:
        return None
    try:
        completed = subprocess.run(
            [binary, "show", tag, "--modelfile"],
            capture_output=True, text=True, encoding="utf-8", errors="replace", timeout=timeout,
        )
    except (OSError, subprocess.TimeoutExpired):
        return None
    if completed.returncode != 0:
        return None
    bundle = parse_modelfile(completed.stdout)
    if bundle:
        bundle.origin = f"ollama show {tag}"
    return bundle


def embedded_template() -> TemplateBundle:
    return TemplateBundle(
        template=QWEN3_OLLAMA_TEMPLATE, parameters=list(QWEN3_OLLAMA_PARAMETERS), origin="embedded",
    )


def resolve_template(source_tag: str = DEFAULT_TEMPLATE_SOURCE) -> TemplateBundle:
    return read_template_from_ollama(source_tag) or embedded_template()


def build_modelfile(
    from_ref: str,
    bundle: TemplateBundle,
    *,
    num_ctx: int = DEFAULT_NUM_CTX,
    system: str | None = None,
) -> str:
    """
    Modelfile complet. `from_ref` est un chemin GGUF (`./yelhaa-qwen-q8_0.gguf`),
    un dossier Safetensors (`./merged`) ou un tag existant.

    Aucun SYSTEM par défaut : le moteur Yelhaa envoie le sien à chaque appel.
    """
    lines = [
        "# yelhaa-qwen — Qwen3-1.7B affiné pour l'assemblage de prompts Yelhaa.",
        f"# Gabarit et paramètres : {bundle.origin}.",
        f"FROM {from_ref}",
        "",
        'TEMPLATE """' + bundle.template + '"""',
        "",
    ]
    seen_ctx = False
    for name, value in bundle.parameters:
        if name == "num_ctx":
            seen_ctx = True
            value = str(num_ctx)
        lines.append(f"PARAMETER {name} {value}")
    if not seen_ctx:
        lines.append(f"PARAMETER num_ctx {num_ctx}")
    if system:
        lines.extend(["", 'SYSTEM """' + system + '"""'])
    lines.append("")
    return "\n".join(lines)
