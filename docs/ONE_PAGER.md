# Sentinel — Risk, Fraud & Regulatory Intelligence Copilot

**Team:** Codeanigans · **Hackathon:** Snowflake CoCo CLI 2026, GCC Edition · **Theme 1**  
**Repository:** https://github.com/anshulbanwala/Codeanigans

---

## Problem

Banks and non-bank finance companies run fraud monitoring, liquidity and credit risk, and regulatory reporting (anti–money laundering, know-your-customer, suspicious-activity filings) across spreadsheets, email, and regulator portals. Analysts need one place to **ask questions in plain language**, see **evidence with citations**, and produce **audit-ready regulatory outputs**—not another dashboard or ungoverned chatbot.

## Solution — Sentinel (Aarohan Finance Ltd.)

**Sentinel** is an MLRO-desk copilot on a **fictional Indian NBFC**. Analysts use a web app to review alerts and cases, ask the copilot, download a **Financial Intelligence Unit–style suspicious transaction report pack**, and replay every answer in an **audit log**. The system **refuses to invent rules** when documents and data do not support an answer.

**Demo story (synthetic):** mule ring after 2am (CASE-1088), structuring under ₹10 lakh cash reporting (CASE-1042), PEP enhanced due diligence (CASE-1101), large exposure and liquidity (Golden Peak, LCR).

---

## Architecture

```
Analyst (Next.js app / optional Streamlit in Snowflake)
    → SENTINEL.RISK.SENTINEL_AGENT  (Cortex Agent, built with CoCo CLI)
         ├ Cortex Analyst + RISK_ANALYTICS semantic view  (transactions, alerts, LCR, credit)
         ├ Cortex Search CALL_SEARCH                      (RM call transcripts)
         ├ Cortex Search REG_DOC_SEARCH                   (PMLA / RBI / FIU excerpts)
         └ CoCo skill: str-factory                        (STR JSON + Markdown)
    → SENTINEL.RISK.COPILOT_AUDIT                        (immutable Q&A log)
```

**CoCo CLI** is used to generate data, deploy the semantic view and agent, and maintain the custom STR skill—not as branding only.

---

## Snowflake objects (FQNs)

| Object | FQN |
|--------|-----|
| Database / schema | `SENTINEL.RISK` |
| Warehouse | `SENTINEL_WH` |
| Cortex Agent | `SENTINEL.RISK.SENTINEL_AGENT` |
| Semantic view | `SENTINEL.RISK.RISK_ANALYTICS` |
| Search (calls) | `SENTINEL.RISK.CALL_SEARCH` |
| Search (regulations) | `SENTINEL.RISK.REG_DOC_SEARCH` |
| Audit table | `SENTINEL.RISK.COPILOT_AUDIT` |

App integration: `SNOWFLAKE.CORTEX.DATA_AGENT_RUN` from Next.js `/api/copilot`.

---

## Six certification prompts

1. Show mule accounts with cash-outs after 2am  
2. Is Rahul Mehta structuring under the ₹10L CTR?  
3. How tight is our LCR and wholesale runoff?  
4. Which names breach RBI large-exposure norms?  
5. What does RBI require for PEP enhanced due diligence?  
6. Draft the FIU-IND STR pack that is due this week *(prefer STR factory in app for full file)*  

**Abstain test:** crypto mining tax rule 2030 → must abstain, no invented regulation.

---

## Data disclaimer

All customer, transaction, call, and case data are **synthetic**, generated for demonstration. Regulatory excerpts are **curated demo chunks** (PMLA, RBI KYC, FIU-IND STR timing, Basel/RBI LCR, RBI mule guidance)—not legal advice and not live web scraping. **No production PII** is used.

---

## Stack

Next.js · TypeScript · Snowflake (tables, Cortex Search, semantic view, Cortex Agent) · CoCo CLI · optional Streamlit-in-Snowflake (`streamlit/`).

**Contact / team:** Codeanigans — Sentinel by Anshul & team.
