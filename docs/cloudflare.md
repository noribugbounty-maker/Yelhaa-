# Cloudflare — configuration hors code

Le build prompt §9 sépare deux couches. Le code porte ses en-têtes, sa
validation et son plafonnement applicatif ; Cloudflare porte le DNS, le proxy,
le WAF et le plafonnement au bord. Ce document couvre la seconde.

Rien de ce qui suit ne vit dans le dépôt. Aucune clé d'API Cloudflare n'y
entre.

## 1. DNS et proxy

| Enregistrement | Valeur | Proxy |
|---|---|---|
| `A` / `CNAME` racine | cible fournie par Vercel | activé (orange) |
| `CNAME www` | cible fournie par Vercel | activé (orange) |

- Mode SSL/TLS : **Full (strict)**. Rien d'autre — `Flexible` réintroduit un
  saut en clair entre Cloudflare et l'origine.
- **Always Use HTTPS** : activé.
- **Automatic HTTPS Rewrites** : activé.
- **Minimum TLS Version** : 1.2.
- HSTS : laissé au code. `next.config.ts` émet déjà
  `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`.
  Ne pas le doubler côté Cloudflare, sous peine d'en-têtes contradictoires.

## 2. WAF

- Jeu de règles managé Cloudflare : activé.
- Jeu de règles OWASP : activé, sensibilité moyenne pour commencer.
- **Exception obligatoire sur `/api/stripe/webhook`** : ne jamais y appliquer
  de transformation de requête, de réécriture de corps, ni de challenge. La
  signature Stripe est calculée sur le corps brut ; la moindre modification la
  casse et le webhook tombe en boucle d'échec.
- Ne pas activer de challenge navigateur sur `/api/*` : ces routes sont
  appelées en `fetch`, pas par un navigateur qui peut résoudre un défi.

## 3. Plafonnement au bord

Le plafonnement applicatif du code est une garde en mémoire de processus : sur
plusieurs instances serverless, chaque instance tient son propre compteur. Il
protège d'une boucle, pas d'un attaquant décidé. Le vrai plafond se pose ici.

| Chemin | Limite suggérée | Clé |
|---|---|---|
| `/api/generate` | 10 requêtes / minute | IP |
| `/api/contact` | 5 requêtes / minute | IP |
| `/api/stripe/checkout` | 10 requêtes / minute | IP |
| `/api/account/delete` | 3 requêtes / minute | IP |
| `/api/stripe/webhook` | **aucune** | — |

Le webhook doit rester joignable sans limite : Stripe rejoue les événements en
cas d'échec, et un 429 déclencherait exactement la tempête qu'on veut éviter.

## 4. Cache

- Ne pas mettre en cache `/api/*`.
- Ne pas mettre en cache les réponses portant un `Set-Cookie` : ce sont les
  cookies de session Supabase.
- `/_next/static/*` et `/brand/*` peuvent être mis en cache longuement : ces
  ressources sont immuables ou versionnées.

## 5. Ce que le code fait déjà

Inutile de le refaire au bord :

- `Content-Security-Policy` autorisant Supabase (`connect-src`, XHR et
  WebSocket) et Stripe (`script-src`, `frame-src`, `form-action`) ;
- `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`,
  `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`
  restrictive ;
- validation Zod côté serveur sur `/api/generate`, `/api/contact`,
  `/api/stripe/checkout` et `/api/account/delete` ;
- piège à robots sur le formulaire de contact ;
- vérification de signature du webhook Stripe sur le corps brut, et
  idempotence par identifiant d'événement.

## 6. Reste à faire avant la production

- **Nonce de CSP.** `script-src` porte encore `'unsafe-inline'` : Next injecte
  des scripts d'amorçage en ligne, et s'en passer demande de générer un nonce
  dans le middleware et de le propager au layout racine. À faire avant
  l'ouverture au public, pas au bord — c'est du code.
- **`NEXT_PUBLIC_SITE_URL`** doit porter le domaine de production, sinon les
  URL de retour OAuth et Stripe sont reconstruites depuis les en-têtes de la
  requête.
- **Point d'accès du webhook Stripe** à déclarer dans le tableau de bord
  Stripe sur le domaine de production, et `STRIPE_WEBHOOK_SECRET` à mettre à
  jour avec le secret de ce point d'accès — celui de `stripe listen` ne vaut
  qu'en local.
