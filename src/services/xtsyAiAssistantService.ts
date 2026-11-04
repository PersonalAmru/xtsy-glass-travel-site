import { supabase } from '@/integrations/supabase/client';
import { CLUSTERS, PLACES } from '@/lib/travel/places';
import type { ChatState } from '@/lib/travel/assistant';

export type XtsyAiKind = 'planner' | 'question' | 'clarification' | 'other';

export interface XtsyAiInterpretation {
  kind: XtsyAiKind;
  normalizedMessage: string;
  assistantMessage: string;
  replyLanguage: string;
}

interface HistoryMessage {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Uses the server-side XTSY AI Edge Function to interpret natural language.
 * The deterministic planner remains the source of truth for itinerary
 * feasibility and is used after this semantic interpretation step.
 */
export async function interpretTripMessage(args: {
  message: string;
  history: HistoryMessage[];
  state: ChatState;
}): Promise<XtsyAiInterpretation> {
  const destinationCatalogue = PLACES.map((place) => ({
    id: place.id,
    name: place.name,
    aliases: place.aliases.slice(0, 8),
    state: CLUSTERS[place.cluster].state,
    region: CLUSTERS[place.cluster].name,
    tags: place.tags.slice(0, 8),
  }));

  const { data, error } = await supabase.functions.invoke('xtsy-ai-assistant', {
    body: {
      message: args.message.slice(0, 2000),
      history: args.history.slice(-10).map((item) => ({
        role: item.role,
        content: item.content.slice(0, 1800),
      })),
      state: {
        days: args.state.days ?? null,
        placeIds: args.state.placeIds.slice(0, 30),
        travellers: args.state.travellers ?? null,
        styles: args.state.styles.slice(0, 10),
        month: args.state.month ?? null,
        camping: args.state.camping ?? null,
        hasPlan: args.state.hasPlan,
        avoid: args.state.avoid.slice(0, 30),
      },
      destinationCatalogue,
    },
  });

  if (error) throw new Error(error.message || 'XTSY AI request failed');
  if (!data || typeof data !== 'object') throw new Error('XTSY AI returned an empty response');

  const kind = data.kind as XtsyAiKind;
  if (!['planner', 'question', 'clarification', 'other'].includes(kind)) {
    throw new Error('XTSY AI returned an unsupported response type');
  }

  return {
    kind,
    normalizedMessage: typeof data.normalized_message === 'string' ? data.normalized_message : '',
    assistantMessage: typeof data.assistant_message === 'string' ? data.assistant_message : '',
    replyLanguage: typeof data.reply_language === 'string' ? data.reply_language : 'English',
  };
}
