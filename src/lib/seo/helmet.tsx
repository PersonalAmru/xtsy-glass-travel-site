/**
 * Helmet that never duplicates the route's own head tags.
 *
 * Every route renders its title, description, canonical, robots and social tags through
 * TanStack `head()`. Many older page components also declare the same tags in a
 * react-helmet-async <Helmet>. With React 19, Helmet 3 renders those tags inline and React
 * hoists them into <head> — on the server too — so the page ships a SECOND set
 * (the 22 Oct 2026 error sweep found 3–5 <title> tags and 2 canonicals on 77 pages).
 *
 * This wrapper drops any of those tags that a matched route's `head()` already declares, and
 * passes everything else through unchanged — notably JSON-LD <script> blocks, which several
 * components still add only here. The decision comes from router state, which is the same on
 * the server and in the browser, so hydration sees identical trees. If no route sets a tag,
 * Helmet's tag is kept, so no page loses its title or description.
 *
 * Import { Helmet } from '@/lib/seo/helmet' instead of 'react-helmet-async'.
 */
import { Children, Fragment, isValidElement, type ReactElement, type ReactNode } from 'react';
import { Helmet as BaseHelmet } from 'react-helmet-async';
import { useRouterState } from '@tanstack/react-router';

type HelmetProps = Parameters<typeof BaseHelmet>[0];

/** CSS selector for the server-rendered tag that a Helmet child would duplicate, or null. */
function ownedSelector(el: ReactElement): string | null {
  const p = (el.props || {}) as Record<string, unknown>;
  if (el.type === 'title') return 'title';
  if (el.type === 'link' && p.rel === 'canonical') return 'link[rel="canonical"]';
  if (el.type === 'meta') {
    const name = typeof p.name === 'string' ? p.name : '';
    const property = typeof p.property === 'string' ? p.property : '';
    if (/^(description|robots|keywords|googlebot)$/i.test(name) || /^twitter:/i.test(name)) return `meta[name="${name}"]`;
    if (/^(og|article):/i.test(property)) return `meta[property="${property}"]`;
  }
  return null;
}

function flatten(children: ReactNode): ReactNode[] {
  const out: ReactNode[] = [];
  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === Fragment) out.push(...flatten((child.props as { children?: ReactNode }).children));
    else if (child !== null && child !== undefined && child !== false && child !== true) out.push(child);
  });
  return out;
}

type HeadTag = Record<string, unknown> | undefined;

/** Selectors (same form as ownedSelector) for every tag the matched routes' head() declares. */
function useRouteOwned(): Set<string> {
  const key = useRouterState({
    select: (s) => {
      const out: string[] = [];
      for (const m of s.matches as Array<{ meta?: HeadTag[]; links?: HeadTag[] }>) {
        for (const t of m.meta || []) {
          if (!t) continue;
          if (t.title) out.push('title');
          if (typeof t.name === 'string') out.push(`meta[name="${t.name}"]`);
          if (typeof t.property === 'string') out.push(`meta[property="${t.property}"]`);
        }
        for (const l of m.links || []) if (l && l.rel === 'canonical') out.push('link[rel="canonical"]');
      }
      return out.join('|');
    },
  });
  return new Set(key ? key.split('|') : []);
}

export function Helmet({ children, ...rest }: HelmetProps) {
  const owned = useRouteOwned();
  const kept = flatten(children).filter((child) => {
    if (!isValidElement(child)) return true;
    const sel = ownedSelector(child);
    return !sel || !owned.has(sel);
  });
  return <BaseHelmet {...rest}>{kept}</BaseHelmet>;
}

export default Helmet;
