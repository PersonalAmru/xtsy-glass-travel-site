import { useEffect, useState, type ComponentType } from "react";

/** Diagnostics must never prevent the guest page from rendering. */
export default function OptionalConsentDebugPanel() {
  const [Panel, setPanel] = useState<ComponentType | null>(null);

  useEffect(() => {
    let active = true;
    let enabled = import.meta.env.DEV;
    try {
      const debug = new URLSearchParams(window.location.search).get("debug");
      enabled ||= debug === "consent" || debug === "hotjar" ||
        localStorage.getItem("xtsy_debug_consent") === "true" ||
        localStorage.getItem("xtsy_debug_hotjar") === "true";
    } catch {
      // Storage may be unavailable; URL flags and development mode still work.
    }
    if (enabled) {
      import("./ConsentDebugPanel")
        .then((module) => {
          if (active) setPanel(() => module.default);
        })
        .catch(() => {
          // A stale, offline or blocked debug chunk is optional, not a route error.
          // Catch here rather than rejecting React.lazy and replacing the whole page.
          if (active) console.warn("[ConsentDebugPanel] Diagnostics unavailable; page remains usable.");
        });
    }
    return () => { active = false; };
  }, []);

  return Panel ? <Panel /> : null;
}