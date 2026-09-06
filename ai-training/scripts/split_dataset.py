"""
Découpe le JSONL canonique en `train.jsonl` / `validation.jsonl`.

    python ai-training/scripts/split_dataset.py
    python ai-training/scripts/split_dataset.py --validation-ratio 0.1 --seed 42 --stratify-by category

Le mélange est **déterministe** : même fichier d'entrée + même graine = mêmes
fichiers de sortie, à l'octet près. Le manifeste `split-manifest.json` retient
l'empreinte de l'entrée ; si elle change, le script le dit — la répartition a
changé parce que les données ont changé, pas par hasard.
"""

from __future__ import annotations

import argparse
import json
import random
import sys
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from yelhaa_training import paths  # noqa: E402
from yelhaa_training.console import ensure_utf8_output  # noqa: E402
from yelhaa_training.dataset import Example, load_examples_strict, sha256_of_file, write_jsonl  # noqa: E402

DEFAULT_VALIDATION_RATIO = 0.10
DEFAULT_SEED = 42


def validation_count(total: int, ratio: float) -> int:
    """Au moins 1 exemple de validation dès qu'il y en a 2, jamais tout le jeu."""
    if total < 2:
        return 0
    return max(1, min(total - 1, int(round(total * ratio))))


def split_examples(
    examples: list[Example],
    *,
    validation_ratio: float = DEFAULT_VALIDATION_RATIO,
    seed: int = DEFAULT_SEED,
    stratify_by: str | None = None,
) -> tuple[list[Example], list[Example]]:
    """
    Mélange déterministe puis coupe. Avec `stratify_by`, chaque valeur de la
    métadonnée est coupée séparément pour que la validation reflète la
    répartition des catégories.
    """
    rng = random.Random(seed)
    groups: dict[str, list[Example]] = defaultdict(list)
    if stratify_by:
        for example in examples:
            groups[str(example.metadata.get(stratify_by, "(none)"))].append(example)
    else:
        groups["all"] = list(examples)

    train: list[Example] = []
    validation: list[Example] = []
    for key in sorted(groups):
        bucket = list(groups[key])
        rng.shuffle(bucket)
        n_val = validation_count(len(bucket), validation_ratio)
        validation.extend(bucket[:n_val])
        train.extend(bucket[n_val:])

    # Ordre final mélangé lui aussi, toujours sous la même graine.
    rng.shuffle(train)
    rng.shuffle(validation)
    return train, validation


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--input", default=str(paths.PROCESSED_DATASET), help="JSONL canonique")
    parser.add_argument("--train-output", default=str(paths.TRAIN_SPLIT))
    parser.add_argument("--validation-output", default=str(paths.VALIDATION_SPLIT))
    parser.add_argument("--validation-ratio", type=float, default=DEFAULT_VALIDATION_RATIO)
    parser.add_argument("--seed", type=int, default=DEFAULT_SEED)
    parser.add_argument("--stratify-by", help="clé de métadonnée (ex. category) pour une coupe par strate")
    ensure_utf8_output()  # avant parse_args : l'aide contient des caractères hors CP1252
    args = parser.parse_args(argv)

    if not 0 < args.validation_ratio < 1:
        print("[split] --validation-ratio doit être dans (0, 1)")
        return 2

    input_path = paths.resolve(args.input)
    try:
        examples = load_examples_strict(input_path)
    except (FileNotFoundError, ValueError) as error:
        print(f"[split] {error}")
        return 2

    train, validation = split_examples(
        examples, validation_ratio=args.validation_ratio, seed=args.seed, stratify_by=args.stratify_by,
    )

    train_path = paths.resolve(args.train_output)
    validation_path = paths.resolve(args.validation_output)
    write_jsonl(train_path, train)
    write_jsonl(validation_path, validation)

    input_hash = sha256_of_file(input_path)
    # Le manifeste vit à côté de train.jsonl : une sortie redirigée reste autonome.
    manifest_path = train_path.parent / paths.SPLIT_MANIFEST.name
    previous = None
    if manifest_path.is_file():
        try:
            previous = json.loads(manifest_path.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            previous = None

    manifest = {
        "input": paths.display(input_path),
        "input_sha256": input_hash,
        "seed": args.seed,
        "validation_ratio": args.validation_ratio,
        "stratify_by": args.stratify_by,
        "train": len(train),
        "validation": len(validation),
        "generated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
    }
    manifest_path.parent.mkdir(parents=True, exist_ok=True)
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")

    print(f"[split] {len(examples)} exemple(s) → {len(train)} train / {len(validation)} validation")
    print(f"  train       {paths.display(train_path)}")
    print(f"  validation  {paths.display(validation_path)}")
    print(f"  graine {args.seed}, ratio {args.validation_ratio:.0%}"
          + (f", stratifié par {args.stratify_by}" if args.stratify_by else ""))
    if len(validation) == 0:
        print("  ⚠ aucun exemple de validation (moins de 2 exemples) : evaluation_strategy sera ignorée")
    if previous and previous.get("input_sha256") != input_hash:
        print("  ℹ l'entrée a changé depuis la dernière coupe : la répartition est recalculée (même graine).")
    elif previous and (previous.get("seed") != args.seed or previous.get("validation_ratio") != args.validation_ratio):
        print("  ℹ graine ou ratio différents de la coupe précédente : la répartition change volontairement.")
    print(f"  manifeste   {paths.display(manifest_path)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
