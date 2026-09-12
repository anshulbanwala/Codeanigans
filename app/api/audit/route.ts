import { NextResponse } from "next/server";
import { readAuditRecords } from "@/lib/audit";

const canRead =
  !!process.env.SNOWFLAKE_ACCOUNT &&
  !!process.env.SNOWFLAKE_USER &&
  !!process.env.SNOWFLAKE_PASSWORD;

export async function GET() {
  if (!canRead) {
    return NextResponse.json({ rows: [], source: "none" });
  }

  try {
    const rows = await readAuditRecords(50);
    return NextResponse.json({ rows, source: "snowflake" });
  } catch (err) {
    console.error("[audit-read]", err);
    return NextResponse.json(
      { rows: [], source: "error", error: "Failed to read audit records" },
      { status: 500 },
    );
  }
}
