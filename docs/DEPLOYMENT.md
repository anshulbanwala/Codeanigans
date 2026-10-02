# Sentinel — deployment & operations

## Environments

| Surface | Purpose | URL / object |
| --- | --- | --- |
| Next.js (local demo) | Hackathon UI + `DATA_AGENT_RUN` | `npm run dev` → http://127.0.0.1:43127 |
| Snowflake mart | Source of truth | `SENTINEL.RISK` |
| Cortex Agent | Copilot brain | `SENTINEL.RISK.SENTINEL_AGENT` |
| Semantic view | Analyst | `SENTINEL.RISK.RISK_ANALYTICS` |
| CoWork | Judge-facing chat | Snowflake UI → Intelligence / CoWork |
| Streamlit (optional) | In-warehouse dashboard | `streamlit/` → deploy in Snowflake |

---

## One-time Snowflake bootstrap

Run in worksheet (order matters):

1. `snowflake/01_schema.sql`
2. `snowflake/02_seed.sql`
3. `snowflake/03_expand.sql`
4. `snowflake/04_winner_expansion.sql`
5. `snowflake/05_app_views.sql`
6. **`snowflake/07_dedupe_mart.sql`** — if scripts were re-run and you see duplicate `CALL_*` / `ALRT_*` keys

Then CoCo prompts in **`coco/PROMPTS.md`** (Search services, extra data, optional IBM sample).

---

## Local app + credentials

```bash
./scripts/setup-local.sh
# edit .env.local — never commit
npm run dev
```

Preflight:

```bash
./scripts/preflight.sh
```

Expected: HTTP 200 on `/api/health` with `snowflake: connected`.

**Role:** use `ACCOUNTADMIN` (or your granted role) if `APP_DEVELOPER` is not on the user.

---

## Cortex Code CLI deploy (repeatable)

```bash
export PATH="$HOME/.local/bin:$PATH"
node scripts/sync-cortex-connection.mjs   # writes ~/.snowflake/connections.toml from .env.local
cortex connections set sentinel
./scripts/deploy-cortex.sh
```

Updates semantic view + agent YAML from `cortex_project/`.

---

## CoWork

1. Log in to [Snowflake](https://app.snowflake.com/).
2. Open **Snowflake Intelligence** / **CoWork**.
3. Chat with **`SENTINEL.RISK.SENTINEL_AGENT`** (same FQN as the app).
4. Paste the CoWork URL into `docs/judge-runs.md`.

---

## Streamlit in Snowflake (optional)

```bash
# From Snowflake UI: create Streamlit app, upload streamlit/streamlit_app.py + environment.yml
# Or ask CoCo: see coco/PROMPTS.md §6
```

Point the app at `SENTINEL.RISK` and warehouse `SENTINEL_WH`.

---

## Production-style hosting (Next.js)

For a public demo URL (Vercel, etc.):

1. Set env vars in the host dashboard (same keys as `.env.local`).
2. `npm run build` && deploy; ensure **serverless** can reach Snowflake (egress allowed).
3. Prefer **one region** close to Snowflake APJ/US for latency.
4. Do **not** commit `.env.local`.

Hackathon submission usually needs **GitHub + video**; live URL is optional unless the form asks for it.

---

## STR factory skill (CoCo)

```bash
# Copy coco/skills/str-factory into your cortex skills folder, then in cortex:
# "Generate STR for CASE-1042"
```

Artifacts land in `output/` (see `output/README.md`). Commit sample JSON **without** secrets.

---

## Demo day

1. `docs/demo-warmup.md` — 2 minutes before recording.
2. `docs/judge-runs.md` — certify all prompts + submission pack.
3. `docs/DEMO_SCRIPT.md` — record video (slides + live app + CoWork).

---

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| `APP_DEVELOPER` role error | Set `SNOWFLAKE_ROLE=ACCOUNTADMIN` in `.env.local` |
| Copilot 500 / timeout | Warm warehouse; see demo-warmup; agent falls back to local engine |
| Duplicate React keys | Run `07_dedupe_mart.sql`; app also dedupes in `lib/mart.ts` |
| Cortex connection empty | `node scripts/sync-cortex-connection.mjs` |
| Agent stale after YAML edit | `./scripts/deploy-cortex.sh` |
