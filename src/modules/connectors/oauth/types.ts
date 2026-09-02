import { ChannelProvider } from "@prisma/client";

export type SocialPlatform = "META" | "X_TWITTER" | "SNAPCHAT" | "TIKTOK";

export interface DiscoveredAccount {
  provider: ChannelProvider;
  externalAccountId: string;
  name: string;
  handle?: string;
  avatarUrl?: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
  scopes: string[];
  metadata?: Record<string, unknown>;
}

export interface OAuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
  scopes: string[];
}

export interface SocialOAuthProvider {
  readonly platform: SocialPlatform;
  getAuthorizationUrl(params: { state: string; redirectUri: string }): Promise<string>;
  exchangeCode(code: string, redirectUri: string): Promise<OAuthTokens>;
  discoverAccounts(accessToken: string): Promise<DiscoveredAccount[]>;
}
