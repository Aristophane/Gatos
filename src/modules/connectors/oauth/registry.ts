import { SocialOAuthProvider, SocialPlatform } from "./types";
import { MetaOAuthProvider } from "./meta-provider";

class OAuthProviderRegistry {
  private providers: Map<SocialPlatform, SocialOAuthProvider> = new Map();

  constructor() {
    this.register(new MetaOAuthProvider());
    // Dans le futur :
    // this.register(new TwitterOAuthProvider());
    // this.register(new SnapchatOAuthProvider());
    // this.register(new TikTokOAuthProvider());
  }

  register(provider: SocialOAuthProvider) {
    this.providers.set(provider.platform, provider);
  }

  get(platform: SocialPlatform): SocialOAuthProvider {
    const provider = this.providers.get(platform);
    if (!provider) {
      throw new Error(`Aucun fournisseur OAuth configuré pour la plateforme : ${platform}`);
    }
    return provider;
  }

  getAllSupportedPlatforms(): SocialPlatform[] {
    return Array.from(this.providers.keys());
  }
}

export const oauthRegistry = new OAuthProviderRegistry();
