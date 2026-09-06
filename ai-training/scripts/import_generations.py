"""
Exporte l'historique `generations` de Supabase vers un JSONL brut (optionnel).

    python ai-training/scripts/import_generations.py
    python ai-training/scripts/import_generations.py --since 2026-06-01 --limit 500 --output dataset/raw/generations-2026-09.jsonl

Chaque génération réussie stockée par le moteur Yelhaa est une paire réelle
« brief utilisateur → prompt validé » : la meilleure matière première pour
apprendre le comportement du produit. Le script lit `NEXT_PUBLIC_SUPABASE_URL`
et `SUPABASE_SERVICE_ROLE_KEY` dans `.env.local` (racine du dépôt) ou dans
l'environnement, interroge l'API REST (PostgREST) et écrit :

    {"messages": [{"role": "user", "content": <idea>},
                  {"role": "assistant", "content": <output>}],
     "metadata": {"category": <domain>, "source": "generations", "generation_id": ...}}

Les briefs sont des données utilisateur : le fichier produit est ignoré par git
(`dataset/raw/generations-*.jsonl`). Relire avant d'entraîner — un prompt
validé par le moteur n'est pas forcément un bon exemple.

Bibliothèque standard uniquement.
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from yelhaa_training import paths  # noqa: E402
from yelhaa_training.console import ensure_utf8_output  # noqa: E402

URL_ENV = "NEXT_PUBLIC_SUPABASE_URL"
KEY_ENV = "SUPABASE_SERVICE_ROLE_KEY"
PAGE_SIZE = 200


def read_env_file(path: Path) -> dict[str, str]:
    """Lecture minimale d'un .env : KEY=VALUE, guillemets simples/doubles retirés, `#` = commentaire."""
    values: dict[str, str] = {}
    if not path.is_file():
        return values
    for line in path.read_text(encoding="utf-8").splitlines():
        stripped = line.strip()
        if not stripped or stripped.startswith("#") or "=" not in stripped:
            continue
        key, _, value = stripped.partition("=")
        value = value.strip()
        if len(value) >= 2 and value[0] == value[-1] and value[0] in "\"'":
            value = value[1:-1]
        values[key.strip()] = value
    return values


def resolve_credentials() -> tuple[str, str]:
    env_file = read_env_file(paths.REPO_ROOT / ".env.local")
    url = os.environ.get(URL_ENV) or env_file.get(URL_ENV, "")
    key = os.environ.get(KEY_ENV) or env_file.get(KEY_ENV, "")
    missing = [name for name, value in ((URL_ENV, url), (KEY_ENV, key)) if not value]
    if missing:
        raise RuntimeError(
            f"{', '.join(missing)} absent(s) de l'environnement et de .env.local — "
            "la clé service_role est nécessaire pour lire toutes les générations."
        )
    return url.rstrip("/"), key


def fetch_page(url: str, key: str, *, offset: int, limit: int, since: str | None, domain: str | None) -> list[dict]:
    params = {
        "select": "id,idea,output,domain,template_id,created_at",
        "order": "created_at.asc",
        "offset": str(offset),
        "limit": str(limit),
    }
    if since:
        params["created_at"] = f"gte.{since}"
    if domain:
        params["domain"] = f"eq.{domain}"
    request = urllib.request.Request(
        f"{url}/rest/v1/generations?{urllib.parse.urlencode(params)}",
        headers={"apikey": key, "Authorization": f"Bearer {key}", "Accept": "application/json"},
    )
    try:
        with urllib.request.urlopen(request, timeout=60) as response:
            payload = json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as error:
        raise RuntimeError(f"Supabase {error.code} : {error.read().decode('utf-8', errors='replace')[:300]}") from error
    except urllib.error.URLError as error:
        raise RuntimeError(f"Supabase injoignable : {error.reason}") from error
    if not isinstance(payload, list):
        raise RuntimeError("réponse inattendue de PostgREST (tableau attendu)")
    return payload


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--output", default=str(paths.RAW_DIR / f"generations-{date.today().isoformat()}.jsonl"))
    parser.add_argument("--since", help="date ISO (YYYY-MM-DD) : ne prendre que les générations postérieures")
    parser.add_argument("--domain", choices=("saas", "product", "finance", "agency"), help="filtrer un domaine")
    parser.add_argument("--limit", type=int, help="nombre maximal de générations")
    parser.add_argument("--min-output-chars", type=int, default=400, help="ignorer les sorties plus courtes (signalé)")
    ensure_utf8_output()  # avant parse_args : l'aide contient des caractères hors CP1252
    args = parser.parse_args(argv)

    try:
        url, key = resolve_credentials()
    except RuntimeError as error:
        print(f"[import] {error}")
        return 2

    output_path = paths.resolve(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    written = 0
    skipped_short = 0
    skipped_empty = 0
    offset = 0
    print(f"[import] {url} → {paths.display(output_path)}")
    with output_path.open("w", encoding="utf-8", newline="\n") as handle:
        while True:
            page_limit = PAGE_SIZE if args.limit is None else max(0, min(PAGE_SIZE, args.limit - written - skipped_short - skipped_empty))
            if page_limit == 0:
                break
            try:
                rows = fetch_page(url, key, offset=offset, limit=page_limit, since=args.since, domain=args.domain)
            except RuntimeError as error:
                print(f"[import] {error}")
                return 1
            if not rows:
                break
            for row in rows:
                idea = (row.get("idea") or "").strip()
                output = (row.get("output") or "").strip()
                if not idea or not output:
                    skipped_empty += 1
                    continue
                if len(output) < args.min_output_chars:
                    skipped_short += 1
                    continue
                record = {
                    "messages": [
                        {"role": "user", "content": idea},
                        {"role": "assistant", "content": output},
                    ],
                    "metadata": {
                        "category": row.get("domain") or "unknown",
                        "source": "generations",
                        "generation_id": row.get("id"),
                        "template_id": row.get("template_id"),
                        "created_at": row.get("created_at"),
                    },
                }
                handle.write(json.dumps(record, ensure_ascii=False) + "\n")
                written += 1
            offset += len(rows)
            if len(rows) < page_limit:
                break

    print(f"[import] {written} exemple(s) écrit(s), {skipped_short} sortie(s) trop courte(s) ignorée(s), {skipped_empty} vide(s)")
    print("[import] relire le fichier avant de l'utiliser, puis : python ai-training/scripts/prepare_dataset.py")
    return 0


if __name__ == "__main__":
    sys.exit(main())
