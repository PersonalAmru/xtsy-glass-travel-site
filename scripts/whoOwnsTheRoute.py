#!/usr/bin/env python3
"""Read-only diagnostic: which Worker actually serves xtsy.one?

A Worker can be attached to a hostname two ways, and they do not rank equally:
a Custom Domain on one Worker takes precedence over another Worker's route
pattern for the same hostname. So `wrangler deploy` can report success, the
route can exist, and the Worker can still never run.

Prints the zone's Worker routes and the account's Worker custom domains as
GitHub check annotations so that precedence is visible rather than inferred.
Never fails the job; it only reports.
"""
import json
import os
import sys
import urllib.error
import urllib.request

BASE = "https://api.cloudflare.com/client/v4"
# .strip() matters: a secret pasted with a trailing newline makes urllib reject
# the Authorization header outright ("Invalid header value"), while wrangler
# tolerates it — so the same token appears to work in one place and not the other.
TOKEN = os.environ.get("CLOUDFLARE_API_TOKEN", "").strip()
ACCOUNT = os.environ.get("CLOUDFLARE_ACCOUNT_ID", "").strip()
ZONE_NAME = os.environ.get("VERIFY_ZONE_NAME", "xtsy.one").strip()


def api(path):
    """GET a Cloudflare API path. Returns (result, error_message)."""
    req = urllib.request.Request(
        f"{BASE}/{path}",
        headers={"Authorization": f"Bearer {TOKEN}", "Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            body = json.load(r)
    except urllib.error.HTTPError as e:
        try:
            body = json.load(e)
        except Exception:
            return None, f"HTTP {e.code}"
    except Exception as e:
        return None, str(e)
    if not body.get("success", False):
        errs = body.get("errors") or []
        msg = "; ".join(f"{x.get('message')} [code: {x.get('code')}]" for x in errs) or "unknown error"
        return None, msg
    return body.get("result"), None


def note(msg):
    print(f"::notice::{msg}")


def warn(msg):
    print(f"::warning::{msg}")


def main():
    if not TOKEN:
        warn("CLOUDFLARE_API_TOKEN not set; skipping route diagnostic")
        return 0

    zones, err = api(f"zones?name={ZONE_NAME}")
    if err:
        warn(f"could not list the {ZONE_NAME} zone: {err}")
        zid = None
    elif not zones:
        warn(f"{ZONE_NAME} is not a zone on this account")
        zid = None
    else:
        zid = zones[0]["id"]
        note(f"zone {ZONE_NAME} found, id ends ...{zid[-4:]}")

    if zid:
        routes, err = api(f"zones/{zid}/workers/routes")
        if err:
            warn(f"could not list Worker routes (token may lack Workers Routes:Read): {err}")
        elif not routes:
            warn("no Worker ROUTES on this zone")
        else:
            for r in routes:
                pattern = r.get("pattern")
                script = r.get("script") or "(none)"
                note(f"route {pattern} -> worker {script}")

    if not ACCOUNT:
        warn("CLOUDFLARE_ACCOUNT_ID not set; cannot list Worker custom domains")
        return 0

    domains, err = api(f"accounts/{ACCOUNT}/workers/domains")
    if err:
        warn(f"could not list Worker custom domains: {err}")
    elif not domains:
        note("no Worker CUSTOM DOMAINS on this account")
    else:
        for d in domains:
            host = d.get("hostname")
            svc = d.get("service") or "(none)"
            note(f"custom-domain {host} -> worker {svc}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
