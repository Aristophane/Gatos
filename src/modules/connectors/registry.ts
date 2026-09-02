import { ChannelProvider } from "@prisma/client";
import { PublishingConnector } from "./types";
import { MetaPublishingConnector } from "./meta/meta-publisher";

class ConnectorRegistry {
  private connectors: Map<string, PublishingConnector> = new Map();

  constructor() {
    // Utilise le connecteur Meta réel (avec fallback automatique si token simulé)
    this.connectors.set("INSTAGRAM_BUSINESS", new MetaPublishingConnector("INSTAGRAM_BUSINESS"));
    this.connectors.set("FACEBOOK_PAGE", new MetaPublishingConnector("FACEBOOK_PAGE"));
  }

  getConnector(provider: ChannelProvider): PublishingConnector {
    const connector = this.connectors.get(provider);
    if (!connector) {
      throw new Error(`Aucun connecteur disponible pour le provider : ${provider}`);
    }
    return connector;
  }
}

export const connectorRegistry = new ConnectorRegistry();
