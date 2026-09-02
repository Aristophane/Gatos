import { ChannelProvider } from "@prisma/client";
import { PublishingConnector } from "./types";
import { MockPublishingConnector } from "./mock-connector";

class ConnectorRegistry {
  private connectors: Map<string, PublishingConnector> = new Map();

  constructor() {
    // Par défaut en dev/test, on injecte les mocks
    this.connectors.set("INSTAGRAM_BUSINESS", new MockPublishingConnector("INSTAGRAM"));
    this.connectors.set("FACEBOOK_PAGE", new MockPublishingConnector("FACEBOOK"));
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
