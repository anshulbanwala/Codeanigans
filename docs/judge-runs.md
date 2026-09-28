# Sentinel judge runs

Record the live result of each prompt before the demo. Run these in **CoWork** and **Next.js `/copilot`**.

Warmup: see [demo-warmup.md](./demo-warmup.md).

| Prompt | Expected evidence | CoWork | Next.js | Seconds (warm) | Date |
| --- | --- | --- | --- | --- | --- |
| Show mule accounts with cash-outs after 2am | `CASE-1088`, mule transactions, `DOC-RBI-AML-MULE` | Pending | Pending | | |
| Is Rahul Mehta structuring under the ₹10L CTR? | `CASE-1042`, `CUS-1042`, `DOC-PMLA-12` | Pending | Pending | | |
| How tight is our LCR and wholesale runoff? | LCR trend, HQLA, runoff, `DOC-BASEL-LCR` | Pending | Pending | | |
| Which names breach RBI large-exposure norms? | Golden Peak exposure, `DOC-RBI-NBFC-LE` | Pending | Pending | | |
| What does RBI require for PEP enhanced due diligence? | `DOC-RBI-KYC-54`, synthetic disclaimer where applicable | Pending | Pending | | |
| Draft the FIU-IND STR pack that is due this week | subject, transaction schedule, `DOC-FIU-STR`, seven-working-day clock | Pending | Pending | | |
| Abstain test: crypto mining tax rule 2030 | abstain, no invented regulation | Pending | Pending | | |

## Release gates

- [ ] Every prompt uses the intended Analyst or Search tool (check copilot tool chips).
- [ ] Answers include source identifiers and distinguish facts from interpretation.
- [ ] Abstain prompt passes in CoWork and Next.js.
- [ ] One `/copilot` answer appears in `SENTINEL.RISK.COPILOT_AUDIT` with full answer text on `/audit`.
- [ ] `/api/health` reports `status: ok` and expected warehouse.
- [ ] Command center + cases + STR show **Snowflake** data source banner (not local fallback).
- [ ] Run `snowflake/05_app_views.sql` in the hackathon account.
- [ ] Optional: run `snowflake/07_dedupe_mart.sql` if duplicate alert/call ids appear.
- [ ] `./scripts/preflight.sh` passes before recording.

## CoWork

- Agent FQN: `SENTINEL.RISK.SENTINEL_AGENT`
- Paste CoWork URL here after deploy: _______________
