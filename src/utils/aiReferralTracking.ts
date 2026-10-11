import { readConsent } from '@/lib/consent';
/**
 * AI Answer-Engine referral tracking.
 *
 * Detects sessions that arrive from AI assistants (ChatGPT, Perplexity,
 * Gemini, Copilot, Claude, etc.) and:
 *  1. Fires a GA4 `ai_referral` event with a stable `ai_source` parameter.
 *  2. Sets a `ai_referral_source` user property so a GA4 segment /
 *     exploration can filter the whole session, not just the landing hit.
 *  3. Persists the source for the session so downstream booking events can
 *     be attributed back to the AI assistant that cited xtsy.one.
 *
 * GA4 setup this pairs with (done once in the GA4 UI):
 *   Segment "AI assistant traffic" → Condition: event `ai_referral`
 *   exists, OR user property `ai_referral_source` is one of
 *   chatgpt / perplexity / gemini / copilot / claude.
 *
 * Diagnostic only — per the project's analytics policy an AI referral is
 * never itself a conversion; it only labels the session.
 */

export type AIReferralSource =
  | 'chatgpt'
  | 'perplexity'
  | 'gemini'
  | 'copilot'
  | 'claude'
  | 'other_ai';

const AI_HOST_MAP: Array<{ match: RegExp; source: AIReferralSource }> = [
  { match: /(^|\.)chatgpt\.com$/i, source: 'chatgpt' },
  { match: /(^|\.)chat\.openai\.com$/i, source: 'chatgpt' },
  { match: /(^|\.)oai\.azure\.com$/i, source: 'chatgpt' },
  { match: /(^|\.)perplexity\.ai$/i, source: 'perplexity' },
  { match: /(^|\.)gemini\.google\.com$/i, source: 'gemini' },
  { match: /(^|\.)bard\.google\.com$/i, source: 'gemini' },
  { match: /(^|\.)copilot\.microsoft\.com$/i, source: 'copilot' },
  { match: /(^|\.)bing\.com$/i, source: 'copilot' },
  { match: /(^|\.)claude\.ai$/i, source: 'claude' },
  { match: /(^|\.)you\.com$/i, source: 'other_ai' },
  { match: /(^|\.)phind\.com$/i, source: 'other_ai' },
  { match: /(^|\.)poe\.com$/i, source: 'other_ai' },
];

const STORAGE_KEY = 'xtsy_ai_referral_source';

/** Resolve the AI source from a referrer URL string, or null. */
export const resolveAISource = (referrer: string): AIReferralSource | null => {
  if (!referrer) return null;
  let host = '';
  try {
    host = new URL(referrer).hostname;
  } catch {
    return null;
  }
  const hit = AI_HOST_MAP.find((entry) => entry.match.test(host));
  return hit ? hit.source : null;
};

/** utm_source values AI assistants and manual AI campaigns commonly use. */
const resolveAISourceFromUTM = (search: string): AIReferralSource | null => {
  const params = new URLSearchParams(search);
  const utm = (params.get('utm_source') || '').toLowerCase();
  if (!utm) return null;
  if (utm.includes('chatgpt') || utm.includes('openai')) return 'chatgpt';
  if (utm.includes('perplexity')) return 'perplexity';
  if (utm.includes('gemini') || utm.includes('bard')) return 'gemini';
  if (utm.includes('copilot')) return 'copilot';
  if (utm.includes('claude') || utm.includes('anthropic')) return 'claude';
  return null;
};

/** The AI source for the current session, if any. */
export const getSessionAISource = (): AIReferralSource | null => {
  if (typeof window === 'undefined' || !readConsent()?.analytics) return null;
  try {
    return (sessionStorage.getItem(STORAGE_KEY) as AIReferralSource) || null;
  } catch {
    return null;
  }
};

/**
 * Detects and reports AI-assistant referrals. Safe to call on every route
 * mount — the GA4 event fires only once per session.
 */
export const trackAIReferral = (): AIReferralSource | null => {
  if (typeof window === 'undefined' || !readConsent()?.analytics) return null;

  const existing = getSessionAISource();
  const detected =
    resolveAISourceFromUTM(window.location.search) ||
    resolveAISource(document.referrer) ||
    existing;

  if (!detected) return null;

  try {
    sessionStorage.setItem(STORAGE_KEY, detected);
  } catch {
    /* storage disabled — event still fires */
  }

  if (existing) return detected; // already reported this session

  const payload = {
    event: 'ai_referral',
    ai_source: detected,
    ai_referrer: document.referrer || '(none)',
    landing_page: window.location.pathname,
    // Diagnostic-only signal — never treat as a conversion.
    signal_quality: 'diagnostic',
  };

  const w = window as unknown as {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push(payload);
  w.gtag?.('event', 'ai_referral', payload);
  w.gtag?.('set', 'user_properties', { ai_referral_source: detected });

  return detected;
};

export default trackAIReferral;
