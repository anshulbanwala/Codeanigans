# Sentinel judge runs

Record the live result of each prompt before the demo. Run these in **CoWork** and **Next.js `/copilot`**.

Warmup: see [demo-warmup.md](./demo-warmup.md).

**Last Next.js certification:** 2026-10-01 (`npm run certify:prompts`, agent engine, post `09_large_exposure_fix.sql`). **CoWork certification:** 2026-10-01 — 7/7 prompts passed against `SENTINEL.RISK.SENTINEL_AGENT`.

| Prompt | Expected evidence | CoWork | Next.js | Seconds (warm) | Date |
| --- | --- | --- | --- | --- | --- |
| Show mule accounts with cash-outs after 2am | mule txns, `DOC-RBI-AML-MULE` | **Pass** | **Pass** | 37 | 2026-10-01 |
| Is Rahul Mehta structuring under the ₹10L CTR? | `CASE-1042`, `CUS-1042`, `DOC-PMLA-12` | **Pass** | **Pass** | 13 | 2026-10-01 |
| How tight is our LCR and wholesale runoff? | LCR trend, HQLA, runoff, `DOC-BASEL-LCR` | **Pass** | **Pass** | 35 | 2026-10-01 |
| Which names breach RBI large-exposure norms? | Golden Peak exposure, `DOC-RBI-NBFC-LE` | **Pass** | **Pass** | 18 | 2026-10-01 |
| What does RBI require for PEP enhanced due diligence? | `DOC-RBI-KYC-54`, synthetic disclaimer | **Pass** | **Pass** | 20 | 2026-10-01 |
| Draft the FIU-IND STR pack that is due this week | `DOC-FIU-STR`, seven-day clock | **Pass** | **Pass** | 25 | 2026-10-01 |
| Abstain test: crypto mining tax rule 2030 | abstain, no invented regulation | **Pass** | **Pass** | 13 | 2026-10-01 |

## Release gates

- [x] Every prompt uses the intended Analyst or Search tool (check copilot tool chips).
- [x] Answers include source identifiers and distinguish facts from interpretation.
- [x] Abstain prompt passes in Next.js and CoWork.
- [x] One `/copilot` answer appears in `SENTINEL.RISK.COPILOT_AUDIT` with full answer text on `/audit`.
- [x] `/api/health` reports `status: ok` and expected warehouse.
- [x] Command center + cases + STR show **Snowflake** data source banner (verified in browser).
- [x] `snowflake/09_large_exposure_fix.sql` applied (Golden Peak + `BREACH_FLAG` view).
- [x] `./scripts/preflight.sh` passes before recording.

## CoWork

- Agent FQN: `SENTINEL.RISK.SENTINEL_AGENT`
- Paste CoWork URL here after deploy: https://ai.snowflake.com/ap-southeast-7.aws/og86553/#/ai/chat/37496380

## Automation

```bash
npm run dev
npm run certify:prompts
./scripts/preflight.sh
```

Snowflake fix (lead, ACCOUNTADMIN): `node scripts/run-sql-file.mjs snowflake/09_large_exposure_fix.sql`
