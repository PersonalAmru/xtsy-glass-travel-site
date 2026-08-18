/**
 * Recovers from stale/failed ES module chunk loads.
 *
 * After a new deploy, an already-open tab (or a cached HTML document) can
 * reference hashed chunks that no longer exist. The dynamic import then fails
 * with "Importing a module script failed" (Safari) / "Failed to fetch
 * dynamically imported module" (Chrome) and the app renders a blank screen.
 *
 * These failures surface as window "error" / "unhandledrejection" events, so no
 * React error boundary can catch them. We perform a single cache-busting reload
 * per session; the sessionStorage guard prevents reload loops when the failure
 * is caused by something other than a stale build (e.g. offline).
 */

const RELOAD_FLAG = "xtsy_chunk_reload_at";
const RELOAD_COOLDOWN_MS = 30_000;

const CHUNK_ERROR_RE =
  /Importing a module script failed|Failed to fetch dynamically imported module|error loading dynamically imported module|Loading chunk \d+ failed|Loading CSS chunk|'text\/html' is not a valid JavaScript MIME type/i;

function isChunkError(value: unknown): boolean {
  if (!value) return false;
  const message =
    typeof value === "string"
      ? value
      : value instanceof Error
        ? `${value.name}: ${value.message}`
        : String((value as { message?: unknown }).message ?? "");
  return CHUNK_ERROR_RE.test(message);
}

function recentlyReloaded(): boolean {
  try {
    const at = Number(sessionStorage.getItem(RELOAD_FLAG) ?? 0);
    return Boolean(at) && Date.now() - at < RELOAD_COOLDOWN_MS;
  } catch {
    return false;
  }
}

function markReloaded() {
  try {
    sessionStorage.setItem(RELOAD_FLAG, String(Date.now()));
  } catch {
    /* storage blocked — reload guard degrades gracefully */
  }
}

function recover() {
  if (recentlyReloaded()) return;
  markReloaded();
  const url = new URL(window.location.href);
  url.searchParams.set("_v", Date.now().toString(36));
  window.location.replace(url.toString());
}

let installed = false;

export function installChunkRecovery() {
  if (installed || typeof window === "undefined") return;
  installed = true;

  window.addEventListener("error", (event) => {
    const target = event.target as HTMLElement | null;
    // A <script type="module"> / preload that 404s fires a non-bubbling error
    // event on the element itself, with no error object attached.
    if (target && (target.tagName === "SCRIPT" || target.tagName === "LINK")) {
      const src =
        (target as HTMLScriptElement).src ?? (target as HTMLLinkElement).href;
      if (typeof src === "string" && /\/assets\/.*\.(m?js)(\?|$)/.test(src)) {
        recover();
      }
      return;
    }
    if (isChunkError(event.error) || isChunkError(event.message)) recover();
  }, true);

  window.addEventListener("unhandledrejection", (event) => {
    if (isChunkError(event.reason)) recover();
  });
}
