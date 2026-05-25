/**
 * seo-hero-health — Diagnostics endpoint for generate-seo-hero pipeline.
 *
 * Returns:
 *  - pexels.configured: PEXELS_API_KEY present + live ping result
 *  - lovableAI.configured: LOVABLE_API_KEY present (not pinged to avoid spend)
 *  - bucket.totalObjects + bySource (.jpg = pexels, .webp = ai)
 *  - lastObjectAt: most recent upload time in the seo-heroes bucket
 *  - mode: "pexels-only" if AI is intentionally disabled in the function logic
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.53.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BUCKET = "seo-heroes";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const out: Record<string, unknown> = { ok: true, checkedAt: new Date().toISOString() };

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const PEXELS_API_KEY = Deno.env.get("PEXELS_API_KEY");
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    // Pexels ping (cheap — 1 photo)
    let pexelsLive = false;
    let pexelsError: string | null = null;
    if (PEXELS_API_KEY) {
      try {
        const r = await fetch(
          "https://api.pexels.com/v1/search?query=meghalaya&per_page=1",
          { headers: { Authorization: PEXELS_API_KEY } },
        );
        pexelsLive = r.ok;
        if (!r.ok) pexelsError = `HTTP ${r.status}`;
      } catch (e) {
        pexelsError = e instanceof Error ? e.message : String(e);
      }
    }

    out.pexels = {
      configured: Boolean(PEXELS_API_KEY),
      live: pexelsLive,
      error: pexelsError,
      fallbackChain: [
        "primary: category + subject keywords",
        "{category} northeast india",
        "northeast india landscape",
        "meghalaya travel",
        "india mountain landscape",
      ],
    };

    out.lovableAI = {
      configured: Boolean(LOVABLE_API_KEY),
      note: "AI path is opt-in via {useAI:true}. Pexels-only mode never escalates to AI.",
    };

    out.mode = "pexels-only (AI requires explicit useAI=true)";

    // Bucket stats
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
    const { data: objects, error } = await supabase.storage
      .from(BUCKET)
      .list("", { limit: 5000, sortBy: { column: "created_at", order: "desc" } });

    if (error) {
      out.bucket = { error: error.message };
    } else {
      const bySource = { pexels_jpg: 0, ai_webp: 0, other: 0 };
      let lastObjectAt: string | null = null;
      for (const o of objects ?? []) {
        if (o.name.endsWith(".jpg") || o.name.endsWith(".jpeg")) bySource.pexels_jpg++;
        else if (o.name.endsWith(".webp")) bySource.ai_webp++;
        else bySource.other++;
        if (!lastObjectAt && o.created_at) lastObjectAt = o.created_at;
      }
      out.bucket = {
        totalObjects: objects?.length ?? 0,
        bySource,
        lastObjectAt,
      };
    }

    return new Response(JSON.stringify(out, null, 2), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ ok: false, error: e instanceof Error ? e.message : String(e) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
