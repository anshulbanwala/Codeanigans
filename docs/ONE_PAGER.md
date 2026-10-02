# Sentinel
### Risk, fraud & regulatory intelligence for Indian NBFCs

**Team Codeanigans** · Snowflake CoCo CLI Hackathon 2026, GCC Edition · Theme 1  
**Repository:** https://github.com/anshulbanwala/Codeanigans

---

## The problem

Anti–money laundering and compliance teams at banks and NBFCs still work across **spreadsheets, case tools, email, and regulator portals**. Analysts lose hours stitching together **transaction patterns**, **relationship-manager notes**, and **RBI / PMLA / FIU-IND guidance**—then rebuilding the same narrative for **suspicious activity reports** and internal audit. Generic chatbots are not acceptable: answers must be **grounded**, **cited**, and **replayable**.

---

## What Sentinel is

**Sentinel** is a copilot for the money-laundering reporting officer’s desk at **Aarohan Finance Ltd.**—a synthetic Indian NBFC built for demonstration. Analysts ask questions in plain English. Sentinel:

- **Surfaces** fraud, liquidity, and credit-risk signals from governed data  
- **Grounds** every answer in database evidence or cited regulatory excerpts  
- **Produces** download-ready **FIU-IND–style suspicious transaction report packs**  
- **Records** who asked what, with SQL, tools used, and citations—in an **audit log**  
- **Refuses to guess** when the corpus cannot support an answer  

Sentinel is built **on Snowflake’s AI Data Cloud** using the **CoCo CLI** workflow: synthetic mart, Cortex Search on calls and circulars, a semantic analytics layer, and a **Cortex Agent** that orchestrates tools—not a bolt-on chat UI on a spreadsheet.

---

## Why Sentinel is built to win real desks

| Capability | What it means for the business |
|------------|--------------------------------|
| **One agent, two worlds** | Same question can pull **structured** SQL (alerts, txns, LCR, concentrations) and **unstructured** search (call transcripts, policy chunks). |
| **Regulatory output, not chat only** | STR factory emits **JSON + Markdown** packs aligned to investigation cases—the filing step many desks still do manually. |
| **Compliance-grade behavior** | Facts vs interpretation; document IDs (e.g. PMLA, RBI KYC, FIU STR timing); **abstain** on out-of-scope questions. |
| **Full investigation loop** | Command center → copilot → case file → STR download → audit replay in one demo path. |
| **Enterprise naming & deploy** | All objects under **`SENTINEL.RISK.*`**; reproducible deploy script and shared developer access for the team. |

---

## Architecture (at a glance)

```
Analyst  →  Next.js desk (command center, copilot, cases, STR, audit)
                ↓
         SENTINEL.RISK.SENTINEL_AGENT  (Snowflake Cortex Agent)
                ↓
    ┌───────────┼───────────┐
    ▼           ▼           ▼
 Analytics   Call search   Regulation search
 (semantic   (RM notes)    (RBI / PMLA / FIU excerpts)
  view)
                ↓
         STR factory skill  →  FIU-style pack
                ↓
         COPILOT_AUDIT  →  immutable Q&A history
```

Optional: **Streamlit-in-Snowflake** companion on the same mart (`streamlit/` in repo).

---

## Data & realism (synthetic, production-shaped)

| Asset | Scale (hackathon mart) |
|-------|-------------------------|
| Customers | ~250 |
| Transactions | **6,000+** (INR, channels, typologies: structuring, mule, layering) |
| Alerts | **~165** |
| Investigation cases | **~50** |
| Liquidity history | 60+ daily LCR / NSFR observations |
| Credit book | **~110** borrowers; **Golden Peak Realty** large-exposure storyline |
| Unstructured | Call transcripts + curated regulatory document index |
| Evidence graph | Devices, logins, merchants, entity links for network cases |

**All data is synthetic.** No real customer PII. Regulatory text is a **demo corpus** for citations—not legal advice.

---

## Snowflake objects (verification)

| | |
|---|---|
| Agent | `SENTINEL.RISK.SENTINEL_AGENT` |
| Semantic analytics | `SENTINEL.RISK.RISK_ANALYTICS` |
| Search (calls) | `SENTINEL.RISK.CALL_SEARCH` |
| Search (regulations) | `SENTINEL.RISK.REG_DOC_SEARCH` |
| Audit | `SENTINEL.RISK.COPILOT_AUDIT` |
| Warehouse | `SENTINEL_WH` |

Live app path: `SNOWFLAKE.CORTEX.DATA_AGENT_RUN` from `/api/copilot`.

---

## What Sentinel can do

- **Monitor the desk** — Live command center for open alerts, case queue, liquidity (LCR/NSFR), and credit concentration on the Snowflake mart.  
- **Investigate in natural language** — Ask about mule cash-outs, structuring under cash reporting limits, PEP due diligence, large exposures, or wholesale runoff; get SQL-backed answers with regulatory citations.  
- **Search unstructured evidence** — Pull relevant passages from RM call transcripts and indexed RBI / PMLA / FIU policy chunks alongside structured facts.  
- **Work case files** — Drill into named investigations (e.g. mule ring, smurfing, PEP wealth mismatch) with linked customers, transactions, and transcripts.  
- **Generate STR packs** — Produce FIU-IND–style suspicious transaction report **JSON and Markdown** for a case ID, ready for MLRO review and filing workflows.  
- **Prove governance** — Every copilot question and answer is stored with confidence, citations, SQL, and tools used—replayable from the audit screen.  
- **Stay honest** — When a question is outside the governed corpus (e.g. fictional future tax rules), Sentinel declines instead of inventing policy.  
- **Run on Snowflake end-to-end** — Same Cortex Agent in the web app, CoWork / Snowflake Intelligence, and optional Streamlit companion—one agent, one mart, one audit trail.

Proof artifacts in repo: **`docs/judge-runs.md`** (7/7 Pass — Next.js + CoWork) · **`output/CASE-1088-STR.json`**

---

## Stack

Next.js · TypeScript · Snowflake (tables, Cortex Search, semantic view, Cortex Agent) · CoCo CLI · optional Streamlit in Snowflake.

**Codeanigans** — Sentinel (Anshul · mycowdeveloper)
