# Vision et périmètre produit

État du cadrage : 1er septembre 2026.

## Problème à résoudre

Un artiste ou un lieu reçoit ou produit des éléments hétérogènes — vidéo, affiche, texte, date, billetterie, lien d'écoute — puis répète manuellement les mêmes opérations sur plusieurs réseaux. Le coût réel n'est pas seulement le clic de publication : il faut reformater, réécrire, vérifier les droits, choisir le bon moment, faire valider, publier et mesurer.

La proposition de valeur est donc : **une source, des variantes adaptées, une validation, plusieurs destinations suivies**.

## Utilisateurs prioritaires

| Persona | Besoin principal | Fréquence | Risque actuel |
|---|---|---:|---|
| Agence / label opérateur | gérer cinq artistes, leurs comptes et leurs calendriers | quotidienne | erreurs de compte, répétition, manque de traçabilité |
| Artiste géré | charger ses médias et textes, planifier et décider seul de ses publications | hebdomadaire | échanges dispersés et répétition manuelle |
| Bar / petite salle | annoncer les événements et remplir la salle localement | plusieurs fois/semaine | informations incohérentes, répétition |

La V1 est optimisée pour le premier cas réel : **une agence/label unique créant et administrant les accès de cinq artistes**. Le pilote technique commence toutefois avec **un seul compte Instagram Business connecté** ; les autres profils peuvent exister dans l'espace avant l'ouverture progressive de leurs connexions sociales. Lors de la création d'un profil artiste, l'agence choisit le mode de fonctionnement : **mode autonome** (l'artiste gère lui-même ses publications) ou **mode délégué** (l'agence se connecte via la délégation Meta et publie pour lui). Chaque artiste dispose d'une page dédiée et cloisonnée. Le même modèle pourra représenter un bar ou une salle via un type de profil différent.

## Objets métier

- **Espace agence** : organisation propriétaire des membres, paramètres et facturation.
- **Profil géré** : sous-espace cloisonné de type artiste ou lieu, regroupant identité, comptes sociaux, ressources et campagnes.
- **Identité du profil** : nom, visuels, couleurs, liens et informations réutilisables.
- **Page lien en bio** : URL publique stable d'un artiste, inspirée de la simplicité de Stan, alimentée automatiquement par ses campagnes et liens actifs.
- **Sortie / événement** : source structurée des informations de campagne.
- **Élément de catalogue** : sortie musicale ou vidéo déjà publiée sur Spotify ou YouTube, identifiée par son lien externe et ses métadonnées.
- **Ressource** : vidéo, image, audio, affiche ou lien importé.
- **Campagne** : scénario, période, audience, source et ensemble de publications.
- **Variante** : texte et média adaptés à un canal, une langue et un format.
- **Plan de publication** : choix simple ou répété fait par le propriétaire du profil.
- **Occurrence** : publication concrète d'un plan, avec destination, format et date.
- **Cible de publication** : compte social, format et date programmée.
- **Publication distante** : identifiant, URL, état et métriques retournés par le réseau.

Cette séparation empêche qu'un « post universel » devienne le modèle de données. Chaque réseau conserve ses propres contraintes et réglages.

Une campagne V1 utilise exactement l'un de ces scénarios :

- `SINGLE_RELEASE` : préparer ou prolonger la promotion d'un single ;
- `ALBUM_RELEASE` : promouvoir un album et ses différents extraits ;
- `CONCERT` : annoncer un concert et ses rappels ;
- `CATALOG_REVIVAL` : créer une nouvelle campagne sociale autour d'une sortie Spotify ou YouTube déjà disponible.

Le catalogue est d'abord un répertoire de sorties existantes, non une archive d'anciens posts sociaux. L'artiste colle un lien Spotify ou YouTube ; Thermidor conserve le fournisseur, l'identifiant externe, l'URL, le titre, la date, la pochette ou miniature et les campagnes déjà menées. La réactivation crée de nouvelles publications sociales qui renvoient vers cette sortie. Elle ne repartage pas la publication sociale distante d'origine.

Le **minimum requis pour réactiver une sortie est son lien Spotify ou YouTube**. Thermidor récupère les métadonnées et le visuel accessibles, puis indique les formats réalisables avec ces éléments. Le titre, la date, les autres métadonnées et la pochette sont modifiables dans la fiche catalogue ; la valeur importée et sa provenance sont néanmoins conservées pour permettre un retour à la source. Lorsqu'une campagne est créée, elle reçoit une copie personnalisable de ces valeurs sans modifier le catalogue. L'artiste peut joindre des images, vidéos et pistes audio qu'il est autorisé à publier pour débloquer des variantes supplémentaires. Si l'utilisateur fournit uniquement une image statique (comme une pochette) et une piste audio, Thermidor générera automatiquement une vidéo basique pour permettre la publication d'un Reel. Une vidéo YouTube ne sera pas téléchargée ni réutilisée automatiquement ; l'original doit être chargé séparément.

## Parcours MVP

1. L'agence crée ou sélectionne l'un de ses cinq profils artistes en choisissant le mode de délégation.
2. Selon le mode choisi, l'artiste ou le collaborateur de l'agence ouvre la page et connecte les comptes Instagram/Facebook via les écrans OAuth de Meta.
3. Le gestionnaire du profil crée une sortie, ajoute les liens utiles, saisit les textes et charge les médias.
4. Le système inspecte les médias et produit les redimensionnements techniques nécessaires (ex: génération vidéo depuis une pochette).
5. Le gestionnaire choisit « Publier maintenant », une ou plusieurs dates libres, ou une répétition quotidienne, hebdomadaire ou mensuelle.
6. Il prévisualise la planification et donne l'ordre final de publier ou programmer.
7. Le moteur publie, signale les erreurs exploitables et évite les doublons.
8. Un tableau de bord affiche les URLs, statuts et premières métriques disponibles.

## Périmètre du MVP

### Inclus

- application web responsive installable en PWA ;
- espace agence, cinq profils artistes et accès cloisonnés ;
- choix du mode de délégation à la création du profil : gestion autonome par l'artiste ou délégation complète à l'agence ;
- bibliothèque de médias avec upload direct et traitement asynchrone ;
- fiches sortie musicale ;
- identité et liens réutilisables par artiste ;
- page publique « lien en bio » automatique pour chaque artiste ;
- profil public personnalisable avec photo, nom, courte biographie, réseaux et cartes de liens réordonnables ;
- saisie et duplication manuelles des textes par canal ;
- adaptations déterministes d'image/vidéo : ratio, cadrage, compression, miniature, génération vidéo basique depuis image ;
- prévisualisation et décision finale par le gestionnaire du profil (artiste ou agence selon le mode choisi) ;
- calendrier et programmation avec fuseau horaire ;
- récurrences quotidiennes, hebdomadaires et mensuelles, dates manuelles, pause et reprise, sans plafond produit initial ;
- approbation d'une série valable sans expiration pour la révision approuvée ;
- modification par le gestionnaire sans étape de réapprobation séparée, avec nouvelle révision auditée ;
- publication Instagram Business et Page Facebook ;
- formats Instagram Story, Reel et publication Feed ;
- appel à l'action « lien en bio » pour les contenus Instagram ; aucun sticker de lien Story requis en V1 ;
- filigrane texte « Lien en bio » ajouté automatiquement aux rendus Story lorsque l'utilisateur l'active ;
- notification push directe sur le téléphone (via PWA) et transfert en un clic vers un profil Facebook personnel, avec confirmation par l'utilisateur ;
- centre « Actions en attente » accessible dans l'application lorsque le push est refusé, indisponible ou manqué ;
- regroupement des actions simultanées dans une liste, avec clôture explicite en un clic ;
- possibilité d'ignorer explicitement une action sans suspendre sa série ;
- publication assistée dans les groupes Facebook ;
- campagnes single, album, concert et réactivation de sorties Spotify/YouTube ;
- personnalisation du texte et du média par couple réseau + format ;
- (le compagnon navigateur local a été abandonné au profit d'un mode strictement assisté par notification) ;
- journal des tentatives, reprise contrôlée et notifications d'échec ;
- export d'un « kit de partage manuel » pour les destinations non automatisables.

### Après le MVP

- publication X ;
- statistiques normalisées par canal ;
- calendrier de sortie et enrichissement avancé des liens musicaux ;
- collaboration et circuits d'approbation avancés ;
- notifications par email ;
- création automatique des Facebook Events et invitations automatiques vers les audiences choisies par l'utilisateur — contacts sélectionnés, amis Facebook et abonnés de Page lorsque la plateforme les rend accessibles — objectif obligatoire V2 sous réserve d'un mécanisme autorisable ;
- WhatsApp Business avec registre de consentement ;
- Snapchat Public Profile après allowlist ;
- TikTok après audit du client API ;
- gestion de playlists possédées par l'utilisateur Spotify ;
- CRM de curateurs avec démarche conforme et non automatisée par défaut ;
- connexion WhatsApp personnel et import explicite du carnet d'adresses, sous réserve de faisabilité et de consentement ;
- préparation, suivi et, si une interface officielle devient disponible, soumission automatisée aux playlists éditoriales Spotify ;
- achat média et Ads APIs ;
- génération vidéo avancée, découpage automatique et sous-titrage multilingue ;
- génération assistée par IA de textes, images ou vidéos ;

### Périmètre conditionnel à forte contrainte

Les capacités suivantes font partie de la vision produit, mais ne peuvent pas être promises comme automatisations serveur tant qu'un spike, une revue des conditions et une validation sécurité/conformité n'ont pas abouti :

- publication sur des profils Facebook personnels ;
- publication automatique dans des groupes Facebook ;
- création automatique des Facebook Events et invitation de leurs audiences ;
- éventuel coffre local de credentials ;
- envoi WhatsApp depuis un compte personnel et import du carnet d'adresses ;
- soumission automatique aux playlists éditoriales Spotify.

Le résultat fonctionnel doit néanmoins être couvert dès le produit initial par un **mode assisté** : contenu prêt, média prêt, destination ouverte, checklist et confirmation de publication. Les variantes automatisées seront développées derrière des feature flags, avec comptes pilotes dédiés et arrêt immédiat si elles contreviennent aux conditions de la plateforme.

Le stockage central de mots de passe sociaux et l'import silencieux de contacts restent interdits par défaut. Leur présence dans la vision signifie que le besoin utilisateur doit être étudié, pas que ces mécanismes sont présumés sûrs ou licites. L'option étudiée en priorité reste un sélecteur de contacts déclenché avec permission explicite.

### Toujours hors du premier produit

- achat de publicité payante dans le premier produit ;
- promesse de publication « exactement à la seconde » ;
- génération ou publication de contenu par IA dans la V1.

## Positionnement : organique avant paid media

Le mot « advertising » recouvre deux produits très différents :

- **promotion organique** : publier sur ses propres comptes et mesurer ;
- **paid media** : créer une campagne, une audience, un budget, des créations publicitaires et gérer la facturation.

Le MVP couvre uniquement le premier. Les Ads APIs impliquent d'autres permissions, responsabilités et écrans ; elles doivent rester un module ultérieur.

## Transformation de contenu en V1

La V1 ne génère et ne publie aucun contenu par IA. Elle réalise uniquement des transformations déterministes : redimensionnement, recadrage, compression, changement de ratio, miniature, filigrane texte « Lien en bio » et validation du format attendu par la destination.

Les textes sont saisis ou dupliqués manuellement par l'agence. Une couche IA pourra être ajoutée dans une version future sans modifier le modèle campagne/variante/cible.

La V1 n'est pas un gestionnaire de droits musicaux. Elle vérifie les capacités techniques de la plateforme, laisse l'utilisateur employer les outils musicaux que la destination expose effectivement et remonte les refus, blocages ou restrictions retournés par le réseau.

## Indicateurs de succès

### Activation

- espace créé + premier compte connecté ;
- première campagne créée ;
- première publication réussie dans les 24 heures suivant l'inscription.

### Valeur

- temps médian entre upload et programmation ;
- nombre de variantes approuvées par campagne ;
- publications réussies par espace et par semaine ;
- taux de réutilisation à 4 semaines.

### Fiabilité

- taux de publications abouties hors erreurs utilisateur/plateforme ;
- taux de doublons, cible absolue : zéro ;
- délai de détection d'un jeton expiré ;
- taux d'échecs récupérés sans intervention du support.

### Garde-fous

- erreurs de compte ou d'artiste sélectionné ;
- médias refusés, muets ou restreints par les plateformes ;
- coût infrastructure par campagne active.
