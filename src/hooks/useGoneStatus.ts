import { useEffect, useState } from "react";
import { getSupabase } from '@/integrations/supabase/lazy';
import { GONE_SLUGS } from "@/data/seoGoneSlugs";

/**
 * 410 Gone strategy.
 * ------------------
 * A slug can be marked "permanently removed" two ways:
 *   1. Compile-time — added to GONE_SLUGS (drives the prerender snapshot).
 *   2. Runtime — an admin adds a row to `seo_redirects` with status_code = 410
 *      (e.g. when a destination/tour is deleted from Supabase). This is the
 *      dynamic path, so we don't need a redeploy to drop a dead URL faster.
 *
 * This hook resolves the *effective* status for the current path. It starts
 * from the compiled value (instant, no flash for prerender) and upgrades a
 * 404 → 410 if Supabase says the slug is gone. The 410 then flows into the
 * <meta name="prerender-status-code"> the NotFound page emits, and the
 * Cloudflare/edge layer (via seo-redirect-resolver) serves a real 410.
 */
export function useGoneStatus(
  pathname: string,
  initial: 404 | 410
): 404 | 410 {
  const [status, setStatus] = useState<404 | 410>(initial);

  useEffect(() => {
    let active = true;
    const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
    const firstSegment = normalized.replace(/^\//, "").split("/")[0];

    // Compile-time gone list wins immediately.
    if (initial === 410 || GONE_SLUGS.has(firstSegment)) {
      setStatus(410);
      return;
    }

    // Runtime check: is this path flagged 410 in Supabase?
    (async () => {
      try {
        const { data, error } = await (await getSupabase())
          .from("seo_redirects")
          .select("status_code")
          .eq("source_path", normalized)
          .eq("is_active", true)
          .maybeSingle();
        if (!active || error || !data) return;
        if (data.status_code === 410) setStatus(410);
      } catch {
        /* network failure → keep 404, fail safe */
      }
    })();

    return () => {
      active = false;
    };
  }, [pathname, initial]);

  return status;
}
