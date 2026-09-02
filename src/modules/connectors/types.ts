export type SupportedFormat = "FEED_POST" | "REEL" | "STORY";

export interface Capabilities {
  supportedFormats: SupportedFormat[];
  maxVideoDurationSeconds: number;
  maxCaptionLength: number;
  supportsAudioCatalog: boolean;
  supportsCustomAudio: boolean;
  supportsBioWatermark: boolean;
}

export interface PreparedPublication {
  targetId: string;
  externalAccountId: string;
  accessToken?: string;
  format: SupportedFormat;
  caption: string;
  mediaUrl?: string;
  audioCatalogId?: string;
  hasBioWatermark?: boolean;
}

export interface PublishResult {
  remotePostId: string;
  permalinkUrl: string;
  rawResponse?: Record<string, unknown>;
}

export interface ReconciliationResult {
  isPublished: boolean;
  remotePostId: string;
  permalinkUrl?: string;
  metrics?: {
    likes?: number;
    comments?: number;
    reach?: number;
  };
}

export interface PublishingConnector {
  getCapabilities(accountId: string): Promise<Capabilities>;
  validate(draft: PreparedPublication): Promise<{ isValid: boolean; errors: string[] }>;
  publish(publication: PreparedPublication): Promise<PublishResult>;
  reconcile(remotePostId: string): Promise<ReconciliationResult>;
}
