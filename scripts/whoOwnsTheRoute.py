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

    # Whether Cloudflare proxies this hostname needs no API permission: a
    # proxied response always carries cf-ray. Absent cf-ray means the record is
    # "DNS only", the edge never sees the request, and the Worker route above is
    # inert however correctly it is configured.
    # Liveness probe. The Worker answers this path before any other logic, so
    # the status code says plainly whether the route dispatches to it.
    try:
        req = urllib.request.Request(
            f"https://{ZONE_NAME}/__xtsy_worker_probe",
            headers={"user-agent": "XTSY-RouteDiagnostic/1.0"},
        )
        with urllib.request.urlopen(req, timeout=20) as r:
            body = r.read(200).decode("utf-8", "replace").strip()
            note(f"PROBE {r.status}: {body[:120]}")
    except urllib.error.HTTPError as e:
        warn(f"PROBE returned HTTP {e.code} — the Worker did not answer this path")
    except Exception as e:
        warn(f"PROBE failed: {e}")

    for host in (ZONE_NAME, f"www.{ZONE_NAME}"):
        try:
            req = urllib.request.Request(
                f"https://{host}/",
                headers={"user-agent": "XTSY-RouteDiagnostic/1.0"},
            )
            with urllib.request.urlopen(req, timeout=20) as r:
                h = r.headers
                cf_ray = h.get("cf-ray")
                server = h.get("server", "")
                rendered = h.get("x-rendered-by", "")
                cache = h.get("cf-cache-status", "")
                age = h.get("age", "")
            if cf_ray:
                note(
                    f"{host}: PROXIED by Cloudflare (server={server}), "
                    f"x-rendered-by={rendered or 'MISSING'}"
                )
                if not rendered:
                    warn(
                        f"{host} is proxied and the route points at xtsy-prerender, "
                        "but the Worker set no header - it is not executing"
                    )
                # Whether the HTML is a cached copy decides whether a fresh
                # origin build is even reachable. A publish cannot show up
                # behind a HIT, so this distinguishes "not deployed" from
                # "deployed but not being served".
                if cache:
                    note(f"{host}: cf-cache-status={cache}" + (f", age={age}s" if age else ""))
                    if cache.upper() in ("HIT", "STALE", "UPDATING", "REVALIDATED"):
                        warn(
                            f"{host} served its HTML from the Cloudflare cache "
                            f"({cache}" + (f", age {age}s" if age else "") + ") - a new "
                            "origin build stays invisible until that cache is purged"
                        )
                else:
                    note(f"{host}: no cf-cache-status header (HTML not cached by this zone)")
            else:
                warn(
                    f"{host}: NOT proxied by Cloudflare (no cf-ray, server={server or 'unknown'}) "
                    "- Worker routes are inert on this hostname"
                )
        except Exception as e:
            warn(f"{host}: probe failed: {e}")

    if not ACCOUNT:
        warn("CLOUDFLARE_ACCOUNT_ID not set; cannot list Worker custom domains")
        return 0

    # A Cloudflare Pages project with a custom domain on this hostname outranks
    # a Worker route for it, so the Worker never runs however correct the route
    # looks. Nothing else in this script would reveal that.
    projects, err = api(f"accounts/{ACCOUNT}/pages/projects")
    if err:
        warn(f"could not list Pages projects (token may lack Pages:Read): {err}")
    elif not projects:
        note("no Cloudflare PAGES projects on this account")
    else:
        for p in projects:
            name = p.get("name")
            doms = [d for d in (p.get("domains") or [])]
            note(f"pages project {name} -> domains {', '.join(doms) if doms else '(none)'}")
            clash = [d for d in doms if d in (ZONE_NAME, f"www.{ZONE_NAME}")]
            if clash:
                warn(
                    f"Pages project {name} claims {', '.join(clash)} - a Pages custom "
                    "domain takes precedence over a Worker route on the same hostname, "
                    "which would stop the Worker executing however correct its route is"
                )

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
