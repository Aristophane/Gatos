import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { managedProfileId, artistEmail } = body;

    if (!managedProfileId) {
      return NextResponse.json({ error: "managedProfileId manquant" }, { status: 400 });
    }

    const token = `mandate_${crypto.randomBytes(16).toString("hex")}`;

    const updated = await prisma.managedProfile.update({
      where: { id: managedProfileId },
      data: {
        mandateToken: token,
        mandateStatus: "PENDING",
        mandateGrantedByEmail: artistEmail || undefined,
      },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3022";
    const inviteUrl = `${appUrl}/mandate/${token}`;

    // Audit log
    await prisma.auditLog.create({
      data: {
        action: "GENERATE_MANDATE_INVITATION",
        targetType: "MANAGED_PROFILE",
        targetId: managedProfileId,
        managedProfileId,
        details: { artistEmail, inviteUrl },
      },
    });

    return NextResponse.json({
      success: true,
      token,
      inviteUrl,
      profile: updated,
    });
  } catch (error: unknown) {
    console.error("Mandate Generate Error:", error);
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
