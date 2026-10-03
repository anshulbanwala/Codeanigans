# Snowflake mart (Sentinel)

The **governed mart** (`SENTINEL.RISK`) is built with **CoCo CLI** — see [`coco/PROMPTS.md`](../coco/PROMPTS.md).

## Hero investigation cases

After the mart exists, upsert the four demo cases (idempotent):

```bash
node scripts/seed-hero-cases.mjs
```

Requires a role with `INSERT`/`UPDATE` on `SENTINEL.RISK` (e.g. `ACCOUNTADMIN` or `APP_DEVELOPER`). Override role:

```bash
# PowerShell
$env:SNOWFLAKE_ROLE='ACCOUNTADMIN'; node scripts/seed-hero-cases.mjs
```

Seeds **CASE-1042**, **CASE-1088**, **CASE-1101**, **CASE-1115** with customers, accounts, alerts, transactions, and call transcripts. The Next.js **Investigations** desk reads these tables only (no local overlay when Snowflake is connected).

## Cortex agent

Deploy from repo root:

```bash
node scripts/sync-cortex-connection.mjs   # optional: from .env.local
./scripts/deploy-cortex.sh
```

Artifacts: [`cortex_project/`](../cortex_project/).
