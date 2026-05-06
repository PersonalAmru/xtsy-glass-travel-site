// Verifies that a public URL is reachable and returns its <title> + meta description
// so the admin can confirm CTR overrides are actually rendered.
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { url } = await req.json();
    if (typeof url !== "string" || !/^https?:\/\//.test(url)) {
      return json({ error: "Invalid url" }, 400);
    }
    const t0 = Date.now();
    const res = await fetch(url, {
      redirect: "follow",
      headers: { "User-Agent": "XTSY-SEO-Verifier/1.0 (+https://xtsy.one)" },
    });
    const ms = Date.now() - t0;
    const html = await res.text();
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
