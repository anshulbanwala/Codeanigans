import { NextResponse } from "next/server";
import { warmupSnowflakeForCopilot } from "@/lib/warmup";
import { isSnowflakeConfigured } from "@/lib/snowflake-config";

export async function GET() {
  if (!isSnowflakeConfigured()) {
    return NextResponse.json({ warmed: false, reason: "not_configured" });
  }
  try {
    await warmupSnowflakeForCopilot();
    return NextResponse.json({ warmed: true });
  } catch (err) {
    console.error("[warmup]", err);
    return NextResponse.json({ warmed: false, reason: "error" }, { status: 503 });
  }
}
