"""
Yelhaa — outillage d'affinage local (CPU, LoRA).

Ce paquet est **isolé de l'application Next.js** : rien ici n'est importé par
`app/`, `components/` ou `lib/`. Les scripts de `ai-training/scripts/` sont des
points d'entrée fins qui s'appuient sur ces modules, et les tests de
`ai-training/tests/` les exercent sans modèle ni réseau.

Modules :

- `paths`      — emplacements canoniques (dataset, configs, sorties).
- `config`     — chargement et validation du YAML d'entraînement.
- `dataset`    — lecture, normalisation, validation et écriture des exemples.
- `quality`    — rapport qualité (doublons, sorties courtes, déséquilibres).
- `formatting` — gabarit de chat Qwen3 et masquage des étiquettes.
- `lora`       — configuration PEFT et vérification des modules cibles.
- `hardware`   — fils CPU et réglages mémoire.
- `modelfile`  — Modelfile Ollama pour `yelhaa-qwen`.
"""

__all__ = [
    "config",
    "dataset",
    "formatting",
    "hardware",
    "lora",
    "modelfile",
    "paths",
    "quality",
]
