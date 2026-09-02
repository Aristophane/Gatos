import { SocialOAuthProvider, SocialPlatform, DiscoveredAccount, OAuthTokens } from "./types";

const GRAPH_API_VERSION = "v20.0";
const GRAPH_API_BASE = `https://graph.facebook.com/${GRAPH_API_VERSION}`;

const META_SCOPES = [
  "pages_show_list",
  "pages_read_engagement",
  "pages_manage_posts",
  "instagram_basic",
  "instagram_content_publish",
];

export class MetaOAuthProvider implements SocialOAuthProvider {
  readonly platform: SocialPlatform = "META";

  private appId = process.env.META_APP_ID || "mock_meta_app_id";
  private appSecret = process.env.META_APP_SECRET || "mock_meta_app_secret";

  async getAuthorizationUrl({ state, redirectUri }: { state: string; redirectUri: string }): Promise<string> {
    const isMock = this.appId === "mock_meta_app_id";
    if (isMock) {
      // Redirection interne vers callback mock
      return `${redirectUri}?code=mock_meta_auth_code_${Date.now()}&state=${encodeURIComponent(state)}`;
    }

    const params = new URLSearchParams({
      client_id: this.appId,
      redirect_uri: redirectUri,
      state,
      scope: META_SCOPES.join(","),
      response_type: "code",
    });

    return `https://www.facebook.com/${GRAPH_API_VERSION}/dialog/oauth?${params.toString()}`;
  }

  async exchangeCode(code: string, redirectUri: string): Promise<OAuthTokens> {
    const isMock = this.appId === "mock_meta_app_id" || code.startsWith("mock_");
    if (isMock) {
      return {
        accessToken: `mock_meta_user_token_${Date.now()}`,
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 jours
        scopes: META_SCOPES,
      };
    }

    // 1. Échange du code contre un token court terme
    const tokenUrl = `${GRAPH_API_BASE}/oauth/access_token?` + new URLSearchParams({
      client_id: this.appId,
      client_secret: this.appSecret,
      redirect_uri: redirectUri,
      code,
    });

    const res = await fetch(tokenUrl);
    const data = await res.json();
    if (!res.ok || data.error) {
      throw new Error(data.error?.message || "Échec de l'échange de token Meta");
    }

    const shortLivedToken = data.access_token;

    // 2. Échange contre un token longue durée (60 jours)
    const longLivedUrl = `${GRAPH_API_BASE}/oauth/access_token?` + new URLSearchParams({
      grant_type: "fb_exchange_token",
      client_id: this.appId,
      client_secret: this.appSecret,
      fb_exchange_token: shortLivedToken,
    });

    const longRes = await fetch(longLivedUrl);
    const longData = await longRes.json();
    const finalToken = longData.access_token || shortLivedToken;
    const expiresIn = longData.expires_in ? Number(longData.expires_in) * 1000 : 60 * 24 * 60 * 60 * 1000;

    return {
      accessToken: finalToken,
      expiresAt: new Date(Date.now() + expiresIn),
      scopes: META_SCOPES,
    };
  }

  async discoverAccounts(accessToken: string): Promise<DiscoveredAccount[]> {
    const isMock = accessToken.startsWith("mock_") || this.appId === "mock_meta_app_id";
    if (isMock) {
      // Simuler les comptes découverts pour le portefeuille de l'agence ou de l'artiste
      return [
        {
          provider: "INSTAGRAM_BUSINESS",
          externalAccountId: "ig_discovered_9901",
          name: "Aura Nova",
          handle: "@auranova_officiel",
          avatarUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=150&h=150&fit=crop",
          accessToken: `mock_ig_token_${Date.now()}`,
          scopes: ["instagram_basic", "instagram_content_publish"],
          metadata: { followers_count: 14200, category: "Musician/Band" },
        },
        {
          provider: "FACEBOOK_PAGE",
          externalAccountId: "fb_discovered_8801",
          name: "Aura Nova Official",
          avatarUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=150&h=150&fit=crop",
          accessToken: `mock_fb_page_token_${Date.now()}`,
          scopes: ["pages_show_list", "pages_manage_posts"],
          metadata: { category: "Music Band", fan_count: 5800 },
        },
        {
          provider: "INSTAGRAM_BUSINESS",
          externalAccountId: "ig_discovered_9902",
          name: "L'Ampli Bleu Paris",
          handle: "@ampli_bleu_paris",
          avatarUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=150&h=150&fit=crop",
          accessToken: `mock_ig_token_ampli_${Date.now()}`,
          scopes: ["instagram_basic", "instagram_content_publish"],
          metadata: { followers_count: 6300, category: "Concert Venue" },
        },
        {
          provider: "FACEBOOK_PAGE",
          externalAccountId: "fb_discovered_8802",
          name: "L'Ampli Bleu - Belleville",
          avatarUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=150&h=150&fit=crop",
          accessToken: `mock_fb_page_token_ampli_${Date.now()}`,
          scopes: ["pages_show_list", "pages_manage_posts"],
          metadata: { category: "Live Music Venue", fan_count: 4100 },
        },
      ];
    }

    // Appel réel à Meta Graph API /me/accounts
    const accountsUrl = `${GRAPH_API_BASE}/me/accounts?` + new URLSearchParams({
      fields: "id,name,access_token,category,picture{url},instagram_business_account{id,username,name,profile_picture_url}",
      access_token: accessToken,
    });

    const res = await fetch(accountsUrl);
    const data = await res.json();
    if (!res.ok || data.error) {
      throw new Error(data.error?.message || "Impossible de récupérer les comptes Meta.");
    }

    const discovered: DiscoveredAccount[] = [];

    interface MetaPageItem {
      id: string;
      name: string;
      access_token: string;
      category?: string;
      picture?: { data?: { url?: string } };
      instagram_business_account?: {
        id: string;
        username?: string;
        name?: string;
        profile_picture_url?: string;
      };
    }

    const pages: MetaPageItem[] = data.data || [];

    for (const page of pages) {
      // 1. Ajouter la Page Facebook
      discovered.push({
        provider: "FACEBOOK_PAGE",
        externalAccountId: page.id,
        name: page.name,
        avatarUrl: page.picture?.data?.url,
        accessToken: page.access_token,
        scopes: ["pages_manage_posts", "pages_read_engagement"],
        metadata: { category: page.category },
      });

      // 2. Si un compte Instagram Business est relié à cette Page
      if (page.instagram_business_account?.id) {
        const ig = page.instagram_business_account;
        discovered.push({
          provider: "INSTAGRAM_BUSINESS",
          externalAccountId: ig.id,
          name: ig.name || ig.username || page.name,
          handle: ig.username ? `@${ig.username}` : undefined,
          avatarUrl: ig.profile_picture_url || page.picture?.data?.url,
          accessToken: page.access_token, // Le token Page permet les actions sur l'IG lié
          scopes: ["instagram_basic", "instagram_content_publish"],
          metadata: { connectedFacebookPageId: page.id },
        });
      }
    }

    return discovered;
  }
}
