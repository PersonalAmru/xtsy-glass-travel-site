/**
 * Generate-SEO-Hero — Lovable AI image generation pipeline.
 *
 * Flow:
 *  1. Receive { slug, title, metaDescription, category, h1 } from caller (admin or build script)
 *  2. Check if seo-heroes/{slug}.webp already exists in storage; if yes, return URL
 *  3. Otherwise, build a precise photographic prompt aligned with the title/meta/category
 *  4. Call Lovable AI (google/gemini-3-pro-image-preview — high-grade) for the hero
 *  5. Convert base64 → bytes → upload to seo-heroes bucket as {slug}.webp
 *  6. Return public URL
 *
 * IMPORTANT: this function is intentionally on-demand (one slug per call) to control
 * AI credit spend. Run via the admin queue (batch of 25–50 per session).
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
}

const BUCKET = "seo-heroes";

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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = (await req.json()) as GenerateRequest;
    if (!body.slug || !body.title || !body.h1) {
      return new Response(JSON.stringify({ error: "slug, title and h1 are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
    const filename = `${body.slug}.webp`;

    // Skip if already exists (unless force=true)
    if (!body.force) {
      const { data: existing } = await supabase.storage.from(BUCKET).list("", { search: filename });
      if (existing?.some((f) => f.name === filename)) {
        const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(filename);
        return new Response(JSON.stringify({ url: pub.publicUrl, cached: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Generate via Lovable AI — High grade model
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-pro-image-preview",
        messages: [{ role: "user", content: buildHeroPrompt(body) }],
        modalities: ["image", "text"],
      }),
    });

    if (!aiResponse.ok) {
      const t = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, t);
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "Lovable AI credits exhausted. Top up at Settings → Workspace → Usage." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const dataUrl: string | undefined = aiData?.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    if (!dataUrl?.startsWith("data:image")) {
      throw new Error("AI did not return an image");
    }

    const base64 = dataUrl.split(",")[1];
    const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(filename, bytes, {
        contentType: "image/webp",
        cacheControl: "public, max-age=31536000, immutable",
        upsert: true,
      });

    if (uploadError) throw uploadError;

    const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(filename);
    return new Response(JSON.stringify({ url: pub.publicUrl, cached: false }), {
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
