# Copilot latency (why 140s happens and how to get to ~30–50s)

## Why STR prompts are slow

`Draft the FIU-IND STR pack that is due this week` often triggers **multiple Cortex tools** (Analyst + regulatory search + sometimes calls) and a **long answer**. On a **cold warehouse** or **cold agent**, 90–140s is common.

The **formal filing pack** is faster from **STR factory** (`/str?caseId=CASE-1042`) — use copilot for narrative + citations, STR page for download.

---

## Do this before every demo (2 minutes)

1. Snowflake worksheet:

```sql
ALTER WAREHOUSE SENTINEL_WH RESUME IF SUSPENDED;
ALTER WAREHOUSE SENTINEL_WH SET AUTO_SUSPEND = 120;
SELECT COUNT(*) FROM SENTINEL.RISK.OPEN_ALERTS_V;
```

2. Open `/copilot` (calls `/api/warmup` automatically).

3. **Throwaway question** in CoWork or app: `Show mule accounts with cash-outs after 2am` — discard the answer.

4. Ask your **real** demo questions second.

---

## App changes (this repo)

| Mechanism | Effect |
| --- | --- |
| `/api/warmup` + copilot mount | Resumes WH + pings mart before you type |
| `warmupSnowflakeForCopilot()` on each `/api/copilot` POST | Keeps session warm |
| Agent YAML STR routing | STR questions → max ~2 tools, shorter answer |
| `COPILOT_DEMO_CACHE=true` in `.env.local` | Repeats **exact same** question in &lt;1s (rehearsal only) |

After editing agent YAML, redeploy:

```bash
./scripts/deploy-cortex.sh
```

---

## Demo script tweak (recommended)

| Instead of | Use |
| --- | --- |
| Long STR draft in chat (140s) | Copilot: `Which STR packs are audit-ready this week?` (~40s) |
| Full pack in chat | **STR factory** → Download JSON/Markdown |

---

## Realistic targets (warm warehouse)

| Prompt type | Target |
| --- | --- |
| Mule / CTR / LCR | 25–45s |
| STR summary in chat | 35–55s |
| Deep “investigate everything” | 60–90s — avoid live |

Log seconds in `docs/judge-runs.md`.
