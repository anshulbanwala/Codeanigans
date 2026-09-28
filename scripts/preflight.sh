#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
PORT="${PORT:-43127}"
BASE="http://127.0.0.1:${PORT}"

echo "== Sentinel preflight =="

if [[ ! -f .env.local ]]; then
  echo "FAIL: .env.local missing"
  exit 1
fi

node scripts/test-snowflake.mjs || { echo "FAIL: Snowflake mart query"; exit 1; }

if ! curl -sf "${BASE}/api/health" >/dev/null 2>&1; then
  echo "WARN: dev server not on ${BASE} — start with: npm run dev"
  exit 0
fi

HEALTH=$(curl -sf "${BASE}/api/health")
echo "$HEALTH" | python3 -m json.tool

STATUS=$(echo "$HEALTH" | python3 -c "import sys,json; print(json.load(sys.stdin).get('status',''))")
if [[ "$STATUS" != "ok" ]]; then
  echo "FAIL: /api/health status is not ok"
  exit 1
fi

CASES=$(curl -sf "${BASE}/api/cases")
COUNT=$(echo "$CASES" | python3 -c "import sys,json; print(len(json.load(sys.stdin).get('cases',[])))")
echo "Cases API: ${COUNT} cases"

echo "PASS: preflight complete"
