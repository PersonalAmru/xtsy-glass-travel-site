import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { withPageCache } from "./lib/pageCache";
import { serverOnlySecurityHeaders } from "./utils/productionSecurityHeaders";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

// Framing protection must be an HTTP header: browsers ignore frame-ancestors and X-Frame-Options
// in <meta> tags (the 22 Oct 2026 error sweep found both ignored, and logged, on every page).
const FRAME_HEADERS = serverOnlySecurityHeaders({ isDevelopment: false });
function withFrameProtection(response: Response): Response {
  const type = response.headers.get("content-type") ?? "";
  if (!type.includes("text/html")) return response;
  let out = response;
  try {
    for (const [k, v] of Object.entries(FRAME_HEADERS)) out.headers.set(k, v);
  } catch {
    // Immutable headers (e.g. a cached or fetched Response): copy, then set.
    out = new Response(response.body, response);
    for (const [k, v] of Object.entries(FRAME_HEADERS)) out.headers.set(k, v);
  }
  return out;
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const handler = await getServerEntry();
      // Public pages are served from the page cache when possible (see src/lib/pageCache.ts).
      const response = await withPageCache(request, ctx, async () =>
        normalizeCatastrophicSsrResponse(await handler.fetch(request.clone(), env, ctx)),
      );
      return withFrameProtection(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
