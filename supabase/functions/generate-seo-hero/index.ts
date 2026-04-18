/**
 * Generate-SEO-Hero — Hybrid Pexels + Lovable AI image pipeline.
 *
 * Strategy (cost-optimized):
 *  1. Check storage cache (seo-heroes/{slug}.webp) — return immediately if cached
 *  2. DEFAULT: Pexels API (free, professional photos) — used for ~1,367 long-tail slugs
 *  3. OPT-IN: Lovable AI (google/gemini-3-pro-image-preview) when {useAI: true}
 *     — reserved for top 50 priority pages (~$2 total spend)
 *  4. Upload result to seo-heroes bucket, return public URL
 *
 * Pexels search uses category + subject keywords for high relevance.
 * Falls back to AI if Pexels returns no results AND useAI is allowed.
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.53.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface GenerateRequest {
  slug: string;
  title: string;
  metaDescription: string;
  category: string;
  h1: string;
  /** Override existing hero — defaults to false */
  force?: boolean;
  /** Use Lovable AI (paid). Defaults to false → uses Pexels (free) */
  useAI?: boolean;
}

const BUCKET = "seo-heroes";

// ──────────────────────────────────────────────────────────────────────────────
// Pexels — search keyword builder per category
// ──────────────────────────────────────────────────────────────────────────────
const buildPexelsQuery = (req: GenerateRequest): string => {
  const subject = req.h1
    .replace(/\(20\d{2}\)/g, "")
    .replace(/[:|–-].*$/g, "")
    .replace(/\b(best|top|cheap|budget|near|in|the|a|an|for|with|and|to)\b/gi, "")
    .trim();

  const categoryQuery: Record<string, string> = {
    hostels: "hostel dorm interior travelers",
    hotels: "boutique hotel mountain india",
    homestays: "homestay village porch india",
    glamping: "luxury glamping dome valley",
    accommodation: "hotel room hospitality",
    rentals: "royal enfield motorcycle hill road",
    tours: "trekking waterfall meghalaya",
    "travel-guides": "northeast india landscape waterfall",
    destinations: "shillong cherrapunji landscape",
    attractions: "waterfall cave forest meghalaya",
    itineraries: "traveler map mountain backpack",
    activities: "trekking kayaking adventure india",
    hospitals: "modern hotel exterior clean",
    restaurants: "indian food restaurant interior",
    "food-dining": "khasi indian food platter",
    weddings: "destination wedding lights mountain",
    transport: "hill road india scenic drive",
    "competitor-capture": "modern hostel facade evening",
    seasonal: "meghalaya monsoon waterfall mist",
    events: "indian festival traditional culture",
    "travel-agency": "travel desk map planning",
  };

  const base = categoryQuery[req.category] || "northeast india travel";
  // Append the subject keywords for relevance (limit total length)
  const combined = `${subject} ${base}`.toLowerCase().split(/\s+/).filter(Boolean).slice(0, 6).join(" ");
  return combined || base;
};

// ──────────────────────────────────────────────────────────────────────────────
// Lovable AI — high-grade prompt (reserved for priority slugs)
// ──────────────────────────────────────────────────────────────────────────────
const buildHeroPrompt = (req: GenerateRequest): string => {
  const subject = req.h1.replace(/\(20\d{2}\)/g, "").replace(/[:|–-].*$/g, "").trim();
  const categoryHints: Record<string, string> = {
    hostels: "modern, light-filled hostel dorm interior with travellers chatting, warm woods, soft natural light",
    hotels: "tasteful boutique hotel exterior in a hill town setting with pine trees and warm windows",
    homestays: "cosy traditional homestay porch with mountain view and locals welcoming guests",
    glamping: "luxury glamping dome at golden hour overlooking misty Northeast India valleys",
    accommodation: "comfortable budget-friendly stay near hospital/college with travellers checking in",
    rentals: "Royal Enfield motorcycle on a winding Northeast India hill road, cinematic",
    tours: "small group of travellers exploring waterfalls and root bridges in Meghalaya, golden hour",
    "travel-guides": "scenic Northeast India landscape photograph (waterfalls, forests, blue rivers) wide aspect, no people in foreground",
    destinations: "iconic landmark of the destination, postcard composition, no logos or text",
    attractions: "the named attraction itself in cinematic composition, golden hour, photographic realism",
    itineraries: "collage-free single hero image: traveller with map, scenic Northeast India backdrop, warm light",
    activities: "the activity in action — trekking, kayaking, caving — in Northeast India, photographic",
    hospitals: "calm, quiet, professional accommodation exterior near a medical campus, daytime",
    restaurants: "warm restaurant interior with North Indian / Khasi food on table, soft window light",
    "food-dining": "Khasi food platter with rice, chutneys, smoked pork on a wooden table, top-down warm lighting",
    weddings: "intimate hill destination wedding setup with fairy lights and Khasi backdrop",
    transport: "shared sumo or scenic NH-6 hill road from Guwahati to Shillong, cinematic",
    "competitor-capture": "modern hostel facade with warm signage, evening, travellers entering",
    seasonal: "Meghalaya in season — monsoon waterfalls or winter mist — photographic",
    events: "cultural Khasi festival with traditional dress and warm crowd, photographic",
    "travel-agency": "professional travel desk with map of Northeast India and friendly host, daytime",
  };
  const hint = categoryHints[req.category] || "photographic landscape of Northeast India";
  return `High-grade editorial travel photograph for: "${subject}". Context: ${req.metaDescription}. Visual brief: ${hint}. Style: National Geographic / Condé Nast Traveler — photorealistic, sharp focus, natural lighting, 16:9 cinematic, no text, no logos, no watermarks, no people looking at camera. Image must visually represent the exact search intent so a viewer instantly understands the page topic within 3 seconds. Avoid generic stock-photo composition. Aspect ratio 16:9.`;
};

// ──────────────────────────────────────────────────────────────────────────────
// Pexels fetcher — returns image bytes (jpeg) or null
// ──────────────────────────────────────────────────────────────────────────────
async function fetchFromPexels(query: string, apiKey: string): Promise<{ bytes: Uint8Array; contentType: string } | null> {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&orientation=landscape&size=large&per_page=5`;
  const res = await fetch(url, { headers: { Authorization: apiKey } });
  if (!res.ok) {
    console.error("Pexels search failed:", res.status, await res.text());
    return null;
  }
  const data = await res.json();
  const photo = data?.photos?.[0];
  const imageUrl: string | undefined = photo?.src?.large2x || photo?.src?.large || photo?.src?.original;
  if (!imageUrl) return null;

  const imgRes = await fetch(imageUrl);
  if (!imgRes.ok) return null;
  const buf = await imgRes.arrayBuffer();
  return { bytes: new Uint8Array(buf), contentType: imgRes.headers.get("content-type") || "image/jpeg" };
}

// ──────────────────────────────────────────────────────────────────────────────
// Lovable AI fetcher — returns image bytes (webp) or throws
// ──────────────────────────────────────────────────────────────────────────────
async function fetchFromLovableAI(prompt: string, apiKey: string): Promise<{ bytes: Uint8Array; contentType: string }> {
  const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-3-pro-image-preview",
      messages: [{ role: "user", content: prompt }],
      modalities: ["image", "text"],
    }),
  });

  if (!aiResponse.ok) {
    const t = await aiResponse.text();
    console.error("AI gateway error:", aiResponse.status, t);
    if (aiResponse.status === 429) throw new Error("RATE_LIMITED");
    if (aiResponse.status === 402) throw new Error("CREDITS_EXHAUSTED");
    throw new Error(`AI gateway error ${aiResponse.status}`);
  }

  const aiData = await aiResponse.json();
  const dataUrl: string | undefined = aiData?.choices?.[0]?.message?.images?.[0]?.image_url?.url;
  if (!dataUrl?.startsWith("data:image")) throw new Error("AI did not return an image");
  const base64 = dataUrl.split(",")[1];
  return { bytes: Uint8Array.from(atob(base64), (c) => c.charCodeAt(0)), contentType: "image/webp" };
}

// ──────────────────────────────────────────────────────────────────────────────
// Main handler
// ──────────────────────────────────────────────────────────────────────────────
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = (await req.json()) as GenerateRequest;
    if (!body.slug || !body.title || !body.h1) {
      return new Response(JSON.stringify({ error: "slug, title and h1 are required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const PEXELS_API_KEY = Deno.env.get("PEXELS_API_KEY");
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

    // Determine extension based on source — Pexels returns jpg, AI returns webp
    const useAI = body.useAI === true;
    const ext = useAI ? "webp" : "jpg";
    const filename = `${body.slug}.${ext}`;

    // 1. Cache check (any extension) — list bucket for slug.*
    if (!body.force) {
      const { data: existing } = await supabase.storage.from(BUCKET).list("", { search: body.slug });
      const hit = existing?.find((f) => f.name.startsWith(`${body.slug}.`));
      if (hit) {
        const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(hit.name);
        return new Response(JSON.stringify({ url: pub.publicUrl, cached: true, source: "cache" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    let result: { bytes: Uint8Array; contentType: string } | null = null;
    let source = "";

    // 2. Try Pexels first (unless useAI explicitly requested)
    if (!useAI && PEXELS_API_KEY) {
      const query = buildPexelsQuery(body);
      console.log(`[${body.slug}] Pexels query: "${query}"`);
      result = await fetchFromPexels(query, PEXELS_API_KEY);
      if (result) source = "pexels";
    }

    // 3. AI path (opt-in OR Pexels failed and AI key available)
    if (!result && LOVABLE_API_KEY) {
      console.log(`[${body.slug}] Falling back to Lovable AI`);
      try {
        result = await fetchFromLovableAI(buildHeroPrompt(body), LOVABLE_API_KEY);
        source = "lovable-ai";
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        if (msg === "RATE_LIMITED") {
          return new Response(JSON.stringify({ error: "Rate limited. Try again later." }),
            { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }
        if (msg === "CREDITS_EXHAUSTED") {
          return new Response(JSON.stringify({ error: "Lovable AI credits exhausted." }),
            { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }
        throw e;
      }
    }

    if (!result) {
      throw new Error("No image source available — configure PEXELS_API_KEY or LOVABLE_API_KEY");
    }

    // 4. Upload (use actual content-type extension)
    const finalExt = result.contentType.includes("webp") ? "webp" :
                     result.contentType.includes("png") ? "png" : "jpg";
    const finalName = `${body.slug}.${finalExt}`;
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(finalName, result.bytes, {
        contentType: result.contentType,
        cacheControl: "public, max-age=31536000, immutable",
        upsert: true,
      });

    if (uploadError) throw uploadError;

    const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(finalName);
    return new Response(JSON.stringify({ url: pub.publicUrl, cached: false, source }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-seo-hero error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
