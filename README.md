# Sentinel by Codeanigans

**Start here with a co-developer: [WESTERLY.md](WESTERLY.md)** — architecture, live Snowflake status, demo plan, and remaining improvements.

Risk, fraud and regulatory intelligence copilot for the **Snowflake CoCo CLI Hackathon 2026 — GCC Edition**, Theme 1.

This repo contains the local demo, the Snowflake DDL/seed scripts, and the CoCo prompts used to deploy the live Cortex stack.

## What it is

**Sentinel** sits on the AML desk of a fictional Indian NBFC, Aarohan Finance Ltd. Analysts ask natural-language questions. The copilot:

1. Surfaces fraud and risk signals (structuring under the ₹10L CTR, mule rings, PEP unexplained wealth, related-party round-tripping, CRE concentration, LCR tightness).
2. Grounds every answer in SQL that would run on a semantic view **or** in a cited circular (PMLA, RBI KYC, FIU-IND, Basel / RBI LCR).
3. Emits an audit-ready FIU-IND style STR pack — the “regulatory output” the problem statement asks for.
4. Writes an immutable audit log of who asked what, with citations.

The live agent is `SENTINEL.RISK.SENTINEL_AGENT`. With Snowflake credentials configured, `/api/copilot` calls `SNOWFLAKE.CORTEX.DATA_AGENT_RUN` and `/audit` reads `SENTINEL.RISK.COPILOT_AUDIT`. Without credentials, the local evidence-first engine remains available as an offline demo fallback.

The local Next.js app is the demo surface. The Snowflake path (Cortex Search + Analyst + Agent, built via CoCo CLI) is how you show **technical execution** to Snowflake judges.

## Run locally

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43127](http://127.0.0.1:43127).

**Public demo (Vercel):** deploy per [docs/VERCEL.md](docs/VERCEL.md) — use that URL as Hack2skill **Prototype Deployed Link**.

Suggested demo path: Command center → Copilot (mule + CTR prompts) → case CASE-1088 → STR factory → Audit log.

## Snowflake + CoCo

1. Log in with the hackathon credentials (never commit them).
2. Run `snowflake/01_schema.sql`.
3. Run `snowflake/02_seed.sql` and `snowflake/03_expand.sql` for the foundation story data.
4. Run `snowflake/04_winner_expansion.sql` for additive customers, transactions, evidence graph tables, feature views, and Analyst verification surfaces.
5. Run `snowflake/05_app_views.sql` for app read views (`OPEN_ALERTS_V`, `CASE_CUSTOMERS_V`).
6. Run `snowflake/09_large_exposure_fix.sql` after `04_winner_expansion.sql` (Golden Peak concentration).
7. Run `snowflake/07_dedupe_mart.sql` if expansion scripts were applied more than once.
8. Install CoCo CLI and walk `coco/PROMPTS.md` in order.
9. Copy `coco/skills/str-factory/SKILL.md` into your CoCo skills folder; save outputs under `output/`.

Install CoCo:

```bash
curl -LsS https://ai.snowflake.com/static/cc-scripts/install.sh | sh
cortex
```

## Docs

- [docs/VIDEO_SCRIPT_FINAL.md](docs/VIDEO_SCRIPT_FINAL.md) — **Hack2skill video script (3–5 min)** — record this.
- [docs/DEMO_SCRIPT.md](docs/DEMO_SCRIPT.md) — index to video script + warmup links.
- [docs/ONE_PAGER.md](docs/ONE_PAGER.md) — **1-pager source** (export to PDF for Hack2skill).
- [docs/judge-runs.md](docs/judge-runs.md) — certify prompts + submission pack checklist.
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) — Snowflake, Cortex deploy, CoWork, Streamlit, hosting.
- [scripts/SETUP.md](scripts/SETUP.md) — quick local setup.
- [docs/HACKATHON.md](docs/HACKATHON.md) — rubric and hackathon context.
- [coco/PROMPTS.md](coco/PROMPTS.md) — copy-paste CoCo session.

## Stack

Next.js 16, TypeScript, Tailwind, shadcn/ui. Snowflake objects: tables, Cortex Search, semantic view, Cortex Agent, plus an optional Snowflake-hosted Streamlit companion in `streamlit/`.

All customer data is **synthetic**.

Live connection smoke check: open `/api/health`. It reports the active Snowflake role, database, schema, warehouse, and canonical agent FQN without exposing credentials.
