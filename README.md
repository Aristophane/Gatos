# Thermidor Multiposting

Documents de cadrage pour un SaaS de création, adaptation, planification et publication de contenus destiné aux artistes, bars et salles de concert.

Le produit est volontairement séparé en deux moteurs :

1. **Content Studio** : transforme des sources brutes en variantes validées pour chaque canal.
2. **Publishing Engine** : connecte les comptes autorisés, programme les publications, exécute les envois et en suit le résultat.

## Décision de départ

La V1 sera une **application web responsive/PWA pour une agence/label gérant cinq artistes**, avec un pilote technique démarrant sur **un unique compte Instagram Business** avant extension aux autres artistes. Son chemin critique est limité à Instagram Business et à Facebook : Pages via API officielle, profils personnels via notification et transfert en un clic, groupes via un parcours assisté. Chaque artiste dispose d'une page cloisonnée dans l'espace de l'agence. X, WhatsApp, Snapchat, TikTok, l'automatisation des Facebook Events et les démarches vers les playlists Spotify restent dans le backlog futur et ne conditionnent pas la sortie de la V1. Une application native mobile ou desktop n'est pas justifiée pour la V1.

La matrice fonctionnelle V1 couvre Instagram Feed, Reels et Stories, les Pages Facebook et le partage assisté vers profils personnels/groupes. Chaque artiste dispose d'une page « lien en bio » mise à jour automatiquement pour orienter vers Spotify, YouTube, billetterie et campagnes actives. Les campagnes concert publient sur les canaux disponibles ; la création native d'un Facebook Event et les invitations automatiques sont un objectif obligatoire de V2. Les plans servent quatre scénarios : sortie de single, sortie d'album, concert et réactivation d'une sortie Spotify ou YouTube existante. Le contenu peut être répété et personnalisé par réseau et par format.

## Documents

- [Vision et périmètre](docs/01-vision-produit.md)
- [Faisabilité des plateformes](docs/02-faisabilite-plateformes.md)
- [Architecture technique](docs/03-architecture-technique.md)
- [Backlog et feuille de route](docs/04-backlog-roadmap.md)
- [Décisions et questions ouvertes](docs/05-decisions.md)

## Hypothèse de livraison

Avec deux développeurs full-stack, un renfort produit/design à mi-temps et un support DevOps ponctuel :

- preuve de faisabilité Meta et cadrage des accès artistes : 2 à 3 semaines ;
- alpha fermée Instagram/Facebook : environ 10 à 14 semaines de réalisation ;
- bêta agence incluant les statistiques élémentaires : 3 à 5 semaines supplémentaires.

Les revues d'applications des plateformes sont des délais externes et ne doivent pas être confondues avec le temps de développement.
