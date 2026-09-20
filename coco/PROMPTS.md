# CoCo CLI prompts — run these in order after `cortex`

Install (macOS/Linux):

```bash
curl -LsS https://ai.snowflake.com/static/cc-scripts/install.sh | sh
cortex
```

Use the hackathon Snowflake connection when the wizard asks. Do not commit passwords or private keys.

## 0. Privileges

```
What privileges does my role have? Can I create databases, Cortex Search services, semantic views, and Cortex Agents?
```

If Cortex models 404 in your region:

```sql
-- ACCOUNTADMIN
ALTER ACCOUNT SET CORTEX_ENABLED_CROSS_REGION = 'AWS_US';
```

## 1. Load the mart

Paste `snowflake/01_schema.sql` first, then:

```
Generate realistic synthetic data into SENTINEL.RISK.

Keep the existing seed customers (Rahul Mehta CUS-1042, the Kavya/Imran/Neha mule trio, PEP Vikram Desai, Meru Logistics and Sagar Traders, Golden Peak Realty).

Add:
- TRANSACTIONS: 800 rows over the last 14 days. ~1.2% fraudulent.
  Typologies: structuring just under ₹10 lakh CTR, mule cash-out after 02:00 IST, related-party round trip, PEP unusual wealth.
- ALERTS aligned to those typologies with scores and case ids CASE-1042, CASE-1088, CASE-1101, CASE-1115.
- CALL_TRANSCRIPTS: 40 short RM / WhatsApp transcripts. Some angry, some coaching mule behaviour.
- REG_DOCS: keep PMLA CTR, RBI KYC PEPs, FIU-IND STR timing, RBI SBR large exposures, Basel LCR, RBI mule guidance. Add 10 more Indian NBFC circular chunks.
- LIQUIDITY_DAILY for 30 days ending 2026-08-30, LCR oscillating 102-118.
- CREDIT_EXPOSURES for 25 names, Golden Peak Realty ~11% of book.

Enable change tracking on CALL_TRANSCRIPTS and REG_DOCS.
```

Run `snowflake/04_winner_expansion.sql` after the foundation scripts when the account needs the additive winner dataset. It is deterministic and idempotent for its generated IDs; it does not update or delete the original Sentinel scenarios. The script also restores `APP_DEVELOPER` grants after agent/semantic deployments.

## 2. Cortex Search

```
Create a Cortex Search service called CALL_SEARCH on SENTINEL.RISK.CALL_TRANSCRIPTS transcript_text with attributes customer_id using warehouse SENTINEL_WH.

Create a Cortex Search service called REG_DOC_SEARCH on SENTINEL.RISK.REG_DOCS excerpt with attributes title, topic, clause using warehouse SENTINEL_WH.
```

## 3. Semantic view (uses the semantic-view skill)

```
Using the semantic-view skill, create a Semantic View named SENTINEL.RISK.RISK_ANALYTICS for Cortex Analyst on TRANSACTIONS, ALERTS, CUSTOMERS, LIQUIDITY_DAILY and CREDIT_EXPOSURES.

Business terms:
- CTR threshold means ₹10 lakh cash, integrally connected
- mule means inbound then cash-out under 60 minutes
- LCR, NSFR, HQLA, CET1, RWA, large exposure as RBI/Basel define them
Add verified queries for: open alerts by typology, structuring just under 10 lakh, mule cash-outs after 2am, LCR last 14 days, names above 10% of book.
```

## 4. Cortex Agent (uses the cortex-agent skill)

```
Using the cortex-agent skill, create an agent SENTINEL.RISK.SENTINEL_AGENT.

Tools:
- cortex_analyst on semantic view SENTINEL.RISK.RISK_ANALYTICS
- cortex_search on CALL_SEARCH and REG_DOC_SEARCH

Persona: You are the MLRO copilot for Aarohan Finance, an Indian NBFC.
Routing: metrics, counts, LCR, RWA, amounts → Analyst. Transcripts, circulars, grounds of suspicion → Search.
Output: cite SQL or clause. If you cannot ground the answer, abstain.
If suspicion is established, offer to emit an FIU-IND STR pack (subjects, transaction schedule, clauses, 7 working day clock).
Never invent a regulation. Never unmask PAN in Slack-like channels; only in the STR pack.
Deploy the agent to Snowflake CoWork.
```

## 5. Test questions (judges will ask variants)

```
Chat with agent SENTINEL.RISK.SENTINEL_AGENT and ask: Show mule accounts with cash-outs after 2am
Ask: Is Rahul Mehta structuring under the ₹10L CTR?
Ask: How tight is our LCR and wholesale runoff?
Ask: Which names breach RBI large-exposure norms?
Ask: What does RBI require for PEP enhanced due diligence?
Ask: Draft the FIU-IND STR pack that is due this week
```

## 6. Streamlit in Snowflake (optional second surface)

```
Build a Streamlit-in-Snowflake app on SENTINEL.RISK that mirrors the local Next.js command center: KPIs, alert queue, copilot chat against SENTINEL_AGENT, and an STR download. Upload it and give me the URL.
```

## 7. Custom skill (show CoCo extensibility)

```
Create a custom skill .coco/skills/str-factory/SKILL.md that, given a CASE_ID, queries TRANSACTIONS + CALL_TRANSCRIPTS + REG_DOCS and writes a FINNet-style STR markdown + JSON to ./output/.
```

The skill file in this repo is already drafted at `coco/skills/str-factory/SKILL.md`.

## 8. Verification record

The deployed object names are:

- Agent: `SENTINEL.RISK.SENTINEL_AGENT`
- Semantic view: `SENTINEL.RISK.RISK_ANALYTICS`
- Search services: `SENTINEL.RISK.CALL_SEARCH`, `SENTINEL.RISK.REG_DOC_SEARCH`
- Audit table: `SENTINEL.RISK.COPILOT_AUDIT`

The Next.js app uses the same agent FQN through `SNOWFLAKE.CORTEX.DATA_AGENT_RUN`. Before recording, run the six prompts above in CoWork, then repeat at least one in `/copilot` and confirm a new row appears in `/audit`.
