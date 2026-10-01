# Sentinel — Risk, Fraud & Regulatory Intelligence Copilot

**Team Codeanigans** · Snowflake CoCo CLI Hackathon 2026, GCC Edition · **Theme 1**  
**Repo:** https://github.com/anshulbanwala/Codeanigans · **Agent:** `SENTINEL.RISK.SENTINEL_AGENT`

---

## Problem (30s read)

NBFC AML desks juggle **fraud alerts**, **liquidity/credit risk**, and **regulatory filings** (PMLA cash reporting, RBI KYC, FIU-IND suspicious transaction reports) across Excel, email, and portals. They need **governed natural-language access** to structured and unstructured evidence—and **audit-ready regulatory artifacts**, not a generic chatbot.

---

## Solution

**Sentinel** is an MLRO-desk copilot for **Aarohan Finance Ltd.** (synthetic Indian NBFC): command center → **Cortex Agent** copilot → case investigation → **FIU-style STR pack** (JSON/Markdown) → **immutable audit log**. The agent **separates fact vs interpretation**, **cites document IDs**, and **abstains** when ungrounded (e.g. fictional “crypto tax 2030”).

---

## Why this design fits Theme 1 (and judging rubric)

| Rubric | How Sentinel scores |
|--------|---------------------|
| **Relevance (30%)** | India NBFC story: ₹10L CTR structuring, 2am mule ring, PEP EDD, Golden Peak large exposure, LCR/wholesale runoff—all on RBI/FIU-shaped demo corpus. |
| **Technical execution (40%)** | Full **CoCo CLI** path: synthetic mart → **dual Cortex Search** (calls + regulations) → **semantic view / Cortex Analyst** → **Cortex Agent** → CoWork + `DATA_AGENT_RUN` from Next.js. Custom **str-factory** skill. Not a LangChain sidecar. |
| **Completeness (30%)** | End-to-end: **detect → investigate → file STR → audit**. UI surfaces for each step; certified **7/7** demo prompts on live agent (Next.js). |

**Differentiator vs typical entries:** Most teams stop at “suspicious graph” or Streamlit-only. Sentinel ships the **regulatory deliverable** (STR pack) and **COPILOT_AUDIT** replay—the explicit second half of the Theme 1 statement.

---

## Architecture (production-shaped, Snowflake-native)

```
Analyst UI (Next.js 16 + optional Streamlit-in-Snowflake)
    │
    ▼
SNOWFLAKE.CORTEX.DATA_AGENT_RUN → SENTINEL.RISK.SENTINEL_AGENT
    │
    ├─ Cortex Analyst ← semantic view SENTINEL.RISK.RISK_ANALYTICS
    │     (transactions, alerts, cases, liquidity, credit concentration + BREACH_FLAG)
    ├─ Cortex Search ← SENTINEL.RISK.CALL_SEARCH (RM transcripts)
    ├─ Cortex Search ← SENTINEL.RISK.REG_DOC_SEARCH (PMLA / RBI KYC / FIU / Basel excerpts)
    └─ CoCo skill str-factory → FIU-IND-style JSON + Markdown (repo: output/CASE-1088-STR.json)
    │
    ▼
SENTINEL.RISK.COPILOT_AUDIT (question, answer, SQL, tools, citations)
```

**Governance:** Shared role `APP_DEVELOPER` for dev/demo; least-privilege grants restored after each agent deploy (`08_app_developer_grants.sql`).

---

## Data scale (synthetic mart — live account)

Designed for **realistic analyst queries**, not toy 10-row demos. After foundation + expansion scripts (representative counts on hackathon account):

| Layer | Scale (order of magnitude) |
|-------|------------------------------|
| **Customers** | ~250 (hero cases + generated portfolio) |
| **Transactions** | **6,000+** INR-shaped rows (structuring, mule, layering typologies) |
| **Alerts** | **~165** open/escalated mix |
| **Cases** | **~50** investigation files |
| **Call transcripts** | Unstructured RM notes (Cortex Search) |
| **REG_DOCS** | Curated regulatory chunks (6 authoritative + synthetic NBFC circulars) |
| **Liquidity** | 60+ daily LCR/NSFR observations |
| **Credit** | **~110** borrowers; **Golden Peak** concentration overlay (`09_large_exposure_fix.sql`) |
| **Graph / evidence** | Device fingerprints, login events, merchants, entity relationships, case evidence links |

**Disclaimer:** 100% synthetic; no production PII. Regulatory text is demo corpus only—not legal advice.

---

## Snowflake objects (for judge verification)

| Type | FQN |
|------|-----|
| Database / schema | `SENTINEL.RISK` |
| Warehouse | `SENTINEL_WH` |
| **Cortex Agent** | `SENTINEL.RISK.SENTINEL_AGENT` |
| Semantic view | `SENTINEL.RISK.RISK_ANALYTICS` |
| Search (calls) | `SENTINEL.RISK.CALL_SEARCH` |
| Search (regulations) | `SENTINEL.RISK.REG_DOC_SEARCH` |
| Audit | `SENTINEL.RISK.COPILOT_AUDIT` |
| App views | `OPEN_ALERTS_V`, `CASE_CUSTOMERS_V` |

**App stack:** TypeScript, Next.js, Snowflake Node driver, `SNOWFLAKE.CORTEX.DATA_AGENT_RUN`. Deploy: `./scripts/deploy-cortex.sh` + `coco/PROMPTS.md`.

---

## Certified demo prompts (7)

1. Mule cash-outs after 2am  
2. Rahul Mehta — ₹10L CTR structuring  
3. LCR and wholesale runoff  
4. RBI large-exposure norms (Golden Peak)  
5. PEP enhanced due diligence  
6. FIU-IND STR due this week *(full file: `/str?caseId=CASE-1088`)*  
7. **Abstain:** crypto mining tax rule 2030  

Recorded results: `docs/judge-runs.md` · Automation: `npm run certify:prompts`

---

## Team

**Codeanigans** — Sentinel (Anshul & team). Built for GCC BFSI: governed AI on enterprise data with compliance-grade outputs.
