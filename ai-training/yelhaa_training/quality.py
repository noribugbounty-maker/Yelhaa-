"""
Rapport qualité du jeu de données.

La qualité prime sur la quantité : cent exemples nets valent mieux que mille
sorties recopiées. Ces contrôles **signalent**, ils ne suppriment rien —
c'est à la personne qui prépare le jeu de décider, exemple par exemple.
"""

from __future__ import annotations

import statistics
from collections import defaultdict
from dataclasses import dataclass, field
from typing import Any

from .dataset import Example, example_lengths, output_key, word_count

# Seuils par défaut. Tous surchargeables depuis les scripts.
MIN_OUTPUT_WORDS = 40          # une consigne de site en moins de 40 mots n'apprend rien
MIN_INPUT_WORDS = 3
MAX_RATIO_OUTPUT_TO_INPUT = 80.0   # au-delà, l'entrée est probablement tronquée
MIN_RATIO_OUTPUT_TO_INPUT = 0.5    # une réponse plus courte que le brief est suspecte
DUPLICATION_WARNING_RATE = 0.10
PREFIX_WORDS = 10
MIN_EXAMPLES_RECOMMENDED = 50


@dataclass
class QualityReport:
    total: int = 0
    short_outputs: list[dict[str, Any]] = field(default_factory=list)
    short_inputs: list[dict[str, Any]] = field(default_factory=list)
    repeated_outputs: list[dict[str, Any]] = field(default_factory=list)
    similar_examples: list[dict[str, Any]] = field(default_factory=list)
    length_imbalance: list[dict[str, Any]] = field(default_factory=list)
    duplicate_count: int = 0
    duplication_rate: float = 0.0
    malformed_json: int = 0
    empty_responses: int = 0
    input_tokens: dict[str, float] = field(default_factory=dict)
    output_tokens: dict[str, float] = field(default_factory=dict)
    categories: dict[str, int] = field(default_factory=dict)
    warnings: list[str] = field(default_factory=list)

    def to_dict(self) -> dict[str, Any]:
        return {
            "total": self.total,
            "short_outputs": self.short_outputs,
            "short_inputs": self.short_inputs,
            "repeated_outputs": self.repeated_outputs,
            "similar_examples": self.similar_examples,
            "length_imbalance": self.length_imbalance,
            "duplicate_count": self.duplicate_count,
            "duplication_rate": round(self.duplication_rate, 4),
            "malformed_json": self.malformed_json,
            "empty_responses": self.empty_responses,
            "input_tokens": self.input_tokens,
            "output_tokens": self.output_tokens,
            "categories": self.categories,
            "warnings": self.warnings,
        }


def _summary(values: list[int]) -> dict[str, float]:
    if not values:
        return {"min": 0, "mean": 0, "median": 0, "max": 0, "p95": 0}
    ordered = sorted(values)
    p95_index = min(len(ordered) - 1, int(round(0.95 * (len(ordered) - 1))))
    return {
        "min": ordered[0],
        "mean": round(statistics.fmean(ordered), 1),
        "median": statistics.median(ordered),
        "max": ordered[-1],
        "p95": ordered[p95_index],
    }


def _prefix(text: str, words: int = PREFIX_WORDS) -> str:
    return " ".join(text.lower().split()[:words])


def build_quality_report(
    examples: list[Example],
    *,
    duplicate_count: int = 0,
    malformed_json: int = 0,
    empty_responses: int = 0,
    min_output_words: int = MIN_OUTPUT_WORDS,
    min_input_words: int = MIN_INPUT_WORDS,
) -> QualityReport:
    report = QualityReport(
        total=len(examples),
        duplicate_count=duplicate_count,
        malformed_json=malformed_json,
        empty_responses=empty_responses,
    )
    considered = len(examples) + duplicate_count
    report.duplication_rate = duplicate_count / considered if considered else 0.0

    by_output: dict[str, list[str]] = defaultdict(list)
    by_user_prefix: dict[str, list[str]] = defaultdict(list)
    by_output_prefix: dict[str, list[str]] = defaultdict(list)
    inputs: list[int] = []
    outputs: list[int] = []

    for example in examples:
        user_words = word_count(example.user_text)
        assistant_words = word_count(example.assistant_text)
        in_tokens, out_tokens = example_lengths(example)
        inputs.append(in_tokens)
        outputs.append(out_tokens)

        if assistant_words < min_output_words:
            report.short_outputs.append({"source": example.source, "words": assistant_words})
        if user_words < min_input_words:
            report.short_inputs.append({"source": example.source, "words": user_words})

        ratio = (out_tokens / in_tokens) if in_tokens else float("inf")
        if ratio < MIN_RATIO_OUTPUT_TO_INPUT:
            report.length_imbalance.append({
                "source": example.source, "kind": "output-shorter-than-input",
                "input_tokens": in_tokens, "output_tokens": out_tokens,
            })
        elif ratio > MAX_RATIO_OUTPUT_TO_INPUT:
            report.length_imbalance.append({
                "source": example.source, "kind": "input-suspiciously-short",
                "input_tokens": in_tokens, "output_tokens": out_tokens,
            })

        by_output[output_key(example)].append(example.source)
        by_user_prefix[_prefix(example.user_text)].append(example.source)
        by_output_prefix[_prefix(example.assistant_text)].append(example.source)

        category = str(example.metadata.get("category", "(none)"))
        report.categories[category] = report.categories.get(category, 0) + 1

    for sources in by_output.values():
        if len(sources) > 1:
            report.repeated_outputs.append({"count": len(sources), "sources": sources})

    similar: dict[tuple[str, ...], dict[str, Any]] = {}
    for kind, buckets in (("same-brief-opening", by_user_prefix), ("same-answer-opening", by_output_prefix)):
        for prefix, sources in buckets.items():
            if len(sources) > 1 and prefix:
                key = tuple(sorted(sources))
                entry = similar.setdefault(key, {"sources": sources, "kinds": []})
                entry["kinds"].append(kind)
    report.similar_examples = list(similar.values())

    report.input_tokens = _summary(inputs)
    report.output_tokens = _summary(outputs)

    # Avertissements lisibles — le rapport détaillé garde les sources.
    if report.total < MIN_EXAMPLES_RECOMMENDED:
        report.warnings.append(
            f"{report.total} exemple(s) : en dessous de {MIN_EXAMPLES_RECOMMENDED}, "
            "le modèle mémorise plus qu'il n'apprend."
        )
    if report.duplication_rate > DUPLICATION_WARNING_RATE:
        report.warnings.append(
            f"taux de doublons {report.duplication_rate:.0%} : la source recopie des exemples."
        )
    if report.repeated_outputs:
        report.warnings.append(
            f"{len(report.repeated_outputs)} réponse(s) recopiée(s) à l'identique sous plusieurs briefs "
            "— le modèle apprendrait à ignorer le brief."
        )
    if report.short_outputs:
        report.warnings.append(
            f"{len(report.short_outputs)} sortie(s) de moins de {min_output_words} mots."
        )
    if report.similar_examples:
        report.warnings.append(
            f"{len(report.similar_examples)} groupe(s) d'exemples au début identique — à relire."
        )
    if report.length_imbalance:
        report.warnings.append(
            f"{len(report.length_imbalance)} exemple(s) au rapport entrée/sortie inhabituel."
        )
    if report.malformed_json:
        report.warnings.append(f"{report.malformed_json} ligne(s) JSON illisible(s) dans les sources.")
    return report


def format_quality_report(report: QualityReport) -> str:
    lines = [
        "Rapport qualité",
        f"  exemples retenus            {report.total}",
        f"  doublons exacts écartés     {report.duplicate_count} ({report.duplication_rate:.1%})",
        f"  JSON illisible              {report.malformed_json}",
        f"  réponses vides              {report.empty_responses}",
        f"  sorties courtes             {len(report.short_outputs)}",
        f"  briefs très courts          {len(report.short_inputs)}",
        f"  réponses recopiées          {len(report.repeated_outputs)} groupe(s)",
        f"  débuts identiques           {len(report.similar_examples)} groupe(s)",
        f"  déséquilibres de longueur   {len(report.length_imbalance)}",
        "  jetons estimés (entrée)     "
        + ", ".join(f"{k} {v}" for k, v in report.input_tokens.items()),
        "  jetons estimés (sortie)     "
        + ", ".join(f"{k} {v}" for k, v in report.output_tokens.items()),
    ]
    if report.categories:
        cats = ", ".join(f"{name} {count}" for name, count in sorted(report.categories.items()))
        lines.append(f"  catégories                  {cats}")
    if report.warnings:
        lines.append("  avertissements :")
        lines.extend(f"    - {warning}" for warning in report.warnings)
    else:
        lines.append("  aucun avertissement")
    return "\n".join(lines)
