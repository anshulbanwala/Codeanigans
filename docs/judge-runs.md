# Sentinel judge runs

Record the live result of each prompt before the demo. Run these in **CoWork** and **Next.js `/copilot`**.

Warmup: see [demo-warmup.md](./demo-warmup.md).

**Certification:** **7/7 Pass** on **Next.js** (2026-10-01, `npm run certify:prompts`) and **CoWork** (2026-10-02, manual judge prompts on live agent). Post `09_large_exposure_fix.sql`.

| Prompt | Expected evidence | CoWork | Next.js | Seconds (warm, Next.js) | Date |
| --- | --- | --- | --- | --- | --- |
| Show mule accounts with cash-outs after 2am | mule txns, `DOC-RBI-AML-MULE` | **Pass** | **Pass** | 36 | 2026-10-02 |
| Is Rahul Mehta structuring under the ₹10L CTR? | `CASE-1042`, `CUS-1042`, `DOC-PMLA-12` | **Pass** | **Pass** | 58 | 2026-10-02 |
| How tight is our LCR and wholesale runoff? | LCR trend, HQLA, runoff, `DOC-BASEL-LCR` | **Pass** | **Pass** | 70 | 2026-10-02 |
| Which names breach RBI large-exposure norms? | Golden Peak exposure, `DOC-RBI-NBFC-LE` | **Pass** | **Pass** | 31 | 2026-10-02 |
| What does RBI require for PEP enhanced due diligence? | `DOC-RBI-KYC-54`, synthetic disclaimer | **Pass** | **Pass** | 23 | 2026-10-02 |
| Draft the FIU-IND STR pack that is due this week | `DOC-FIU-STR`, seven-day clock | **Pass** | **Pass** | 52 | 2026-10-02 |
| Abstain test: crypto mining tax rule 2030 | abstain, no invented regulation | **Pass** | **Pass** | 17 | 2026-10-02 |

## Release gates

- [x] Every prompt uses the intended Analyst or Search tool (check copilot tool chips).
- [x] Answers include source identifiers and distinguish facts from interpretation.
- [x] Abstain prompt passes in Next.js and CoWork.
- [x] One `/copilot` answer appears in `SENTINEL.RISK.COPILOT_AUDIT` with full answer text on `/audit`.
- [x] `/api/health` reports `status: ok` and expected warehouse.
- [ ] Command center + cases + STR show **Snowflake** data source banner (verify in browser).
- [x] `snowflake/09_large_exposure_fix.sql` applied (Golden Peak + `BREACH_FLAG` view).
- [ ] Optional: run `snowflake/07_dedupe_mart.sql` if duplicate alert/call ids appear.
- [x] `./scripts/preflight.sh` passes before recording.

## CoWork

- Agent FQN: `SENTINEL.RISK.SENTINEL_AGENT`
- CoWork URL (certified): https://ai.snowflake.com/ap-southeast-7.aws/og86553#/ai/chat/37496376

## Automation

```bash
npm run dev
npm run certify:prompts
./scripts/preflight.sh
```

Snowflake fix (lead, ACCOUNTADMIN): `node scripts/run-sql-file.mjs snowflake/09_large_exposure_fix.sql`

## Submission pack (Hack2skill GCC)

- [ ] Theme **1** — Risk, Fraud & Regulatory Intelligence Copilot  
- [ ] Team **Codeanigans** · repo https://github.com/anshulbanwala/Codeanigans  
- [ ] **3–5 min video** — follow `docs/VIDEO_SCRIPT_FINAL.md` (full story; edit to ≤ 5 min)  
- [ ] **1-pager PDF** — export `docs/ONE_PAGER.md`  
- [ ] **Prototype link** — Vercel per `docs/VERCEL.md` or CoWork URL above  
- [ ] Keep Snowflake objects up through evaluation; no demo-breaking refactors after submit  
