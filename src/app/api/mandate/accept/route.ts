import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { mandateToken, artistEmail } = body;

    if (!mandateToken) {
      return NextResponse.json({ error: "mandateToken manquant" }, { status: 400 });
    }

    const profile = await prisma.managedProfile.findUnique({
      where: { mandateToken },
    });

    if (!profile) {
      return NextResponse.json({ error: "Lien de mandat invalide ou expiré" }, { status: 404 });
    }

    const updated = await prisma.managedProfile.update({
      where: { id: profile.id },
      data: {
        mandateStatus: "ACTIVE",
        mandateGrantedAt: new Date(),
        mandateGrantedByEmail: artistEmail || profile.mandateGrantedByEmail,
      },
    });

    // Audit log de signature de mandat
    await prisma.auditLog.create({
      data: {
        action: "ACCEPT_IDENTITY_MANDATE",
        targetType: "MANAGED_PROFILE",
        targetId: profile.id,
        managedProfileId: profile.id,
        details: {
          artistEmail,
          grantedAt: new Date().toISOString(),
          agencyWorkspaceId: profile.agencyWorkspaceId,
        },
      },
    });

    return NextResponse.json({
      success: true,
      profile: updated,
    });
  } catch (error: unknown) {
    console.error("Mandate Accept Error:", error);
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
