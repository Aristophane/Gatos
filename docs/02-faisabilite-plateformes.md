# Faisabilité des plateformes

État vérifié le 1er septembre 2026. Les API et politiques évoluent ; cette matrice doit être revue avant chaque nouvelle version de connecteur.

## Matrice de décision

| Destination | Publication officielle | Identité éligible | Décision produit | Phase |
|---|---|---|---|---|
| Instagram Feed | image ou vidéo simple | compte professionnel Business/Creator | publication officielle | V1 |
| Instagram Reel | vidéo verticale avec audio intégré | compte professionnel Business/Creator | publication officielle | V1 |
| Instagram Story | image/vidéo éphémère | compte Business | publication officielle ; un compte Business pour le pilote initial | V1 |
| Page Facebook | posts et Reels de Page | Page administrée | publication officielle | V1 |
| Profil Facebook personnel | pas d'API générale de publication automatisée | utilisateur individuel | notification puis transfert en un clic vers la feuille de partage/destination | V1 |
| Groupes Facebook | fonctionnalité officielle de publication supprimée | aucune intégration générale supportée | mode assisté V1, puis compagnon navigateur conditionnel | V1/P1 conditionnel |
| Événement Facebook | capacité générale de création/invitation non confirmée dans l'API publique actuelle | utilisateur/Page organisatrice | objectif obligatoire V2, après spike API/compagnon et revue Meta | V2 |
| X | posts texte/média via OAuth utilisateur | compte ayant autorisé l'app | hors chemin critique, backlog futur | Future |
| WhatsApp | messages Cloud API | numéro WhatsApp Business, destinataires consentants | hors chemin critique, backlog futur | Future |
| WhatsApp personnel | pas d'API officielle de multiposting personnel | compte et appareil de l'utilisateur | hors chemin critique, backlog futur | Future |
| Snapchat | Stories et Spotlights via Public Profile API | Public Profile ; accès allowlist | hors chemin critique, backlog futur | Future |
| Spotify | métadonnées et modification des playlists autorisées | playlist possédée/gérée par l'utilisateur | enrichissement et playlists propres seulement | Future |
| Playlists éditoriales Spotify | pas d'API publique de soumission automatique identifiée | artiste/équipe Spotify for Artists | assistant de pitch ; automatisation si partenariat officiel | Future |
| TikTok | Direct Post vidéo/photo disponible | utilisateur autorisé ; audit requis pour lever les restrictions | possible sous audit, backlog futur | Future |

## Instagram

L'API officielle permet de publier images, vidéos, Reels et carrousels sur les comptes professionnels. Elle ne permet pas de publier sur les comptes grand public. Dans le parcours avec Facebook Login, les Stories restent réservées aux comptes Business ; les posts et Reels sont disponibles aux comptes professionnels éligibles.

### Business ou Creator

Les deux sont des **comptes Instagram professionnels** et peuvent donc publier un post Feed ou un Reel par l'API. La différence utile pour Thermidor est la suivante :

| Conséquence | Business | Creator |
|---|---|---|
| Cible habituelle | marque, entreprise, label, salle | artiste, personnalité, créateur |
| Feed et Reels par API | oui | oui |
| Stories par le parcours Content Publishing avec Facebook Login | oui | non dans la capacité actuellement documentée |
| Liaison à une Page avec Facebook Login | requise | requise |
| Bibliothèque musicale native | peut être restreinte selon le compte, le territoire ou l'usage commercial | souvent mieux adaptée aux créateurs, sans garantie universelle |

Le choix ne change donc presque rien pour les posts et Reels, mais il change la couverture des **Stories automatiques**. Décision V1 : commencer avec un unique compte pilote Business, puis appliquer le même prérequis aux comptes déployés ultérieurement si les Stories automatiques restent exigées. Ce choix est compatible avec l'activité d'un musicien ; il s'agit d'un type de compte, pas d'une qualification juridique de l'artiste. En contrepartie, certaines musiques de la bibliothèque Instagram peuvent être indisponibles pour un compte Business. La V1 limite cet effet puisque l'artiste charge sa propre piste et Thermidor l'intègre au média.

Le compte Instagram Business pilote possède déjà une Page Facebook liée et administrable. La voie V1 retenue est donc Facebook Login afin d'obtenir un onboarding Meta cohérent pour Instagram et cette Page. Instagram Login direct reste une solution future si un artiste ne possède pas de Page liée.

Implications :

- annoncer clairement le prérequis « compte Instagram professionnel » ;
- prévoir une vérification d'éligibilité dès la connexion ;
- ne pas supposer qu'une connexion Instagram autorise automatiquement Facebook ;
- héberger temporairement ou téléverser le média selon le flux supporté ;
- interroger l'état du conteneur avant la publication et respecter la limite de publication exposée par l'API ;
- livrer Feed simple, Reel et Story en V1 ; conserver les carrousels pour une version ultérieure.

Pour une réactivation issue d'un lien Spotify/YouTube, la fiche campagne peut exister avec le lien seul. En revanche, la cible Reel reste `MISSING_MEDIA` tant que l'utilisateur n'a pas chargé une vidéo compatible. La V1 ne transforme pas automatiquement une pochette ou miniature en vidéo.

### Liens vers Spotify, YouTube et la billetterie

La V1 utilise une page « lien en bio » publique et stable pour chaque artiste. Les légendes Feed/Reel et les Stories orientent vers cette page avec l'appel à l'action « lien en bio ». Pour une Story, Thermidor peut intégrer cette mention comme filigrane dans le rendu avant publication. Si la publication officielle ne permet pas d'ajouter le sticker de lien attendu, la Story est tout de même publiée sans sticker ; ce manque ne déclenche ni blocage ni finalisation manuelle.

Thermidor met à jour le contenu de sa page publique, pas la bio du compte Instagram. Décision : l'URL est installée manuellement une seule fois dans la bio Instagram par l'utilisateur, puis reste stable. Aucun endpoint d'écriture de bio n'a été identifié dans l'espace API officiel Meta consulté ; cette conclusion est une inférence à partir des opérations actuellement documentées et devra être retestée pendant le spike Meta.

Source : [espace API Instagram officiel Meta](https://www.postman.com/meta/instagram/overview).

### Musique dans les Reels

Le flux officiel accepte une vidéo possédant une piste audio AAC et publie ce fichier sur le compte professionnel. Cependant, l'intégration "en dur" de l'audio pose un risque majeur de *Content ID* : Meta risque de rendre la vidéo muette si la piste musicale est distribuée officiellement, car le fichier uploadé n'est pas lié à la bibliothèque sous licence.

Depuis le 1er juin 2026, Meta propose une **Instagram Audio API** pour les applications utilisant Facebook Login. Pour contourner le risque de blocage, la V1 intégrera prioritairement cette API (via un *spike* spécifique) afin de lier le Reel à un ID audio officiel du catalogue Meta (la musique de l'artiste ou un autre son).

L'upload d'un audio original (normalisé en AAC et associé à la vidéo par Thermidor) restera un mode de repli. Thermidor expose la capacité réellement offerte par l'app et remonte les décisions de la plateforme : média accepté, bloqué, restreint ou rendu muet.

Sources : [changelog officiel Instagram Platform](https://developers.facebook.com/docs/instagram-platform/changelog), [collection officielle Meta Instagram](https://www.postman.com/meta/instagram/documentation/6yqw8pt/instagram-api), [accès à la bibliothèque musicale selon Meta](https://www.facebook.com/help/instagram/402084904469945).

## Facebook

Le périmètre automatisable est la **Page Facebook**. Le système obtient un Page Access Token pour une Page que l'utilisateur est autorisé à gérer, puis publie avec les permissions revues par Meta. Le flux Reels accepte notamment les états brouillon, programmé ou publié.

Il faut distinguer trois actions que l'expression « poster sur Facebook » mélange souvent :

| Action | Automatisation officielle V1 |
|---|---|
| Publier un post ou un Reel sur une Page Facebook | oui |
| Publier dans un groupe ou sur un profil personnel | non via une API générale ; parcours assisté |
| Créer l'objet Facebook Event et inviter son audience | aucun endpoint public général confirmé ; objectif V2 conditionné par un spike |

Thermidor peut donc publier automatiquement l'annonce d'un concert sur la Page Facebook, avec son visuel, son texte et son lien de billetterie. C'est la création de la fiche native « Événement Facebook » — avec date, lieu, organisateurs et bouton de participation — qui reste distincte et non confirmée par l'API publique.

Comme pour Instagram, le connecteur Page envoie la vidéo finalisée avec la piste fournie par l'artiste et normalisée en AAC. La sélection dans une bibliothèque Facebook n'est pas requise par la V1.

Les profils personnels et les groupes font désormais partie du périmètre fonctionnel, mais pas du connecteur officiel Meta : depuis Graph API v19, Meta a supprimé `publish_to_groups`, `groups_access_member_info` et le Groups API général. Une publication automatique serveur ne doit donc pas être promise comme équivalente à celle des Pages, même si l'utilisateur administre le groupe.

Pour un profil personnel, la V1 programme une `ASSISTED_PUBLICATION`. Exactement à l'heure prévue, l'utilisateur reçoit une notification push directement sur son téléphone ; aucun rappel anticipé n'est envoyé. Plusieurs actions dues au même moment sont regroupées et le push ouvre leur liste. Chaque action permet de prévisualiser le contenu et déclenche, sur appareil compatible, la feuille de partage système avec texte, lien et fichier. Facebook reste la destination choisie par l'utilisateur ; après partage, il clôt l'action avec un bouton de validation en un clic. Le partage Web dépend du navigateur et de l'app cible : « un clic » désigne le transfert vers le composer, pas un envoi silencieux garanti. Si le push est refusé, indisponible ou manqué, l'action reste dans le centre « Actions en attente » de Thermidor. L'email n'est pas un canal V1.

La livraison se concentre uniquement sur le palier assisté par notification :

1. générer le texte, le média et le lien, notifier à l'heure planifiée (via Web Push PWA), puis fournir un bouton de partage et des fallbacks « copier » / « télécharger ».

Le projet abandonne l'idée d'un "compagnon navigateur" (extension de scraping) en raison de sa fragilité (le DOM de Facebook changeant constamment) et du risque de bannissement pour l'utilisateur. Le produit ne stocke aucun mot de passe Facebook sur le serveur.

Sources : [collection officielle Meta Facebook](https://www.postman.com/meta/facebook/documentation/r56bjfd/facebook-api), [documentation Meta Pages Posts](https://developers.facebook.com/docs/pages-api/posts/), [annonce officielle Graph API v19](https://developers.facebook.com/blog/post/2024/01/23/introducing-facebook-graph-and-marketing-api-v19/).

### Événements Facebook — objectif V2

La V1 sait préparer les informations d'un concert et publier ses annonces sur les canaux automatisables. La V2 doit créer automatiquement l'objet Facebook Event — titre, description, visuel, lieu, début/fin, billetterie et organisateur — puis permettre à l'utilisateur de choisir ses sources d'invitation parmi les contacts sélectionnés, les amis Facebook et les abonnés de la Page. L'interface n'affiche que les audiences réellement accessibles au compte et au mécanisme retenu. Aucun endpoint public général couvrant aujourd'hui cette création et ces invitations n'a été confirmé dans les références Meta consultées.

Ce besoin fait donc l'objet d'un spike V2 séparé : API officielle ou partenariat en priorité ; à défaut, compagnon local seulement si la revue des conditions Meta, le modèle de menace et des tests réels le permettent. L'objet `CONCERT` et sa planification restent natifs dans Thermidor dès la V1 afin de ne pas reconstruire le modèle métier en V2.

Source technique du transfert en un clic : [Web Share API — MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Share_API).

Source de référence à tester : [Page Events — Graph API](https://developers.facebook.com/docs/graph-api/reference/page/events/).

## X

X autorise la création de posts pour l'utilisateur authentifié via OAuth 2.0 Authorization Code avec PKCE et les scopes `tweet.read`, `tweet.write` et `users.read`. Le média est chargé avant d'être référencé par son identifiant lors de la création du post. Cette faisabilité est conservée pour information, mais X n'est pas sur le chemin critique de la V1.

Implications :

- le connecteur est techniquement adapté à une version future ;
- le coût et les limites du plan X doivent être validés par un spike et instrumentés par espace ;
- les fonctions payantes ou Enterprise ne doivent pas être incluses implicitement ;
- stocker la réponse et l'identifiant distant avant de considérer le job comme terminé.

Sources : [création d'un post X](https://docs.x.com/x-api/posts/create-post), [upload média](https://docs.x.com/x-api/media/upload-media), [authentification et scopes](https://docs.x.com/fundamentals/authentication/guides/v2-authentication-mapping), [limites](https://docs.x.com/x-api/fundamentals/rate-limits).

## Snapchat

La Public Profile API sait téléverser des médias, publier des Stories et des Spotlights et lire leurs métriques. Toutefois, l'accès à cette API requiert actuellement une allowlist, après création d'une app OAuth et échange avec un contact Snap.

Décision : conserver la demande d'allowlist et le connecteur dans le backlog futur. Aucun travail Snap ne conditionne la V1. Un connecteur ne passe en développement complet qu'après obtention d'un environnement d'essai représentatif.

Sources : [démarrage et allowlist](https://developers.snap.com/marketing-api/Public-Profile-API/GetStarted), [gestion et publication des médias](https://developers.snap.com/marketing-api/Public-Profile-API/ProfileAssetManagement), [métriques](https://developers.snap.com/marketing-api/Public-Profile-API/Metrics).

## WhatsApp

Le canal serveur fiable repose sur la WhatsApp Business Platform : rattacher un numéro Business et envoyer des messages aux personnes qui ont accepté ce canal. Les conversations initiées par l'entreprise utilisent des modèles approuvés en dehors de la fenêtre de service prévue par WhatsApp. Le compte personnel reste dans le périmètre via le parcours local décrit plus bas, avec des capacités et des responsabilités distinctes.

Le module exige donc avant tout envoi :

- une preuve de consentement : destinataire, finalité, texte présenté, source, horodatage ;
- une gestion simple du retrait et une liste de suppression ;
- des modèles approuvés et versionnés ;
- un contrôle de fréquence, de qualité et des échecs ;
- une séparation stricte des contacts entre espaces de travail ;
- une analyse juridique dédiée avant mise en production.

La CNIL rappelle que la prospection électronique vers des particuliers repose en principe sur un consentement préalable, libre, spécifique, éclairé et univoque, et que chaque sollicitation doit permettre un refus simple.

Le compte WhatsApp personnel est également intégré à la vision, sous forme d'un parcours local et explicitement déclenché. Le premier palier utilise la feuille de partage ou ouvre une conversation préremplie. Un prototype de compagnon peut ensuite sélectionner des conversations dans la session locale, mais il reste séparé de la Cloud API et ne doit jamais transformer un carnet personnel en base marketing implicite.

L'import du carnet d'adresses doit afficher les champs lus, la finalité, l'espace destinataire et une confirmation avant copie. Un « import silencieux » est traité comme une exigence métier à reformuler : la synchronisation peut devenir automatique après un consentement initial explicite et révocable, mais pas être cachée à la personne qui possède le carnet ni aux contacts lorsque la loi exige leur information.

Sources : [Cloud API officielle Meta](https://www.postman.com/meta/whatsapp-business-platform/documentation/wlk6lh4/whatsapp-cloud-api), [règles générales d'opt-in et modèles](https://about.fb.com/news/2025/04/ways-to-manage-your-businesses-chats-on-whatsapp/), [CNIL — prospection commerciale](https://www.cnil.fr/fr/la-prospection-commerciale), [CNIL — communications électroniques](https://www.cnil.fr/fr/communication-electronique-quelles-regles).

## Spotify et les playlists

Quatre besoins doivent rester distincts :

1. afficher/enrichir une sortie à partir d'un lien Spotify : possible avec les métadonnées autorisées ;
2. ajouter un titre à une playlist possédée ou gérée par l'utilisateur connecté : possible avec les scopes de modification correspondants ;
3. contacter des curateurs indépendants : workflow CRM et règles de prospection ;
4. soumettre aux playlists éditoriales Spotify : processus Spotify for Artists pour lequel aucune capacité publique générique d'automatisation n'est identifiée dans la Web API.

La V1 accepte le lien seul, le résout et conserve les métadonnées et le visuel accessibles avec leur provenance ; l'utilisateur n'a pas à fournir un fichier pour créer la fiche catalogue. Ces valeurs sont éditables, mais l'instantané importé reste conservé séparément. Une version future peut ajouter un enrichissement musical avancé et un assistant de pitch : collecte des informations demandées, rédaction, checklist, rappel de délai et journal de soumission. Une soumission totalement automatique ne sera activée que via une API ou un partenariat officiellement autorisé ; le produit ne simulera pas clandestinement Spotify for Artists avec des mots de passe stockés sur le serveur.

Sources : [autorisation Spotify](https://developer.spotify.com/documentation/web-api/concepts/authorization), [concepts playlists](https://developer.spotify.com/documentation/web-api/concepts/playlists), [création de playlist](https://developer.spotify.com/documentation/web-api/reference/create-playlist).

## TikTok

La prémisse « l'auto-post TikTok n'est pas possible » n'est plus exacte. La Content Posting API permet le Direct Post vidéo et photo. En revanche, un client non audité est limité à des publications privées et à un faible nombre d'utilisateurs ; un audit est nécessaire pour un produit public.

Décision : conserver TikTok dans le backlog futur. Son spike, son audit et ses réglages spécifiques ne conditionnent ni le modèle ni le calendrier de la V1.

Sources : [Direct Post — démarrage](https://developers.tiktok.com/doc/content-posting-api-get-started), [référence Direct Post](https://developers.tiktok.com/doc/content-posting-api-reference-direct-post), [règles de partage et audit](https://developers.tiktok.com/doc/content-sharing-guidelines).

## Politique générale de connecteur

Un connecteur passe en production seulement si les cinq preuves suivantes existent :

1. compte de test et OAuth complet avec révocation ;
2. publication de chaque type annoncé ;
3. comportement documenté après timeout et reprise ;
4. lecture du statut ou méthode de réconciliation ;
5. validation App Review / allowlist / audit et conformité aux conditions.

Une automatisation locale non officielle suit une piste expérimentale distincte : feature flag, déclenchement visible, comptes pilotes, journal local, aucune collecte centrale de credentials et revue des conditions avant diffusion. Elle ne remplace jamais silencieusement un connecteur officiel défaillant.
