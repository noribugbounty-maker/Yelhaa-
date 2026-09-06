# Prompt Variable Schema — contrat unique pour tous les domaines

> Ce fichier est la source de vérité. Les fichiers `saas-prompt-templates.md`, `product-prompt-templates.md` et `finance-prompt-templates.md` s'y réfèrent et ne redéfinissent jamais une variable du core autrement qu'ici.

**Le principe :** un **core** commun à tous les domaines, plus une **extension** par domaine. Ta couche d'extraction implémente le core une seule fois, puis charge l'extension correspondant au domaine détecté. Pas trois logiques parallèles.

---

## CORE — présent dans les trois domaines, extrait systématiquement

### Identité

| Variable | Type | Requis | Défaut si absent |
|---|---|---|---|
| `{{BRAND_NAME}}` | string | **oui** | bloquer et redemander |
| `{{VERTICAL}}` | string | **oui** | déduit de l'input par le classifieur |
| `{{TAGLINE}}` | string | non | omettre la ligne, ne pas inventer |
| `{{CONTACT_EMAIL}}` | string | non | `hello@{domaine}` si le domaine est connu, sinon omettre le champ |

### Message

| Variable | Type | Requis | Défaut si absent |
|---|---|---|---|
| `{{HERO_HEADLINE}}` | string | **oui** | généré depuis `{{VERTICAL}}` + `{{VALUE_PROP}}` |
| `{{VALUE_PROP}}` | string | **oui** | généré depuis l'input brut |
| `{{PRIMARY_CTA}}` | string | non | `"Get started"` (SaaS) / `"Add to bag"` (product) / `"Book a consultation"` (finance) |
| `{{SECONDARY_CTA}}` | string | non | omettre le bouton, ne pas en inventer un second |

### Contenu

| Variable | Type | Requis | Défaut si absent |
|---|---|---|---|
| `{{ITEM_1..6}}` | string[] | **oui** | minimum 3, sinon la grille passe en 2 colonnes |
| `{{DETAIL_1..6}}` | string[] | non | supprimer les sections spec/table qui en dépendent |
| `{{PRICING_TIERS}}` | `{name, price, period?, features[]}[]` | non | supprimer toute la section pricing |
| `{{PROOF_STAT_1..4}}` | `{value, label, qualifier}[]` | non | variante qualitative sans chiffres — **jamais inventé** |

> **`{{ITEM_*}}` remplace les anciens `{{FEATURE_*}}` (SaaS), `{{FEATURE_*}}` (product) et `{{SERVICE_*}}` (finance).** Un seul nom, un seul extracteur. Le libellé affiché ("Features" / "Capabilities" / "Services") est fixé par le template, pas par la variable.

### Design

| Variable | Type | Requis | Défaut si absent |
|---|---|---|---|
| `{{ACCENT_HEX}}` | hex | non | l'accent natif du template — **jamais un accent générique** |
| `{{LOGO_ASSET}}` | path | non | wordmark typographique en `{{BRAND_NAME}}` |

### Assets

| Variable | Type | Requis | Rôle |
|---|---|---|---|
| `{{HERO_ASSET}}` | path | non | asset principal, image **ou** vidéo — l'extension détermine le chemin |
| `{{SCREEN_1..5}}` | path[] | non | captures produit / vues secondaires |

> **`{{SCREEN_*}}` remplace les anciens `{{PRODUCT_SHOT_*}}` (product) et `{{SCREEN_*}}` (finance).** `{{HERO_ASSET}}` est désormais présent dans les trois domaines, y compris finance.

---

## EXTENSIONS PAR DOMAINE

### `saas`

| Variable | Type | Requis | Défaut si absent |
|---|---|---|---|
| `{{MOCK_UI_KIND}}` | enum | non | déduit de `{{VERTICAL}}` : `dashboard` \| `inbox` \| `editor` \| `analytics` \| `settings` |

Une seule variable d'extension — c'est le domaine le plus léger, parce que le chemin standard construit tout en CSS.

### `product`

| Variable | Type | Requis | Défaut si absent |
|---|---|---|---|
| `{{PRODUCT_NAME}}` | string | **oui** | fallback sur `{{BRAND_NAME}}` |
| `{{PRICE}}` | string | non | supprimer le panneau d'achat, garder la page vitrine |
| `{{VARIANTS}}` | `{name, swatch?, sku?, stock?}[]` | non | supprimer le sélecteur entier si longueur ≤ 1 |
| `{{SIZE_GUIDE}}` | `{rows[]}` | non | supprimer le lien et la modale |
| `{{ALLERGENS}}` | string[] | conditionnel | **obligatoire si alimentaire/cosmétique** — sinon ligne "nous contacter" |
| `{{LEAD_TIME}}` | string | conditionnel | **obligatoire si fait main / sur commande** |

### `finance`

| Variable | Type | Requis | Défaut si absent |
|---|---|---|---|
| `{{SUB_VERTICAL}}` | enum | **oui** | `wealth` \| `advisory` \| `neobank` \| `trading` \| `insurance` — pilote le choix du template |
| `{{REGULATOR}}` | string | **oui** | ligne réglementaire libellée "à compléter" — **jamais omise** |
| `{{ENTITY_LEGAL}}` | string | **oui** | idem |
| `{{RATE}}` | `{value, type, basis, example}` | non | panneau qualitatif sans chiffre — **jamais inventé** |
| `{{PROTECTION_SCHEME}}` | `{name, cap, scope}` | conditionnel | **obligatoire si `neobank`** — détermine si le site peut dire "protégé" ou seulement "cantonné" |

### `agency`

| Variable | Type | Requis | Défaut si absent |
|---|---|---|---|
| `{{PROJECT_1..6}}` | `{title, category, year, blurb?, asset?}[]` | **oui** | minimum 3 ; en dessous, la galerie passe en liste éditoriale |
| `{{TEAM_1..6}}` | `{name, role, photo?}[]` | non | supprimer la section équipe — **jamais de portraits stock** |
| `{{AWARDS}}` | `{name, year}[]` | non | supprimer la bande — **jamais inventée** |
| `{{CLIENT_LOGOS}}` | `{name, asset?}[]` | non | supprimer la section — **jamais de marque connue non fournie** |

---

## Ce que ta couche d'extraction implémente

```ts
type Domain = 'saas' | 'product' | 'finance' | 'agency'

interface CoreVars {
  BRAND_NAME: string
  VERTICAL: string
  TAGLINE?: string
  CONTACT_EMAIL?: string
  HERO_HEADLINE: string
  VALUE_PROP: string
  PRIMARY_CTA?: string
  SECONDARY_CTA?: string
  ITEM: string[]            // 3..6
  DETAIL?: string[]         // 0..6
  PRICING_TIERS?: Tier[]
  PROOF_STAT?: Stat[]
  ACCENT_HEX?: string
  LOGO_ASSET?: string
  HERO_ASSET?: string
  SCREEN?: string[]         // 0..5
}

type Vars =
  | (CoreVars & { domain: 'saas' }    & SaasVars)
  | (CoreVars & { domain: 'product' } & ProductVars)
  | (CoreVars & { domain: 'finance' } & FinanceVars)
  | (CoreVars & { domain: 'agency' }  & AgencyVars)
```

**Pipeline, dans l'ordre :**

```
1. classify(input)        → domain + vertical (+ sub_vertical si finance)
2. extractCore(input)     → CoreVars, identique pour les trois domaines
3. extractExtension(input, domain) → les champs spécifiques
4. gateAssets(vars)       → 'standard' | 'enhanced' | 'sequence' | 'video'
5. selectTemplate(domain, art_direction)
6. render(template, vars, path)
7. validate(output)       → voir ci-dessous
```

**Détection du chemin d'assets (étape 4), identique partout :**

```ts
const images = [vars.HERO_ASSET, ...(vars.SCREEN ?? [])]
  .filter(Boolean)
  .filter(a => !/\.(mp4|webm|mov)$/i.test(a))

const hasVideo  = /\.(mp4|webm|mov)$/i.test(vars.HERO_ASSET ?? '')
const has3D     = /\.(glb|gltf)$/i.test(vars.HERO_ASSET ?? '')

const path = has3D            ? 'advanced'
           : hasVideo         ? 'video'
           : images.length >= 3 ? 'sequence'
           : images.length >= 1 ? 'enhanced'
           :                      'standard'
```

---

## Validation avant émission (étape 7) — non négociable

Le prompt final est rejeté et régénéré s'il contient l'un de ces éléments :

| Motif | Pourquoi |
|---|---|
| `{{` ou `}}` | placeholder non résolu — détruit la confiance immédiatement |
| `[REQUIRES:` | marqueur non nettoyé — le modèle génératif construira les deux chemins |
| `STANDARD PATH` / `ENHANCED PATH` / `VIDEO PATH` / `ADVANCED PATH` | chemin non retenu resté dans le prompt |
| `fallback` | ambiguïté : le modèle construira une version dégradée visible |

**Et pour `domain === 'finance'` uniquement**, un contrôle supplémentaire :

```
si le prompt contient un pourcentage, un montant monétaire ou une notation
qui n'apparaît nulle part dans l'input utilisateur
  → bloquer, ne pas émettre
```

C'est cinq lignes de code. Un modèle génératif remplit volontiers un champ vide avec un chiffre plausible, et en finance un rendement inventé expose ton utilisateur à un vrai risque réglementaire — pas à un bug d'affichage.

---

## Migration des 27 prompts existants

Trois renommages à passer en find-and-replace au moment de l'ingestion en base :

| Ancien | Nouveau | Fichiers concernés |
|---|---|---|
| `{{FEATURE_1..6}}` | `{{ITEM_1..6}}` | saas, product |
| `{{SERVICE_1..6}}` | `{{ITEM_1..6}}` | finance |
| `{{PRODUCT_SHOT_1..5}}` | `{{SCREEN_1..5}}` | product |

Rien d'autre ne bouge. `{{HERO_ASSET}}` est maintenant valide dans les trois domaines, et les extensions ne se chevauchent pas.
