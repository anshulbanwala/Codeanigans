# Deploy Sentinel on Vercel

Use this URL as **Prototype Deployed Link** on Hack2skill (plus CoWork for the Snowflake agent UI).

## 1. Prerequisites

- Vercel account: https://vercel.com  
- GitHub repo connected: `anshulbanwala/Codeanigans`  
- **Vercel Pro** (or team plan) recommended — copilot calls `DATA_AGENT_RUN` often need **>60s** (`maxDuration: 300` in `vercel.json`).

## 2. Import project (fastest — use GitHub)

**Option A — Browser (recommended, ~5 min)**

1. Open: https://vercel.com/new/import?s=https://github.com/anshulbanwala/Codeanigans  
2. **Continue with GitHub** → authorize → import **Codeanigans**  
3. Framework: **Next.js** · Root: `./` · Deploy  
4. Add environment variables (step 3 below) → **Redeploy**

**Option B — CLI + GitHub Actions (auto-deploy on every `main` push)**

```bash
chmod +x scripts/vercel-github-setup.sh
./scripts/vercel-github-setup.sh
```

Then add Snowflake env vars in the Vercel dashboard and run `vercel --prod` once, or push to `main` to trigger the workflow.

## 3. Environment variables (required)

In **Project → Settings → Environment Variables**, add for **Production** (and Preview if you want):

| Name | Example / notes |
|------|------------------|
| `SNOWFLAKE_ACCOUNT` | `vgwrwen-ed58886` |
| `SNOWFLAKE_USER` | `SENTINEL_DEV_USER` |
| `SNOWFLAKE_PASSWORD` | team secret (never commit) |
| `SNOWFLAKE_ROLE` | `APP_DEVELOPER` |
| `SNOWFLAKE_WAREHOUSE` | `SENTINEL_WH` |
| `SNOWFLAKE_DATABASE` | `SENTINEL` |
| `SNOWFLAKE_SCHEMA` | `RISK` |

Do **not** enable `COPILOT_DEMO_CACHE` in production unless rehearsing.

## 4. Deploy

Click **Deploy**, or from CLI:

```bash
npm i -g vercel   # once
cd /path/to/Codeanigans
vercel login
vercel link
vercel --prod
```

## 5. Verify

- `https://<your-project>.vercel.app/api/health` → `status: ok`, `snowflake: connected`  
- Command center shows **Snowflake** banner  
- `/copilot` — one short question after `/api/warmup`  

If copilot **times out** on Hobby plan, upgrade to Pro or use **CoWork URL** as primary prototype link.

## 6. Hack2skill form

| Field | Value |
|-------|--------|
| **Prototype Deployed Link** | `https://<your-project>.vercel.app` |
| **Description** | Also list CoWork: see `docs/judge-runs.md` |
| **GitHub** | https://github.com/anshulbanwala/Codeanigans |

## 7. After agent redeploy on Snowflake

Run `snowflake/08_app_developer_grants.sql` as ACCOUNTADMIN so `SENTINEL_DEV_USER` keeps agent access.
