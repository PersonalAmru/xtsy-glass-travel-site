/**
 * TanStack-native head() builder.
 *
 * Per-route title/description/og:* live in each route's `head()` so SSR emits
 * unique tags (react-helmet-async only runs after hydration, which made every
 * server-rendered page inherit the root title).
 */

const SITE_URL = "https://xtsy.one";

export const DEFAULT_OG_IMAGE =
  "https://storage.googleapis.com/gpt-engineer-file-uploads/1WJsBBRRZpg9MH8fICqqeJ2sC6q1/social-images/social-1765259372136-with_padding.png";

export interface RouteHeadInput {
  /** Path beginning with "/" — used for canonical + og:url. */
  path: string;
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  ogType?: "website" | "article" | "product";
  noIndex?: boolean;
  /** With noIndex: keep following links ("noindex, follow") so link equity still flows. */
  noIndexFollow?: boolean;
  /**
   * Above-the-fold hero image URL. Emitted as <link rel="preload" as="image">
   * so mobile browsers start the LCP fetch during HTML parse.
   */
  preloadImage?: string;
  /** Optional responsive srcset/sizes for the preloaded hero image. */
  preloadImageSrcSet?: string;
  preloadImageSizes?: string;
  /** Optional phone-specific hero (e.g. a portrait crop): preloaded below 768px, the main one above. */
  preloadMobile?: { href: string; srcSet: string; sizes?: string };
  /** JSON-LD objects rendered as <script type="application/ld+json"> */
  jsonLd?: Array<Record<string, unknown>>;
}


export function canonicalFor(path: string): string {
  if (!path || path === "/") return `${SITE_URL}/`;
  const clean = ("/" + path.replace(/^\/+/, "")).split("?")[0].split("#")[0];
  return `${SITE_URL}${clean.replace(/\/+$/, "")}`;
}

export function buildRouteHead(input: RouteHeadInput) {
  const url = canonicalFor(input.path);
  const image = input.image || DEFAULT_OG_IMAGE;

  return {
    meta: [
      { title: input.title },
      { name: "description", content: input.description },
      ...(input.keywords ? [{ name: "keywords", content: input.keywords }] : []),
      {
        name: "robots",
        content: input.noIndex
          ? input.noIndexFollow ? "noindex, follow" : "noindex, nofollow"
          : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
      },
      { property: "og:type", content: input.ogType || "website" },
      { property: "og:title", content: input.title },
      { property: "og:description", content: input.description },
      { property: "og:url", content: url },
      { property: "og:image", content: image },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: input.title },
      { name: "twitter:description", content: input.description },
      { name: "twitter:image", content: image },
    ],
    links: [
      { rel: "canonical", href: url },
      ...(input.preloadImage
        ? [
            {
              rel: "preload",
              as: "image",
              href: input.preloadImage,
              ...(input.preloadImageSrcSet
                ? {
                    imageSrcSet: input.preloadImageSrcSet,
                    imageSizes: input.preloadImageSizes || "100vw",
                  }
                : {}),
              fetchPriority: "high" as const,
              ...(input.preloadMobile ? { media: "(min-width: 768px)" } : {}),
            },
            ...(input.preloadMobile
              ? [
                  {
                    rel: "preload",
                    as: "image",
                    href: input.preloadMobile.href,
                    imageSrcSet: input.preloadMobile.srcSet,
                    imageSizes: input.preloadMobile.sizes || "100vw",
                    fetchPriority: "high" as const,
                    media: "(max-width: 767px)",
                  },
                ]
              : []),
          ]
        : []),
    ],

    ...(input.jsonLd?.length
      ? {
          scripts: input.jsonLd.map((schema) => ({
            type: "application/ld+json",
            children: JSON.stringify(schema),
          })),
        }
      : {}),
  };
}

