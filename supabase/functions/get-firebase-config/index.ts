import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Return Firebase configuration for client-side use
    // These are publishable keys, safe for client exposure
    const config = {
      apiKey: Deno.env.get("FIREBASE_API_KEY"),
      authDomain: Deno.env.get("FIREBASE_AUTH_DOMAIN"),
      projectId: Deno.env.get("FIREBASE_PROJECT_ID"),
      appId: Deno.env.get("FIREBASE_APP_ID"),
    };

    // Validate all config values are present
    const missingKeys = Object.entries(config)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingKeys.length > 0) {
      console.error("Missing Firebase config keys:", missingKeys);
      return new Response(
        JSON.stringify({ 
          error: "Firebase configuration incomplete",
          missing: missingKeys 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    return new Response(
      JSON.stringify(config),
      { 
        status: 200, 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=3600" // Cache for 1 hour
        } 
      }
    );
  } catch (error) {
    console.error("Error fetching Firebase config:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch configuration" }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
