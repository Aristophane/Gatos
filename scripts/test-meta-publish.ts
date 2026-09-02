/**
 * Script de test / Spike de publication Meta (Instagram Business + Facebook Page)
 * Valide concrètement la capacité à poster sur deux réseaux distincts.
 * 
 * Usage :
 * pnpm tsx scripts/test-meta-publish.ts
 * 
 * Avec vrais identifiants Meta (Graph API v20+) :
 * $env:TEST_META_ACCESS_TOKEN="EAA..."
 * $env:TEST_IG_USER_ID="178414..."
 * $env:TEST_FB_PAGE_ID="102938..."
 * pnpm tsx scripts/test-meta-publish.ts
 */

import { MetaPublishingConnector } from "../src/modules/connectors/meta/meta-publisher";

async function runMetaSpike() {
  console.log("=================================================");
  console.log("🚀 SPIKE META : VALIDATION MULTIPOSTING REEL / POST");
  console.log("   Réseau 1 : Instagram Business");
  console.log("   Réseau 2 : Facebook Page");
  console.log("=================================================\n");

  const accessToken = process.env.TEST_META_ACCESS_TOKEN || "mock_token_spike";
  const igUserId = process.env.TEST_IG_USER_ID || "mock_ig_account_9988";
  const fbPageId = process.env.TEST_FB_PAGE_ID || "mock_fb_page_4433";

  const isReal = !accessToken.startsWith("mock_");
  console.log(`📡 Mode d'exécution : ${isReal ? "🟢 RÉEL (Meta Graph API v20+)" : "🟡 SIMULÉ (Mock Pipeline)"}`);
  if (isReal) {
    console.log(`- Token fourni : ${accessToken.substring(0, 10)}...`);
    console.log(`- Instagram Business ID : ${igUserId}`);
    console.log(`- Facebook Page ID : ${fbPageId}\n`);
  } else {
    console.log(`ℹ️ Aucun token Meta réel détecté dans $env:TEST_META_ACCESS_TOKEN.`);
    console.log(`  Exécutez le script avec vos identifiants réels pour valider les endpoints distants.\n`);
  }

  const sampleMedia = "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1080&h=1080&fit=crop";
  const sampleCaption = `[Thermidor Spike ${new Date().toLocaleTimeString()}] Test de publication synchronisée multi-réseaux 🎵 #ThermidorMultiposting`;

  // 1. TEST INSTAGRAM BUSINESS
  console.log("--- [1/2] TEST INSTAGRAM BUSINESS ---");
  const igConnector = new MetaPublishingConnector("INSTAGRAM_BUSINESS");
  try {
    console.log("⏳ Création et publication sur Instagram...");
    const igResult = await igConnector.publish({
      targetId: "spike_target_ig",
      externalAccountId: igUserId,
      accessToken,
      format: "FEED_POST",
      caption: sampleCaption,
      mediaUrl: sampleMedia,
    });
    console.log("✅ SUCCÈS INSTAGRAM !");
    console.log(`   - Remote Post ID : ${igResult.remotePostId}`);
    console.log(`   - Lien Instagram : ${igResult.permalinkUrl}`);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("❌ ÉCHEC INSTAGRAM :", msg);
  }

  console.log("\n-------------------------------------\n");

  // 2. TEST FACEBOOK PAGE
  console.log("--- [2/2] TEST FACEBOOK PAGE ---");
  const fbConnector = new MetaPublishingConnector("FACEBOOK_PAGE");
  try {
    console.log("⏳ Création et publication sur la Page Facebook...");
    const fbResult = await fbConnector.publish({
      targetId: "spike_target_fb",
      externalAccountId: fbPageId,
      accessToken,
      format: "FEED_POST",
      caption: sampleCaption,
      mediaUrl: sampleMedia,
    });
    console.log("✅ SUCCÈS FACEBOOK PAGE !");
    console.log(`   - Remote Post ID : ${fbResult.remotePostId}`);
    console.log(`   - Lien Facebook  : ${fbResult.permalinkUrl}`);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("❌ ÉCHEC FACEBOOK :", msg);
  }

  console.log("\n=================================================");
  console.log("🏁 FIN DU SPIKE DE PUBLICATION MULTI-RÉSEAUX");
  console.log("=================================================");
}

runMetaSpike().catch(console.error);
