"""
Sortie console en UTF-8, même redirigée.

Sous Windows, `python script.py | Tee-Object log.txt` écrit en page de code
ANSI (cp1252) : un simple « → » ferait planter le script avec
UnicodeEncodeError. On force UTF-8 avec remplacement des caractères
inconnus — un journal lisible vaut mieux qu'un entraînement interrompu par
une flèche.
"""

from __future__ import annotations

import sys


def ensure_utf8_output() -> None:
    for stream in (sys.stdout, sys.stderr):
        reconfigure = getattr(stream, "reconfigure", None)
        if reconfigure is None:
            continue
        try:
            reconfigure(encoding="utf-8", errors="replace")
        except (ValueError, OSError):
            # Flux déjà fermé ou non reconfigurable : on laisse tel quel.
            pass
