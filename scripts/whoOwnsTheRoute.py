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
        z = zones[0]
        zid = z["id"]
        note(f"zone {ZONE_NAME} found, id ends ...{zid[-4:]}")
        # status must be "active": a zone that is pending/moved/deactivated keeps
        # its DNS records and route config on screen while the edge ignores them.
        note(
            f"zone status={z.get('status')} paused={z.get('paused')} "
            f"type={z.get('type')} plan={(z.get('plan') or {}).get('name')}"
        )
        ns = z.get("name_servers") or []
        ons = z.get("original_name_servers") or []
        note(f"zone name_servers={','.join(ns) or 'none'}")
        note(f"zone original_name_servers={','.join(ons) or 'none'}")
        if z.get("status") != "active":
            warn(
                f"zone is '{z.get('status')}', not active - Worker routes and proxy "
                "settings do not take effect in this state"
            )

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
    # Liveness probe: the Worker answers this path before any other logic, so a
    # 200 proves the route dispatches and a 4xx proves it does not.
    for probe_url in (f"https://{ZONE_NAME}/__xtsy_worker_probe",):
        try:
            req = urllib.request.Request(
                probe_url, headers={"user-agent": "XTSY-RouteDiagnostic/1.0"}
            )
            with urllib.request.urlopen(req, timeout=20) as r:
                body = r.read(200).decode("utf-8", "replace").strip()
                note(f"PROBE {r.status}: {body[:120]}")
        except urllib.error.HTTPError as e:
            warn(f"PROBE returned HTTP {e.code} - the Worker did NOT answer this path")
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
            else:
                warn(
                    f"{host}: NOT proxied by Cloudflare (no cf-ray, server={server or 'unknown'}) "
                    "- Worker routes are inert on this hostname"
                )
        except Exception as e:
            warn(f"{host}: probe failed: {e}")

    if ACCOUNT:
        script, err = api(f"accounts/{ACCOUNT}/workers/scripts/xtsy-prerender/settings")
        if err:
            warn(f"could not read xtsy-prerender settings: {err}")
        elif script:
            note(f"worker settings: {json.dumps(script)[:300]}")

    if not ACCOUNT:
        warn("CLOUDFLARE_ACCOUNT_ID not set; cannot list Worker custom domains")
        return 0

    # Cloudflare Pages projects attach custom domains through a separate API, and
    # a Pages custom domain takes precedence over a Worker route on the same
    # hostname. Such a project is invisible to the Workers endpoints above, so a
    # correctly-bound Worker route can sit there never firing.
    projects, err = api(f"accounts/{ACCOUNT}/pages/projects")
    if err:
        warn(f"could not list Pages projects: {err}")
    elif not projects:
        note("no Cloudflare PAGES projects on this account")
    else:
        for pr in projects:
            name = pr.get("name")
            doms = pr.get("domains") or []
            note(f"pages project {name} -> domains: {', '.join(doms) or 'none'}")
            if ZONE_NAME in doms or f"www.{ZONE_NAME}" in doms:
                warn(
                    f"Pages project '{name}' claims {ZONE_NAME} - this takes "
                    "precedence over the Worker route and would stop it firing"
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
