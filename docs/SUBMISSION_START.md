# Submission — status & steps

## Current status (2026-10-01)

| Area | Status |
|------|--------|
| Snowflake mart + agent | Live `SENTINEL.RISK.SENTINEL_AGENT` |
| Shared dev login | `SENTINEL_DEV_USER` + `APP_DEVELOPER` (see `scripts/SETUP.md`) |
| Large-exposure demo | Fixed via `snowflake/09_large_exposure_fix.sql` (Golden Peak + `BREACH_FLAG`) |
| Semantic view | Redeployed with `BREACH_FLAG` on `CREDIT_CONCENTRATION_VIEW` |
| Next.js judge prompts | **7/7 Pass** — `npm run certify:prompts` |
| Preflight | `./scripts/preflight.sh` **PASS** |
| STR sample in repo | `output/CASE-1088-STR.json` |
| CoWork certification | **Pending** (manual) |
| Video + Hack2skill | **Pending** |

---

## Step 1 — Local setup (every developer)

```bash
git pull
npm install
cp .env.example .env.local   # password from lead (DM)
npm run dev
```

- Health: http://127.0.0.1:43127/api/health → `status: ok`
- Tests: `node scripts/test-snowflake.mjs` and `node scripts/test-copilot-access.mjs`

If copilot says agent unauthorized → lead runs `snowflake/08_app_developer_grants.sql` as ACCOUNTADMIN.

---

## Step 2 — Snowflake SQL order (lead / fresh account)

1. `01_schema.sql` → `02_seed.sql` → `03_expand.sql`
2. `04_winner_expansion.sql`
3. **`09_large_exposure_fix.sql`** (required after 04)
4. `05_app_views.sql`
5. Optional: `07_dedupe_mart.sql`
6. After agent deploy: `08_app_developer_grants.sql`

---

## Step 3 — Warm before demo or certification

`docs/demo-warmup.md` — resume `SENTINEL_WH`, or hit `/api/warmup` while dev server runs.

---

## Step 4 — Re-certify prompts (anytime)

```bash
npm run dev
npm run certify:prompts
./scripts/preflight.sh
```

Update `docs/judge-runs.md` if timings change.

---

## Step 5 — CoWork (manual, one person)

1. Open agent `SENTINEL.RISK.SENTINEL_AGENT` in CoWork.
2. Run the same 7 prompts as `docs/judge-runs.md`.
3. Paste **CoWork URL** into that file.

---

## Step 6 — Browser checks (5 min)

- Command center / cases / STR show **Snowflake** banner (not offline fallback).
- `/copilot` → Cortex Agent on answers.
- `/str?caseId=CASE-1088` → download JSON/Markdown.
- `/audit` → recent rows with full answer text.

---

## Step 7 — Video (3–5 min)

Script: `docs/SHIP_CHECKLIST.md` section **D**.  
Tips: `docs/LATENCY.md` (short copilot Qs; STR via STR page).

---

## Step 8 — One-pager PDF

Export `docs/ONE_PAGER.md` to PDF (Google Docs / Word).

---

## Step 9 — Hack2skill

Theme **1**, team **Codeanigans**, repo URL, video link, PDF.  
https://hack2skill.com/event/cococlihack-gccedition

---

## Step 10 — Freeze

No new features. Demo-breaker fixes only. Keep Snowflake objects up through evaluation.
