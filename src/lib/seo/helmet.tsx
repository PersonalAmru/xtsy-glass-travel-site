/**
 * Helmet that never duplicates the route's own head tags.
 *
 * Every route renders its title, description, canonical, robots and social tags on the server
 * through TanStack `head()`. Many older page components also declare the same tags in a
 * react-helmet-async <Helmet>, which only runs in the browser and appends a SECOND set
 * (the 22 Oct 2026 error sweep found 3–5 <title> tags and 2 canonicals on 77 pages).
 *
 * This wrapper drops any of those tags that the server already rendered for the page, and passes
 * everything else through unchanged — notably JSON-LD <script> blocks, which several components
 * still add only here. If a route does not set a tag itself, Helmet's tag is kept, so no page
 * loses its title or description.
 *
 * Import { Helmet } from '@/lib/seo/helmet' instead of 'react-helmet-async'.
 */
import { Children, Fragment, isValidElement, type ReactElement, type ReactNode } from 'react';
import { Helmet as BaseHelmet } from 'react-helmet-async';

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

/** True when the document already has this tag from the server (Helmet's own tags carry data-rh). */
function serverOwns(selector: string): boolean {
  if (typeof document === 'undefined') return false;
  return !!document.head.querySelector(`${selector}:not([data-rh])`);
}

export function Helmet({ children, ...rest }: HelmetProps) {
  const kept = flatten(children).filter((child) => {
    if (!isValidElement(child)) return true;
    const sel = ownedSelector(child);
    return !sel || !serverOwns(sel);
  });
  return <BaseHelmet {...rest}>{kept}</BaseHelmet>;
}

export default Helmet;
