#!/usr/bin/env bash
# Copy every JSON/MD file in $2 to ci-screenshots:${3:-perf-full}/$1/ (adds/overwrites, never deletes),
# retrying the push when parallel shards race each other.
set -euo pipefail
LABEL="$1"; SRC="$(cd "$2" && pwd)"; ROOT="${3:-perf-full}"
ls "$SRC"/*.json >/dev/null 2>&1 || { echo "nothing to publish"; exit 0; }
for i in 1 2 3 4 5 6 7 8 9 10; do
  rm -rf /tmp/pub && mkdir -p /tmp/pub && cd /tmp/pub
  git init -q .
  git config user.name "xtsy-ci"; git config user.email "ci@xtsy.one"
  git remote add origin "https://x-access-token:${GH_TOKEN}@github.com/${GITHUB_REPOSITORY}.git"
  if git fetch -q --depth=1 origin ci-screenshots 2>/dev/null; then git checkout -q FETCH_HEAD; else git checkout -q --orphan ci-screenshots; fi
  mkdir -p "$ROOT/$LABEL"
  cp "$SRC"/*.json "$ROOT/$LABEL/"; cp "$SRC"/*.md "$ROOT/$LABEL/" 2>/dev/null || true
  git add -A
  git commit -q -m "$ROOT ($LABEL) @ $(date -u +%FT%TZ)" || exit 0
  git push -q origin HEAD:ci-screenshots && exit 0
  sleep $((RANDOM % 10 + 3))
done
exit 1
