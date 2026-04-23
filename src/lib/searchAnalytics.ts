/**
 * searchAnalytics — fire-and-forget logger that records on-site search queries
 * to the `search_queries` table for the admin Search Console.
 *
 * Designed to never block the UI: errors are swallowed, calls are debounced
 * per (query+source) so a user typing doesn't flood the table, and a session
 * marker is reused for visitor identification.
 */
import { supabase } from '@/integrations/supabase/client';

interface LogSearchInput {
  query: string;
  source: string; // 'header_overlay' | 'hero_hint_bar' | etc.
  resultCount: number;
  pagePath?: string;
  clickedResultUrl?: string | null;
  clickedResultTitle?: string | null;
}

const VISITOR_KEY = 'xtsy_visitor_id';
const SESSION_KEY = 'xtsy_session_id';
// per-session in-memory dedup so we don't insert duplicates while typing
const recent: Map<string, number> = new Map();
const DEDUP_MS = 4000;

function getVisitorId(): string {
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id = `v_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    return 'anon';
  }
}

function getSessionId(): string {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return 'anon';
  }
}

function getDevice(): string {
  if (typeof navigator === 'undefined') return 'unknown';
  const ua = navigator.userAgent;
  if (/Mobi|Android|iPhone/i.test(ua)) return 'mobile';
  if (/iPad|Tablet/i.test(ua)) return 'tablet';
  return 'desktop';
}

/**
 * Log a search query. Safe to call on every keystroke — internal dedup &
 * minimum-length guards prevent flood.
 */
export function logSearchQuery(input: LogSearchInput): void {
  const q = (input.query || '').trim();
  if (q.length < 2) return; // ignore noise

  const dedupKey = `${input.source}::${q.toLowerCase()}`;
  const now = Date.now();
  const last = recent.get(dedupKey);
  if (last && now - last < DEDUP_MS) return;
  recent.set(dedupKey, now);

  // truncate map periodically
  if (recent.size > 200) {
    for (const [k, t] of recent) {
      if (now - t > 60_000) recent.delete(k);
    }
  }

  const payload = {
    query: q.slice(0, 200),
    source: input.source,
    page_path: (input.pagePath ?? (typeof window !== 'undefined' ? window.location.pathname : null))?.slice(0, 200) ?? null,
    result_count: Math.max(0, input.resultCount | 0),
    clicked_result_url: input.clickedResultUrl ?? null,
    clicked_result_title: input.clickedResultTitle ?? null,
    visitor_id: getVisitorId(),
    session_id: getSessionId(),
    device_type: getDevice(),
    user_agent: typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 300) : null,
  };

  // fire and forget — never throw to UI
  void supabase.from('search_queries').insert(payload).then(({ error }) => {
    if (error && import.meta.env.DEV) {
      console.warn('[searchAnalytics] insert failed:', error.message);
    }
  });
}

/**
 * Update the most recent matching log row with the result the user clicked.
 * Best-effort: we look up the latest insert by (visitor_id, query) within 5 min.
 */
export async function logSearchClick(opts: {
  query: string;
  source: string;
  url: string;
  title: string;
}): Promise<void> {
  const q = (opts.query || '').trim().toLowerCase();
  if (!q) return;
  try {
    // Insert a new row representing the click — simpler & more robust than UPDATE.
    await supabase.from('search_queries').insert({
      query: q.slice(0, 200),
      source: `${opts.source}_click`,
      result_count: 1,
      clicked_result_url: opts.url,
      clicked_result_title: opts.title.slice(0, 200),
      visitor_id: getVisitorId(),
      session_id: getSessionId(),
      device_type: getDevice(),
      page_path: typeof window !== 'undefined' ? window.location.pathname : null,
    });
  } catch {
    /* swallow */
  }
}
