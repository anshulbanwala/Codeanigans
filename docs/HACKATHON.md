# Westerly — Theme 1 winning playbook

Snowflake CoCo CLI Hackathon 2026, GCC Edition  
https://hack2skill.com/event/cococlihack-gccedition/

**Prototype submission: 13 September 2026** (team date). Event page originally listed 1 Sep — use **13 Sep**. Prize: $4,300 / ₹4,00,000 winner. Full day-by-day plan: [WESTERLY.md](../WESTERLY.md).

## What the first theme actually asks

**Risk, Fraud and Regulatory Intelligence Copilot**

Banking and NBFC teams still run real-time fraud, liquidity, credit risk, and regulatory reporting (AML, Basel, local rules) as a manual mash-up of Excel, email, and FIU portals.

Build a copilot that:

- surfaces risk and fraud signals, **and**
- produces **audit-ready regulatory outputs** from natural language questions.

If you only ship a fraud dashboard, you miss half the statement. If you only ship a chatbot, you miss “audit-ready”. Sentinel does both.

## How you are scored (map every pixel to this)

| Criterion (weight) | How Sentinel scores it |
| --- | --- |
| Real-world relevance 30% | Indian NBFC, RBI KYC, PMLA ₹10L CTR, FIU-IND 7-day STR clock, SBR large exposures, LCR for upper-layer NBFCs. GCC-shaped (Mumbai books, India regulations). |
| Technical execution 40% | CoCo CLI used as the builder, not a logo. Semantic view → Cortex Analyst. Cortex Search on calls + circulars. Cortex Agent with routing + abstain. Custom STR skill. Audit table. |
| Solution completeness 30% | Ingest → detect → investigate → file STR → audit. UI for each step. Empty / error / abstain states. Demo script. |

Judges from Snowflake will look for **the CoCo happy path they taught in the workshops**, not a generic LangChain app that happens to mention Snowflake.

## Why Theme 1 (and not the others)

- It is the most “enterprise AI + governed data” story Snowflake wants to tell in BFSI GCCs.
- It naturally uses **both** structured (txns, LCR, RWA) and unstructured (call transcripts, circulars) — that is the Cortex Agent demo they keep repeating.
- Regulatory output is a differentiator. Most teams will stop at “here is a suspicious graph”.
- You can tell a 3-minute story with three named cases. Manufacturing OEE and supply-chain ontologies need more data engineering than a weekend allows.

## Product: Sentinel, on Aarohan Finance Ltd.

Fictional deposit-taking NBFC. Team name Westerly. Copilot persona: MLRO assistant.

Four narrative cases (memorise these):

1. **CASE-1042 Rahul Mehta** — smurfing just under ₹10 lakh CTR, then IMPS layering. STR already drafted.
2. **CASE-1088 Kavya / Imran / Neha** — 02:00 IST mule ring funded by Nexus Digital Mart. Shared device. Freeze + network STR.
3. **CASE-1101 Vikram Desai** — PEP, Dubai “consultancy”, luxury car vs ₹18L declared income. EDD overdue.
4. **CASE-1115 Meru ↔ Sagar** — related-party ₹1.2 Cr round trip before a WC renewal.
5. Overlay: **Golden Peak Realty** 11.4% of book (RBI large exposure) and **LCR 108.4%** with wholesale runoff as the binding constraint.

## Data groundwork (what we already built)

Local TypeScript mart in `lib/data.ts` — enough for a live UI without the warehouse.

Snowflake mart in `snowflake/01_schema.sql`:

- CUSTOMERS, ACCOUNTS, TRANSACTIONS, ALERTS, CASES
- CALL_TRANSCRIPTS, REG_DOCS (unstructured)
- LIQUIDITY_DAILY, CREDIT_EXPOSURES
- COPILOT_AUDIT (the compliance story)

Do **not** download PaySim (24M rows). It is the wrong domain (African mobile money) and will drown the demo. CoCo’s own docs tell you to generate synthetic fraud tables with a prompt — we do that in `coco/PROMPTS.md`.

If you still want an external reference dataset, use a **tiny** sample of PaySim only as a second typology table, relabelled, not as the hero mart.

## CoCo / Cortex stack (this is the 40%)

Official pattern (workshops + [Getting Started with Cortex Agents with CoCo CLI](https://www.snowflake.com/en/developers/guides/getting-started-with-cortex-agents-with-coco/)):

1. `cortex` → generate/load data  
2. Cortex Search on transcripts  
3. Semantic view skill on facts  
4. Cortex Agent skill with Analyst + Search  
5. Chat with the agent from CoCo  
6. Deploy to Snowflake Intelligence / CoWork  

Extra (beats the sample sales-assistant lab):

- Second search service on **regulations**
- Custom skill `str-factory`
- Audit table + row-access story
- Abstain when ungrounded (Theme 1 is about audit; hallucinated STRs lose)

Install: `curl -LsS https://ai.snowflake.com/static/cc-scripts/install.sh | sh`  
Docs: https://docs.snowflake.com/en/user-guide/cortex-code/cortex-code-cli

If models are missing in APJ: ACCOUNTADMIN `ALTER ACCOUNT SET CORTEX_ENABLED_CROSS_REGION = 'AWS_US';`

Never commit the hackathon password, private key, or `connections.toml`.

## Workshops and YouTube

Hack2skill FAQ: sessions are recorded and on-demand on the event portal (not all are public YouTube). GCC Edition:

- Workshop 1 (12 Aug 2026) — CoCo CLI starter (environment, workflow, core concepts). APJ analogue speaker: **Abhay Singh**.
- Workshop 2 (19 Aug 2026) — hands-on AI apps (implementation, enterprise practices). APJ analogue speaker: **Sarita Priyadarshini**.
- AMA 25 Aug 2026.

Public videos that teach the same motions:

| Video | URL | Use for |
| --- | --- | --- |
| CoCo agent workshop — intro | https://youtu.be/Vp2p7jHkHHA | What CoCo is |
| CoCo agent workshop — full build | https://youtu.be/0o_7TmiaeGY | End-to-end agent |
| Export to stage | https://youtu.be/Fnx0xtOC92I | Sharing artifacts |
| Migrate PySpark with CoCo CLI | https://youtu.be/O9fqLg2nAKc | CLI as data engineer |
| Deploy Python pipelines with Cortex Code | https://youtu.be/qMU1MGCqkMU | Single-prompt deploy |
| Summit 2026 platform keynote (CoCo / CoWork) | https://youtu.be/CtqKJV6gyGQ | Narrative for slides |

Repos: [building-ai-agents-with-coco-workshop](https://github.com/sfc-gh-rbachala/building-ai-agents-with-coco-workshop), [HandsOnLabs CoCo CLI](https://github.com/calebaalexander/HandsOnLabs/tree/main/2-Cortex-Code/CoCo%20CLI).

## End-to-end path for the team (now → finale)

### Before 1 Sep (prototype)

1. Register / confirm team Westerly on Hack2skill. Pick **Theme 1** only.
2. Record a 3–5 min unlisted video: Command center → two copilot questions → STR JSON download → 60s of a CoCo terminal session creating the agent.
3. Submit: Git repo, video, 1-pager (problem, architecture, CoCo objects, demo prompts).
4. Keep Snowflake objects named `SENTINEL.*` so judges can poke them if they have your account.

### 2–21 Sep (evaluation)

Do not go dark. Add: Streamlit-in-Snowflake twin, more verified queries on the semantic view, a board LCR pack PDF generated by CoCo.

### 1–4 Oct (finale)

Live demo. One driver, one talker. If Wi-Fi dies, the Next.js app is the fallback — same prompts, same answers.

## 3-minute demo script

1. **0:00** “Aarohan is an NBFC. FIU-IND still gets Word docs. We built Sentinel on Snowflake CoCo.”
2. **0:20** Command center KPIs. Point at two critical alerts.
3. **0:40** Copilot: “Show mule accounts with cash-outs after 2am.” Show SQL + RBI mule citation + network sketch.
4. **1:20** Copilot: “Is Rahul Mehta structuring under the ₹10L CTR?” Show PMLA Rule 3.
5. **1:50** Open CASE-1088, play the transcript, freeze already applied.
6. **2:10** STR factory → download pack → “this is the audit-ready output, 7-day clock.”
7. **2:30** Audit log. “Internal audit can replay every copilot answer.”
8. **2:45** Terminal clip: CoCo creating the agent. Close: “Same stack the workshops taught, pointed at a real MLRO workflow.”

## What not to do

- Do not fine-tune a random fraud model on Kaggle and wrap a chat UI. Weak on CoCo, weak on regulations.
- Do not use real customer data or scraped PAN/Aadhaar.
- Do not skip citations. Theme 1 is a compliance product.
- Do not build all five themes. Depth wins.

## Support

- cococlihackgcc-support@hack2skill.com
- Snowflake Discourse group linked from the event page

## Architecture (one slide)

```
Analyst NL
    → Cortex Agent (CoCo-built)
         ├ Cortex Analyst + semantic view  (txns, LCR, RWA, alerts)
         ├ Cortex Search                   (calls, RBI/PMLA chunks)
         └ STR factory skill               (FIU-IND pack)
    → Next.js / Streamlit surfaces
    → COPILOT_AUDIT (immutable)
```
