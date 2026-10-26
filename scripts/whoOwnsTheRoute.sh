#!/usr/bin/env bash
# Read-only diagnostic: which Worker actually serves xtsy.one?
#
# A Worker can be attached to a hostname two ways, and they do not rank equally:
# a Custom Domain on one Worker takes precedence over another Worker's route
# pattern for the same hostname. So `wrangler deploy` can report success, the
# route can exist, and the Worker can still never run. This prints both lists
# as check annotations so that distinction is visible.
set -uo pipefail

api() {
  curl -sS --max-time 20 \
    -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
    -H "Content-Type: application/json" \
    "https://api.cloudflare.com/client/v4/$1"
}

zid=$(api "zones?name=xtsy.one" | python3 -c '
import json,sys
try: r=(json.load(sys.stdin).get("result") or [])
except Exception: r=[]
print(r[0]["id"] if r else "")
')

if [ -z "$zid" ]; then
  echo "::warning::could not read the xtsy.one zone (token may lack Zone:Read)"
else
  echo "::notice::zone found, id ends ...${zid: -4}"
  api "zones/$zid/workers/routes" | python3 -c '
import json,sys
try: rs=(json.load(sys.stdin).get("result") or [])
except Exception: rs=[]
if not rs:
    print("::warning::no Worker ROUTES on this zone")
for r in rs:
    print(f"::notice::route {r.get(\"pattern\")} -> worker {r.get(\"script\")}")
'
fi

api "accounts/${CLOUDFLARE_ACCOUNT_ID}/workers/domains" | python3 -c '
import json,sys
try: rs=(json.load(sys.stdin).get("result") or [])
except Exception: rs=[]
if not rs:
    print("::notice::no Worker CUSTOM DOMAINS on this account")
for r in rs:
    print(f"::notice::custom-domain {r.get(\"hostname\")} -> worker {r.get(\"service\")}")
'
