ALTER FUNCTION public.update_inventory_on_booking() SET search_path = '';
ALTER FUNCTION public.move_to_dlq(text, text, bigint, jsonb) SET search_path = '';
ALTER FUNCTION public.read_email_batch(text, integer, integer) SET search_path = '';
ALTER FUNCTION public.enqueue_email(text, jsonb) SET search_path = '';
ALTER FUNCTION public.delete_email(text, bigint) SET search_path = '';

DROP POLICY IF EXISTS "room_availability_status_public_read" ON public.room_availability_status;
CREATE POLICY "room_availability_status_public_read" ON public.room_availability_status FOR SELECT TO anon, authenticated USING (room_type_id <> '' AND status IN ('available', 'limited', 'sold_out', 'blocked', 'unavailable'));

DROP POLICY IF EXISTS "mobile_ui_logs_public_insert" ON public.mobile_ui_logs;
CREATE POLICY "mobile_ui_logs_public_insert" ON public.mobile_ui_logs FOR INSERT TO anon, authenticated WITH CHECK (length(component_name) BETWEEN 1 AND 120 AND length(error_type) BETWEEN 1 AND 80 AND coalesce(length(error_message), 0) <= 2000 AND coalesce(length(page_url), 0) <= 2048 AND screen_width BETWEEN 0 AND 10000 AND screen_height BETWEEN 0 AND 10000 AND viewport_width BETWEEN 0 AND 10000 AND viewport_height BETWEEN 0 AND 10000);

DROP POLICY IF EXISTS "Allow read access to all" ON public.blocked_dates;
DROP POLICY IF EXISTS "authenticated_can_read_blocked_dates" ON public.blocked_dates;
DROP POLICY IF EXISTS "blocked_dates_public_read" ON public.blocked_dates;
DROP POLICY IF EXISTS "blocked_dates_public_read_only" ON public.blocked_dates;
CREATE POLICY "blocked_dates_public_read" ON public.blocked_dates FOR SELECT TO anon, authenticated USING (date >= (CURRENT_DATE - 1) AND room_type <> '');

DROP POLICY IF EXISTS "reviews_public_read" ON public.reviews;
CREATE POLICY "reviews_public_read" ON public.reviews FOR SELECT TO anon, authenticated USING (verified IS TRUE AND rating BETWEEN 1 AND 5);

DROP POLICY IF EXISTS "Allow anonymous inserts for tracking" ON public.traffic_sessions;
CREATE POLICY "Allow anonymous inserts for tracking" ON public.traffic_sessions FOR INSERT TO anon, authenticated WITH CHECK (length(session_id) BETWEEN 8 AND 200 AND length(visitor_id) BETWEEN 8 AND 200 AND coalesce(length(landing_page), 0) <= 2048 AND coalesce(length(referrer_url), 0) <= 2048 AND coalesce(bot_likelihood_score, 0) BETWEEN 0 AND 100 AND coalesce(click_quality_score, 0) BETWEEN 0 AND 100 AND coalesce(unified_intent_score, 0) BETWEEN 0 AND 100);

DROP POLICY IF EXISTS "Anyone can record loader events" ON public.analytics_loader_events;
CREATE POLICY "Anyone can record loader events" ON public.analytics_loader_events FOR INSERT TO anon, authenticated WITH CHECK (tag IN ('contentsquare', 'hotjar') AND status IN ('loaded', 'blocked', 'failed', 'skipped') AND coalesce(length(source_url), 0) <= 2048 AND coalesce(length(error_message), 0) <= 1000 AND coalesce(attempts, 0) BETWEEN 0 AND 10 AND coalesce(duration_ms, 0) BETWEEN 0 AND 120000);

DROP POLICY IF EXISTS "Anyone can log a search query" ON public.search_queries;
CREATE POLICY "Anyone can log a search query" ON public.search_queries FOR INSERT TO anon, authenticated WITH CHECK (length(query) BETWEEN 1 AND 200 AND coalesce(length(query_normalized), 0) <= 200 AND coalesce(length(page_path), 0) <= 500 AND coalesce(length(clicked_result_url), 0) <= 2048 AND coalesce(result_count, 0) BETWEEN 0 AND 10000);

DROP POLICY IF EXISTS "room_types_anon_read" ON public.room_types;
CREATE POLICY "room_types_anon_read" ON public.room_types FOR SELECT TO anon, authenticated USING (is_active IS TRUE AND base_price >= 0 AND capacity > 0);

DROP POLICY IF EXISTS "Itineraries public read access" ON public.itineraries;
DROP POLICY IF EXISTS "itineraries_public_read" ON public.itineraries;
DROP POLICY IF EXISTS "itineraries_public_read_only" ON public.itineraries;
CREATE POLICY "itineraries_public_read" ON public.itineraries FOR SELECT TO anon, authenticated USING (featured IS TRUE OR source IN ('xtsy', 'editorial'));

DROP POLICY IF EXISTS "Attractions are viewable by everyone" ON public.attractions;
CREATE POLICY "Attractions are viewable by everyone" ON public.attractions FOR SELECT TO anon, authenticated USING (name <> '' AND type <> '' AND (latitude IS NULL OR latitude BETWEEN -90 AND 90) AND (longitude IS NULL OR longitude BETWEEN -180 AND 180));

DROP POLICY IF EXISTS "newsletter_anonymous_insert" ON public.newsletter_subscribers;
CREATE POLICY "newsletter_anonymous_insert" ON public.newsletter_subscribers FOR INSERT TO anon, authenticated WITH CHECK (email = lower(btrim(email)) AND email ~ '^[A-Za-z0-9.!#$%&''*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$' AND length(email) <= 254 AND length(full_name) BETWEEN 1 AND 120 AND is_active IS TRUE);

DROP POLICY IF EXISTS "Anyone can insert RUM samples" ON public.route_performance_metrics;
CREATE POLICY "Anyone can insert RUM samples" ON public.route_performance_metrics FOR INSERT TO anon, authenticated WITH CHECK (route LIKE '/%' AND length(route) <= 500 AND metric_date BETWEEN CURRENT_DATE - 1 AND CURRENT_DATE + 1 AND coalesce(lcp_ms, 0) BETWEEN 0 AND 120000 AND coalesce(inp_ms, 0) BETWEEN 0 AND 120000 AND coalesce(cls_score, 0) BETWEEN 0 AND 100 AND coalesce(ttfb_ms, 0) BETWEEN 0 AND 120000 AND coalesce(fcp_ms, 0) BETWEEN 0 AND 120000);

DROP POLICY IF EXISTS "room_inventory_public_read" ON public.room_inventory;
CREATE POLICY "room_inventory_public_read" ON public.room_inventory FOR SELECT TO anon, authenticated USING (date BETWEEN CURRENT_DATE - 1 AND CURRENT_DATE + 730 AND available_count BETWEEN 0 AND total_count AND total_count >= 0);

DROP POLICY IF EXISTS "Allow anonymous inserts for leads" ON public.traffic_lead_events;
CREATE POLICY "Allow anonymous inserts for leads" ON public.traffic_lead_events FOR INSERT TO anon, authenticated WITH CHECK (length(session_id) BETWEEN 8 AND 200 AND lead_stage IN ('awareness', 'consideration', 'intent', 'qualified', 'booking', 'confirmed') AND coalesce(length(contact_hash), 0) <= 256 AND coalesce(length(contact_type), 0) <= 40 AND coalesce(lead_value, 0) BETWEEN 0 AND 100000000);

DROP POLICY IF EXISTS "Allow anonymous inserts for interactions" ON public.traffic_interaction_events;
CREATE POLICY "Allow anonymous inserts for interactions" ON public.traffic_interaction_events FOR INSERT TO anon, authenticated WITH CHECK (length(session_id) BETWEEN 8 AND 200 AND length(event_type) BETWEEN 1 AND 80 AND length(event_name) BETWEEN 1 AND 120 AND coalesce(length(page_url), 0) <= 2048 AND coalesce(length(element_text), 0) <= 500);

DROP POLICY IF EXISTS "Allow anonymous inserts for validated events" ON public.traffic_validated_events;
CREATE POLICY "Allow anonymous inserts for validated events" ON public.traffic_validated_events FOR INSERT TO anon, authenticated WITH CHECK (length(session_id) BETWEEN 8 AND 200 AND event_name IN ('whatsapp_engaged_validated', 'call_engaged_validated', 'lead_qualified', 'booking_confirmed') AND validation_passed IS TRUE AND coalesce(click_quality_score, 0) BETWEEN 0 AND 100 AND coalesce(unified_intent_score, 0) BETWEEN 0 AND 100 AND coalesce(intent_category, 'High') IN ('High', 'Hot') AND coalesce(conversion_value, 0) BETWEEN 0 AND 100000000 AND coalesce(adjusted_conversion_value, 0) BETWEEN 0 AND 100000000);

DROP POLICY IF EXISTS "Anyone can insert intrusion logs" ON public.security_intrusion_logs;
CREATE POLICY "Anyone can insert intrusion logs" ON public.security_intrusion_logs FOR INSERT TO anon, authenticated WITH CHECK (length(event_type) BETWEEN 1 AND 100 AND severity IN ('low', 'medium', 'high', 'critical') AND coalesce(length(email), 0) <= 254 AND coalesce(length(ip_address), 0) <= 64 AND is_acknowledged IS FALSE);

DROP POLICY IF EXISTS "Public can read property room types" ON public.property_room_types;
CREATE POLICY "Public can read property room types" ON public.property_room_types FOR SELECT TO anon, authenticated USING (is_active IS TRUE AND base_price >= 0 AND coalesce(total_units, 0) >= 0);

DROP POLICY IF EXISTS "Allow anonymous inserts for page events" ON public.traffic_page_events;
CREATE POLICY "Allow anonymous inserts for page events" ON public.traffic_page_events FOR INSERT TO anon, authenticated WITH CHECK (length(session_id) BETWEEN 8 AND 200 AND page_url LIKE 'http%' AND length(page_url) <= 2048 AND coalesce(length(page_path), 0) <= 500 AND coalesce(time_spent_seconds, 0) BETWEEN 0 AND 86400 AND coalesce(scroll_depth, 0) BETWEEN 0 AND 100 AND coalesce(interaction_count, 0) BETWEEN 0 AND 10000);

DROP POLICY IF EXISTS "Allow anonymous inserts for consent" ON public.consent_records;
CREATE POLICY "Allow anonymous inserts for consent" ON public.consent_records FOR INSERT TO anon, authenticated WITH CHECK (length(visitor_id) BETWEEN 8 AND 200 AND coalesce(length(session_id), 0) <= 200 AND coalesce(length(ip_hash), 0) <= 256 AND coalesce(length(user_agent), 0) <= 1000 AND consent_method IN ('banner', 'settings', 'api', 'imported') AND consent_version IS NOT NULL);

DROP POLICY IF EXISTS "Visitors can insert defense logs" ON public.traffic_defense_logs;
CREATE POLICY "Visitors can insert defense logs" ON public.traffic_defense_logs FOR INSERT TO anon, authenticated WITH CHECK (length(session_id) BETWEEN 8 AND 200 AND length(visitor_id) BETWEEN 8 AND 200 AND layer_number BETWEEN 1 AND 3 AND length(layer_name) BETWEEN 1 AND 100 AND length(check_name) BETWEEN 1 AND 100 AND coalesce(check_score, 0) BETWEEN 0 AND 100);

DROP POLICY IF EXISTS "Allow anonymous inserts for bot logs" ON public.bot_detection_logs;
CREATE POLICY "Allow anonymous inserts for bot logs" ON public.bot_detection_logs FOR INSERT TO anon, authenticated WITH CHECK (coalesce(length(session_id), 0) <= 200 AND coalesce(length(visitor_id), 0) <= 200 AND length(detection_type) BETWEEN 1 AND 100 AND coalesce(detection_score, 0) BETWEEN 0 AND 100 AND coalesce(length(action_taken), 0) <= 100);

DROP POLICY IF EXISTS "Anyone can read OTA cache" ON public.ota_availability_cache;
CREATE POLICY "Anyone can read OTA cache" ON public.ota_availability_cache FOR SELECT TO anon, authenticated USING (cache_date BETWEEN CURRENT_DATE - 1 AND CURRENT_DATE + 730 AND available BETWEEN 0 AND total AND total >= 0 AND room_type_name <> '');

DROP POLICY IF EXISTS "Destinations public read access" ON public.destinations;
DROP POLICY IF EXISTS "destinations_anon_read" ON public.destinations;
DROP POLICY IF EXISTS "destinations_public_read_only" ON public.destinations;
CREATE POLICY "destinations_public_read" ON public.destinations FOR SELECT TO anon, authenticated USING (name <> '' AND state <> '' AND (latitude IS NULL OR latitude BETWEEN -90 AND 90) AND (longitude IS NULL OR longitude BETWEEN -180 AND 180));