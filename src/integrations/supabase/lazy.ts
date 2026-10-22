/**
 * Load the Supabase client on first use instead of in the initial page bundle.
 *
 * The client (auth, realtime, storage, postgrest) is about 200 KB of JavaScript. The root
 * providers only need it after the page has rendered (exchange rates, session restore, analytics),
 * so importing it statically put it on every page's critical path. Code that runs on demand can
 * keep importing { supabase } from './client' directly; anything mounted from __root should use
 * getSupabase().
 */
import type { supabase as Client } from './client';

let pending: Promise<typeof Client> | null = null;

export function getSupabase(): Promise<typeof Client> {
  if (!pending) pending = import('./client').then((m) => m.supabase);
  return pending;
}
