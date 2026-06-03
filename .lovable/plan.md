# Rebuild Cloud schema (consolidated) + fix build errors

## Background
Enabling Lovable Cloud created a **brand-new, empty backend** (0 tables). Your app's data/schema lived in the previously-connected (now inaccessible) project. Because the new backend has no tables, the auto-generated `src/integrations/supabase/types.ts` is empty, so every `supabase.from('...')` resolves to `never` — the source of ~95% of the build errors. A separate, trivial error is `process` being undefined in a Node script.

## What I verified
I reconstructed the schema locally by replaying all 200 migration files against a throwaway Postgres:
- **90+ tables rebuilt successfully**, including all the ones the build complains about: `bookings`, `room_types`, `admin_notifications`, `booking_messages`, `blocked_dates`, `properties`, `room_availability_status`, `reviews`, `restaurant_reviews`, `enquiries`, `tour_enquiries`, `profiles`, `user_roles`, `analytics_loader_events`, `transactions`, `inventory`, `destinations`, `itineraries`, `newsletter_subscribers`, `booking_invoices`, `password_reset_otp`, `security_alerts`, `whatsapp_templates`, `secret_access_log`, and more.
- **2 objects are NOT in your migration history**: `room_inventory` (table) and `metrics` (view). Your code references `room_inventory` (`date`, `room_type_id`, `available_count`) but no migration ever created it — it was almost certainly created by hand in the old project's dashboard. I will recreate it from the column shape the code uses.

## Plan

### 1. Build a validated consolidated schema
- From the local reconstruction, produce a single coherent schema snapshot (guaranteed to apply cleanly from scratch).
- Add the missing `room_inventory` table:
  - `id uuid pk`, `room_type_id uuid`, `date date`, `available_count int`, `total_count int`, timestamps; unique `(room_type_id, date)`.
- Recreate `metrics` if anything depends on it; otherwise drop dependent references.
- Keep both `app_role` and `user_role` enums (both are legitimately used — `user_role` types `profiles.role`).
- Strip statements the migration tool can't run (writes to `storage.buckets`, `pg_cron` schedule pointing at the old project).

### 2. Apply the consolidated migration
- Run it through the migration tool (your approval). This creates all tables, enums, functions, triggers, RLS policies, and GRANTs in the new Cloud backend.

### 3. Restore storage buckets + scheduled job separately
- Recreate buckets `booking-invoices` (private), `seo-heroes` (public), `review-media` (public) via the storage tool, plus their `storage.objects` policies.
- Re-add the daily `analytics-loader-summary` cron with the **correct new** project URL.

### 4. Regenerate types + fix remaining build errors
- After the migration runs, `src/integrations/supabase/types.ts` regenerates with all tables → the `never` errors disappear.
- Fix `scripts/generate-seo-slugs.ts` `process` error by guarding the Node global.

### 5. Verify
- Confirm the build passes.
- Run a security scan to confirm RLS coverage on every public table (a few policies that depended on replay ordering may need re-adding; I'll fix any the scan flags).

## Important caveats
- **Data is not restored** — only the schema/structure. The new backend starts empty of rows (seed data from migrations, e.g. restaurant reviews, will be included where it was in migrations).
- A small number of RLS policies may need re-adding after the scan (step 5); I'll handle those so no public table is left unprotected.

## Technical notes
- Reconstruction done via local Postgres with a Supabase-compatible bootstrap (roles `anon`/`authenticated`/`service_role`, `auth`/`storage`/`vault` stubs). The final consolidated file is validated to apply with zero errors on a clean database before I submit it.
- The consolidated migration is large; it will be submitted as one (or a few) migration approvals.
