# CoCo CLI session — run in order after `cortex`

```bash
curl -LsS https://ai.snowflake.com/static/cc-scripts/install.sh | sh
cortex
```

Use hackathon Snowflake credentials in the wizard. Do not commit passwords.

## 0. Privileges

```
What privileges does my role have? Can I create databases, Cortex Search services, semantic views, and Cortex Agents?
```

If Cortex models 404:

```sql
ALTER ACCOUNT SET CORTEX_ENABLED_CROSS_REGION = 'AWS_US';
```

## 1. Mart (CoCo-generated)

```
Create database SENTINEL, schema RISK, warehouse SENTINEL_WH (XSMALL, auto-suspend 60s).

Create governed tables for an Indian NBFC AML demo: CUSTOMERS, ACCOUNTS, TRANSACTIONS, ALERTS, CASES, CALL_TRANSCRIPTS, REG_DOCS, LIQUIDITY_DAILY, CREDIT_EXPOSURES, COPILOT_AUDIT.

Seed hero customers: Rahul Mehta CUS-1042, mule trio CUS-1088/1089/1090, PEP Vikram Desai CUS-1101, Meru CUS-1115 and Sagar CUS-1116, Golden Peak Realty CUS-1304.

Generate realistic synthetic data:
- 800+ TRANSACTIONS over 14 days (~1.2% fraud): structuring under ₹10L CTR, mule cash-out after 02:00 IST, related-party round trip, PEP wealth mismatch.
- ALERTS for CASE-1042, CASE-1088, CASE-1101, CASE-1115.
- 40 CALL_TRANSCRIPTS (RM / WhatsApp).
- REG_DOCS: PMLA CTR, RBI KYC PEP, FIU-IND STR timing, RBI large exposure, Basel LCR, RBI mule guidance + 10 synthetic NBFC chunks.
- LIQUIDITY_DAILY 30 days, LCR 102–118.
- CREDIT_EXPOSURES ~25 names, Golden Peak ~11% of book.

Enable change tracking on CALL_TRANSCRIPTS and REG_DOCS.
```

After the mart exists, upsert the four Investigations hero cases (idempotent):

```bash
node scripts/seed-hero-cases.mjs
```

This MERGEs CASE-1042, CASE-1088, CASE-1101, CASE-1115 plus linked customers, accounts, alerts, transactions, and call transcripts into `SENTINEL.RISK` so the Next.js app reads them only from Snowflake.

## 2. Cortex Search

```
Create Cortex Search service CALL_SEARCH on SENTINEL.RISK.CALL_TRANSCRIPTS (transcript_text, attributes customer_id, call_id) using SENTINEL_WH.

Create REG_DOC_SEARCH on SENTINEL.RISK.REG_DOCS (excerpt, attributes title, topic, clause, doc_id) using SENTINEL_WH.
```

## 3. Semantic view

```
Using the semantic-view skill, create SENTINEL.RISK.RISK_ANALYTICS on TRANSACTIONS, ALERTS, CUSTOMERS, LIQUIDITY_DAILY, CREDIT_EXPOSURES.

Business terms: CTR ₹10 lakh cash; mule = inbound then cash-out within 60 minutes; large exposure >10% of book.

Add verified queries: open alerts by typology; structuring under 10 lakh; mule cash-outs after 2am; LCR last 14 days; names above 10% of book.
```

## 4. Cortex Agent

```
Using the cortex-agent skill, create agent SENTINEL.RISK.SENTINEL_AGENT with:
- risk_analytics on SENTINEL.RISK.RISK_ANALYTICS
- reg_doc_search on REG_DOC_SEARCH
- call_search on CALL_SEARCH

MLRO persona for Aarohan Finance. Route metrics to Analyst, policy/transcripts to Search. Cite SQL or clauses; abstain if ungrounded. Offer FIU-IND STR pack when suspicion is established. Deploy to CoWork.
```

Or deploy from repo YAML:

```bash
./scripts/deploy-cortex.sh
```

## 5. Demo prompts

```
Chat with SENTINEL.RISK.SENTINEL_AGENT:
- Show mule accounts with cash-outs after 2am
- Is Rahul Mehta structuring under the ₹10L CTR?
- How tight is our LCR and wholesale runoff?
- Which names breach RBI large-exposure norms?
- What does RBI require for PEP enhanced due diligence?
- Draft the FIU-IND STR pack that is due this week
```

## 6. Custom skill

```
Use coco/skills/str-factory/SKILL.md to generate FINNet-style STR markdown + JSON for CASE-1042 into ./output/
```

## 7. App role (after agent deploy)

```
Grant role APP_DEVELOPER usage on warehouse SENTINEL_WH, database SENTINEL, schema RISK, select on mart tables, insert on COPILOT_AUDIT, usage on agent SENTINEL.RISK.SENTINEL_AGENT, semantic view RISK_ANALYTICS, and both search services.
```
