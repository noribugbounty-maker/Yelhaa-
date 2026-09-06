# YELHAA — DÉCISIONS PRODUIT

> Document de référence. Il tranche les questions laissées ouvertes par le README, le prompt design et le build prompt.
>
> **Ordre de lecture dans Claude Code :**
> 1. `README.txt` — structure produit (parcours, routes, règles non négociables)
> 2. `yelhaa-design-prompt.md` — branding et direction artistique
> 3. `yelhaa-build-prompt.md` — architecture technique et câblage
> 4. **ce fichier** — décisions qui priment sur les valeurs par défaut des trois précédents
>
> **Priorité en cas de conflit :** structure produit > décisions de ce fichier > technique > design.

---

## 1. Ordre de priorité du design

Claude Code applique `yelhaa-design-prompt.md` comme une **contrainte de production**, pas comme une source d'inspiration.

Il doit, avant d'écrire la moindre ligne :

1. lire le prompt design en entier ;
2. relever les décisions encore ouvertes qu'il contient ;
3. les résoudre avec les décisions de **ce** fichier ;
4. ne jamais substituer une direction artistique de son invention.

**Ordre de priorité :**

```
1. Demandes explicites de l'utilisateur
2. Palette et branding fournis (fichiers SVG + §1 du prompt design)
3. yelhaa-design-prompt.md
4. Décisions de design strictement nécessaires à l'implémentation
```

Quand plusieurs options sont valables, retenir celle qui suit le plus fidèlement le prompt design. Une préférence esthétique de Claude Code ne prime jamais sur une décision explicite.

---

## 2. Branding — wordmark

**Le mark / wordmark Yelhaa est en Arial Bold Italic.**

Cette règle vaut **uniquement pour le mark**. La typographie du reste de l'interface est définie par le prompt design (§1.4) : General Sans en display, Inter en UI, JetBrains Mono pour les données.

Deux conséquences techniques :

- Les fichiers logo fournis sont des SVG avec les lettres **déjà vectorisées**. Le wordmark s'affiche donc toujours via le SVG, jamais via du texte stylé — c'est la seule façon d'avoir un rendu identique sur toutes les machines.
- Si un wordmark en texte est nécessaire quelque part (balise `title`, e-mail transactionnel, repli), la pile est `Arial, Helvetica, "Liberation Sans", sans-serif` en `font-weight: 700; font-style: italic`. Arial est une police système sous licence : **elle ne se sert jamais en webfont** depuis le serveur.

---

## 3. Moteur IA

**Fournisseur : OpenAI (gpt-5-nano par défaut)**, utilisé exclusivement pour la couche intelligence et génération :

- analyse de l'idée de l'utilisateur ;
- recherche du modèle de prompt le plus proche dans la base ;
- optimisation et construction du prompt ;
- génération du résultat final.

**Unité de comptage : la génération.** Une génération correspond au traitement complet demandé par l'utilisateur. Les étapes internes du moteur — classification, sélection SQL, injection, validation — **ne sont jamais comptées comme plusieurs générations**. Les deux appels au modèle décrits au §4 du build prompt comptent ensemble pour **une seule** génération.

L'architecture reste extensible pour accueillir d'autres fournisseurs par la suite : le client IA est isolé derrière une interface, et le nom du modèle vient de `process.env`.

La clé vit dans `.env.local`. Elle n'apparaît jamais dans le frontend, ni dans le dépôt Git, ni dans le code source.

---

## 4. Tarifs et quotas

| Plan | Prix | Mode Stripe | Générations / mois |
|---|---|---|---|
| **Free** | 0 $ | — | 3 |
| **Pro** | 4,99 $ / mois | `subscription` | 150 |
| **Agency** | 17,99 $ / mois | `subscription` | 500 |

- Le compteur est géré **côté serveur** exclusivement.
- Aucune autre unité n'est comptée : ni composants, ni automatisations. Une seule métrique, la génération.
- Les trois plans payants sont des abonnements mensuels. Aucun paiement unique, aucun accès à vie.

**Réinitialisation**

- Automatique le **1er de chaque mois**, sans action de l'utilisateur.
- Le compteur repart à zéro.
- **Aucun report** : les générations non utilisées sont perdues.

**Au dépassement**

Blocage de la génération, affichage de la limite atteinte et de la date de réinitialisation, lien vers `/pricing`. Aucune facturation supplémentaire n'est déclenchée. Aucun langage de pression, aucun compte à rebours, aucune mention de rareté.

**Une génération échouée ne consomme jamais de quota.** Le compteur s'incrémente après la validation de sortie réussie, jamais avant l'appel.

---

## 5. Remboursements

Aucun remboursement après un achat ou un abonnement, **sauf erreur réelle imputable au service**.

Sont considérés comme erreurs réelles :

- un paiement encaissé alors que le service n'a pas été correctement activé ;
- une facturation manifestement erronée ;
- un problème technique ayant directement empêché l'utilisation de ce qui a été acheté.

Chaque demande est examinée au cas par cas. Les remboursements ne sont pas garantis et restent soumis à vérification.

---

## 6. Données et confidentialité

**Principe de minimisation.** Ne sont conservées que les données nécessaires au fonctionnement du compte et du service :

- informations du compte ;
- historique des générations ;
- idées saisies par l'utilisateur ;
- résultats générés ;
- plan et compteur de générations ;
- informations techniques nécessaires au fonctionnement et à la sécurité.

**Règles :**

- Conservation limitée à la durée nécessaire au service ou à une obligation légale.
- L'utilisateur peut demander la suppression de son compte et de ses données personnelles. **Une route et une action d'interface doivent exister pour cela** — pas seulement une mention dans les conditions.
- Les clés d'API et secrets internes ne sont jamais stockés dans les données utilisateur ni exposés à l'utilisateur.
- Aucune donnée utilisateur utilisée à des fins publicitaires sans consentement approprié. Les cases de consentement au traitement et au marketing sont **distinctes et décochées par défaut**.

Une politique de confidentialité complète — durées exactes, sous-traitants, droits, obligations légales — doit être fournie **avant la mise en production**. La page `/legal/privacy` existe dès le build et accueille ce contenu.

---

## 7. Export et publication

**En V1 :**

- copie directe du résultat ;
- téléchargement du résultat.

Ces deux actions sont réellement fonctionnelles dès la première version. Les données exportées correspondent exactement au contenu généré par l'utilisateur.

**La publication publique n'existe pas en V1.** Si elle est ajoutée plus tard, elle devra être déclenchée explicitement par l'utilisateur. **Aucun contenu utilisateur n'est jamais publié automatiquement.**

---

## 8. Entité et footer

```
Marque       Yelhaa
Adresse      aucune adresse physique à afficher
Footer       All rights reserved, Yelhaa AI, 2026.
```

**Ne rien inventer** : ni adresse, ni société, ni numéro légal, ni information administrative supplémentaire.

Le texte de copyright reste dans le footer et n'apparaît nulle part ailleurs — en particulier jamais dans la navigation (règle absolue du README §10).

---

## 9. Réseaux sociaux

Les quatre coordonnées seront renseignées **directement dans le code après la génération** :

```
LinkedIn   · Instagram · TikTok · E-mail
```

Claude Code prévoit uniquement la structure permettant de les ajouter facilement — les constantes centralisées de `lib/config.ts` décrites au §8 du build prompt. Une icône dont l'URL est vide n'est pas rendue, jamais un lien mort.

**Ne pas inventer d'URL, de nom de compte ou d'adresse e-mail.**

---

## 10. Ce qui reste ouvert

| # | Élément | Quand |
|---|---|---|
| 1 | Liste des modèles affichés dans le sélecteur | phase 8 |
| 2 | Les 4 URL sociales | dans le code, après génération |
| 3 | Clés d'API | dans `.env.local`, après le build |
| 4 | Politique de confidentialité complète | avant la mise en production |

Aucun de ces points ne bloque le build.

**Contenu de la HOME — tranché, à ne pas réinterpréter :**

- h1 : **« Your idea. Made real. »**, sur deux lignes empilées, le mot *real* souligné à la main en `--volt`.
- Sous-titre : « Décris ton idée. Yelhaa l'analyse, la structure et te renvoie un prompt prêt à l'emploi — puis l'ouvre dans un environnement où plusieurs IA la construisent avec toi. »
- **Aucun badge** au-dessus du h1.
- **Placeholder statique**, sans exemples qui défilent, et **aucune bande de pills d'inspiration**.

Le h1 est déjà tranché : **« Your idea. Made real. »**

---

**FIN DES DÉCISIONS PRODUIT — YELHAA**
