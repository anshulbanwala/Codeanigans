#!/usr/bin/env bash
# Deploy Sentinel semantic view + agent (CoCo / Cortex CLI)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PROJECT="${ROOT}/cortex_project"
export PATH="${HOME}/.local/bin:${PATH}"

CONN="${CORTEX_CONNECTION:-sentinel}"
if [[ -z "$CONN" ]]; then
  ACTIVE="$(cortex connections list 2>/dev/null | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('active_connection') or '')" 2>/dev/null || true)"
  CONN="$ACTIVE"
fi

if [[ -z "$CONN" ]]; then
  echo "Run: cortex  — then: export CORTEX_CONNECTION=sentinel"
  exit 1
fi

echo "Using connection: $CONN"

cortex agent-studio sv-deploy -c "$CONN" \
  --file-path "${PROJECT}/RISK_ANALYTICS.sv.yaml" \
  --target default

cortex agent-studio agent-deploy -c "$CONN" \
  --file-path "${PROJECT}/SENTINEL_COPILOT.agent.yaml" \
  --target default

cortex agent-studio agent-publish -c "$CONN" --fqn SENTINEL.RISK.SENTINEL_AGENT 2>/dev/null || true

echo "Done. Re-apply APP_DEVELOPER grants via CoCo (coco/PROMPTS.md §7) if needed."
