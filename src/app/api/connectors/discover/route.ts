import { NextResponse } from "next/server";
import { oauthRegistry } from "@/modules/connectors/oauth/registry";
import { SocialPlatform } from "@/modules/connectors/oauth/types";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const platform: SocialPlatform = body.platform || "META";

    const provider = oauthRegistry.get(platform);
    // En dev/bac à sable ou avec token simulé
    const mockToken = "mock_meta_user_token_discovery";
    const accounts = await provider.discoverAccounts(mockToken);

    return NextResponse.json({
      success: true,
      platform,
      accounts,
    });
  } catch (error: unknown) {
    console.error("Connectors Discover Error:", error);
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
