import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/snowflake";

const agentFqn = "SENTINEL.RISK.SENTINEL_AGENT";

export async function GET() {
  const configured = Boolean(
    process.env.SNOWFLAKE_ACCOUNT &&
      process.env.SNOWFLAKE_USER &&
      process.env.SNOWFLAKE_PASSWORD,
  );

  if (!configured) {
    return NextResponse.json({
      status: "degraded",
      mode: "local",
      snowflake: "not_configured",
      agent: agentFqn,
    });
  }

  try {
    const rows = await executeQuery<{
      CURRENT_ROLE: string;
      CURRENT_DATABASE: string;
      CURRENT_SCHEMA: string;
      CURRENT_WAREHOUSE: string;
    }>(
      "SELECT CURRENT_ROLE() AS CURRENT_ROLE, CURRENT_DATABASE() AS CURRENT_DATABASE, CURRENT_SCHEMA() AS CURRENT_SCHEMA, CURRENT_WAREHOUSE() AS CURRENT_WAREHOUSE",
    );
    const context = rows[0];

    return NextResponse.json({
      status: "ok",
      mode: "snowflake",
      snowflake: "connected",
      agent: agentFqn,
      role: context?.CURRENT_ROLE ?? null,
      database: context?.CURRENT_DATABASE ?? null,
      schema: context?.CURRENT_SCHEMA ?? null,
      warehouse: context?.CURRENT_WAREHOUSE ?? null,
    });
  } catch (error) {
    console.error("[health-snowflake]", error);
    return NextResponse.json(
      {
        status: "degraded",
        mode: "snowflake",
        snowflake: "error",
        agent: agentFqn,
      },
      { status: 503 },
    );
  }
}
