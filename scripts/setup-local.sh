#!/usr/bin/env bash
# Local dev + Snowflake env for Sentinel (Codeanigans)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ ! -f .env.local ]]; then
  cp .env.example .env.local
  echo "Created .env.local from .env.example — fill in SNOWFLAKE_ACCOUNT, USER, PASSWORD."
fi

if ! command -v node >/dev/null; then
  echo "Node.js is required."
  exit 1
fi

npm install

export PATH="${HOME}/.local/bin:${PATH}"
if command -v cortex >/dev/null; then
  echo "Cortex Code CLI: $(cortex --version 2>/dev/null || cortex version 2>/dev/null || echo installed)"
else
  echo "Installing Cortex Code CLI (cortex)..."
  NON_INTERACTIVE=1 SKIP_PATH_PROMPT=1 sh -c 'curl -LsS https://ai.snowflake.com/static/cc-scripts/install.sh | sh'
  export PATH="${HOME}/.local/bin:${PATH}"
fi

echo ""
echo "Next steps:"
echo "  1. Edit $ROOT/.env.local with hackathon Snowflake credentials"
echo "  2. In Snowflake worksheet: run snowflake/01_schema.sql through 05_app_views.sql"
echo "  3. From repo: cd cortex_project && cortex (connect) — deploy agent per coco/PROMPTS.md"
echo "  4. npm run dev  →  http://127.0.0.1:43127"
echo ""
