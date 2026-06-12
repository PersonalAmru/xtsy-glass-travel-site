## Why the homepage feels slow — diagnosis

I profiled the live homepage and read the boot path (`index.html`, `main.tsx`, `App.tsx`, `Index.tsx`). Measured: FCP ~2.0s, DOMContentLoaded ~5.3s, Full load ~5.9s, main-thread Task time ~4.9s, Style recalc ~0.79s, 217 resources.

Two layers are at play:

**A. Preview/dev inflation (not real for visitors)**
- The preview serves 154 *unbundled* ES modules (e.g. `tailwind.css` as a 1118ms dev module, `App.tsx` 952ms). In the published build these bundle/minify, so a big part of the 5.9s is dev-server overhead. Production is faster — but the issues below are real in production too.

**B. Real bottlenecks (affect the live site)**
1. **Failing network call during boot** — `HappyGuestsContext` throws `Failed to fetch happy guests count` on every load. A failed round-trip blocks/competes with hydration and spams the console.
2. **Heavy synchronous provider stack** wrapping every route: `HappyGuestsProvider → UserAuthProvider → TrafficAnalyticsProvider → ConversionSignalsProvider → EnhancedAnalyticsProvider`. Several fire network requests on mount (`track-analytics` measured at 763ms, traffic/realtime pings, conversion signals) — all on the critical path.
3. **Third-party tag weight on the main thread** — GTM loads ContentSquare/uxa (131KB) plus extra frames (15 documents / 8 frames). This drives Style-recalc (618 recalcs, 787ms) and most of the 4.9s task time.
4. **Big eager JS** — `supabase-js` (135KB) and `lucide-react` (157KB) load at boot because the client + icons are imported high in the tree.
5. **LCP overlay lingers** — the `#lcp-skeleton` covers the screen until React commits (double-rAF) or a 4s/4.5s safety timeout. If hydration is delayed by #1–#4, visitors stare at the skeleton even though "load" technically finished → *perceived* slowness.
6. **LCP image ambiguity** — `index.html` preloads the brand-symbol PNG, but the hero section paints `meghalaya-hero.jpg` (measured 861ms, not preloaded). The actual largest paint isn't the preloaded asset.

## Proposed fixes (prioritized, non-destructive to tracking/consent/validation)

These respect the admin-first analytics + Consent Mode v2 rules — analytics still fires, just deferred off the critical path; nothing is removed.

**P1 — Unblock hydration (biggest perceived win)**
- Fix/guard `HappyGuestsContext` fetch: make it non-blocking, run after first paint (idle), cache, and fail silently so it never competes with hydration. Confirm the `metrics`/guests source is reachable; if it's an env/URL issue, correct it.
- Defer the boot-time analytics network calls (traffic analytics provider mount ping, realtime ping, conversion-signals init) to `requestIdleCallback`/post-load, same pattern already used for the pageview event and exchange rates.

**P2 — Trim main-thread & boot JS**
- Verify ContentSquare/rrweb only load post-consent + post-LCP (already partly via `contentsquareLoader` at 2s idle) and keep it strictly idle-gated.
- Confirm `lucide-react` uses named imports everywhere (tree-shakeable) and audit any barrel/`import * as` usage.
- Lazy-init the Supabase client usage paths that aren't needed for first paint where feasible.

**P3 — LCP correctness**
- Align the preload with the real LCP element: either preload `meghalaya-hero.jpg` (responsive, `fetchpriority=high`) or confirm the brand symbol is genuinely the LCP and drop the unused hero cost. Serve the hero as WebP/AVIF.
- Tighten skeleton dismissal so it hides immediately on first meaningful paint rather than waiting on the full provider tree.

**P4 — Verify on the published build**
- Re-measure on `xtsy.one` (not the dev preview) with a performance profile to separate dev-mode noise from real gains, and confirm DOMContentLoaded/LCP drop.

### Technical notes
- Files in scope: `src/contexts/HappyGuestsContext.tsx`, `src/hooks/useTrafficAnalytics.tsx`, `src/providers/ConversionSignalsProvider.tsx`, `src/hooks/useEnhancedAnalytics.tsx`, `src/utils/contentsquareLoader.ts`, `src/main.tsx`, `index.html`, `src/components/HeroSection.tsx`.
- No changes to consent gating, GTM single-authority routing, or validation/intent-scoring logic — only scheduling/ordering and a failing-fetch fix.
- Keep keyframes in global CSS (per project rule) and inputs ≥16px.

Want me to start with P1 (the failing fetch + deferring boot-time analytics), which should give the largest perceived-load improvement, then proceed through P2–P4?