# GTM audit corrections — 3 November 2026

Website safeguards are implemented; external container corrections are not applied.
Container: GTM-5FXJ9QBK. GA4 stream referenced by the container: G-SJY2WX6L4B.

## Changes required in the GTM workspace

1. Replace numeric `> 0` consent comparisons with string equality to `granted`. Keep Consent Mode v2's native consent checks; never substitute numeric data-layer values for actual Google consent.
2. GA4 tags require `analytics_storage`; remove additional advertising-consent requirements from GA4 tags only. Keep advertising tags dependent on marketing consent, including applicable `ad_storage`, `ad_user_data`, and `ad_personalization` signals.
3. Use GTM's built-in **Event** variable for event names. The website also supplies `event_name` and `eventName` aliases, but no alias repairs a misconfigured consent trigger.
4. Custom-event matching must use literal `scroll_depth` and `review_interaction`, not the display labels `CE - scroll_depth` or `CE - review_interaction`.
5. Add explicit custom-event triggers for `lead_qualified` and `whatsapp_engaged_validated`. Only these, `call_engaged_validated`, and `booking_confirmed` may be conversions. Require `is_validated_conversion = true` and `is_conversion = true`. Do not convert raw clicks, form submission, booking creation/initiation, directions, or app installation.
6. Remove redundant Contentsquare tags; retain at most one consent-gated loader and coordinate it with the existing website loader. Three duplicate-tag errors were observed after analytics-only acceptance.
7. Preserve admin exclusion. Preview and synthetic traffic must not become business conversions.

## Verification before publishing the container

- Fresh and rejected-consent visits/reloads: no analytics/ad cookies or identifiers.
- Analytics-only acceptance: GA4 page-view collection reaches the correct stream; advertising permission remains denied.
- Raw and low/medium-intent actions: no conversion tags fire.
- Validated high/hot-intent signals: only the four approved conversion tags may fire.
- A pending enquiry must never become `booking_confirmed`.
- GA4 report/key-event configuration must also be checked with authorized reporting/admin access; a network collection response alone does not prove report ingestion.

## Evidence from this task

- Nineteen shared-policy and consent regression tests pass.
- Live analytics-only test: GTM loaded; no GA4 collection request or GA cookie observed. Ingestion is therefore not verified.
- Live and preview rejection tests: no Google tracking request before choice or after rejection/reload, no Google analytics/ad cookies.
- Google Ads connection, sitemaps, business listings and guest-message channels were not changed.