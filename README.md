# Sentinel by Codeanigans

**Start here with a co-developer: [WESTERLY.md](WESTERLY.md)** — what this is, what is left, day plan through **13 Sep**, and which Kaggle datasets to use.

Risk, fraud and regulatory intelligence copilot for the **Snowflake CoCo CLI Hackathon 2026 — GCC Edition**, Theme 1.

This repo is a complete prototype you can demo locally **today**, plus the SQL and CoCo prompts to reproduce it on the Snowflake credentials Hack2skill issued.

## What it is

**Sentinel** sits on the AML desk of a fictional Indian NBFC, Aarohan Finance Ltd. Analysts ask natural-language questions. The copilot:

1. Surfaces fraud and risk signals (structuring under the ₹10L CTR, mule rings, PEP unexplained wealth, related-party round-tripping, CRE concentration, LCR tightness).
2. Grounds every answer in SQL that would run on a semantic view **or** in a cited circular (PMLA, RBI KYC, FIU-IND, Basel / RBI LCR).
3. Emits an audit-ready FIU-IND style STR pack — the “regulatory output” the problem statement asks for.
4. Writes an immutable audit log of who asked what, with citations.

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
3. Install CoCo CLI and walk `coco/PROMPTS.md` in order.
4. Copy `coco/skills/str-factory/SKILL.md` into your CoCo skills folder if you want the custom skill on the recording.

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
