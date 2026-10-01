# How to fill everything — step by step

Use this with `docs/judge-runs.md`, `docs/ONE_PAGER.md`, and Hack2skill.

---

## Part A — `docs/judge-runs.md` (CoWork column)

**Who:** One person with Snowflake / CoWork access.  
**When:** After `docs/demo-warmup.md` (warehouse warm).

1. Open **Snowflake CoWork** (or Snowflake Intelligence) and select agent **`SENTINEL.RISK.SENTINEL_AGENT`**.
2. Copy the **browser URL** → paste under **“Paste CoWork URL here”** at the bottom of `docs/judge-runs.md`.
3. For **each row** in the table (7 prompts), type the **exact prompt** from the first column.
4. In the **CoWork** column, write **Pass** or **Fail**.
5. In **Seconds (warm)**, use a stopwatch from Enter → answer complete (target: under 90s for most; STR chat can be slow — OK to use shorter STR question in CoWork if needed).
6. Set **Date** to today (`YYYY-MM-DD`).
7. **Pass criteria (quick):**
   - Mule → cites mule/CASH/`DOC-RBI-AML-MULE` or similar.
   - Rahul → `1042`, CTR/PMLA.
   - LCR → numbers + liquidity doc.
   - Large exposure → **Golden Peak** + breach / board reporting language.
   - PEP → KYC doc id.
   - STR → FIU / seven-day clock (full pack: use app `/str` in video).
   - Abstain → **no** invented 2030 tax rule; says out of scope.
8. Tick **release gate**: open command center in browser → confirm **Snowflake** banner (not “offline demo”).
9. Commit: `git add docs/judge-runs.md && git commit -m "Certify CoWork judge runs"` (optional).

---

## Part B — One-pager PDF (judges)

**Who:** Anyone.  
**Source file:** `docs/ONE_PAGER.md` (technical version).

1. Open Google Docs or Word → paste contents of **`docs/ONE_PAGER.md`**.
2. Add **one architecture diagram** (export from draw.io or screenshot the ASCII block, cleaned up).
3. Optional second mini-diagram: **data flow** (tables → semantic view + search → agent → STR + audit).
4. Keep to **1–2 pages** (judges skim).
5. Export **PDF** → name: `Codeanigans-Sentinel-OnePager.pdf`.

**What to emphasize (already in ONE_PAGER):** data scale, Snowflake FQNs, CoCo path, why Theme 1 is fully covered, synthetic disclaimer.

---

## Part C — Video (3–5 minutes)

**Who:** Lead + screen recorder (OBS / Loom / QuickTime).  
**Script:** `docs/SHIP_CHECKLIST.md` section D.

| Time | What to show | What to say (short) |
|------|----------------|---------------------|
| 0:00–0:25 | Title slide or command center | Aarohan NBFC; FIU still gets Word docs; Sentinel on Snowflake CoCo |
| 0:25–1:00 | KPIs + 2 alerts | Snowflake live data banner visible |
| 1:00–1:45 | `/copilot` — mule prompt | Tools/SQL + `DOC-RBI-AML-MULE` |
| 1:45–2:15 | Second prompt — Rahul CTR or LCR | Citations |
| 2:15–2:35 | CASE-1088 case page | Transcript / freeze |
| 2:35–2:55 | `/str?caseId=CASE-1088` → download JSON | Audit-ready regulatory output |
| 2:55–3:10 | `/audit` | Immutable replay |
| 3:10–3:45 | Terminal: `cortex` or CoWork same agent FQN | Same stack as workshops |
| End | Repo URL on screen | github.com/anshulbanwala/Codeanigans |

Upload **unlisted** YouTube or Vimeo → copy link for Hack2skill.

---

## Part D — Hack2skill form

**URL:** https://hack2skill.com/event/cococlihack-gccedition  
**Login:** Your registered Hack2skill account.

Typical fields (wording may vary):

| Field | What to enter |
|-------|----------------|
| Team name | **Codeanigans** |
| Theme / track | **Theme 1** — Risk, Fraud & Regulatory Intelligence Copilot |
| Project title | **Sentinel** |
| GitHub / repo | `https://github.com/anshulbanwala/Codeanigans` |
| Demo video | Unlisted YouTube/Vimeo URL |
| Document | Upload **PDF** from Part B |
| **Prototype Deployed Link** | `https://<your-app>.vercel.app` — see **`docs/VERCEL.md`** |
| Description (if box) | 2–3 sentences from ONE_PAGER problem + solution |
| Snowflake objects (if box) | `SENTINEL.RISK.SENTINEL_AGENT`, `RISK_ANALYTICS`, `CALL_SEARCH`, `REG_DOC_SEARCH` |

Submit before the portal deadline on the event page.

---

## Part E — After submit

- Keep Snowflake warehouse/objects **running** through evaluation.
- No new features — only demo-breakers.
- If agent redeployed: run `08_app_developer_grants.sql` again.

---

## Quick verification before you upload

```bash
git pull
npm run dev
./scripts/preflight.sh
npm run certify:prompts   # optional re-check
```
