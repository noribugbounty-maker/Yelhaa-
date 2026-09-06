# ai-training — affinage local de Qwen3-1.7B (hors produit)

> Le moteur Yelhaa tourne désormais sur **OpenAI (gpt-5-nano)**. Ce dossier
> n'est plus branché à l'application : pas de `YELHAA_QWEN_MODEL`, pas
> d'Ollama dans `lib/ai/`. Il reste comme outillage expérimental isolé.

Pipeline **CPU seul**, LoRA, basse mémoire, pour apprendre à Qwen3-1.7B le
comportement de construction de prompts de Yelhaa, puis servir le résultat à
l'application via Ollama sous le nom `yelhaa-qwen`.

```
brief utilisateur ──► Qwen3-1.7B + LoRA (ai-training/) ──► fusion ──► GGUF ──► Ollama : yelhaa-qwen
                                                                                     ▲
Yelhaa Next.js ──► lib/ai/client.ts (readAiModels → YELHAA_QWEN_MODEL) ──► Ollama ──┘
```

Ce dossier est **indépendant de l'application** : rien dans `app/`,
`components/` ou `lib/` n'importe de code Python, et le seul lien est un tag
Ollama dans `.env.local`.

Cible matérielle : AMD Ryzen 5 7520U (4 cœurs / 8 fils), 16 Go de RAM, pas de
GPU. Tout ce qui suit est calibré pour cette machine ; lire « Limites » avant
de lancer un entraînement long.

## Arborescence

```
ai-training/
├── README.md                    ce document
├── requirements.txt             dépendances Python (CPU)
├── requirements-export.txt      dépendances de la conversion GGUF (optionnel)
├── pytest.ini
├── configs/qwen3-1.7b-lora.yaml hyperparamètres — tout est là, rien en dur
├── dataset/
│   ├── README.md                format, règles, sources de données
│   ├── raw/                     vos fichiers bruts (jamais modifiés)
│   ├── processed/               dataset.jsonl canonique + rapport
│   ├── splits/                  train.jsonl, validation.jsonl (déterministes)
│   ├── examples/                format-samples.jsonl — 3 exemples de référence
│   └── eval/                    yelhaa-eval.jsonl — briefs de comparaison
├── scripts/
│   ├── import_generations.py    (optionnel) export Supabase → raw/
│   ├── prepare_dataset.py       normalise, rejette avec raison, rapport qualité
│   ├── validate_dataset.py      rapport structurel ; code ≠ 0 si invalide
│   ├── split_dataset.py         90 / 10, graine fixe
│   ├── smoke_test.py            vérifie la chaîne sans entraîner
│   ├── train.py                 LoRA sur CPU, checkpoints, reprise, arrêt propre
│   ├── evaluate.py              base vs affiné sur les mêmes briefs, rapport
│   └── export.py                fusion → GGUF → Modelfile → Ollama
├── yelhaa_training/             bibliothèque partagée par les scripts et les tests
├── outputs/
│   ├── checkpoints/             checkpoint-<pas>/ reprenables + train-log.jsonl
│   ├── adapter/                 adaptateur LoRA final + tokenizer + résumé
│   └── exported/                merged/, *.gguf, Modelfile, Modelfile.safetensors
└── tests/                       pytest — sans modèle ni réseau
```

`outputs/`, `.venv/`, `tools/` et `dataset/raw/generations-*.jsonl` sont
ignorés par git.

## 0. Prérequis

- **Python 3.11+**. Sur cette machine, `python` n'est qu'un alias du Microsoft
  Store ; installer un vrai interpréteur :

  ```powershell
  winget install --id Python.Python.3.12 -e
  # nouveau terminal ensuite, puis vérifier :
  py -3.12 --version
  ```

- **Ollama** déjà installé (`%LOCALAPPDATA%\Programs\Ollama\ollama.exe`) avec
  `qwen3:4b`. Si `ollama` n'est pas reconnu dans PowerShell :

  ```powershell
  $env:Path += ";$env:LOCALAPPDATA\Programs\Ollama"
  ```

- Environ **12 Go de disque** libres : poids de base (~3,4 Go en cache
  Hugging Face), modèle fusionné (~3,4 Go), GGUF (~1,8 Go en Q8_0), checkpoints.

Toutes les commandes ci-dessous se lancent **depuis la racine du dépôt**
(`yelhaa-main/`), dans PowerShell. `python` désigne l'interpréteur de
l'environnement virtuel une fois activé ; `py -3.12` fonctionne aussi partout.

## 1. Installer les dépendances Python

```powershell
py -3.12 -m venv ai-training\.venv
ai-training\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
# PyTorch CPU d'abord — l'index CPU évite de télécharger une version CUDA inutile
pip install torch --index-url https://download.pytorch.org/whl/cpu
pip install -r ai-training/requirements.txt
```

Si `Activate.ps1` est bloqué par la stratégie d'exécution :
`Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`, puis réessayer.

Vérification rapide, sans télécharger de modèle :

```powershell
python -m pytest ai-training
```

## 2. Préparer le jeu de données

Déposer des fichiers `.json` / `.jsonl` dans `ai-training/dataset/raw/` (format
dans `dataset/README.md`), ou exporter l'historique réel de Yelhaa :

```powershell
python ai-training/scripts/import_generations.py            # lit .env.local (clé service_role)
python ai-training/scripts/prepare_dataset.py
```

`prepare_dataset.py` écrit `dataset/processed/dataset.jsonl` et
`prepare-report.json`. Chaque exemple écarté y figure avec sa source et sa
raison (`malformed-json`, `empty-assistant-message`, `duplicate`…). Rien n'est
supprimé en silence, et les fichiers de `raw/` ne sont jamais modifiés.

## 3. Valider

```powershell
python ai-training/scripts/validate_dataset.py
python ai-training/scripts/validate_dataset.py --tokenizer Qwen/Qwen3-1.7B   # longueurs exactes
python ai-training/scripts/validate_dataset.py --strict                       # échoue aussi sur la qualité
```

Rapport : total, valides, invalides, messages user/assistant manquants,
prompts vides, doublons, longueurs moyennes, séquence maximale, dépassements de
`max_seq_length`, puis le rapport qualité (sorties courtes, réponses recopiées,
débuts identiques, déséquilibres). Code de sortie `1` si une ligne est
structurellement invalide, `2` si le fichier manque, `3` sous `--strict`.

## 4. Découper

```powershell
python ai-training/scripts/split_dataset.py                          # 90 / 10, graine 42
python ai-training/scripts/split_dataset.py --stratify-by category   # par domaine
```

Produit `dataset/splits/train.jsonl`, `validation.jsonl` et
`split-manifest.json` (empreinte de l'entrée, graine, effectifs). Même entrée
+ même graine = mêmes fichiers, à l'octet près.

## 5. Test de fumée, puis entraînement

```powershell
python ai-training/scripts/smoke_test.py               # ~1 min : tokenizer, LoRA, architecture, un exemple encodé
python ai-training/scripts/smoke_test.py --load-model  # charge vraiment les 7 Go : preuve mémoire (quelques minutes)
```

Le test sans `--load-model` vérifie l'architecture sur un squelette « meta »
(zéro mémoire) : model_type Qwen3, modules cibles LoRA présents, encodage
d'un exemple avec le gabarit officiel et masque exact du préfixe.

Lancer l'entraînement :

```powershell
$env:YELHAA_TRAIN_THREADS = "6"
python ai-training/scripts/train.py --config ai-training/configs/qwen3-1.7b-lora.yaml
# ou, sans environnement virtuel activé :
py ai-training/scripts/train.py --config ai-training/configs/qwen3-1.7b-lora.yaml
```

Essai court avant un vrai run (20 pas d'optimisation) :

```powershell
python ai-training/scripts/train.py --config ai-training/configs/qwen3-1.7b-lora.yaml --max-steps 20
```

Ce que fait le script : charge le tokenizer et `Qwen/Qwen3-1.7B` en float32 sur
CPU, encode chaque exemple avec le gabarit de chat Qwen3 (préfixe masqué,
réponse supervisée), vérifie les modules cibles contre le modèle réel, injecte
LoRA (r 16, α 32, dropout 0,05), active le gradient checkpointing, entraîne
avec `Trainer` (batch 1 × accumulation 8), écrit un checkpoint tous les
`save_steps`, puis sauvegarde l'adaptateur, le tokenizer, la configuration et
un résumé dans `outputs/adapter/`.

**C'est lent, et c'est attendu.** Sur ce processeur, un exemple de ~1 000
jetons coûte de l'ordre d'une à plusieurs minutes (aller, retour, recalcul du
checkpointing). Un pas d'optimisation = 8 exemples. Compter des heures pour
quelques centaines d'exemples, des jours pour deux époques sur un millier.
Le journal affiche le temps écoulé et une estimation du reste après chaque pas.

### Où sont les checkpoints

`ai-training/outputs/checkpoints/checkpoint-<pas>/` — poids LoRA, optimiseur,
planificateur, état du Trainer, RNG. `save_total_limit: 3` garde les trois
derniers. `train-log.jsonl` (même dossier) contient chaque ligne de journal.

### Arrêter proprement, reprendre

Depuis un **autre** terminal :

```powershell
New-Item ai-training/outputs/STOP
```

À la fin du pas en cours, le script écrit un checkpoint reprenable et
s'arrête (le fichier `STOP` est retiré). `Ctrl+C` fonctionne aussi : les poids
LoRA en cours sont sauvés dans `outputs/adapter/interrupted/` (utilisables,
mais **non reprenables**), et le dernier checkpoint reprenable est indiqué.

## 6. Reprendre

```powershell
python ai-training/scripts/train.py --config ai-training/configs/qwen3-1.7b-lora.yaml --resume auto
python ai-training/scripts/train.py --config ai-training/configs/qwen3-1.7b-lora.yaml --resume ai-training/outputs/checkpoints/checkpoint-40
```

`auto` reprend le dernier checkpoint de `output_dir`. La reprise restaure
l'optimiseur, le planificateur et la position dans les données.

## 7. Évaluer

Avant export, avec transformers (lent — l'adaptateur est appliqué au modèle de
base, les deux générant sur CPU) :

```powershell
python ai-training/scripts/evaluate.py --backend transformers --adapter ai-training/outputs/adapter --limit 3
python ai-training/scripts/evaluate.py --backend transformers --adapter ai-training/outputs/adapter --loss --no-generate
```

Après export dans Ollama (rapide) :

```powershell
python ai-training/scripts/evaluate.py --backend ollama --base qwen3:4b --candidate yelhaa-qwen
```

Les huit briefs de `dataset/eval/yelhaa-eval.jsonl` (SaaS sombre, e-commerce
chaleureux, portfolio, tableau de bord, magazine, banque mutualiste, studio
brutaliste, produit IA) sont envoyés **aux deux modèles à l'identique**. Le
rapport `outputs/eval/<horodatage>/report.md` juxtapose des indices lisibles :
couverture des dimensions d'un prompt de site (mise en page, typographie,
couleur, responsive, accessibilité, performance, interactions, mouvement,
composants, états, conversion), concret (unités, valeurs), structure, formules
creuses (« modern and beautiful »…), respect de la direction artistique
demandée, éléments requis, répétitions — plus la perte de validation si
demandée.

Ce sont des heuristiques. Le rapport ne conclut jamais qu'un modèle est
meilleur : il met les deux sorties côte à côte pour qu'une personne tranche.

## 8. Exporter

```powershell
python ai-training/scripts/export.py --check      # état de l'outillage, rien n'est écrit
python ai-training/scripts/export.py              # fusion (float32) → merged/ (bfloat16) → GGUF Q8_0 → Modelfile
```

La fusion (`merge_and_unload`) charge le modèle de base en float32 (~7 Go),
applique l'adaptateur, puis sauvegarde `outputs/exported/merged/` en Safetensors
**avec le tokenizer complet** (`tokenizer.json`, `tokenizer_config.json`,
`chat_template`).

La conversion GGUF utilise `convert_hf_to_gguf.py` de llama.cpp. Il n'est pas
supposé installé : le script le cherche (`--llama-cpp`, `$env:LLAMA_CPP_DIR`,
`ai-training/tools/llama.cpp`, `~/llama.cpp`) et, s'il manque, imprime
exactement quoi faire :

```powershell
git clone --depth 1 https://github.com/ggml-org/llama.cpp ai-training/tools/llama.cpp
pip install -r ai-training/requirements-export.txt
python ai-training/scripts/export.py --skip-merge
```

Options : `--gguf-outtype f16|bf16|q8_0|f32` (défaut `q8_0`, ~1,8 Go, bon
compromis CPU) ; `--quantize Q4_K_M` si le binaire `llama-quantize` est
disponible (sinon le script le dit et n'invente rien).

Le Modelfile reprend le `TEMPLATE` et les `PARAMETER` du `qwen3:4b` installé
(`ollama show qwen3:4b --modelfile`), avec un repli embarqué relevé sur cette
machine. Deux fichiers sont écrits : `Modelfile` (GGUF) et
`Modelfile.safetensors` (`FROM ./merged`, voie alternative si la version
d'Ollama importe directement les Safetensors Qwen3 — sinon elle échoue
clairement et la voie GGUF est nécessaire).

## 9. Installer dans Ollama

```powershell
cd ai-training/outputs/exported
ollama create yelhaa-qwen -f Modelfile
cd ../../..
ollama list          # qwen3:4b est toujours là, yelhaa-qwen s'ajoute
```

ou `python ai-training/scripts/export.py --skip-merge --create`. Le script
refuse tout tag commençant par `qwen` : `qwen3:4b` n'est jamais écrasé.

## 10. Tester Ollama

```powershell
ollama run yelhaa-qwen "Build a premium cybersecurity SaaS landing page. Dark, editorial, high-contrast."
```

Ou depuis l'API, comme le moteur le fait (`think: false`) :

```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:11434/api/chat -ContentType "application/json" -Body (@{
  model = "yelhaa-qwen"; stream = $false; think = $false
  messages = @(@{ role = "user"; content = "Portfolio for a documentary photographer. Minimal, editorial, black and white." })
} | ConvertTo-Json -Depth 5) | Select-Object -ExpandProperty message
```

## 11. Connecter à Yelhaa

Dans `.env.local` :

```
OLLAMA_HOST=http://localhost:11434    # ou vide : même valeur par défaut
YELHAA_QWEN_MODEL=yelhaa-qwen
```

Puis redémarrer `npm run dev`. À partir de là, l'étape d'**injection** (appel
#2, assemblage du prompt final) tourne sur `yelhaa-qwen` ; la classification
(appel #1) reste sur `AI_MODEL_CLASSIFY`, la validation et la régénération
unique ne changent pas. Vider `YELHAA_QWEN_MODEL` ramène l'injection sur
`AI_MODEL_INJECT` sans autre modification. Vérification sans réseau :

```powershell
npm run test:ai-models
```

Point d'entrée direct côté serveur : `generateWithYelhaaQwen(prompt, system?)`
dans `lib/ai/yelhaa-qwen.ts`, sur le même `CompletionClient` que le moteur.

## Configuration (`configs/qwen3-1.7b-lora.yaml`)

| clé | défaut | rôle |
|---|---|---|
| `model_name` | `Qwen/Qwen3-1.7B` | modèle de base (Hugging Face) |
| `output_dir` / `adapter_dir` | `outputs/checkpoints` / `outputs/adapter` | checkpoints / adaptateur final |
| `learning_rate` | `2e-4` | taux d'apprentissage LoRA |
| `num_train_epochs` / `max_steps` | `2` / — | durée ; `max_steps` prime |
| `batch_size` / `gradient_accumulation_steps` | `1` / `8` | lot effectif 8 |
| `max_seq_length` | `2048` | préfixe + cible, en jetons |
| `lora_r` / `lora_alpha` / `lora_dropout` | `16` / `32` / `0.05` | LoRA |
| `lora_target_modules` | q,k,v,o,gate,up,down_proj | vérifiés contre le modèle chargé |
| `warmup_ratio` / `weight_decay` / `lr_scheduler_type` | `0.05` / `0.01` / `cosine` | optimisation |
| `logging_steps` / `save_steps` / `save_total_limit` | `1` / `10` / `3` | journal, checkpoints |
| `evaluation_strategy` / `eval_steps` / `eval_max_examples` | `epoch` / — / `32` | évaluation bornée |
| `seed` | `42` | reproductibilité |
| `gradient_checkpointing` | `true` | mémoire contre temps |
| `cpu_threads` | `null` | `YELHAA_TRAIN_THREADS` > YAML > `min(6, cœurs − 2)` |
| `torch_dtype` | `float32` | ou `bfloat16` (moitié de RAM, plus lent sur Zen 2) |
| `system_prompt` / `system_prompt_file` | `null` | message système ajouté aux exemples qui n'en ont pas |
| `train_on_metadata` | `false` | les métadonnées ne deviennent jamais du texte, sauf demande explicite |
| `enable_thinking` | `false` | gabarit sans bloc de réflexion, comme le moteur |

Une clé inconnue est une erreur.

## Variables d'environnement

| variable | lue par | rôle |
|---|---|---|
| `OLLAMA_HOST` | Next.js, `evaluate.py` | instance Ollama (vide = `http://localhost:11434`) |
| `OLLAMA_API_KEY` | Next.js, `evaluate.py` | seulement pour une instance hébergée |
| `AI_MODEL_CLASSIFY` / `AI_MODEL_INJECT` | Next.js | modèles des appels #1 et #2 |
| `YELHAA_QWEN_MODEL` | Next.js, `evaluate.py` | tag du modèle affiné ; renseigné, il prend l'appel #2 |
| `YELHAA_TRAIN_THREADS` | scripts Python | fils CPU pour l'entraînement / la fusion |
| `LLAMA_CPP_DIR` | `export.py` | dossier llama.cpp, si cloné ailleurs |

## Tests

```powershell
python -m pytest ai-training                      # rapide, sans modèle ni réseau
$env:YELHAA_RUN_MODEL_TESTS = "1"; python -m pytest ai-training   # + gabarit Qwen3 réel (télécharge le tokenizer)
npm run test:ai-models                             # commutateur côté Next.js
```

Couverts : normalisation et rejets avec raison, doublons, rapport qualité,
découpe déterministe et stratifiée, pipeline prepare → validate → split sur
fichiers temporaires, chargement et validation du YAML, résolution des fils
CPU, formatage par gabarit et masque des étiquettes (faux tokenizer), troncature
et exemples écartés, validation LoRA, squelette Qwen3 sur device meta,
Modelfile, heuristiques d'évaluation.

## Limites — Ryzen 5 7520U / 16 Go / CPU

- **Vitesse.** Aucun GPU : l'ordre de grandeur est la minute par exemple, pas la
  seconde. Prévoir des runs de nuit ; commencer par `--max-steps 20` pour
  mesurer la durée réelle d'un pas sur vos données, puis extrapoler.
- **Mémoire.** float32 : ~6,8 Go de poids + activations + logits sur 2 048
  jetons (~1,2 Go en float32, plus leur copie pour la perte). Le total approche
  10–12 Go : fermer le navigateur et les autres applications lourdes. Si
  Windows tue le processus ou si la mémoire virtuelle s'emballe, passer
  `max_seq_length: 1024`, puis `torch_dtype: bfloat16` (poids à 3,4 Go, calcul
  plus lent car Zen 2 n'a pas d'instructions bf16).
- **Taille de jeu réaliste.** Quelques centaines d'exemples de qualité. Au-delà
  d'un millier, une époque se compte en jours.
- **Repli pratique.** Si 1,7 B est trop lent, `model_name: Qwen/Qwen3-0.6B`
  divise le temps par trois avec la même chaîne (même tokenizer, mêmes
  modules cibles, même export). Le modèle est moins capable ; l'évaluation
  comparative le dira.
- **Fusion et conversion.** Chargement en float32 (~7 Go) puis écriture en
  bfloat16 ; conversion GGUF en quelques minutes. Pas de quantification Q4
  sans `llama-quantize` (binaire à télécharger ou compiler).
- **Écart de format en production.** Le moteur envoie à l'appel #2 un long
  message système et un message utilisateur contenant le gabarit et les
  variables. Un jeu « brief → prompt » n'entraîne pas ce format exact ; pour
  s'en approcher, utiliser `system_prompt_file` ou des exemples avec `system`
  (voir `dataset/README.md`). Le modèle garde ses capacités de base pour le
  reste.
- **Ce qui n'est pas fait.** Aucune quantification à l'entraînement
  (bitsandbytes n'est pas CPU), pas de flash-attention, pas de xformers : ce
  sont des optimisations GPU. PyTorch CPU ordinaire suffit.
