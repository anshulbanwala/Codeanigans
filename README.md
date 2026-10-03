# Sentinel · Codeanigans

**Snowflake CoCo CLI Hackathon 2026 — GCC Edition · Theme 1**

Risk, fraud, and regulatory intelligence copilot for **Aarohan Finance Ltd.** (synthetic Indian NBFC). Built with **Snowflake CoCo CLI (`cortex`)**: mart, Cortex Search, semantic view, Cortex Agent, and custom STR skill.

**Judges:** start with **[SUBMISSION.md](SUBMISSION.md)** (architecture, 5-minute tour, demo prompts).

## Repo map

| Path | Purpose |
|------|---------|
| `app/` | Next.js desk (copilot, investigations, STR, audit) |
| `coco/PROMPTS.md` | CoCo session prompts to reproduce the Snowflake stack |
| `coco/skills/str-factory/` | Custom STR skill for CoCo |
| `cortex_project/` | Agent + semantic view YAML |
| `scripts/` | `deploy-cortex.sh`, `sync-cortex-connection.mjs`, `seed-hero-cases.mjs` |
| `snowflake/README.md` | Mart + hero-case seed notes |
| `streamlit/` | Optional Snowsight Streamlit companion |

## Run locally

```bash
npm install
cp .env.example .env.local   # Snowflake creds — never commit
npm run dev
```

Open http://127.0.0.1:43127 · **`/api/health`** should show Snowflake connected.

```bash
npm run build    # production check
npm run seed:hero   # upsert hero cases into SENTINEL.RISK (once per account)
```

## Reproduce Snowflake (CoCo)

```bash
curl -LsS https://ai.snowflake.com/static/cc-scripts/install.sh | sh
cortex   # hackathon account
```

Follow **`coco/PROMPTS.md`**, then hero seed (`snowflake/README.md`), then:

```bash
node scripts/sync-cortex-connection.mjs   # optional: from .env.local
./scripts/deploy-cortex.sh
```

## Live demo

Deploy on **Vercel** with the same `SNOWFLAKE_*` variables as `.env.example`. Copilot routes use extended timeouts (`vercel.json`).

All customer data is **synthetic**.
