# Sentinel — submission brief

**Team:** Codeanigans · **Theme:** Risk, Fraud and Regulatory Intelligence Copilot  
**Repo:** https://github.com/anshulbanwala/Codeanigans

## Problem

NBFC AML desks juggle spreadsheets, case tools, and FIU portals. Analysts need **grounded** answers (SQL + policy citations), **STR-ready output**, and an **audit trail**—not a generic chatbot.

## Solution

**Sentinel** — MLRO copilot on Snowflake:

- **CoCo CLI** built the mart, Cortex Search, semantic view, and Cortex Agent.
- **Next.js** desk: command center → copilot → investigations → cases → STR → audit.
- **Abstains** when evidence is missing.

## Architecture

```
Analyst → Next.js → SENTINEL.RISK.SENTINEL_AGENT
              ├ Cortex Analyst (RISK_ANALYTICS semantic view)
              ├ CALL_SEARCH · REG_DOC_SEARCH
              └ STR factory skill (CoCo) → FIU-style pack
         → COPILOT_AUDIT
```

## Snowflake objects

| Object | Name |
|--------|------|
| Database / schema | `SENTINEL.RISK` |
| Warehouse | `SENTINEL_WH` |
| Agent | `SENTINEL.RISK.SENTINEL_AGENT` |
| Semantic view | `SENTINEL.RISK.RISK_ANALYTICS` |
| Search | `SENTINEL.RISK.CALL_SEARCH`, `SENTINEL.RISK.REG_DOC_SEARCH` |
| Audit | `SENTINEL.RISK.COPILOT_AUDIT` |

## 5-minute judge tour

1. **`/api/health`** — expect `status: "ok"`, `snowflake: "connected"`, agent `SENTINEL.RISK.SENTINEL_AGENT`.
2. **`/`** — command center KPIs (banner shows **snowflake** when live).
3. **`/copilot`** — try: *Is Rahul Mehta structuring under the ₹10L CTR?* (tables + citations).
4. **`/investigations?case=CASE-1088`** — mule network visuals, alerts, transactions, call transcript from mart.
5. **`/audit`** — copilot runs logged to `COPILOT_AUDIT`.
6. **Abstain:** *What is the crypto mining tax rule 2030?*

## Demo prompts (copilot)

1. Show mule accounts with cash-outs after 2am  
2. Is Rahul Mehta structuring under the ₹10L CTR?  
3. How tight is our LCR and wholesale runoff?  
4. Which names breach RBI large-exposure norms?  
5. What does RBI require for PEP enhanced due diligence?  
6. Draft the FIU-IND STR pack that is due this week  

## Hero cases (investigations)

| Case | Story |
|------|--------|
| CASE-1042 | CTR structuring — Rahul Mehta |
| CASE-1088 | Overnight mule ring — Kavya / Imran / Neha |
| CASE-1101 | PEP unexplained wealth — Vikram Desai |
| CASE-1115 | Related-party round trip — Meru ↔ Sagar |

Data: CoCo-generated mart + `node scripts/seed-hero-cases.mjs` (see `snowflake/README.md`). **Synthetic only** — no production PII.

## Deploy (Vercel)

1. Import repo; set env from `.env.example` (`SNOWFLAKE_*`). Use a user with **`APP_DEVELOPER`** (e.g. hackathon app user).
2. Redeploy; confirm **`/api/health`** is green.
3. Region: `sin1` (see `vercel.json`) for India-adjacent latency.

## How we built it

1. `cortex` + **`coco/PROMPTS.md`** — mart, search, semantic view, agent, CoWork.  
2. **`cortex_project/`** + **`scripts/deploy-cortex.sh`** — versioned agent deploy.  
3. **`coco/skills/str-factory/`** — custom CoCo STR skill.  
4. This repo — Next.js + `DATA_AGENT_RUN` + audit table.  
5. **Optional:** `streamlit/` — Snowsight Streamlit companion on the same mart.
