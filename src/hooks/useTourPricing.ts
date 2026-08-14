/**
 * useTourPricing — admin-editable tour package pricing.
 *
 * Reads public.tour_pricing (separate from roomInventory / roomTypes / room
 * pricing — tours and rooms never share a pricing source). Falls back silently
 * to the static SIGNATURE_PACKAGES prices when the table is unreachable, so
 * the public /tours pages always render a price.
 */

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface TourPriceRow {
  slug: string;
  title: string;
  region: string | null;
  duration: string | null;
  price_per_person: number;
  compare_at_price: number | null;
  competitor_name: string | null;
  competitor_price: number | null;
  min_group: number | null;
  sort_order: number;
  is_active: boolean;
  notes: string | null;
}

export type TourPriceMap = Record<string, TourPriceRow>;

export const useTourPricing = () => {
  const [prices, setPrices] = useState<TourPriceMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("tour_pricing" as never)
        .select(
          "slug,title,region,duration,price_per_person,compare_at_price,competitor_name,competitor_price,min_group,sort_order,is_active,notes",
        )
        .eq("is_active", true);

      if (cancelled) return;
      if (!error && Array.isArray(data)) {
        const map: TourPriceMap = {};
        for (const row of data as unknown as TourPriceRow[]) map[row.slug] = row;
        setPrices(map);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  /** Returns the admin price for a slug, or the supplied fallback. */
  const priceFor = (slug: string | undefined, fallback: number) =>
    (slug && prices[slug]?.price_per_person) || fallback;

  return { prices, priceFor, loading };
};

export default useTourPricing;
