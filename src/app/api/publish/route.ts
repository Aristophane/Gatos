import { NextResponse } from "next/server";
import { publisherService } from "@/modules/publisher/service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, occurrenceId } = body;

    if (!occurrenceId) {
      return NextResponse.json({ error: "occurrenceId manquant" }, { status: 400 });
    }

    if (action === "CANCEL") {
      const result = await publisherService.cancelOccurrence(occurrenceId);
      return NextResponse.json({ success: true, action: "CANCELLED", occurrence: result });
    }

    if (action === "EXECUTE" || !action) {
      const result = await publisherService.executeOccurrence(occurrenceId);
      return NextResponse.json({ success: true, action: "EXECUTED", ...result });
    }

    return NextResponse.json({ error: "Action non reconnue" }, { status: 400 });
  } catch (error: unknown) {
    console.error("API Publish Error:", error);
    const errMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errMessage }, { status: 500 });
  }
}
