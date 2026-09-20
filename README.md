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

Suggested demo path: Command center → Copilot (mule + CTR prompts) → case CASE-1088 → STR factory → Audit log.

## Snowflake + CoCo

1. Log in with the hackathon credentials (never commit them).
2. Run `snowflake/01_schema.sql`.
3. Run `snowflake/02_seed.sql` and `snowflake/03_expand.sql` when the account needs the seeded story volume.
4. Install CoCo CLI and walk `coco/PROMPTS.md` in order.
5. Copy `coco/skills/str-factory/SKILL.md` into your CoCo skills folder if you want the custom skill on the recording.

Install CoCo:

```bash
curl -LsS https://ai.snowflake.com/static/cc-scripts/install.sh | sh
cortex
```

## Docs

- [docs/HACKATHON.md](docs/HACKATHON.md) — full briefing: rubric, why this product, data model, CoCo stack, workshop videos, 3-minute demo script, submission checklist.
- [coco/PROMPTS.md](coco/PROMPTS.md) — copy-paste CoCo session.

## Stack

Next.js 16, TypeScript, Tailwind, shadcn/ui. Snowflake objects: tables, Cortex Search, semantic view, Cortex Agent, optional Streamlit-in-Snowflake.

All customer data is **synthetic**.

Live connection smoke check: open `/api/health`. It reports the active Snowflake role, database, schema, warehouse, and canonical agent FQN without exposing credentials.
