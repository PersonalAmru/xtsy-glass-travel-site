// Verifies that a public URL is reachable and returns its <title> + meta description
// so the admin can confirm CTR overrides are actually rendered.
//
// SECURITY: this performs a server-side fetch of a caller-supplied URL, so it is
// gated behind an admin JWT and restricted to an allow-list of our own hosts to
// prevent SSRF / anonymous fetch-proxy abuse. Requests also have a hard timeout
// and response-size cap.
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.0";

// Only our own public properties may be verified.
const ALLOWED_HOSTS = new Set([
  "xtsy.one",
  "www.xtsy.one",
  "xtsy-one.lovable.app",
]);
const ALLOWED_HOST_SUFFIXES = [".lovable.app", ".lovableproject.com"];

const MAX_BYTES = 2_000_000; // 2MB cap
const FETCH_TIMEOUT_MS = 10_000;

function isAllowedHost(hostname: string): boolean {
  const h = hostname.toLowerCase();
  if (ALLOWED_HOSTS.has(h)) return true;
  return ALLOWED_HOST_SUFFIXES.some((s) => h.endsWith(s));
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    // ── Auth: require an authenticated admin user ─────────────────────────────
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return json({ error: "Unauthorized" }, 401);
    }
    const userClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return json({ error: "Unauthorized" }, 401);
    const { data: isAdmin } = await userClient.rpc("has_role", { _user_id: user.id, _role: "admin" });
    if (!isAdmin) return json({ error: "Admin access required" }, 403);

    const { url } = await req.json();
    if (typeof url !== "string" || !/^https:\/\//i.test(url)) {
      return json({ error: "Invalid url (https only)" }, 400);
    }

    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      return json({ error: "Invalid url" }, 400);
    }
    if (!isAllowedHost(parsed.hostname)) {
      return json({ error: "Host not allowed. Only xtsy.one properties may be verified." }, 400);
    }

    const t0 = Date.now();
    const res = await fetch(parsed.toString(), {
      redirect: "follow",
      headers: { "User-Agent": "XTSY-SEO-Verifier/1.0 (+https://xtsy.one)" },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    const ms = Date.now() - t0;

    // Read with a hard size cap so a huge/streaming response can't exhaust memory.
    const reader = res.body?.getReader();
    let received = 0;
    const chunks: Uint8Array[] = [];
    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          received += value.length;
          if (received > MAX_BYTES) {
            await reader.cancel();
            break;
          }
          chunks.push(value);
        }
      }
    }
    const html = new TextDecoder().decode(
      chunks.reduce((acc, c) => {
        const merged = new Uint8Array(acc.length + c.length);
        merged.set(acc);
        merged.set(c, acc.length);
        return merged;
      }, new Uint8Array()),
    );

    const title = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "").trim();
    const meta =
      (html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)?.[1] ?? "")
        .trim() ||
      (html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i)?.[1] ?? "")
        .trim();
    const h1 = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? "")
      .replace(/<[^>]+>/g, "")
      .trim();
    return json({
      ok: res.ok,
      status: res.status,
      finalUrl: res.url,
      durationMs: ms,
      title,
      metaDescription: meta,
      h1,
      bytes: html.length,
    });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : String(e) }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
