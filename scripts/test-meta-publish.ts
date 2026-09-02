/**
 * Script de test / Spike de publication Meta (Instagram Business + Facebook Page)
 * Valide concrètement la capacité à poster sur deux réseaux distincts via Meta Graph API v20+.
 */

try {
  // Charge automatiquement le fichier .env
  process.loadEnvFile?.(".env");
} catch {
  // Ignoré si le fichier est absent
}

import { MetaPublishingConnector } from "../src/modules/connectors/meta/meta-publisher";

const GRAPH_API_VERSION = "v20.0";
const GRAPH_API_BASE = `https://graph.facebook.com/${GRAPH_API_VERSION}`;

async function runMetaSpike() {
  console.log("=================================================");
  console.log("🚀 SPIKE META : VALIDATION MULTIPOSTING CROISÉ");
  console.log("   Réseau 1 : Instagram Business");
  console.log("   Réseau 2 : Facebook Page");
  console.log("=================================================\n");

  const rawToken = process.env.TEST_META_ACCESS_TOKEN;
  let igUserId = process.env.TEST_IG_USER_ID;
  let fbPageId = process.env.TEST_FB_PAGE_ID;
  let fbPageToken = rawToken;

  if (!rawToken || rawToken.startsWith("mock_")) {
    console.log("🟡 MODE SIMULATION ACTIVÉ");
    console.log("ℹ️ La variable TEST_META_ACCESS_TOKEN n'est pas encore renseignée dans votre .env.");
    console.log("   Pour tester avec vos vrais comptes Meta :");
    console.log("   1. Rendez-vous sur : https://developers.facebook.com/tools/explorer/");
    console.log("   2. Sélectionnez votre application (ID: " + (process.env.META_APP_ID || "1470274654633106") + ")");
    console.log("   3. Ajoutez les permissions : pages_show_list, pages_read_engagement, pages_manage_posts, instagram_basic, instagram_content_publish");
    console.log("   4. Cliquez sur 'Generate Access Token'");
    console.log("   5. Ajoutez dans votre .env : TEST_META_ACCESS_TOKEN=\"EAA...\"");
    console.log("   Le script auto-détectera vos comptes Instagram et Facebook !\n");

    // Lancer la simulation pour valider la logique
    await executePublish("mock_token", "mock_ig_123", "mock_fb_456", "mock_token");
    return;
  }

  console.log("🟢 MODE RÉEL DÉTECTÉ (Token présent dans .env)");
  console.log(`- Token utilisateur : ${rawToken.substring(0, 15)}...`);

  // Auto-découverte des comptes si les IDs ne sont pas spécifiés manuellement
  if (!igUserId || !fbPageId) {
    console.log("🔍 Auto-détection de vos Pages Facebook et comptes Instagram associés...");
    try {
      const accountsUrl = `${GRAPH_API_BASE}/me/accounts?fields=id,name,access_token,instagram_business_account{id,username}&access_token=${rawToken}`;
      const res = await fetch(accountsUrl);
      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error?.message || JSON.stringify(data));
      }

      const pages = data.data || [];
      if (pages.length === 0) {
        console.warn("⚠️ Aucune Page Facebook trouvée pour ce compte.");
        console.warn("   Assurez-vous que votre compte Facebook administre au moins une Page.");
        return;
      }

      // Sélectionner la première page disponible
      const selectedPage = pages[0];
      fbPageId = selectedPage.id;
      fbPageToken = selectedPage.access_token || rawToken;
      console.log(`✅ Page Facebook trouvée : "${selectedPage.name}" (ID: ${fbPageId})`);

      // Vérifier si un compte Instagram Business est lié à cette page
      if (selectedPage.instagram_business_account?.id) {
        igUserId = selectedPage.instagram_business_account.id;
        console.log(`✅ Compte Instagram Business trouvé : @${selectedPage.instagram_business_account.username || igUserId} (ID: ${igUserId})`);
      } else {
        // Chercher dans les autres pages
        for (const p of pages) {
          if (p.instagram_business_account?.id) {
            igUserId = p.instagram_business_account.id;
            console.log(`✅ Compte Instagram Business trouvé via la page "${p.name}" : (ID: ${igUserId})`);
            break;
          }
        }
      }

      if (!igUserId) {
        console.warn("⚠️ Aucun compte Instagram Business n'est relié à vos Pages Facebook.");
        console.warn("   Pour publier sur Instagram, le compte doit être Professionnel et relié à une Page.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("❌ Erreur lors de la détection automatique des comptes :", msg);
      return;
    }
  }

  console.log("\n🚀 Lancement de la publication réelle...");
  await executePublish(rawToken, igUserId, fbPageId, fbPageToken);
}

async function executePublish(userToken: string, igUserId?: string, fbPageId?: string, fbPageToken?: string) {
  const sampleMedia = "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1080&h=1080&fit=crop";
  const sampleCaption = `[Thermidor Test ${new Date().toLocaleTimeString()}] Publication synchronisée multi-réseaux 🎵 #Thermidor`;

  // 1. INSTAGRAM BUSINESS
  console.log("\n--- [1/2] TEST PUBLICATION INSTAGRAM BUSINESS ---");
  if (!igUserId) {
    console.log("⏭️ Test Instagram sauté (aucun identifiant de compte Instagram Business)");
  } else {
    const igConnector = new MetaPublishingConnector("INSTAGRAM_BUSINESS");
    try {
      console.log(`⏳ Envoi vers Instagram (ID: ${igUserId})...`);
      const igResult = await igConnector.publish({
        targetId: "spike_target_ig",
        externalAccountId: igUserId,
        accessToken: fbPageToken || userToken,
        format: "FEED_POST",
        caption: sampleCaption,
        mediaUrl: sampleMedia,
      });
      console.log("🎉 SUCCÈS INSTAGRAM !");
      console.log(`   - Identifiant distant : ${igResult.remotePostId}`);
      console.log(`   - Permalien public    : ${igResult.permalinkUrl}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("❌ ERREUR INSTAGRAM :", msg);
    }
  }

  // 2. FACEBOOK PAGE
  console.log("\n--- [2/2] TEST PUBLICATION PAGE FACEBOOK ---");
  if (!fbPageId) {
    console.log("⏭️ Test Facebook sauté (aucun identifiant de Page Facebook)");
  } else {
    const fbConnector = new MetaPublishingConnector("FACEBOOK_PAGE");
    try {
      console.log(`⏳ Envoi vers la Page Facebook (ID: ${fbPageId})...`);
      const fbResult = await fbConnector.publish({
        targetId: "spike_target_fb",
        externalAccountId: fbPageId,
        accessToken: fbPageToken || userToken,
        format: "FEED_POST",
        caption: sampleCaption,
        mediaUrl: sampleMedia,
      });
      console.log("🎉 SUCCÈS FACEBOOK PAGE !");
      console.log(`   - Identifiant distant : ${fbResult.remotePostId}`);
      console.log(`   - Permalien public    : ${fbResult.permalinkUrl}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("❌ ERREUR FACEBOOK :", msg);
    }
  }

  console.log("\n=================================================");
  console.log("🏁 VALIDATION DE PUBLICATION TERMINÉE");
  console.log("=================================================");
}

runMetaSpike().catch(console.error);
