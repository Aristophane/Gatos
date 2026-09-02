import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { encryptString } from "@/lib/crypto";
import { DiscoveredAccount } from "@/modules/connectors/oauth/types";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { managedProfileId, account }: { managedProfileId: string; account: DiscoveredAccount } = body;

    if (!managedProfileId || !account) {
      return NextResponse.json({ error: "Paramètres invalides" }, { status: 400 });
    }

    const profile = await prisma.managedProfile.findUnique({
      where: { id: managedProfileId },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profil artiste introuvable" }, { status: 404 });
    }

    // Chiffrement du token au repos via AES-256-GCM
    const encryptedToken = encryptString(account.accessToken);
    const encryptedRefreshToken = account.refreshToken ? encryptString(account.refreshToken) : null;

    // Création ou mise à jour de la connexion
    const connection = await prisma.channelConnection.upsert({
      where: {
        managedProfileId_provider_externalAccountId: {
          managedProfileId,
          provider: account.provider,
          externalAccountId: account.externalAccountId,
        },
      },
      update: {
        externalAccountName: account.handle || account.name,
        isConnected: true,
        lastCheckedAt: new Date(),
        credential: {
          upsert: {
            create: {
              encryptedToken,
              encryptedRefreshToken,
              expiresAt: account.expiresAt,
              scopes: account.scopes,
            },
            update: {
              encryptedToken,
              encryptedRefreshToken,
              expiresAt: account.expiresAt,
              scopes: account.scopes,
            },
          },
        },
      },
      create: {
        managedProfileId,
        provider: account.provider,
        externalAccountId: account.externalAccountId,
        externalAccountName: account.handle || account.name,
        isConnected: true,
        lastCheckedAt: new Date(),
        credential: {
          create: {
            encryptedToken,
            encryptedRefreshToken,
            expiresAt: account.expiresAt,
            scopes: account.scopes,
          },
        },
      },
    });

    // Journal d'audit avec traçabilité de la délégation
    await prisma.auditLog.create({
      data: {
        action: "ATTACH_CHANNEL_CONNECTION",
        targetType: "CHANNEL_CONNECTION",
        targetId: connection.id,
        managedProfileId,
        details: {
          provider: account.provider,
          accountName: account.name,
          delegationMode: profile.delegationMode,
          mandateStatus: profile.mandateStatus,
        },
      },
    });

    return NextResponse.json({
      success: true,
      connection,
    });
  } catch (error: unknown) {
    console.error("Connectors Attach Error:", error);
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
