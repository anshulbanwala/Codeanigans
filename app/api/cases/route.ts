import { NextResponse } from "next/server";
import { getCases } from "@/lib/mart";

const HERO_IDS = ["CASE-1042", "CASE-1088", "CASE-1101", "CASE-1115"];

export async function GET() {
  try {
    const { source, data } = await getCases();
    const heroes = data.filter((c) => HERO_IDS.includes(c.id));
    const rest = data.filter((c) => !HERO_IDS.includes(c.id));
    const ordered = [...heroes, ...rest];
    return NextResponse.json({
      source,
      cases: ordered.map((c) => ({
        id: c.id,
        title: c.title,
        status: c.status,
        typology: c.typology,
        severity: c.severity,
      })),
    });
  } catch (err) {
    console.error("[cases-api]", err);
    return NextResponse.json({ error: "Failed to load cases" }, { status: 500 });
  }
}
