import { executeQuery } from "@/lib/snowflake";
import { isSnowflakeConfigured } from "@/lib/snowflake-config";

let lastWarmupAt = 0;
const WARMUP_INTERVAL_MS = 45_000;
const COPILOT_WARMUP_INTERVAL_MS = 12_000;

export async function warmupSnowflake(): Promise<void> {
  await warmupSnowflakeInternal(WARMUP_INTERVAL_MS);
}

/** Run before copilot agent calls — resumes WH and pings more often. */
export async function warmupSnowflakeForCopilot(): Promise<void> {
  await warmupSnowflakeInternal(COPILOT_WARMUP_INTERVAL_MS, true);
}

async function warmupSnowflakeInternal(
  minIntervalMs: number,
  resumeWarehouse = false,
): Promise<void> {
  if (!isSnowflakeConfigured()) return;
  const now = Date.now();
  if (now - lastWarmupAt < minIntervalMs) return;
  lastWarmupAt = now;

  const warehouse = process.env.SNOWFLAKE_WAREHOUSE ?? "SENTINEL_WH";
  if (resumeWarehouse) {
    try {
      await executeQuery(`ALTER WAREHOUSE ${warehouse} RESUME IF SUSPENDED`);
    } catch {
      // role may not allow ALTER — ping still helps
    }
  }
  await executeQuery("SELECT 1 AS ping");
  try {
    await executeQuery(
      `SELECT COUNT(*) AS open_alerts FROM SENTINEL.RISK.OPEN_ALERTS_V`,
    );
  } catch {
    await executeQuery(
      `SELECT COUNT(*) AS open_alerts FROM SENTINEL.RISK.ALERTS`,
    );
  }
}
