import { createStart, createCsrfMiddleware, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

// Start installs a CSRF middleware automatically when src/start.ts is absent;
// defining this file opts out, so re-add equivalent same-origin protection for
// server functions. Implemented locally with createMiddleware rather than the
// framework's createCsrfMiddleware helper: importing that helper here pulls the
// server entry into an ESM chunk cycle in the Worker build, which evaluates
// `createCsrfMiddleware` before it is initialised and 500s every request with
// "createCsrfMiddleware is not a function".
const csrfMiddleware = createMiddleware().server(async (ctx: any) => {
  if (ctx.handlerType !== "serverFn") return ctx.next();

  const request: Request | undefined = ctx.request;
  if (!request) return ctx.next();

  const secFetchSite = request.headers.get("Sec-Fetch-Site");
  if (secFetchSite !== null) {
    return secFetchSite === "same-origin" || secFetchSite === "none"
      ? ctx.next()
      : new Response("Forbidden", { status: 403 });
  }

  const requestOrigin = new URL(request.url).origin;
  const origin = request.headers.get("Origin");
  if (origin !== null) {
    return origin === requestOrigin ? ctx.next() : new Response("Forbidden", { status: 403 });
  }

  const referer = request.headers.get("Referer");
  if (referer !== null) {
    return referer.startsWith(requestOrigin)
      ? ctx.next()
      : new Response("Forbidden", { status: 403 });
  }

  return ctx.next();
});

export const startInstance = createStart(() => ({
  requestMiddleware: [errorMiddleware, csrfMiddleware],
}));
