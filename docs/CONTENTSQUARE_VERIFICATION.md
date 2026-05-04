# Contentsquare / Hotjar Tag — Verification Checklist

Tag URL: `https://t.contentsquare.net/uxa/8a1781ba2e7b5.js`
Loader: `src/utils/contentsquareLoader.ts` (consent-gated, GTM-deduped)
Debug panel: `src/components/debug/ConsentDebugPanel.tsx`

The tag must fire **only after the user grants `analytics_storage` consent**
(Google Consent Mode v2 + project CMP). Use this checklist after every
deploy or GTM container publish.

---

## 0. Prep

- Use a **private / incognito** window (no cached consent).
- Open DevTools → **Console** + **Network** (check "Preserve log").
- In Network, filter by `contentsquare`.
- Optional: append `?debug=consent` to the URL to surface the in-app debug
  panel (bottom-left). It shows loader status (`idle / queued / loading /
  loaded / blocked / error`), the resolved consent source, and the latest
  `analytics_storage` signal from the dataLayer.

## 1. Pre-consent (cookie banner visible)

Expected:
- ✅ Console: `[CS-Loader] init — consent=false source=none` (or `localStorage`).
- ✅ Console: `[CS-Loader] Waiting — no analytics consent yet.`
- ✅ Network: **no** request to `t.contentsquare.net`.
- ✅ Debug panel pill: grey **idle**.
- ✅ App is fully usable — banner shows, navigation works.

## 2. Reject all

- Click **Reject All** in the consent banner.
- Expected:
  - ✅ Console: `[CONSENT→GTM] consent_update PUSHED` with
    `analytics_storage: denied`.
  - ✅ Network: still **no** Contentsquare request.
  - ✅ Debug panel: `Analytics consent: false`, status remains **idle**.

## 3. Accept analytics (or Accept all)

- Reload, then click **Accept All** (or analytics-only).
- Expected:
  - ✅ Console: `[CS-Loader] consent-update received { analytics: true }`.
  - ✅ Console: `[CS-Loader] Injecting script (analytics consent granted).`
  - ✅ Network: `GET https://t.contentsquare.net/uxa/8a1781ba2e7b5.js` →
    **200** (or **304**), Type `script`, Initiator `contentsquareLoader.ts`
    *or* `gtm.js` (if GTM tag fired first — loader dedupes).
  - ✅ Console: green badge `[CS-Loader] ✓ Contentsquare/Hotjar tag loaded`
    with `{ ms: <duration> }`.
  - ✅ Debug panel pill: green **loaded**, with load time.
  - ✅ `window.__cs_uxa_loaded === true`.
  - ✅ `window.__csLoader.status === 'loaded'`.

## 4. Persistence across navigation

- Navigate to another route (e.g. `/tours`).
- Expected:
  - ✅ Loader does **not** re-inject (dedup via `__cs_uxa_loaded`).
  - ✅ No `[CS-Loader] ✗` errors in console.

## 5. Blocker / failure simulation

- Enable uBlock Origin / Brave Shields, or block `t.contentsquare.net` in
  DevTools → Network → "Block request domain".
- Reload, accept analytics consent.
- Expected:
  - ✅ Network: request shows **(blocked)** or **(failed)**.
  - ✅ Console: red badge `[CS-Loader] ✗ Failed to load Contentsquare/Hotjar
    tag` with `likely_blocker: true`.
  - ✅ `dataLayer` contains a `cs_loader_error` event (check via
    `dataLayer.filter(e => e.event === 'cs_loader_error')`).
  - ✅ Sentry receives a `warning`-level message
    `[CS-Loader] Failed to load Contentsquare/Hotjar tag` (visible in the
    Sentry project — production builds only).
  - ✅ Debug panel pill: red **blocked**.
  - ✅ The rest of the app continues to work normally — no thrown errors,
    no blank screens.

## 6. Revoke consent mid-session

- After a successful load, open the consent settings and revoke analytics.
- Expected:
  - ✅ Console: `[CONSENT→GTM] consent_update PUSHED` with
    `analytics_storage: denied`.
  - ✅ The already-loaded script keeps running (browser cannot un-execute
    code), but no new pageview will be reported by Contentsquare on the
    next hard reload until consent is granted again.
  - ℹ️ Recommended: instruct the user to clear cookies / hard reload to
    fully purge any in-memory state.

## 7. GTM-installed path (preferred)

If the tag is also configured inside GTM container `GTM-5FXJ9QBK`:

- Trigger: All Pages.
- Consent settings → Require additional consent: `analytics_storage`.
- Expected:
  - ✅ The GTM tag injects `t.contentsquare.net/...` once.
  - ✅ The runtime loader detects the existing `<script>` and logs:
    `[CS-Loader] Skipped — script tag already present in DOM.`
  - ✅ Only **one** request to the tag URL (no double load).

## 8. Quick console one-liners

```js
// Loader state
window.__csLoader

// Was the tag actually injected?
!!document.querySelector('script[src*="t.contentsquare.net/uxa/8a1781ba2e7b5.js"]')

// Latest GCM signal in dataLayer
[...dataLayer].reverse().find(e => e?.analytics_storage)?.analytics_storage

// All loader-error events
dataLayer.filter(e => e?.event === 'cs_loader_error')
```

---

If any check fails, capture the **Console** + **Network** screenshots and
the output of the one-liners above before filing a bug.
