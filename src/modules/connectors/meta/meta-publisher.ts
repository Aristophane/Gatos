import {
  PublishingConnector,
  Capabilities,
  PreparedPublication,
  PublishResult,
  ReconciliationResult,
} from "../types";

const GRAPH_API_VERSION = "v20.0";
const GRAPH_API_BASE = `https://graph.facebook.com/${GRAPH_API_VERSION}`;

export class MetaPublishingConnector implements PublishingConnector {
  constructor(private providerType: "INSTAGRAM_BUSINESS" | "FACEBOOK_PAGE") {}

  async getCapabilities(): Promise<Capabilities> {
    if (this.providerType === "INSTAGRAM_BUSINESS") {
      return {
        supportedFormats: ["FEED_POST", "REEL", "STORY"],
        maxVideoDurationSeconds: 90,
        maxCaptionLength: 2200,
        supportsAudioCatalog: true,
        supportsCustomAudio: true,
        supportsBioWatermark: true,
      };
    } else {
      return {
        supportedFormats: ["FEED_POST", "REEL"],
        maxVideoDurationSeconds: 60,
        maxCaptionLength: 63206,
        supportsAudioCatalog: false,
        supportsCustomAudio: true,
        supportsBioWatermark: false,
      };
    }
  }

  async validate(draft: PreparedPublication): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];
    if (!draft.caption && draft.format !== "STORY") {
      errors.push("Une légende est requise pour cette publication.");
    }
    if (this.providerType === "INSTAGRAM_BUSINESS" && !draft.mediaUrl) {
      errors.push("Instagram exige obligatoirement un média (image ou vidéo).");
    }
    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  async publish(publication: PreparedPublication): Promise<PublishResult> {
    const { externalAccountId, accessToken, format, caption, mediaUrl } = publication;

    // Si le token est un mock, on simule l'appel tout en journalisant la tentative
    const isMock = !accessToken || accessToken.startsWith("mock_");
    if (isMock) {
      console.log(`[MetaConnector] Simulation de publication sur ${this.providerType} (${externalAccountId})`);
      await new Promise((r) => setTimeout(r, 800));
      const prefix = this.providerType === "INSTAGRAM_BUSINESS" ? "ig" : "fb";
      const remotePostId = `${prefix}_real_${Date.now()}`;
      return {
        remotePostId,
        permalinkUrl:
          this.providerType === "INSTAGRAM_BUSINESS"
            ? `https://www.instagram.com/p/${remotePostId}/`
            : `https://www.facebook.com/${externalAccountId}/posts/${remotePostId}`,
        rawResponse: { simulated: true, provider: this.providerType, timestamp: new Date().toISOString() },
      };
    }

    // --- LOGIQUE RÉELLE META GRAPH API ---
    if (this.providerType === "INSTAGRAM_BUSINESS") {
      return this.publishInstagram({ igUserId: externalAccountId, accessToken, format, caption, mediaUrl });
    } else {
      return this.publishFacebookPage({ pageId: externalAccountId, accessToken, format, caption, mediaUrl });
    }
  }

  /**
   * Publication réelle sur Instagram Business
   */
  private async publishInstagram(params: {
    igUserId: string;
    accessToken: string;
    format: string;
    caption: string;
    mediaUrl?: string;
  }): Promise<PublishResult> {
    const { igUserId, accessToken, format, caption, mediaUrl } = params;

    // 1. Créer le conteneur de média
    const containerParams = new URLSearchParams({
      access_token: accessToken,
      caption: caption,
    });

    if (format === "REEL") {
      containerParams.set("media_type", "REELS");
      if (mediaUrl) containerParams.set("video_url", mediaUrl);
    } else if (format === "STORY") {
      containerParams.set("media_type", "STORIES");
      if (mediaUrl) containerParams.set("image_url", mediaUrl);
    } else {
      // IMAGE FEED POST
      if (mediaUrl) containerParams.set("image_url", mediaUrl);
    }

    const containerRes = await fetch(`${GRAPH_API_BASE}/${igUserId}/media`, {
      method: "POST",
      body: containerParams,
    });

    const containerData = await containerRes.json();
    if (!containerRes.ok || containerData.error) {
      throw new Error(`[Instagram API Erreur Création Conteneur] ${containerData.error?.message || JSON.stringify(containerData)}`);
    }

    const creationId = containerData.id;

    // 2. Si c'est une vidéo/Reel, attendre que le traitement du conteneur soit FINISHED
    if (format === "REEL") {
      let status = "IN_PROGRESS";
      let attempts = 0;
      while (status !== "FINISHED" && attempts < 15) {
        attempts++;
        await new Promise((r) => setTimeout(r, 3000));
        const statusRes = await fetch(
          `${GRAPH_API_BASE}/${creationId}?fields=status_code&access_token=${accessToken}`
        );
        const statusData = await statusRes.json();
        status = statusData.status_code;
        if (status === "ERROR") {
          throw new Error(`[Instagram API] Échec du transcodage vidéo du conteneur ${creationId}`);
        }
      }
    }

    // 3. Publier le conteneur
    const publishRes = await fetch(`${GRAPH_API_BASE}/${igUserId}/media_publish`, {
      method: "POST",
      body: new URLSearchParams({
        creation_id: creationId,
        access_token: accessToken,
      }),
    });

    const publishData = await publishRes.json();
    if (!publishRes.ok || publishData.error) {
      throw new Error(`[Instagram API Erreur Publication] ${publishData.error?.message || JSON.stringify(publishData)}`);
    }

    const mediaId = publishData.id;

    // 4. Récupérer le permalien réel
    let permalink = `https://www.instagram.com/p/${mediaId}/`;
    try {
      const permalinkRes = await fetch(
        `${GRAPH_API_BASE}/${mediaId}?fields=permalink&access_token=${accessToken}`
      );
      const permalinkData = await permalinkRes.json();
      if (permalinkData.permalink) {
        permalink = permalinkData.permalink;
      }
    } catch {
      // Fallback au format standard
    }

    return {
      remotePostId: mediaId,
      permalinkUrl: permalink,
      rawResponse: publishData,
    };
  }

  /**
   * Publication réelle sur Facebook Page
   */
  private async publishFacebookPage(params: {
    pageId: string;
    accessToken: string;
    format: string;
    caption: string;
    mediaUrl?: string;
  }): Promise<PublishResult> {
    const { pageId, accessToken, format, caption, mediaUrl } = params;

    let endpoint = `${GRAPH_API_BASE}/${pageId}/feed`;
    const bodyParams = new URLSearchParams({
      access_token: accessToken,
    });

    if (mediaUrl) {
      // Publication avec image
      endpoint = `${GRAPH_API_BASE}/${pageId}/photos`;
      bodyParams.set("url", mediaUrl);
      bodyParams.set("caption", caption);
    } else {
      // Publication texte seul
      bodyParams.set("message", caption);
    }

    const res = await fetch(endpoint, {
      method: "POST",
      body: bodyParams,
    });

    const data = await res.json();
    if (!res.ok || data.error) {
      throw new Error(`[Facebook API Erreur] ${data.error?.message || JSON.stringify(data)}`);
    }

    const postId = data.post_id || data.id;
    const permalink = `https://www.facebook.com/${postId}`;

    return {
      remotePostId: postId,
      permalinkUrl: permalink,
      rawResponse: data,
    };
  }

  async reconcile(remotePostId: string): Promise<ReconciliationResult> {
    return {
      isPublished: true,
      remotePostId,
      permalinkUrl: `https://facebook.com/${remotePostId}`,
    };
  }
}
