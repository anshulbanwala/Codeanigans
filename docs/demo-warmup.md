# Demo warmup (Task 1 — latency)

Run **2 minutes before** CoWork or Next.js `/copilot` recording.

## Snowflake worksheet

```sql
USE WAREHOUSE SENTINEL_WH;
ALTER WAREHOUSE SENTINEL_WH RESUME IF SUSPENDED;
SELECT 1;
SELECT COUNT(*) FROM SENTINEL.RISK.OPEN_ALERTS_V;
SELECT LCR_PCT FROM SENTINEL.RISK.LIQUIDITY_DAILY ORDER BY AS_OF DESC LIMIT 1;
```

Optional for demo window:

```sql
ALTER WAREHOUSE SENTINEL_WH SET AUTO_SUSPEND = 120;
```

## CoWork

1. Open `SENTINEL.RISK.SENTINEL_AGENT`.
2. Ask once: `Show mule accounts with cash-outs after 2am` (discard answer — warms Cortex + WH).
3. Record the **second** ask for video.

## Next.js

1. Open `/api/health` — expect `status: ok`, `snowflake: connected`.
2. Health endpoint runs a light warehouse ping when configured.
3. Use the six frozen prompts from `docs/judge-runs.md`; avoid compound questions live.

## STR prompt tip

For filing output, use **STR factory** in the app. In copilot, prefer: *Which STR packs are audit-ready this week?* — not a full pack generation in chat.

See **`docs/LATENCY.md`** for 140s troubleshooting.

## Target timings (warm warehouse)

| Prompt | Target |
| --- | --- |
| Mule / CTR | 25–40s |
| LCR / large exposure | 20–35s |
| STR draft | 35–50s |

Log actual seconds in `docs/judge-runs.md`.
