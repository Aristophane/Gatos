import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Début du seed Thermidor...");

  // Nettoyage préalable si nécessaire
  await prisma.outboxEvent.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.publishAttempt.deleteMany();
  await prisma.remotePost.deleteMany();
  await prisma.publicationTarget.deleteMany();
  await prisma.publicationOccurrence.deleteMany();
  await prisma.publicationPlan.deleteMany();
  await prisma.contentVariantAsset.deleteMany();
  await prisma.contentVariant.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.assetRendition.deleteMany();
  await prisma.asset.deleteMany();
  await prisma.catalogItem.deleteMany();
  await prisma.linkItem.deleteMany();
  await prisma.linkPage.deleteMany();
  await prisma.oAuthCredential.deleteMany();
  await prisma.channelConnection.deleteMany();
  await prisma.profileAccess.deleteMany();
  await prisma.membership.deleteMany();
  await prisma.managedProfile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.agencyWorkspace.deleteMany();

  // 1. Création de l'Espace Agence
  const agency = await prisma.agencyWorkspace.create({
    data: {
      name: "Thermidor Studios",
      slug: "thermidor-studios",
    },
  });

  // 2. Création de l'Utilisateur Agence (Admin)
  const agencyUser = await prisma.user.create({
    data: {
      name: "Sophie Laurent",
      email: "sophie@thermidor.studio",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
      memberships: {
        create: {
          agencyWorkspaceId: agency.id,
          role: "OWNER",
        },
      },
    },
  });

  // 3. Création des 5 Profils Gérés
  // Profil 1 : Pilote Meta (Aura Nova - Mode Délégué)
  const auraNova = await prisma.managedProfile.create({
    data: {
      agencyWorkspaceId: agency.id,
      name: "Aura Nova",
      slug: "aura-nova",
      type: "ARTIST",
      delegationMode: "DELEGATED",
      mandateStatus: "ACTIVE",
      mandateGrantedAt: new Date("2026-08-01"),
      mandateGrantedByEmail: "contact@auranova.com",
      mandateToken: "mandate_aura_nova_demo",
      bio: "Duo pop électronique futuriste. Prochain album 'Éclipse' en préparation.",
      brandColor: "#f43f5e",
      avatarUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=300&fit=crop",
      socialLinks: {
        instagram: "https://instagram.com/auranova_officiel",
        facebook: "https://facebook.com/auranovaofficial",
        spotify: "https://open.spotify.com/artist/aura-nova",
      },
      channelConnections: {
        create: [
          {
            provider: "INSTAGRAM_BUSINESS",
            externalAccountId: "ig_aura_nova_99",
            externalAccountName: "@auranova_officiel",
            isConnected: true,
            credential: {
              create: {
                encryptedToken: "mock_encrypted_ig_token_aura_nova",
                scopes: ["instagram_basic", "instagram_content_publish"],
              },
            },
          },
          {
            provider: "FACEBOOK_PAGE",
            externalAccountId: "fb_page_aura_nova_44",
            externalAccountName: "Aura Nova Band",
            isConnected: true,
            credential: {
              create: {
                encryptedToken: "mock_encrypted_fb_token_aura_nova",
                scopes: ["pages_show_list", "pages_read_engagement", "pages_manage_posts"],
              },
            },
          },
        ],
      },
      linkPage: {
        create: {
          slug: "aura-nova",
          title: "Aura Nova",
          bio: "Écoutez notre dernier single 'Neon Rain' et réservez vos places pour la Maroquinerie !",
          avatarUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=300&fit=crop",
          isPublished: true,
          linkItems: {
            create: [
              {
                title: "🎵 Écouter le single 'Neon Rain' sur Spotify",
                url: "https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT",
                type: "CATALOG",
                order: 1,
              },
              {
                title: "🎟️ Concert à La Maroquinerie (Paris) - Billetterie",
                url: "https://dice.fm/event/aura-nova-paris",
                type: "TICKETING",
                order: 2,
              },
              {
                title: "🎬 Regarder le clip officiel sur YouTube",
                url: "https://youtube.com/watch?v=dQw4w9WgXcQ",
                type: "CUSTOM",
                order: 3,
              },
            ],
          },
        },
      },
    },
    include: {
      channelConnections: true,
    },
  });

  // Profil 2 : Komorebi Club (Artiste - Mode Autonome)
  await prisma.managedProfile.create({
    data: {
      agencyWorkspaceId: agency.id,
      name: "Komorebi Club",
      slug: "komorebi-club",
      type: "ARTIST",
      delegationMode: "AUTONOMOUS",
      mandateStatus: "NOT_REQUIRED",
      bio: "Lo-Fi Beats & Ambient Jazz.",
      brandColor: "#0284c7",
      avatarUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop",
      linkPage: {
        create: {
          slug: "komorebi-club",
          title: "Komorebi Club",
          bio: "Chill beats to relax/study to.",
          isPublished: true,
        },
      },
    },
  });

  // Profil 3 : L'Ampli Bleu (Lieu / Salle de concert - Mode Délégué)
  await prisma.managedProfile.create({
    data: {
      agencyWorkspaceId: agency.id,
      name: "L'Ampli Bleu",
      slug: "l-ampli-bleu",
      type: "VENUE",
      delegationMode: "DELEGATED",
      mandateStatus: "ACTIVE",
      mandateGrantedAt: new Date("2026-08-10"),
      mandateGrantedByEmail: "booking@amplibleu.fr",
      bio: "Scène indie rock & cocktails maison au cœur de Belleville.",
      brandColor: "#7c3aed",
      avatarUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop",
      linkPage: {
        create: {
          slug: "l-ampli-bleu",
          title: "L'Ampli Bleu - Concerts & Bar",
          bio: "Programmation des concerts de la semaine et réservation.",
          isPublished: true,
        },
      },
    },
  });

  // Profil 4 : Solène & The Waves (Artiste - Mode Délégué, Mandat en Attente)
  await prisma.managedProfile.create({
    data: {
      agencyWorkspaceId: agency.id,
      name: "Solène & The Waves",
      slug: "solene-waves",
      type: "ARTIST",
      delegationMode: "DELEGATED",
      mandateStatus: "PENDING",
      mandateToken: "mandate_solene_waves_demo",
      bio: "Indie Surf Pop.",
      brandColor: "#10b981",
      avatarUrl: "https://images.unsplash.com/photo-1520523839898-50712825e3a7?w=300&h=300&fit=crop",
    },
  });

  // Profil 5 : Milo Vesper (Artiste - Mode Autonome)
  await prisma.managedProfile.create({
    data: {
      agencyWorkspaceId: agency.id,
      name: "Milo Vesper",
      slug: "milo-vesper",
      type: "ARTIST",
      delegationMode: "AUTONOMOUS",
      mandateStatus: "NOT_REQUIRED",
      bio: "Folk acoustique & récits de voyage.",
      brandColor: "#d97706",
      avatarUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop",
    },
  });

  // 4. Création d'un élément de catalogue pour Aura Nova
  const catalogNeonRain = await prisma.catalogItem.create({
    data: {
      managedProfileId: auraNova.id,
      sourceProvider: "SPOTIFY",
      canonicalUrl: "https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT",
      externalId: "4cOdK2wGLETKBW3PvgPWqT",
      title: "Neon Rain",
      releaseDate: new Date("2026-08-15"),
      thumbnailUrl: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=600&h=600&fit=crop",
      sourceMetadataSnapshot: {
        artist: "Aura Nova",
        album: "Éclipse (EP)",
        duration_ms: 215000,
      },
    },
  });

  // 5. Création d'un Asset d'exemple (Pochette)
  const coverAsset = await prisma.asset.create({
    data: {
      managedProfileId: auraNova.id,
      catalogItemId: catalogNeonRain.id,
      originalFilename: "cover-neon-rain.jpg",
      mimeType: "image/jpeg",
      sizeBytes: BigInt(1250000),
      s3Key: "uploads/aura-nova/cover-neon-rain.jpg",
      publicUrl: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=1080&h=1080&fit=crop",
      width: 1080,
      height: 1080,
      hasAudio: false,
      renditions: {
        create: [
          {
            ratio: "RATIO_1_1",
            mimeType: "image/jpeg",
            s3Key: "renditions/aura-nova/cover-neon-rain-1x1.jpg",
            publicUrl: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=1080&h=1080&fit=crop",
            width: 1080,
            height: 1080,
          },
          {
            ratio: "RATIO_9_16",
            mimeType: "image/jpeg",
            s3Key: "renditions/aura-nova/cover-neon-rain-9x16.jpg",
            publicUrl: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=1080&h=1920&fit=crop",
            width: 1080,
            height: 1920,
          },
        ],
      },
    },
    include: {
      renditions: true,
    },
  });

  // 6. Création de la première Campagne V1 : SINGLE_RELEASE
  const campaign = await prisma.campaign.create({
    data: {
      managedProfileId: auraNova.id,
      catalogItemId: catalogNeonRain.id,
      title: "Sortie du Single 'Neon Rain'",
      scenario: "SINGLE_RELEASE",
      status: "ACTIVE",
      startDate: new Date(),
    },
  });

  // Variantes de contenu : 1 Instagram Reel + 1 Facebook Page Post
  const igReelVariant = await prisma.contentVariant.create({
    data: {
      campaignId: campaign.id,
      network: "INSTAGRAM",
      format: "REEL",
      caption: "« Neon Rain » est enfin disponible partout ! 🌧️✨ Lien en bio pour écouter le titre sur Spotify. #AuraNova #ElectroPop #NewMusic",
      hasBioWatermark: true,
      audioCatalogId: "audio_meta_track_9988",
      audioCatalogTitle: "Aura Nova - Neon Rain",
      assets: {
        create: {
          assetId: coverAsset.id,
          assetRenditionId: coverAsset.renditions.find((r) => r.ratio === "RATIO_9_16")?.id,
          order: 0,
        },
      },
    },
  });

  const fbPostVariant = await prisma.contentVariant.create({
    data: {
      campaignId: campaign.id,
      network: "FACEBOOK",
      format: "FEED_POST",
      caption: "Notre nouveau single « Neon Rain » est sorti ! Découvrez l'univers de notre prochain album. Lien d'écoute en premier commentaire.",
      assets: {
        create: {
          assetId: coverAsset.id,
          assetRenditionId: coverAsset.renditions.find((r) => r.ratio === "RATIO_1_1")?.id,
          order: 0,
        },
      },
    },
  });

  // Plan de publication immédiate
  const plan = await prisma.publicationPlan.create({
    data: {
      campaignId: campaign.id,
      scheduleMode: "NOW",
      timezone: "Europe/Paris",
    },
  });

  // Occurrence prête pour l'Instagram Reel
  const igConnection = auraNova.channelConnections.find((c) => c.provider === "INSTAGRAM_BUSINESS");
  if (igConnection) {
    await prisma.publicationOccurrence.create({
      data: {
        publicationPlanId: plan.id,
        contentVariantId: igReelVariant.id,
        scheduledAt: new Date(),
        status: "SCHEDULED",
        approvedByUserId: agencyUser.id,
        approvedAt: new Date(),
        targets: {
          create: {
            channelConnectionId: igConnection.id,
            destinationType: "OFFICIAL_API",
            status: "PENDING",
          },
        },
      },
    });
  }

  // Occurrence prête pour le Post Facebook
  const fbConnection = auraNova.channelConnections.find((c) => c.provider === "FACEBOOK_PAGE");
  if (fbConnection) {
    await prisma.publicationOccurrence.create({
      data: {
        publicationPlanId: plan.id,
        contentVariantId: fbPostVariant.id,
        scheduledAt: new Date(),
        status: "SCHEDULED",
        approvedByUserId: agencyUser.id,
        approvedAt: new Date(),
        targets: {
          create: {
            channelConnectionId: fbConnection.id,
            destinationType: "OFFICIAL_API",
            status: "PENDING",
          },
        },
      },
    });
  }

  console.log("✅ Seed complété avec succès !");
  console.log(`- Agence : ${agency.name} (id: ${agency.id})`);
  console.log(`- 5 Profils créés : Aura Nova (Pilote), Komorebi Club, L'Ampli Bleu, Solène & The Waves, Milo Vesper`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
