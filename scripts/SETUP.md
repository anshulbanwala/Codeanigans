# Quick setup (run app + Snowflake + Cortex Code)

## 1. App is running

Dev server (if started):

**http://127.0.0.1:43127**

Without Snowflake creds you will see **Offline demo** — UI works from local mart.

## 2. One-time local setup

```bash
cd /Users/rajat/Codeanigans
./scripts/setup-local.sh
```

Edit **`.env.local`** (never commit). **Shared dev / copilot demo:**

```env
SNOWFLAKE_ACCOUNT=vgwrwen-ed58886
SNOWFLAKE_USER=SENTINEL_DEV_USER
SNOWFLAKE_PASSWORD=<from team lead — not in git>
SNOWFLAKE_ROLE=APP_DEVELOPER
SNOWFLAKE_WAREHOUSE=SENTINEL_WH
SNOWFLAKE_DATABASE=SENTINEL
SNOWFLAKE_SCHEMA=RISK
```

Use **ACCOUNTADMIN** + your personal user only for SQL bootstrap and `./scripts/deploy-cortex.sh`. After every agent deploy, run **`snowflake/08_app_developer_grants.sql`** as ACCOUNTADMIN (or `node scripts/run-sql-file.mjs snowflake/08_app_developer_grants.sql` with admin env vars). Agent `CREATE OR REPLACE` drops `USAGE ON AGENT` for `APP_DEVELOPER`.

Test shared login: `node scripts/test-snowflake.mjs` and `node scripts/test-copilot-access.mjs`.

Restart dev server after saving `.env.local`:

```bash
npm run dev
```

Check: **http://127.0.0.1:43127/api/health** → `status: ok`, `snowflake: connected`

## 3. Snowflake SQL (worksheet or cortex)

Run in order in the hackathon Snowflake account:

1. `snowflake/01_schema.sql`
2. `snowflake/02_seed.sql`
3. `snowflake/03_expand.sql`
4. `snowflake/04_winner_expansion.sql`
5. `snowflake/05_app_views.sql`
6. `snowflake/09_large_exposure_fix.sql` (after `04_winner_expansion.sql`)

Then follow **`coco/PROMPTS.md`** for Cortex Search + data expansion (or use cortex chat with those prompts).

## 4. Cortex Code CLI (“CoCo” / codex)

Installed to `~/.local/bin/cortex`. Ensure PATH:

```bash
export PATH="$HOME/.local/bin:$PATH"
cortex --version
```

**Connect Snowflake** (interactive — use hackathon login):

```bash
cortex
# follow prompts to add connection; same account as .env.local
```

**Deploy agent + semantic view from this repo:**

```bash
export CORTEX_CONNECTION=your_connection_name   # if not active
./scripts/deploy-cortex.sh
```

## 5. Verify end-to-end

| Check | URL / action |
| --- | --- |
| Health | `/api/health` |
| Live data banner | Command center → “Snowflake SENTINEL.RISK” |
| Copilot | `/copilot` → mule prompt (30–50s warm) |
| Audit | `/audit` → row with answer replay |
| STR | `/str?caseId=CASE-1088` |

Warmup before demo: **`docs/demo-warmup.md`**

Judge checklist: **`docs/judge-runs.md`**
