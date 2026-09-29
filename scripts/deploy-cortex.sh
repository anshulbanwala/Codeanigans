#!/usr/bin/env bash
# Deploy Sentinel semantic view + agent from repo YAML (requires cortex CLI + Snowflake connection)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PROJECT="${ROOT}/cortex_project"
export PATH="${HOME}/.local/bin:${PATH}"

CONN="${CORTEX_CONNECTION:-}"
if [[ -z "$CONN" ]]; then
  ACTIVE="$(cortex connections list 2>/dev/null | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('active_connection') or '')" 2>/dev/null || true)"
  CONN="$ACTIVE"
fi

if [[ -z "$CONN" ]]; then
  echo "No Snowflake connection for Cortex CLI."
  echo "Run:  cortex"
  echo "Then add your hackathon connection (same account as .env.local)."
  echo "Or:   export CORTEX_CONNECTION=your_connection_name"
  exit 1
fi

echo "Using connection: $CONN"

echo "Deploying semantic view RISK_ANALYTICS..."
cortex agent-studio sv-deploy -c "$CONN" \
  --file-path "${PROJECT}/RISK_ANALYTICS.sv.yaml" \
  --target default

echo "Deploying agent SENTINEL_COPILOT..."
cortex agent-studio agent-deploy -c "$CONN" \
  --file-path "${PROJECT}/SENTINEL_COPILOT.agent.yaml" \
  --target default

echo "Publishing agent live version..."
cortex agent-studio agent-publish -c "$CONN" --fqn SENTINEL.RISK.SENTINEL_AGENT 2>/dev/null || true

echo "Restoring APP_DEVELOPER grants (agent deploy resets USAGE)..."
if [[ -n "${SNOWFLAKE_ADMIN_USER:-}" && -n "${SNOWFLAKE_ADMIN_PASSWORD:-}" ]]; then
  SNOWFLAKE_USER="$SNOWFLAKE_ADMIN_USER" \
  SNOWFLAKE_PASSWORD="$SNOWFLAKE_ADMIN_PASSWORD" \
  SNOWFLAKE_ROLE="${SNOWFLAKE_ADMIN_ROLE:-ACCOUNTADMIN}" \
    node "${ROOT}/scripts/run-sql-file.mjs" "${ROOT}/snowflake/08_app_developer_grants.sql" || {
      echo "Warning: grant script failed — run snowflake/08_app_developer_grants.sql as ACCOUNTADMIN."
    }
else
  echo "Set SNOWFLAKE_ADMIN_USER + SNOWFLAKE_ADMIN_PASSWORD to auto-apply grants, or run:"
  echo "  node scripts/run-sql-file.mjs snowflake/08_app_developer_grants.sql  # with ACCOUNTADMIN in env"
fi

echo "Done. Verify: cortex agents list -c $CONN"
echo "Shared dev: node scripts/test-copilot-access.mjs (with APP_DEVELOPER in .env.local)"
