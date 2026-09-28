import { NextResponse } from "next/server";
import { buildStrPackForCase } from "@/lib/mart";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const caseId = searchParams.get("caseId");
  if (!caseId) {
    return NextResponse.json({ error: "caseId is required" }, { status: 400 });
  }

  try {
    const result = await buildStrPackForCase(caseId);
    if (!result.data) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }
    return NextResponse.json({ pack: result.data, source: result.source });
  } catch (err) {
    console.error("[str-api]", err);
    return NextResponse.json({ error: "Failed to build STR pack" }, { status: 500 });
  }
}
