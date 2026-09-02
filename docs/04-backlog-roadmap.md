# Backlog priorisé et feuille de route

## Règles de priorité

- **P0** : indispensable à une alpha fiable Instagram/Facebook.
- **P1** : apporte une valeur nette après validation du noyau.
- **P2** : dépend d'un accès plateforme, d'une validation marché ou d'un chantier conformité distinct.
- **P3** : expansion ; ne doit pas influencer la conception initiale au-delà des interfaces prévues.

Les tailles `S`, `M`, `L` et `XL` sont relatives. Une story `XL` doit être redécoupée avant le sprint.

## Phase 0 — Réduire les risques avant de construire

| ID | Priorité | Taille | Élément | Critère de sortie |
|---|---:|---:|---|---|
| DISC-01 | P0 | S | Cartographier le fonctionnement de l'agence et des 5 artistes | compte pilote, futurs comptes, médias, validations et fréquence documentés |
| DISC-02 | P0 | M | Tester le concept cliquable | l'agence et au moins 2 artistes utilisent leurs vues respectives sans confusion |
| API-01 | P0 | L | Spike OAuth + Reel Instagram | connexion, upload, publication, statut et révocation démontrés |
| API-02 | P0 | L | Spike Page + Reel Facebook | même preuve, avec permissions exactes consignées |
| API-03 | P0 | M | Spike profils/groupes Facebook | mode assisté via notification PWA démontré |
| API-04 | P0 | L | Spike Instagram Audio API | liaison d'un Reel à une piste du catalogue Meta démontrée |
| MEDIA-API-01 | P0 | M | Vérifier l'audio fourni par l'artiste | upload, normalisation AAC, association vidéo et publication IG/FB démontrés |
| LEG-01 | P0 | M | Cartographier données et rôles RGPD | registre initial, rétention, sous-traitants et responsabilités validés |
| BIZ-01 | P0 | S | Établir la baseline du pilote interne | temps actuel mesuré sur l'agence et marge campagne confirmée |

**Gate G0** : ne pas engager le connecteur Meta complet sans deux publications réelles sur comptes de test, liste des permissions et chemin App Review identifié.

## Premier incrément vertical à construire

Le démarrage ne cherche pas à livrer tout le backlog. Le premier résultat exécutable doit couvrir un seul chemin de bout en bout :

1. créer l'espace agence et le profil artiste pilote ;
2. connecter son compte Instagram Business et sa Page Facebook liée avec Facebook Login ;
3. charger un média et saisir une légende ;
4. produire un rendu compatible ;
5. choisir « maintenant » ou une date précise ;
6. publier sur Instagram Feed puis sur la Page Facebook ;
7. afficher le statut, l'identifiant distant et une erreur exploitable.

Les Reels, Stories, séries, actions personnelles et pages lien en bio viennent ensuite sur ce socle. Ce chemin valide l'architecture, l'OAuth, le stockage média, le scheduler et l'idempotence avant d'élargir l'interface.

## P0 — Alpha fermée Meta

### Socle et identité

| ID | Taille | Story | Critères d'acceptation résumés |
|---|---:|---|---|
| FND-01 | M | Initialiser monorepo, CI et environnements | lint, tests, migrations et déploiement de test reproductibles |
| IAM-01 | L | Créer l'espace agence et ses profils gérés | cinq profils possibles, un artiste pilote connecté, aucun accès croisé |
| IAM-03 | L | Inviter le propriétaire sur sa page | l'agence crée/révoque l'accès ; l'utilisateur ne voit que son profil |
| IAM-04 | M | Appliquer l'autorité de publication | seul le propriétaire peut approuver, programmer, annuler ou publier pour son profil |
| IAM-02 | M | Journaliser les actions sensibles | connexion canal, approbation, publication et suppression traçables |
| SEC-01 | L | Stocker les credentials sociaux chiffrés | KMS, scopes minimaux, aucune valeur dans logs/UI |
| SEC-02 | M | Exporter et supprimer un espace | workflow asynchrone audité, politique de rétention appliquée |

### Médias et informations source

| ID | Taille | Story | Critères d'acceptation résumés |
|---|---:|---|---|
| LIB-01 | L | Upload direct multipart image/vidéo | reprise, checksum, quotas, progression et annulation |
| LIB-02 | L | Inspecter et transcoder les vidéos | FFmpeg asynchrone, états visibles, original immuable |
| LIB-03 | M | Générer rendus 9:16, 4:5 et 1:1 | choix remplir/ajuster + cadrage, validation par profil |
| LIB-04 | L | Charger et normaliser une piste audio | upload propriétaire, sortie AAC, aperçu et rendu vidéo reproductible |
| LIB-05 | S | Ajouter le filigrane lien en bio | bandeau texte déterministe, position sûre, aperçu et activation par variante Story |
| SRC-01 | M | Créer une fiche single | titre, artiste, date, liens et CTA enregistrés |
| SRC-02 | M | Créer une fiche concert | lieu, date/fuseau, artistes, billetterie et mentions |
| SRC-03 | M | Créer une fiche album | titre, pochette, date, liens et liste d'extraits enregistrés |
| CAT-01 | L | Parcourir le catalogue Spotify/YouTube | filtres par fournisseur/type/date et campagnes précédentes visibles |
| CAT-02 | M | Réactiver une sortie existante | nouvelle campagne sociale créée sans repartager ni altérer un ancien post |
| CAT-03 | L | Importer un lien Spotify ou YouTube | URL validée, fournisseur/ID résolus, métadonnées et visuel enregistrés avec provenance |
| CAT-04 | M | Compléter une sortie avec des médias propriétaires | lien seul accepté pour la fiche ; vidéo utilisateur obligatoire pour activer un Reel |

### Préparation de contenu

| ID | Taille | Story | Critères d'acceptation résumés |
|---|---:|---|---|
| ART-01 | M | Configurer l'identité d'un profil | type artiste/lieu, nom, visuels, couleurs et liens réutilisables |
| LINK-01 | L | Publier une page lien en bio par artiste | URL stable, responsive, profil et cartes de liens dans un modèle inspiré de Stan |
| LINK-02 | M | Alimenter la page depuis les campagnes | campagne active mise en avant, activation/expiration automatiques, ordre manuel possible |
| LINK-03 | S | Intégrer l'appel à l'action Instagram | texte « lien en bio » disponible pour Feed, Reel et Story sans exiger de sticker |
| LINK-04 | M | Personnaliser la page publique | photo, nom, bio, réseaux, couleurs et cartes réordonnables |
| TXT-01 | M | Personnaliser par réseau et format | une variante éditable par couple ; aucune personnalisation par occurrence |
| CMP-01 | L | Créer une campagne à partir d'une source | snapshot du catalogue personnalisable, objectif, période, assets, variantes et cibles séparés |
| CMP-02 | L | Prévisualiser et approuver chaque cible | propriétaire seul ; validité sans expiration et édition ultérieure auto-approuvée/auditée |
| MAN-01 | M | Exporter un kit manuel | texte copiable, média téléchargeable, lien et checklist |

La page publique s'inspire de Stan pour la hiérarchie — identité, biographie, réseaux et cartes externes — sans reprendre ses fonctions de vente, paiement ou formation dans la V1. Référence : [Stan — personnaliser son store](https://help.stan.store/article/109-how-to-build-launch-your-stan-store-in-30-mins).

### Connexions, planification et publication

| ID | Taille | Story | Critères d'acceptation résumés |
|---|---:|---|---|
| CON-01 | L | Connecter et révoquer Instagram Business | Facebook Login déclenché par le propriétaire, compte/type/capacités visibles |
| CON-02 | L | Connecter et révoquer la Page Facebook liée | même onboarding Meta, sélection de Page et santé visibles |
| AST-01 | L | Préparer une publication Facebook assistée | paquet signé, notification planifiée, destination ouverte et confirmation journalisée |
| FBP-01 | L | Transférer en un clic vers un profil personnel | notification à l'échéance, Web Share si compatible, fallbacks copie/téléchargement et confirmation |
| FBG-01 | L | Publier en mode assisté dans un groupe | groupe choisi explicitement et résultat confirmé |
| PUB-01 | L | Publier dans le Feed Instagram | image/vidéo, statut, URL distante et erreurs traduites |
| PUB-04 | XL | Publier un Reel Instagram | vidéo utilisateur obligatoire, rendu vertical/audio, conteneur, polling et URL distante |
| PUB-05 | L | Publier une Story Instagram | compte Business obligatoire ; publication maintenue sans sticker de lien, CTA lien en bio |
| PUB-02 | XL | Publier post et Reel de Page Facebook | upload, publication, URL distante, erreurs traduites |
| PUB-03 | L | Orchestrer les jobs de façon idempotente | outbox, verrou, retries, DLQ et état `UNKNOWN` testés |
| SCH-01 | L | Programmer avec fuseau horaire | stockage UTC, DST testé, jamais avant l'heure et 99 % sous cinq minutes |
| SCH-02 | L | Créer un plan simple ou répété | maintenant, dates libres, cadence quotidienne/hebdomadaire/mensuelle et fin facultative |
| SCH-03 | M | Modifier une série existante | aperçu du différentiel ; seules les occurrences futures dont l'exécution n'a pas commencé sont régénérées |
| SCH-04 | M | Exécuter une série sans limite produit | matérialisation glissante, pause/reprise/arrêt et quotas plateforme respectés |
| SCH-05 | S | Avertir sur une répétition identique sous 24 h | avertissement non bloquant, confirmation explicite et audit |
| OPS-01 | L | Afficher statuts et actions correctives | erreur compréhensible, reconnecter/corriger/retenter selon le cas |
| ACT-01 | M | Afficher les actions utilisateur en attente | liste persistante, regroupement, partage, validation ou « Ignorer » en un clic |
| ACT-02 | S | Évacuer les actions devenues anciennes | récurrente remplacée à l'échéance suivante ; ponctuelle expirée par clôture mensuelle ; audit conservé |
| OBS-01 | M | Instrumenter le parcours | traces corrélées, dashboards succès/latence/backlog/quotas |
| NTF-01 | S | Notifier l'échec d'une publication | push téléphone, sans fuite de données |
| NTF-02 | M | Notifier une publication personnelle attendue | un Web Push à l'heure exacte par lot simultané, sans rappel anticipé, lien signé et état de livraison |

**Gate G1 — alpha fermée** : l'agence publie de bout en bout avec l'unique compte Instagram Business pilote et sa destination Facebook retenue, sans fuite d'accès ni doublon, avec au moins un cas de jeton expiré et un cas de panne transitoire correctement récupérés.

## P1 — Bêta et preuve de valeur

| ID | Taille | Élément | Dépend de |
|---|---:|---|---|
| ANL-01 | L | Métriques de base par publication | IDs distants, permissions insights |
| ANL-02 | M | Tableau de campagne normalisé | ANL-01, définition métriques comparables |
| CAL-01 | M | Vue calendrier et duplication de campagne | CMP-01, SCH-01 |
| COL-01 | L | Commentaires et validation à deux niveaux | retours pilotes agence/label |
| CAP-01 | M | Sous-titrage et transcription éditables | pipeline média stable |
| BILL-01 | L | Plans, quotas et comptage d'usage | modèle commercial validé |
| OPS-02 | M | Console support sécurisée | audit, masquage et droits support |
| NTF-03 | M | Ajouter les notifications email | préférences, vérification d'adresse, désabonnement et délivrabilité |

**Gate G2 — bêta** : le pilote est étendu progressivement aux autres artistes jusqu'à cinq profils actifs, la rétention à quatre semaines est mesurée et le coût réel par campagne confirme la marge annoncée.

## Backlog futur — plateformes non critiques

| ID | Taille | Élément | Condition de démarrage |
|---|---:|---|---|
| X-01 | XL | OAuth et publication texte/image/vidéo sur X | priorité future décidée, budget API validé |
| WA-01 | XL | Onboarding WhatsApp Business | parcours Embedded Signup et responsabilité contractuelle validés |
| WA-02 | XL | Contacts, consentement et suppressions | avis juridique + modèle de preuve accepté |
| WA-03 | XL | Modèles approuvés, campagnes et délivrabilité | WA-01/02, pilote volontaire |
| WAP-01 | L | Partage assisté vers WhatsApp personnel | prototype local, consentement utilisateur |
| WAP-02 | XL | Compagnon WhatsApp personnel | revue conditions, threat model, comptes pilotes |
| CT-01 | L | Import explicite et synchronisation du carnet d'adresses | permission, aperçu, source, révocation et avis juridique |
| SNAP-01 | XL | OAuth, Story et Spotlight | allowlist obtenue |
| SNAP-02 | L | Statistiques Snap | SNAP-01 stable |
| TT-01 | XL | Direct Post TikTok | spike réussi, UX conforme |
| TT-02 | L | Audit TikTok et lancement public | dossier d'audit accepté |
| PLAY-01 | L | Gérer les playlists Spotify de l'utilisateur | demande utilisateur validée, scopes minimaux |
| CRM-01 | XL | Répertoire et suivi des curateurs | finalité, sourcing et conformité validés |
| SPED-01 | L | Assistant de pitch Spotify éditorial | champs, échéance, checklist et confirmation manuelle validés |
| SPED-02 | XL | Soumission éditoriale automatisée | API ou partenariat officiel disponible et autorisé |

## P1 conditionnel — Fonctionnalités sans API officielle

| ID | Taille | Élément | Condition de démarrage |
|---|---:|---|---|
| VAULT-01 | L | Étudier un coffre local de credentials | besoin pilote prouvé ; aucune synchronisation serveur |

Ces éléments appartiennent au périmètre produit, mais ne franchissent pas le gate de production sur la seule réussite technique. Ils exigent aussi une décision conformité/plateforme et peuvent rester durablement en mode assisté (ex: notifications push).

## V2 — Facebook Events

| ID | Taille | Élément | Critère de sortie |
|---|---:|---|---|
| EVT-01 | L | Spike création et invitations d'événement | capacités officielles, audiences invitables, limites et conditions documentées sur comptes pilotes |
| EVT-02 | XL | Créer automatiquement un Facebook Event | titre, lieu, dates, visuel, billetterie, organisateurs et URL distante confirmés |
| EVT-03 | XL | Inviter automatiquement l'audience retenue | choix parmi contacts sélectionnés, amis Facebook et abonnés de Page selon capacités ; consentement, limites, journal et arrêt sûr validés |

La V2 n'est considérée complète pour les salles et artistes que si `EVT-02` et `EVT-03` aboutissent avec un mécanisme autorisable. Cette exigence ne bloque pas la V1.

## P3 — Expansion

- paid media via Meta/Snap/TikTok Ads APIs ;
- génération de textes, images ou vidéos par IA ;
- génération et montage vidéo avancés ;
- recommandations basées sur les performances ;
- bibliothèque de modèles de campagne par genre musical ou type d'événement ;
- localisation multilingue à grande échelle ;
- application mobile native si les critères du document d'architecture sont atteints ;
- nouveaux canaux décidés selon la demande, jamais seulement parce qu'une API existe.

## Ordre d'implémentation conseillé

```mermaid
flowchart LR
    A[Découverte + spikes API] --> B[Identité + sécurité]
    B --> C[Bibliothèque média]
    B --> D[Sources + campagnes]
    C --> E[Variantes + approbation]
    D --> E
    E --> F[Scheduler + outbox]
    F --> G[Instagram]
    F --> H[Facebook Pages]
    G --> I[Alpha pilote]
    H --> I
    I --> P[Publication assistée (Push)]
    I --> J[Analytics + itérations agence]
    J --> K[Backlog futur non critique]
```

## Plan calendaire indicatif

Hypothèse : 2 développeurs full-stack, produit/design à 50 %, DevOps et juridique ponctuels.

| Période | Résultat attendu |
|---|---|
| Semaines 1–3 | workflow agence/artistes, prototype, spikes Meta et musique, cartographie RGPD |
| Semaines 4–6 | espace agence, pages artistes, sécurité, upload et modèle campagne |
| Semaines 7–10 | redimensionnement, variantes manuelles, approbation, scheduler et observabilité |
| Semaines 11–14 | connecteurs Meta, durcissement et alpha pilote |
| Semaines 15–19 | itérations agence, accès artistes, métriques de base et bêta |

Ce calendrier ne contient aucune promesse de délai pour l'App Review Meta. Les allowlists et audits des plateformes futures ne conditionnent pas la V1.

## Stratégie de test

- tests unitaires pour règles de capacités, permissions et transitions d'état ;
- tests contractuels sur des fixtures enregistrées pour chaque version d'API ;
- comptes sandbox/test séparés par plateforme ;
- tests d'intégration réels quotidiens limités et observés ;
- chaos ciblé : timeout après upload, token expiré, webhook dupliqué, quota, média refusé ;
- parcours E2E : upload → approbation → programmation → publication → URL distante ;
- vérification manuelle des formats sur appareils iOS/Android avant chaque lancement de canal.

## Référence UX de planification

La V1 reprend des conventions éprouvées : publication immédiate ou à date fixe, créneaux récurrents par canal, aperçu des prochaines occurrences et arrêt explicite d'une répétition. Buffer distingue également les dates personnalisées de sa file récurrente et permet de modifier ou arrêter une récurrence. Thermidor ajoute les fréquences quotidiennes, hebdomadaires et mensuelles demandées, sans plafond produit initial.

Références : [Buffer — posting schedules](https://support.buffer.com/en-us/articles/setting-up-your-timezones-and-posting-schedules-P4iSag90Fl), [Buffer — recurring posts](https://support.buffer.com/en-us/articles/is-it-possible-to-schedule-one-post-to-repeat-multiple-times-521zxc7H5D).
