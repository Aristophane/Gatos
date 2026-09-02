# Décisions structurantes et questions ouvertes

## Décisions actées

| ID | Décision | Motif | Réversibilité |
|---|---|---|---|
| ADR-001 | Web responsive/PWA pour la V1 | couvre gestion d'agence, upload, calendrier et validation sans deux bases mobiles | forte |
| ADR-002 | Promotion organique uniquement au départ | les Ads APIs constituent un produit, des permissions et une facturation différents | forte |
| ADR-003 | Meta seul sur le chemin critique | Instagram professionnel, Pages, profils et groupes Facebook concentrent la V1 | moyenne |
| ADR-004 | Profils/groupes Facebook dans le périmètre assisté par notification | API générale absente : mode assisté via notification PWA (abandon du compagnon) | forte |
| ADR-005 | Monolithe modulaire, workers séparés | vitesse d'équipe avec isolation des tâches longues | moyenne |
| ADR-006 | PostgreSQL source de vérité + file de jobs | simplicité d'architecture V1 (élimination de Redis) | moyenne |
| ADR-007 | Modèle campagne/variante/cible/tentative | respecte les différences par réseau et rend les erreurs traçables | faible |
| ADR-008 | Aucune génération ou publication par IA en V1 | la transformation V1 se limite au redimensionnement et adaptations déterministes | forte |
| ADR-009 | Original média immuable + rendus prédéfinis | reproductibilité, audit et publication rapide | moyenne |
| ADR-010 | Adaptateurs et registre de capacités versionné | changements d'API isolés, validation avant envoi | moyenne |
| ADR-011 | WhatsApp uniquement dans le backlog futur | aucun travail WhatsApp ne conditionne la V1 | forte |
| ADR-012 | Région UE et chiffrement des jetons dès le socle | coût de correction ultérieure trop élevé | faible |
| ADR-013 | X, Snap, WhatsApp et TikTok hors chemin critique | conserver la faisabilité sans consommer la capacité V1 | forte |
| ADR-014 | Aucun microservice initial | le domaine évoluera vite ; les frontières logiques suffisent | forte |
| ADR-015 | Abandon du compagnon local | le scraping DOM est trop fragile et risqué ; seul le push est conservé | forte |
| ADR-016 | Aucun mot de passe social dans le backend SaaS | risque critique et souvent incompatible avec les conditions des plateformes | faible |
| ADR-017 | Import de contacts explicite avant toute synchronisation | consentement, traçabilité et révocation sont indispensables | faible |
| ADR-018 | Pitch Spotify éditorial couvert d'abord en mode assisté | aucune API publique de soumission automatique identifiée | forte |
| ADR-019 | V1 exploitée par une agence/label avec cinq artistes | correspond à l'utilisation réelle initiale | faible |
| ADR-020 | Chaque artiste ou lieu possède une page cloisonnée | l'agence voit le portefeuille, le propriétaire ne voit pas les autres profils | faible |
| ADR-021 | Pas de moteur de gestion des droits musicaux en V1 | conserver l'audio et utiliser les capacités/refus normaux des plateformes | moyenne |
| ADR-022 | Priorité à l'Instagram Audio API pour éviter le Content ID | l'upload d'audio en dur reste un mode de repli avec acceptation du risque | moyenne |
| ADR-023 | L'agence crée les profils et accès artistes | centralise l'onboarding des cinq artistes | faible |
| ADR-024 | Choix du mode autonome ou délégué | l'agence peut gérer intégralement les publications si la délégation est choisie | faible |
| ADR-025 | Le gestionnaire charge média et texte depuis sa page | ce paquet devient la source de la planification multicanal | faible |
| ADR-026 | La connexion OAuth utilise la délégation native Meta | le gestionnaire (artiste ou agence) connecte son propre compte Facebook autorisé | faible |
| ADR-027 | Un upload peut produire une publication simple ou répétée | le propriétaire choisit formats, supports et répétition | faible |
| ADR-028 | La V1 utilise l'audio directement fourni par l'artiste | normalisation AAC et association au média par Thermidor | moyenne |
| ADR-029 | Instagram V1 couvre Feed, Reel et Story | matrice demandée pour chaque profil | moyenne |
| ADR-030 | Facebook V1 couvre Pages, profils personnels et groupes | Page officielle ; notification/transfert personnel ; groupe assisté | moyenne |
| ADR-031 | Quatre scénarios de campagne structurent la V1 | single, album, concert et réactivation du catalogue | faible |
| ADR-032 | Personnalisation au niveau réseau + format | les répétitions réutilisent la même variante pour un couple donné | moyenne |
| ADR-033 | Le catalogue V1 référence des sorties Spotify/YouTube existantes | la réactivation crée de nouveaux posts sociaux autour du lien, pas un repartage d'ancien post | faible |
| ADR-034 | Un lien Spotify/YouTube suffit pour créer et réactiver une sortie | les médias propriétaires sont facultatifs ; les formats irréalisables restent signalés | moyenne |
| ADR-035 | Publication Facebook Page et création Facebook Event sont deux capacités distinctes | posts/Reels de Page automatisables en V1 ; création/invitations Event visées en V2 | moyenne |
| ADR-036 | Le pilote commence avec un unique compte Instagram Business | réduit le risque d'intégration ; extension progressive après validation de bout en bout | moyenne |
| ADR-037 | Les profils Facebook personnels utilisent une notification et un transfert en un clic | l'utilisateur publie dans sa session ; aucune automatisation silencieuse ni mot de passe stocké | faible |
| ADR-038 | Création et invitations automatiques aux Facebook Events sont obligatoires en V2 | besoin métier majeur des salles/artistes, sans bloquer le lancement V1 | moyenne |
| ADR-039 | Génération vidéo basique depuis une pochette | un Reel exige une vidéo, Thermidor en génèrera une boucle si seul image+audio sont fournis | faible |
| ADR-040 | L'utilisateur choisit les sources d'invitation d'un Event en V2 | contacts sélectionnés, amis et abonnés de Page sont proposés uniquement s'ils sont accessibles | moyenne |
| ADR-041 | Le compte Business pilote possède une Page Facebook liée | Facebook Login devient le parcours Meta V1 de référence | moyenne |
| ADR-042 | Une série accepte dates manuelles ou règle de cadence | couvre contrôle fin et automatisation sans deux modèles de publication | faible |
| ADR-043 | Métadonnées et pochette importées sont éditables | l'instantané source est conservé séparément pour la provenance et la restauration | faible |
| ADR-044 | Les cadences V1 sont quotidienne, hebdomadaire et mensuelle | complétées par publication immédiate/date exacte et dates manuelles | faible |
| ADR-045 | Les séries n'ont pas de plafond produit initial | une fenêtre technique glissante évite de matérialiser une récurrence infinie | moyenne |
| ADR-046 | « À la demande » couvre maintenant et dates libres | l'utilisateur conserve contrôle immédiat et planification arbitraire | faible |
| ADR-047 | Catalogue et campagne possèdent deux niveaux d'édition | corrections durables dans le catalogue, personnalisation isolée dans la campagne | faible |
| ADR-048 | Les doublons identiques sous 24 heures déclenchent un avertissement | confirmation journalisée, sans blocage de la programmation | moyenne |
| ADR-049 | L'approbation d'une série ne périme pas | elle couvre toutes les occurrences de la révision jusqu'à révocation ou arrêt | moyenne |
| ADR-050 | La V1 notifie directement le téléphone par push | l'email est reporté à une version future | moyenne |
| ADR-051 | Un jour mensuel absent déborde au premier jour du mois suivant | l'heure locale et le jour d'ancrage de la série sont conservés | faible |
| ADR-052 | Annulation et modification possibles en état `PREPARING` | le job peut être stoppé jusqu'à la dernière seconde avant l'appel API | faible |
| ADR-053 | L'application possède un centre d'actions en attente | fallback V1 lorsque le push est refusé, indisponible ou manqué | faible |
| ADR-054 | Le push est envoyé uniquement à l'heure prévue | aucun rappel anticipé afin de limiter le flooding | faible |
| ADR-055 | Les actions simultanées sont présentées dans une liste | un lot de notification ouvre les publications attendant une action | faible |
| ADR-056 | La rétention active dépend du type de plan | récurrente jusqu'à la prochaine échéance ; ponctuelle jusqu'à la clôture mensuelle | faible |
| ADR-057 | La confirmation manuelle se fait en un clic | le clic est horodaté et audité, sans preuve distante obligatoire | faible |
| ADR-058 | Une occurrence manquée ne suspend pas la série | l'occurrence suivante remplace l'ancienne et le plan continue | faible |
| ADR-059 | Une action peut être ignorée explicitement | seule l'occurrence passe à `SKIPPED`, avec auteur et horodatage | faible |
| ADR-060 | La précision V1 est de zéro à cinq minutes après l'heure prévue | aucune publication anticipée ; objectif mesurable à 99 % | moyenne |
| ADR-061 | Chaque artiste possède une page lien en bio automatique | URL stable vers campagnes, Spotify, YouTube et billetterie | faible |
| ADR-062 | Une Story est publiée sans sticker si celui-ci n'est pas automatisable | le CTA renvoie vers le lien en bio et aucune étape manuelle n'est imposée | faible |
| ADR-063 | L'URL lien en bio est installée manuellement une seule fois | Thermidor actualise la page stable, pas le champ bio Instagram | faible |
| ADR-064 | La page publique reprend le modèle de présentation de Stan | profil, réseaux et cartes de liens ; aucun module e-commerce en V1 | moyenne |
| ADR-065 | Thermidor peut ajouter automatiquement le filigrane « Lien en bio » | transformation déterministe optionnelle du rendu Story, sans IA | faible |

## Points pouvant attendre l'implémentation

### D4 — Modèle économique

La marge par campagne est confirmée pour l'usage interne. Le choix facturation par agence, artiste ou volume peut attendre l'ouverture à des clients externes ; la V1 doit néanmoins mesurer stockage, minutes vidéo et publications par artiste.

### D5 — Précision de programmation

Décision : promettre une exécution entre l'heure prévue et cinq minutes après, jamais avant, pour 99 % des jobs éligibles. Mesurer la dérive réelle avant de resserrer l'objectif.

## État de préparation

Aucune question produit restante ne bloque le début du développement. Les choix de détail — ordre précis des cartes lien en bio, style du filigrane, microcopie et seuils opérationnels — seront traités pendant les sprints sans retarder le premier incrément vertical.

## Risques principaux

| Risque | Probabilité | Impact | Réponse |
|---|---:|---:|---|
| App Review Meta refusée ou retardée | élevée | élevé | spike et dossier Meta dès la phase 0 ; mode assisté conservé |
| Changement de politique ou format | élevée | élevé | registre versionné, tests contractuels, feature flags par capacité |
| Doubles publications après timeout | moyenne | critique | état `UNKNOWN`, réconciliation, idempotence et intervention humaine |
| Audio refusé, restreint ou rendu muet par Meta | élevée | élevé | préserver la piste, tester les comptes réels et afficher le statut plateforme |
| Compte pilote ou Page liée devenus inéligibles | faible à moyenne | élevé | contrôle à la connexion, santé du canal et reconnexion guidée |
| Création/invitations Facebook Event sans endpoint public confirmé | élevée | élevé | objectif V2, spike officiel/partenariat puis compagnon seulement après revue |
| Mauvais artiste ou mauvais compte sélectionné | moyenne | critique | cloisonnement, identité visuelle persistante et confirmation avant publication |
| Coûts vidéo supérieurs à l'estimation | moyenne | élevé | comptage par artiste, quotas et suivi des minutes transcodées |
| Produit trop large avant usage régulier | élevée | élevé | gates G0/G1/G2, Meta d'abord, aucun nouveau canal sans preuve |
| Fuite de jetons ou de contenus non publiés | faible à moyenne | critique | KMS, scopes minimaux, isolation, audit, URLs courtes et tests sécurité |
| Compagnon navigateur cassé par un changement d'interface | élevée | élevé | sélecteurs stricts, arrêt sûr, versioning, feature flag et kit manuel |
| Suspension liée à une automatisation non officielle | moyenne à élevée | critique | pilote limité, revue des conditions, confirmation et kill switch |
| Import de contacts sans base légale suffisante | moyenne | critique | permission explicite, registre de source, information et suppression |

## Critères de go/no-go

### Go pour la V1

- une agence/label opérateur constitue le pilote réel, d'abord avec un compte Business puis jusqu'à cinq artistes — **confirmé** ;
- les spikes Meta réussissent et les permissions ont un chemin de revue réaliste ;
- le temps actuel de préparation/publication est mesuré et suffisamment douloureux — **confirmé** ;
- les utilisateurs acceptent un compte professionnel et une validation humaine — **confirmé** ;
- le coût estimé par campagne laisse une marge avec le prix testé — **confirmé**.

### No-go ou pivot du noyau automatisé

- la majorité exige d'abord les groupes Facebook ou des profils personnels et refuse le mode assisté ;
- la valeur repose surtout sur l'achat publicitaire, non sur l'organique ;
- les comptes cibles sont massivement inéligibles aux API officielles ;
- aucun segment n'accepte de payer pour le gain de temps mesuré.

Dans ces cas, il vaut mieux pivoter vers un Content Studio + publication assistée/compagnon local que construire un moteur serveur fragile. Les besoins profils, groupes, WhatsApp personnel et pitch Spotify restent alors dans le produit, mais avec un niveau d'automatisation adapté à ce qui est autorisable.
