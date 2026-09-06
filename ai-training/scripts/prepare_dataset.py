"""
Prépare le jeu de données canonique depuis les fichiers bruts.

    python ai-training/scripts/prepare_dataset.py
    python ai-training/scripts/prepare_dataset.py --input dataset/raw/mon-export.jsonl

Lit `.json` / `.jsonl`, normalise les blancs, valide les rôles, écarte les
exemples malformés ou vides, retire les doublons exacts et écrit
`dataset/processed/dataset.jsonl` accompagné d'un rapport JSON.

Rien n'est supprimé en silence : chaque rejet est listé avec sa source et sa
raison, à l'écran et dans `dataset/processed/prepare-report.json`. Les
fichiers bruts ne sont jamais modifiés.

Bibliothèque standard uniquement — tourne sans PyTorch.
"""

from __future__ import annotations

import argparse
import json
import sys
from collections import Counter
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from yelhaa_training import paths  # noqa: E402
from yelhaa_training.console import ensure_utf8_output  # noqa: E402
from yelhaa_training.dataset import (  # noqa: E402
    Example,
    Rejection,
    dedupe,
    iter_raw_records,
    normalize_example,
    write_jsonl,
)
from yelhaa_training.quality import (  # noqa: E402
    MIN_OUTPUT_WORDS,
    build_quality_report,
    format_quality_report,
)


def collect_inputs(patterns: list[str]) -> list[Path]:
    files: list[Path] = []
    for pattern in patterns:
        candidate = paths.resolve(pattern)
        if candidate.is_file():
            files.append(candidate)
            continue
        if candidate.is_dir():
            files.extend(sorted(p for p in candidate.iterdir() if p.suffix.lower() in (".json", ".jsonl")))
            continue
        # Motif glob relatif à ai-training/ (ex. dataset/raw/*.jsonl).
        matches = sorted(paths.TRAINING_ROOT.glob(pattern))
        files.extend(p for p in matches if p.is_file())
    unique: list[Path] = []
    seen: set[Path] = set()
    for file in files:
        if file not in seen:
            seen.add(file)
            unique.append(file)
    return unique


def prepare(files: list[Path], *, keep_duplicates: bool) -> tuple[list[Example], list[Rejection], Counter]:
    examples: list[Example] = []
    rejections: list[Rejection] = []
    for file in files:
        for item in iter_raw_records(file):
            if isinstance(item, Rejection):
                rejections.append(item)
                continue
            raw, source = item
            example, rejection = normalize_example(raw, source)
            if example is not None:
                examples.append(example)
            elif rejection is not None:
                rejections.append(rejection)

    if not keep_duplicates:
        examples, duplicates = dedupe(examples)
        rejections.extend(duplicates)

    reasons = Counter(r.reason for r in rejections)
    return examples, rejections, reasons


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument(
        "--input", nargs="*", default=["dataset/raw"],
        help="fichiers, dossiers ou motifs (défaut : dataset/raw). Relatifs à ai-training/.",
    )
    parser.add_argument("--output", default=str(paths.PROCESSED_DATASET), help="JSONL canonique produit")
    parser.add_argument("--report", default=str(paths.PREPARE_REPORT), help="rapport JSON produit")
    parser.add_argument("--keep-duplicates", action="store_true", help="ne pas écarter les doublons exacts")
    parser.add_argument(
        "--min-output-words", type=int, default=MIN_OUTPUT_WORDS,
        help=f"seuil d'alerte pour les sorties courtes (défaut {MIN_OUTPUT_WORDS}) — alerte, pas rejet",
    )
    ensure_utf8_output()  # avant parse_args : l'aide contient des caractères hors CP1252
    args = parser.parse_args(argv)

    files = collect_inputs(args.input)
    if not files:
        print(f"[prepare] aucun fichier .json/.jsonl trouvé pour : {', '.join(args.input)}")
        print("          déposer les données brutes dans ai-training/dataset/raw/ (voir dataset/README.md)")
        return 2

    print("[prepare] sources :")
    for file in files:
        print(f"  - {paths.display(file)}")

    examples, rejections, reasons = prepare(files, keep_duplicates=args.keep_duplicates)

    output = paths.resolve(args.output)
    written = write_jsonl(output, examples)

    report = build_quality_report(
        examples,
        duplicate_count=reasons.get("duplicate", 0),
        malformed_json=reasons.get("malformed-json", 0),
        empty_responses=reasons.get("empty-assistant-message", 0),
        min_output_words=args.min_output_words,
    )

    report_path = paths.resolve(args.report)
    report_path.parent.mkdir(parents=True, exist_ok=True)
    report_path.write_text(
        json.dumps(
            {
                "sources": [paths.display(f) for f in files],
                "output": paths.display(output),
                "written": written,
                "rejected": len(rejections),
                "rejection_reasons": dict(reasons),
                "rejections": [r.to_record() for r in rejections],
                "quality": report.to_dict(),
            },
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )

    print()
    print(f"[prepare] {written} exemple(s) écrit(s) → {paths.display(output)}")
    print(f"[prepare] {len(rejections)} rejet(s)")
    for reason, count in reasons.most_common():
        print(f"  {reason:<28} {count}")
    shown = 0
    for rejection in rejections:
        if shown >= 15:
            print(f"  … {len(rejections) - shown} autre(s) dans le rapport")
            break
        detail = f" — {rejection.detail}" if rejection.detail else ""
        print(f"  · {rejection.source}: {rejection.reason}{detail}")
        shown += 1
    print()
    print(format_quality_report(report))
    print()
    print(f"[prepare] rapport détaillé → {paths.display(report_path)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
