CARTE DU CODE ACTUEL : ARCHITECTURE.md
Ce fichier est un cahier des charges historique (Qwen / Ollama).
Le runtime est Next.js 15 + OpenAI — voir ARCHITECTURE.md.

================================================================
STRUCTURE DIRECTIVE — APPLICATION MULTI-IA / CLAUDE CODE
================================================================

VERSION: 2.0
TYPE: STRUCTURE / PRODUCT LOGIC / FUNCTIONAL SCOPE
CHANGELOG: voir section 18 (résumé des corrections vs v1.0)

⚠️⚠️⚠️ INSTRUCTION ABSOLUMENT PRIORITAIRE ⚠️⚠️⚠️

CLAUDE CODE DOIT LIRE CE FICHIER EN ENTIER AVANT DE LIRE ET
D'EXÉCUTER LE PROMPT DE L'UTILISATEUR.

CE FICHIER EST LA BASE STRUCTURELLE OBLIGATOIRE DU PRODUIT.
IL NE S'AGIT PAS D'UNE SIMPLE NOTE OU D'UNE SUGGESTION.
IL DOIT ÊTRE RESPECTÉ PENDANT TOUTE L'IMPLÉMENTATION.

LE PROMPT QUE L'UTILISATEUR FOURNIRA ENSUITE EST UN PROMPT
DE DESIGN / BRANDING / DIRECTION CRÉATIVE.

STRUCTURE = CE FICHIER
DESIGN = PROMPT UTILISATEUR

CLAUDE CODE DOIT COMBINER LES DEUX SANS SACRIFIER LA STRUCTURE.

SI LE PROMPT UTILISATEUR ENTRE EN CONFLIT AVEC UNE RÈGLE STRUCTURELLE
DE CE FICHIER, LA STRUCTURE DE CE FICHIER DOIT ÊTRE CONSERVÉE,
SAUF SI L'UTILISATEUR DEMANDE EXPLICITEMENT DE MODIFIER CETTE
STRUCTURE.

================================================================
1. CONCEPT DU PRODUIT
================================================================

L'application est un environnement de développement basé sur
plusieurs agents IA spécialisés, tous propulsés par un seul moteur
(des modèles à poids ouverts de la famille Qwen, servis par une
instance Ollama que l'éditeur configure).

L'objectif est de permettre à l'utilisateur de travailler avec
plusieurs rôles d'agents dans une seule application cohérente,
sans que l'utilisateur ait à choisir ou gérer de fournisseur
ou de modèle : le moteur IA est géré intégralement en interne.

Le produit doit pouvoir accueillir notamment :

- plusieurs agents spécialisés (rôles), tous propulsés par ce
  moteur unique ;
- génération de code ;
- modification de code ;
- debugging ;
- code review ;
- architecture ;
- tests ;
- documentation ;
- contexte projet ;
- fichiers et dossiers ;
- historique ;
- workflows entre agents.

L'application doit être pensée comme UN SEUL ENVIRONNEMENT DE
DÉVELOPPEMENT MULTI-AGENTS (rôles spécialisés, un seul moteur
Ollama/Qwen), et non comme plusieurs chatbots séparés.

================================================================
2. STRUCTURE PRINCIPALE DU PRODUIT
================================================================

Les sections principales obligatoires sont :

HOME (contient l'expérience PROMPT — voir section 3)
PRICING
FAQ
CONTACT

L'authentification fait partie intégrante du produit :

LOGIN
SIGN UP

Ne pas inventer arbitrairement d'autres sections principales.

CORRECTION vs v1 : "PROMPT" n'est plus une page séparée du HOME.
Chez les principaux acteurs du marché (Lovable, Bolt, v0), la page
d'accueil contient directement le champ de saisie de l'idée — il n'y
a pas de clic intermédiaire entre "arriver sur le site" et "pouvoir
écrire son idée". Séparer HOME et PROMPT en deux pages ajoute une
friction que la concurrence a délibérément supprimée. HOME et
l'expérience PROMPT ne font donc qu'une seule page fonctionnelle ;
"PROMPT" reste un nom d'usage pour désigner cette expérience, pas une
route distincte dans la navigation.

================================================================
3. HOME / PROMPT — EXPÉRIENCE CENTRALE
================================================================

HOME est la page d'entrée principale ET le point de départ du
parcours produit. Elle doit :

- présenter clairement le produit et sa valeur ;
- contenir directement le champ de saisie de l'idée (YOUR IDEA) ;
- permettre d'accéder aux autres sections principales (PRICING,
  FAQ, CONTACT) sans quitter le fil du parcours.

Le contenu exact et le design sont définis par le prompt utilisateur.

Le parcours obligatoire est :

YOUR IDEA
    ↓
ENTER / GENERATE
    ↓
LOGIN / SIGN UP (uniquement si l'utilisateur n'est pas déjà connecté)
    ↓
CONSERVER L'IDÉE
    ↓
GENERATION
    ↓
YOUR PROMPT
    ↓
ENVIRONNEMENT DE DÉVELOPPEMENT MULTI-IA

Ce parcours est NON NÉGOCIABLE.

----------------------------------------------------------------
3.1 YOUR IDEA
----------------------------------------------------------------

L'utilisateur commence par entrer son idée dans un champ visible dès
l'arrivée sur HOME.

Cette idée doit être considérée comme une donnée importante de
l'utilisateur. Elle doit être conservée pendant tout le parcours,
y compris en cas de rechargement de page pendant l'étape
d'authentification.

RECOMMANDATION FONCTIONNELLE (pas de design imposé) : le champ doit
pouvoir afficher des exemples/suggestions de prompts (placeholder
tournant ou liste d'inspiration) pour réduire l'effet page blanche.
C'est un standard d'onboarding chez les outils comparables. Le
wording exact de ces exemples relève du prompt utilisateur, pas de
ce document.

----------------------------------------------------------------
3.2 ENTER / GENERATE
----------------------------------------------------------------

Lorsque l'utilisateur clique sur l'action de génération :

1. vérifier son authentification ;
2. si l'utilisateur est DÉJÀ connecté, passer directement à
   CONSERVER L'IDÉE puis GENERATION, sans afficher Login/Sign Up ;
3. s'il n'est pas connecté, ouvrir Login / Sign Up ;
4. conserver exactement l'idée saisie dans les deux cas ;
5. ne jamais demander à l'utilisateur de la réécrire après
   l'authentification.

----------------------------------------------------------------
3.3 LOGIN / SIGN UP
----------------------------------------------------------------

L'authentification arrive APRÈS l'action Enter / Generate, et
UNIQUEMENT si l'utilisateur n'est pas déjà connecté.

Elle doit permettre :

- Login ;
- Sign Up ;
- retour au parcours si nécessaire.

EXIGENCE STRUCTURELLE (ajoutée, informée par la pratique du marché) :
l'authentification doit supporter au minimum une option à friction
réduite (OAuth — ex. Google/GitHub) en plus de l'email/mot de passe.
Réduire le nombre de champs à l'inscription est un facteur reconnu de
conversion sur ce type de parcours "idée avant compte". Le choix des
providers OAuth exacts reste à définir par l'utilisateur.

RÈGLE CRITIQUE :

L'idée saisie avant l'authentification DOIT ÊTRE PRÉSERVÉE.

L'authentification ne doit jamais réinitialiser ou perdre le travail
de l'utilisateur.

----------------------------------------------------------------
3.4 APRÈS AUTHENTIFICATION
----------------------------------------------------------------

Après une authentification réussie :

- récupérer l'idée originale ;
- reprendre automatiquement le parcours ;
- lancer la génération ;
- produire le résultat attendu ;
- afficher / ouvrir YOUR PROMPT.

Le parcours doit sembler continu, sans rupture visible entre "avant
compte" et "après compte".

================================================================
4. YOUR PROMPT
================================================================

YOUR PROMPT représente le résultat généré à partir de l'idée initiale.

Il doit permettre de continuer vers l'expérience de développement
multi-IA.

La structure doit donc permettre :

USER IDEA
→ GENERATED PROMPT
→ AI DEVELOPMENT WORKFLOW

Le design exact de cette expérience est laissé au prompt utilisateur.

================================================================
5. MULTI-IA / AGENTS
================================================================

L'architecture doit être extensible à plusieurs agents, mais reste
adossée à un seul moteur IA (Ollama servant des modèles Qwen).

Elle doit pouvoir supporter :

- plusieurs agents spécialisés ;
- workflows séquentiels ;
- workflows collaboratifs ;
- partage de contexte.

EXIGENCE STRUCTURELLE (ajoutée) : l'environnement de développement
doit exposer un sélecteur de RÔLE/AGENT visible et accessible depuis
l'espace de travail — pas seulement une capacité back-end invisible.
Ce sélecteur porte uniquement sur le rôle de l'agent (Coding,
Architecture, Review, Debugging, Testing, Documentation, Research),
jamais sur un choix de fournisseur ou de modèle : un seul moteur,
Ollama/Qwen, exécute tous les rôles. L'apparence de ce sélecteur relève
du design, sa présence relève de la structure.

Exemples de rôles possibles :

- Coding Agent
- Architecture Agent
- Code Review Agent
- Debugging Agent
- Testing Agent
- Documentation Agent
- Research Agent

Ces rôles sont des capacités potentielles.

Ils ne doivent pas obligatoirement tous apparaître dans l'interface
initiale.

================================================================
6. CONTEXTE DE DÉVELOPPEMENT
================================================================

Le produit doit être pensé pour de vrais projets de développement.

La structure doit pouvoir accueillir :

- projets ;
- fichiers ;
- dossiers ;
- contexte du code ;
- historique des conversations ;
- modifications générées ;
- commandes / outils ;
- activité des agents ;
- workflows ;
- contexte persistant.

L'implémentation exacte reste libre.

================================================================
6bis. SORTIE / EXPORT DU TRAVAIL
================================================================

CORRECTION vs v1 : la v1 ne définissait aucune sortie au parcours
après "environnement multi-IA". Sur ce type de produit, l'étape de
sortie fait partie du minimum structurel attendu par l'utilisateur
(export, synchronisation avec un dépôt, ou publication), même si
l'implémentation précise n'est pas encore décidée.

La structure doit donc prévoir, comme capacités potentielles :

- export ou récupération du code généré ;
- synchronisation avec un dépôt de code (ex. Git) ;
- publication / déploiement de ce qui a été construit.

Ne PAS inventer de mécanisme précis (fournisseur d'hébergement,
process de déploiement, options de sécurité) : ce document identifie
uniquement le besoin structurel qu'une sortie doit exister et être
accessible depuis l'environnement multi-IA. Le détail sera fourni
séparément.

================================================================
7. PRICING
================================================================

PRICING est une page principale dédiée.

Elle sert à présenter les offres commerciales.

Ne PAS inventer :

- prix ;
- quotas ;
- fonctionnalités ;
- limites ;
- plans

si ces informations ne sont pas fournies par l'utilisateur.

Le design et le contenu définitifs seront déterminés séparément.

================================================================
8. FAQ
================================================================

FAQ est une page principale dédiée.

Elle peut couvrir notamment :

- fonctionnement du produit ;
- concept multi-IA ;
- génération de prompts ;
- modèles ;
- agents ;
- authentification ;
- workflows ;
- pricing.

Ne pas inventer de faits concernant le produit.

================================================================
9. CONTACT
================================================================

CONTACT est une page principale dédiée.

Elle permet à l'utilisateur de contacter l'équipe / le produit.

La structure peut accueillir un formulaire et les informations
nécessaires.

Les détails exacts sont laissés au prompt utilisateur.

================================================================
10. NAVIGATION PRINCIPALE
================================================================

La navigation principale doit contenir :

HOME
PRICING
FAQ
CONTACT

LOGIN / SIGN UP constitue l'accès d'authentification.

RÈGLE ABSOLUE (unique occurrence normative, voir aussi section 11) :
"ALL RIGHTS RESERVED" ne doit jamais apparaître dans la navigation —
uniquement dans le footer. Ne pas transformer du texte légal de
footer en élément de navigation.

================================================================
11. FOOTER
================================================================

Le footer peut contenir :

- copyright ;
- informations légales ;
- ALL RIGHTS RESERVED ;
- autres informations de footer.

================================================================
12. TEMPLATES / EXEMPLES
================================================================

Des templates ou exemples peuvent exister dans le produit.

Ils restent secondaires.

Ils ne doivent jamais remplacer ou modifier le parcours principal :

YOUR IDEA
→ ENTER / GENERATE
→ LOGIN / SIGN UP (si nécessaire)
→ CONSERVATION DE L'IDÉE
→ GENERATION
→ YOUR PROMPT
→ MULTI-IA

================================================================
13. FRONTIÈRE ENTRE STRUCTURE ET DESIGN
================================================================

CE FICHIER NE DÉFINIT PAS LE DESIGN.

NE PAS INVENTER :

- couleurs ;
- typographies ;
- logo ;
- identité visuelle ;
- gradients ;
- ombres ;
- bordures ;
- boutons ;
- cartes ;
- animations ;
- illustrations ;
- iconographie ;
- style graphique ;
- direction artistique.

Le design sera fourni dans un PROMPT UTILISATEUR SÉPARÉ.

CLAUDE CODE DOIT DONC :

1. respecter la structure de ce fichier ;
2. lire ensuite le prompt utilisateur ;
3. appliquer le design demandé par l'utilisateur ;
4. ne pas remplacer la structure par sa propre interprétation.

================================================================
14. PRINCIPE D'IMPLÉMENTATION
================================================================

Ce fichier = PRODUCT STRUCTURE LAYER.

Le prompt utilisateur = DESIGN / CREATIVE LAYER.

Les deux doivent fonctionner ensemble.

NE PAS CONFONDRE STRUCTURE ET DESIGN.

La structure doit rester :

- cohérente ;
- extensible ;
- fonctionnelle ;
- fidèle à ce document ;
- prête à recevoir le design du prompt utilisateur.

================================================================
15. CHECKLIST OBLIGATOIRE AVANT DE CODER
================================================================

AVANT D'ÉCRIRE LE MOINDRE CODE, CLAUDE CODE DOIT :

[ ] Lire l'intégralité de ce fichier.
[ ] Comprendre toutes les règles obligatoires.
[ ] Identifier HOME (qui contient l'expérience PROMPT).
[ ] Identifier PRICING.
[ ] Identifier FAQ.
[ ] Identifier CONTACT.
[ ] Identifier LOGIN / SIGN UP (email/mdp + option OAuth).
[ ] Comprendre le parcours YOUR IDEA.
[ ] Comprendre ENTER / GENERATE et le cas "déjà connecté".
[ ] Comprendre la conservation de l'idée.
[ ] Comprendre le parcours après authentification.
[ ] Comprendre YOUR PROMPT.
[ ] Comprendre le concept multi-IA et le sélecteur de modèle/agent.
[ ] Comprendre le besoin structurel de sortie/export (section 6bis).
[ ] Comprendre la frontière structure / design.
[ ] Lire le prompt utilisateur séparé.
[ ] Vérifier les éventuels conflits.
[ ] Conserver les règles structurelles.
[ ] Appliquer ensuite le design du prompt utilisateur.

================================================================
16. INSTRUCTIONS NON NÉGOCIABLES
================================================================

⚠️⚠️⚠️ LISEZ CE FICHIER EN ENTIER AVANT TOUTE ACTION. ⚠️⚠️⚠️

⚠️ CE FICHIER N'EST PAS OPTIONNEL.
⚠️ CE FICHIER N'EST PAS UNE SIMPLE SUGGESTION.
⚠️ CE FICHIER DÉFINIT LA STRUCTURE DE BASE DU PRODUIT.
⚠️ LA STRUCTURE DOIT ÊTRE RESPECTÉE PENDANT TOUTE L'IMPLÉMENTATION.
⚠️ LE PROMPT UTILISATEUR VIENT APRÈS CE FICHIER ET DÉFINIT LE DESIGN.
⚠️ NE PAS REMPLACER LA STRUCTURE PAR UNE INTERPRÉTATION PERSONNELLE
   DU DESIGN.
⚠️ NE PAS SUPPRIMER UNE SECTION OBLIGATOIRE.
⚠️ NE PAS CASSER LE PARCOURS YOUR IDEA → GENERATE → AUTH (si
   nécessaire) → GENERATION → YOUR PROMPT.
⚠️ NE JAMAIS PERDRE L'IDÉE DE L'UTILISATEUR PENDANT
   L'AUTHENTIFICATION.
⚠️ ALL RIGHTS RESERVED DOIT RESTER DANS LE FOOTER UNIQUEMENT.
⚠️ NE PAS INVENTER LE DESIGN, LE PRICING, OU LES FAITS PRODUIT NON
   FOURNIS.

ORDRE D'EXÉCUTION OBLIGATOIRE :

1. LIRE CE FICHIER.
2. COMPRENDRE LA STRUCTURE.
3. RETENIR LES RÈGLES NON NÉGOCIABLES.
4. LIRE LE PROMPT UTILISATEUR.
5. APPLIQUER LE DESIGN DU PROMPT.
6. CONSTRUIRE LE PRODUIT EN RESPECTANT CETTE STRUCTURE.

READ → UNDERSTAND → RESPECT → READ USER PROMPT → IMPLEMENT.

================================================================
17. NOTE SUR LE PACKAGING (v1 → v2)
================================================================

La v1 encapsulait ce texte dans un script Python qui l'écrivait dans
un fichier. Cette couche n'apportait aucune valeur structurelle : ce
document est livré ici directement en texte brut, prêt à être copié
dans le contexte de Claude Code. Si tu as besoin de le régénérer via
script pour ton pipeline (n8n, CI, etc.), il te suffit de le
réencapsuler tel quel.

================================================================
18. CHANGELOG — CORRECTIONS APPORTÉES (v1.0 → v2.0)
================================================================

1. HOME et PROMPT fusionnés en une seule expérience (page unique),
   conformément au pattern observé chez Lovable/Bolt/v0 : friction
   inutile supprimée.
2. Ajout du cas "utilisateur déjà connecté" dans ENTER/GENERATE —
   la v1 ne le traitait pas explicitement.
3. Ajout d'une exigence structurelle sur l'authentification à
   friction réduite (OAuth), pratique standard confirmée sur ce
   type de parcours.
4. Ajout d'une recommandation fonctionnelle sur les exemples/
   placeholders dans le champ YOUR IDEA (onboarding standard du
   secteur).
5. Ajout d'un sélecteur de modèle/agent comme exigence structurelle
   visible dans l'environnement multi-IA (absent de la v1).
6. Ajout de la section 6bis (sortie/export/publication) — absente
   de la v1, alors qu'elle fait partie du minimum structurel
   attendu sur ce type de produit chez tous les concurrents étudiés.
7. Suppression de la répétition x3 de la règle "ALL RIGHTS RESERVED
   = footer uniquement" — conservée une seule fois comme règle
   normative, rappelée dans la checklist finale.
8. Suppression de la couche Python inutile autour du texte (v1
   générait un fichier via script sans raison structurelle).

================================================================
FIN DU FICHIER STRUCTURE
================================================================
