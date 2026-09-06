"""
Heuristiques de lecture d'un prompt de site généré.

Ce ne sont **pas** des mesures de qualité : ce sont des indices, lisibles et
reproductibles, qui aident à comparer deux sorties sur les mêmes briefs. Un
score élevé dit qu'un texte est structuré, concret, couvre les dimensions
attendues et évite les formules creuses ; il ne dit pas qu'il est bon. La
lecture humaine reste l'arbitre — le rapport le rappelle.
"""

from __future__ import annotations

import re
from collections import Counter
from dataclasses import dataclass, field

# Dimensions qu'un prompt de construction de site devrait aborder.
ASPECTS: dict[str, tuple[str, ...]] = {
    "layout": ("layout", "grid", "column", "section", "hero", "header", "footer", "sidebar", "container", "gutter"),
    "typography": ("typograph", "font", "typeface", "serif", "sans", "letter-spacing", "line-height", "heading scale", "type scale", "weight"),
    "color": ("color", "colour", "palette", "contrast", "accent", "background", "#", "hsl", "oklch", "rgb"),
    "spacing": ("spacing", "padding", "margin", "whitespace", "white space", "rhythm", "8px", "4px", "scale"),
    "responsive": ("responsive", "breakpoint", "mobile", "tablet", "desktop", "viewport", "stack", "collapse"),
    "accessibility": ("accessib", "wcag", "aria", "focus", "screen reader", "keyboard", "alt text", "contrast ratio", "reduced motion", "prefers-reduced-motion"),
    "performance": ("performance", "lcp", "cls", "lazy", "preload", "font-display", "image weight", "kb", "lighthouse", "core web vitals"),
    "interaction": ("hover", "active state", "focus state", "click", "tap", "interaction", "cursor", "toggle", "scroll", "sticky"),
    "motion": ("animation", "motion", "transition", "easing", "ease-out", "duration", "ms", "stagger", "reveal", "parallax"),
    "components": ("component", "button", "card", "nav", "navigation", "form", "input", "modal", "table", "badge", "tabs", "footer"),
    "states": ("empty state", "loading", "skeleton", "error state", "disabled", "success", "validation", "fallback"),
    "conversion": ("cta", "call to action", "call-to-action", "conversion", "sign up", "signup", "pricing", "trust", "testimonial", "social proof", "funnel"),
}

# Formules creuses : un prompt actionnable n'en a pas besoin.
GENERIC_FILLER: tuple[str, ...] = (
    "modern and beautiful", "beautiful", "stunning", "sleek", "eye-catching", "eye catching",
    "user-friendly", "user friendly", "seamless", "cutting-edge", "cutting edge", "state-of-the-art",
    "visually appealing", "engaging", "intuitive", "nice", "clean and modern", "best practices",
    "next-level", "world-class", "elevate", "unleash", "amazing", "awesome", "innovative",
    "professional look", "modern look", "great user experience", "attractive",
)

_UNIT_NUMBER = re.compile(r"\b\d+(?:[.,]\d+)?\s?(?:px|rem|em|ms|s|%|vw|vh|fr|pt|dp|deg|kb|mb|col|columns?|cols?)\b", re.I)
_HEX_COLOR = re.compile(r"#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})\b", re.I)
_PLAIN_NUMBER = re.compile(r"(?<![#\w])\d+(?:[.,]\d+)?(?![\w%])")
_HEADING = re.compile(r"^\s{0,3}(#{1,6}\s+\S|[A-Z][A-Z0-9 /&\-]{3,}:?\s*$|\d+[.)]\s+\S|[-*•]\s+\S)")
_WORD = re.compile(r"[\w'-]+", re.U)

LENGTH_MIN_WORDS = 150
LENGTH_MAX_WORDS = 900


@dataclass
class Scores:
    coverage: float
    specificity: float
    structure: float
    filler: float
    art_direction: float
    completeness: float
    consistency: float
    length: float
    words: int
    aspects_hit: list[str] = field(default_factory=list)
    aspects_missed: list[str] = field(default_factory=list)
    filler_found: list[str] = field(default_factory=list)
    art_direction_missed: list[str] = field(default_factory=list)
    must_cover_missed: list[str] = field(default_factory=list)

    @property
    def overall(self) -> float:
        return round(
            (self.coverage + self.specificity + self.structure + self.filler
             + self.art_direction + self.completeness + self.consistency) / 7,
            3,
        )

    def as_row(self) -> dict[str, float]:
        return {
            "coverage": self.coverage,
            "specificity": self.specificity,
            "structure": self.structure,
            "filler": self.filler,
            "art_direction": self.art_direction,
            "completeness": self.completeness,
            "consistency": self.consistency,
            "length": self.length,
            "overall": self.overall,
        }


DIMENSION_LABELS = {
    "coverage": "couverture des dimensions",
    "specificity": "concret (unités, valeurs)",
    "structure": "structure (titres, listes)",
    "filler": "absence de formules creuses",
    "art_direction": "direction artistique suivie",
    "completeness": "éléments demandés couverts",
    "consistency": "sans répétitions",
    "length": "longueur adaptée",
    "overall": "moyenne (indicative)",
}


def _clip(value: float) -> float:
    return round(max(0.0, min(1.0, value)), 3)


def _contains(haystack: str, needle: str) -> bool:
    """Présence en début de mot : « grid » reconnaît « grids », « dark » reconnaît « darker »."""
    needle = needle.lower().strip()
    if not needle:
        return False
    if not needle.replace("-", "").replace(" ", "").isalnum():
        return needle in haystack
    return re.search(r"(?<![\w-])" + re.escape(needle), haystack) is not None


def score_output(
    text: str,
    *,
    art_direction: list[str] | None = None,
    must_cover: list[str] | None = None,
) -> Scores:
    lowered = text.lower()
    words = _WORD.findall(lowered)
    n_words = max(1, len(words))
    per_100 = 100.0 / n_words

    hit = [name for name, keys in ASPECTS.items() if any(_contains(lowered, k) for k in keys)]
    missed = [name for name in ASPECTS if name not in hit]
    coverage = _clip(len(hit) / len(ASPECTS))

    concrete = len(_UNIT_NUMBER.findall(text)) * 1.0 + len(_HEX_COLOR.findall(text)) * 1.0 + len(_PLAIN_NUMBER.findall(text)) * 0.5
    specificity = _clip((concrete * per_100) / 4.0)

    lines = [line for line in text.splitlines() if line.strip()]
    structured = sum(1 for line in lines if _HEADING.match(line))
    structure = _clip((structured / max(1, len(lines))) * 1.6) if len(lines) >= 4 else _clip(structured / 6)

    filler_found = [phrase for phrase in GENERIC_FILLER if _contains(lowered, phrase)]
    filler_hits = sum(len(re.findall(r"(?<![\w-])" + re.escape(p), lowered)) for p in filler_found)
    filler = _clip(1.0 - (filler_hits * per_100) / 1.5)

    art_terms = [t for t in (art_direction or []) if t.strip()]
    art_missed = [t for t in art_terms if not _contains(lowered, t)]
    art_score = _clip(1.0 - len(art_missed) / len(art_terms)) if art_terms else 1.0

    cover_terms = [t for t in (must_cover or []) if t.strip()]
    cover_missed = [t for t in cover_terms if not _contains(lowered, t)]
    completeness = _clip(1.0 - len(cover_missed) / len(cover_terms)) if cover_terms else 1.0

    consistency = _clip(1.0 - repetition_rate(words, lines))

    if n_words < LENGTH_MIN_WORDS:
        length = _clip(n_words / LENGTH_MIN_WORDS)
    elif n_words > LENGTH_MAX_WORDS:
        length = _clip(1.0 - (n_words - LENGTH_MAX_WORDS) / LENGTH_MAX_WORDS)
    else:
        length = 1.0

    return Scores(
        coverage=coverage,
        specificity=specificity,
        structure=structure,
        filler=filler,
        art_direction=art_score,
        completeness=completeness,
        consistency=consistency,
        length=length,
        words=len(words),
        aspects_hit=hit,
        aspects_missed=missed,
        filler_found=filler_found,
        art_direction_missed=art_missed,
        must_cover_missed=cover_missed,
    )


def repetition_rate(words: list[str], lines: list[str]) -> float:
    """Part des 5-grammes répétés + part des lignes dupliquées, bornée à 1."""
    if len(words) < 10:
        return 0.0
    grams = Counter(tuple(words[i:i + 5]) for i in range(len(words) - 4))
    repeated = sum(count - 1 for count in grams.values() if count > 1)
    gram_rate = repeated / max(1, len(words) - 4)
    normalized_lines = [" ".join(line.lower().split()) for line in lines]
    line_counts = Counter(normalized_lines)
    duplicate_lines = sum(count - 1 for count in line_counts.values() if count > 1)
    line_rate = duplicate_lines / max(1, len(lines))
    return min(1.0, gram_rate * 3 + line_rate)


def format_delta(base: float, candidate: float) -> str:
    delta = candidate - base
    sign = "+" if delta > 0 else ""
    return f"{sign}{delta:.2f}"
