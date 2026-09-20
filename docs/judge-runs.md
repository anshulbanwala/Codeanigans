# Sentinel judge runs

Record the live result of each prompt before the demo. Run these in CoWork or the Cortex agent, then repeat at least one through `/copilot`.

| Prompt | Expected evidence | Result | Date |
| --- | --- | --- | --- |
| Show mule accounts with cash-outs after 2am | `CASE-1088`, mule transactions, `DOC-RBI-AML-MULE` | Pending | |
| Is Rahul Mehta structuring under the ₹10L CTR? | `CASE-1042`, `CUS-1042`, `DOC-PMLA-12` | Pending | |
| How tight is our LCR and wholesale runoff? | LCR trend, HQLA, runoff, `DOC-BASEL-LCR` | Pending | |
| Which names breach RBI large-exposure norms? | Golden Peak exposure, `DOC-RBI-NBFC-LE` | Pending | |
| What does RBI require for PEP enhanced due diligence? | `DOC-RBI-KYC-54`, synthetic-content disclaimer where applicable | Pending | |
| Draft the FIU-IND STR pack that is due this week | subject, transaction schedule, `DOC-FIU-STR`, seven-working-day clock | Pending | |

## Release gates

- [ ] Every prompt uses the intended Analyst or Search tool.
- [ ] Answers include source identifiers and distinguish facts from interpretation.
- [ ] One garbage question abstains instead of inventing a regulation.
- [ ] One `/copilot` answer appears in `SENTINEL.RISK.COPILOT_AUDIT`.
- [ ] `/api/health` reports the expected `APP_DEVELOPER` role and `SENTINEL_WH`.