#!/usr/bin/env bash
# One-time: link Vercel project and push IDs + token to GitHub Actions secrets.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if ! command -v vercel >/dev/null 2>&1; then
  echo "Installing Vercel CLI..."
  npm install -g vercel@62.1.0
fi

if ! command -v gh >/dev/null 2>&1; then
  echo "Install GitHub CLI: https://cli.github.com/"
  exit 1
fi

echo "Log in to Vercel (browser opens)..."
vercel login

echo "Link this repo to a Vercel project (create new if prompted)..."
vercel link

ORG_ID=$(node -e "console.log(JSON.parse(require('fs').readFileSync('.vercel/project.json','utf8')).orgId)")
PROJECT_ID=$(node -e "console.log(JSON.parse(require('fs').readFileSync('.vercel/project.json','utf8')).projectId)")

echo ""
echo "Create a token at: https://vercel.com/account/tokens"
read -rsp "Paste VERCEL_TOKEN: " TOKEN
echo ""

gh secret set VERCEL_ORG_ID --body "$ORG_ID"
gh secret set VERCEL_PROJECT_ID --body "$PROJECT_ID"
gh secret set VERCEL_TOKEN --body "$TOKEN"

echo ""
echo "Add Snowflake env vars in Vercel Dashboard → Project → Settings → Environment Variables"
echo "Then: vercel --prod   OR push to main to trigger .github/workflows/vercel-deploy.yml"
echo "See docs/VERCEL.md"
