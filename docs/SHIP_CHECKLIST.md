# Final shipping checklist — Codeanigans / Sentinel

## A. Product gates (engineering)

- [x] `/api/health` → `status: ok`, `snowflake: connected` (2026-10-01)
- [ ] Command center shows **Snowflake SENTINEL.RISK** banner (confirm in browser)
- [x] `/copilot` → Cortex Agent badge on live answers
- [x] `/audit` → Snowflake rows with **answer replay**
- [x] `/str?caseId=CASE-1088` → pack source Snowflake; JSON in `output/CASE-1088-STR.json`
- [x] `docs/judge-runs.md` — Next.js 7/7 Pass (CoWork pending)
- [x] Abstain prompt passes (Next.js); CoWork pending
- [ ] Optional: `snowflake/07_dedupe_mart.sql` run once
- [x] `./scripts/preflight.sh` passes

## B. Snowflake / CoCo (judges)

- [ ] Objects exist: `SENTINEL_AGENT`, `RISK_ANALYTICS`, Search services (per `coco/PROMPTS.md`)
- [ ] CoWork URL recorded in `docs/judge-runs.md`
- [ ] 60s terminal clip: `cortex` or deploy script in video
- [ ] Optional: `output/CASE-*-STR.json` from str-factory skill

## C. Submission pack (Hack2skill)

- [ ] GitHub repo URL (public or judge-accessible)
- [ ] Theme **1** — Risk, Fraud & Regulatory Intelligence Copilot
- [ ] **3–5 min video** (unlisted YouTube/Vimeo): product + CoCo/CoWork
- [ ] **1-pager PDF**: problem, architecture, `SENTINEL.*` FQNs, 6 demo prompts, synthetic data disclaimer
- [ ] Team name **Codeanigans**

## D. 3-minute script (memorize)

1. Aarohan NBFC / FIU pain  
2. Command center — two alerts  
3. Copilot: mule prompt → tools + SQL  
4. Copilot: Rahul CTR or LCR  
5. CASE-1088 + call evidence  
6. STR download  
7. Audit log  
8. CoWork / CoCo clip — same agent name  

## E. After submit

- [ ] Keep Snowflake warehouse objects up through evaluation
- [ ] No new features — demo-breaker fixes only
- [ ] Rotate password if ever exposed; re-run `sync-cortex-connection.mjs`
