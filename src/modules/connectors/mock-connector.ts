import { PublishingConnector, Capabilities, PreparedPublication, PublishResult, ReconciliationResult } from "./types";

export class MockPublishingConnector implements PublishingConnector {
  constructor(private providerName: "INSTAGRAM" | "FACEBOOK") {}

  async getCapabilities(): Promise<Capabilities> {
    return {
      supportedFormats: ["FEED_POST", "REEL", "STORY"],
      maxVideoDurationSeconds: 90,
      maxCaptionLength: 2200,
      supportsAudioCatalog: true,
      supportsCustomAudio: true,
      supportsBioWatermark: true,
    };
  }

  async validate(draft: PreparedPublication): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];
    if (!draft.caption && draft.format !== "STORY") {
      errors.push("Une légende est obligatoire pour les publications et Reels.");
    }
    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  async publish(publication: PreparedPublication): Promise<PublishResult> {
    // Simuler une latence réseau
    await new Promise((resolve) => setTimeout(resolve, 600));

    const prefix = this.providerName === "INSTAGRAM" ? "ig" : "fb";
    const remotePostId = `${prefix}_post_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const permalinkUrl =
      this.providerName === "INSTAGRAM"
        ? `https://instagram.com/p/${remotePostId}`
        : `https://facebook.com/permalink.php?id=${remotePostId}`;

    return {
      remotePostId,
      permalinkUrl,
      rawResponse: {
        status: "ok",
        simulated: true,
        provider: this.providerName,
        format: publication.format,
        timestamp: new Date().toISOString(),
      },
    };
  }

  async reconcile(remotePostId: string): Promise<ReconciliationResult> {
    return {
      isPublished: true,
      remotePostId,
      permalinkUrl: `https://${this.providerName.toLowerCase()}.com/p/${remotePostId}`,
      metrics: {
        likes: Math.floor(Math.random() * 250) + 10,
        comments: Math.floor(Math.random() * 30) + 2,
        reach: Math.floor(Math.random() * 1200) + 100,
      },
    };
  }
}
