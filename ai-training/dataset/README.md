# Jeu de données — brief → prompt de site

Le modèle apprend **une** chose : transformer un brief utilisateur en un prompt
de construction de site concret et actionnable, dans le style Yelhaa. La
qualité prime sur la quantité — cent paires nettes valent mieux que mille
sorties recopiées.

## Dossiers

| Dossier | Contenu | Produit par |
|---|---|---|
| `raw/` | vos fichiers sources (`.json` / `.jsonl`), jamais modifiés | vous, ou `import_generations.py` |
| `processed/` | `dataset.jsonl` canonique + `prepare-report.json` | `prepare_dataset.py` |
| `splits/` | `train.jsonl`, `validation.jsonl`, `split-manifest.json` | `split_dataset.py` |
| `examples/` | `format-samples.jsonl` — trois exemples illustrant le format et le niveau attendu | fourni |
| `eval/` | `yelhaa-eval.jsonl` — briefs de test pour `evaluate.py` (jamais utilisés à l'entraînement) | fourni |

`raw/generations-*.jsonl` est ignoré par git : ce sont des données utilisateur.

## Format canonique (JSONL, une ligne = un exemple)

```json
{"messages": [
   {"role": "user", "content": "Build a premium cybersecurity SaaS website."},
   {"role": "assistant", "content": "Create a dark, technical SaaS marketing site…"}
 ],
 "metadata": {"category": "saas", "industry": "cybersecurity", "style": "dark-technical", "complexity": "high"}}
```

Règles :

- un `system` optionnel en première position, puis une alternance stricte
  `user` / `assistant` qui se termine par `assistant` ;
- `metadata` est facultatif, valeurs scalaires uniquement ; il **n'entre jamais
  dans le texte d'entraînement** sauf `train_on_metadata: true` dans le YAML,
  et même alors seulement en préfixe du message utilisateur — jamais dans la
  cible ;
- la cible supervisée est la réponse de l'assistant, formatée par le gabarit
  officiel du tokenizer Qwen3 ; rien d'autre n'est appris.

Formats de commodité acceptés par `prepare_dataset.py` et convertis :
`{"prompt", "completion"}`, `{"input", "output"}`, `{"user", "assistant"}`,
`{"instruction", "response"}`, `{"brief", "prompt"}` (+ `"system"` optionnel).

## Ce qui fait un bon exemple

La réponse doit être ce que Yelhaa produit de mieux : une direction artistique
nommée (palette avec valeurs, typographies, grille), une structure de pages
et de sections, le comportement responsive avec ses points de rupture, la
direction de mouvement (durées, courbes, `prefers-reduced-motion`), les
exigences d'accessibilité et de performance, les composants à implémenter
avec leurs états. Voir `examples/format-samples.jsonl`.

À écarter : « moderne et élégant », « animations agréables », « expérience
utilisateur fluide ». Ces formules n'apprennent rien au modèle — et
`evaluate.py` les compte.

## Sources possibles

1. **Historique Yelhaa** — `python ai-training/scripts/import_generations.py`
   exporte les paires réelles brief → prompt validé de la table `generations`
   (clé `service_role` lue dans `.env.local`). Relire avant d'entraîner.
2. **Rédaction manuelle** à partir des gabarits `content/templates/*.md`,
   avec des variables réelles remplacées — le résultat doit être un prompt
   fini, pas un gabarit avec `{{VARIABLES}}`.
3. **Briefs multilingues** : les briefs peuvent être en français, les réponses
   dans la langue attendue en production.

## Aligner l'entraînement sur l'appel de production (optionnel)

En production, l'étape d'injection reçoit un message système
(`INJECT_SYSTEM_PROMPT`, `lib/ai/prompts.ts`) et un message utilisateur qui
contient le gabarit et les variables. Pour que le modèle affiné voie le même
format, deux options :

- ajouter un `system` à vos exemples ;
- ou renseigner `system_prompt_file` dans le YAML avec le texte du prompt
  système (copié depuis `lib/ai/prompts.ts`) — il est alors ajouté à tous les
  exemples qui n'en ont pas.

Sans cela, le modèle apprend « brief → prompt » et garde ses capacités de base
pour le reste ; c'est un point de départ raisonnable.

## Contrôles

```powershell
python ai-training/scripts/prepare_dataset.py                 # normalise, rejette avec raison, rapport qualité
python ai-training/scripts/validate_dataset.py                # code de sortie ≠ 0 si structurellement invalide
python ai-training/scripts/validate_dataset.py --tokenizer Qwen/Qwen3-1.7B   # longueurs exactes
python ai-training/scripts/split_dataset.py                   # 90 / 10, graine 42, déterministe
```

Le rapport qualité signale : sorties trop courtes, réponses recopiées entre
plusieurs briefs, débuts identiques, déséquilibres de longueur, doublons,
JSON illisible. Rien n'est supprimé sans être listé.
