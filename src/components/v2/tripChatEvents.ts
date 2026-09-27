/** Tiny event bus so any button can open the pop-up trip assistant without loading it. */
export const OPEN_EVENT = 'xtsy:open-trip-chat';

/** Open the pop-up assistant from anywhere, optionally sending a first message. */
export function openTripChat(prompt?: string) {
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: { prompt } }));
}
