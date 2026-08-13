import { createServerFn } from '@tanstack/react-start';
import { getRequestHeader } from '@tanstack/react-start/server';
import { z } from 'zod';

const ConsentItem = z.object({
  consent_type: z.enum(['essential', 'analytics', 'marketing', 'personalization']),
  granted: z.boolean(),
});

const BodySchema = z.object({
  visitor_id: z.string().trim().min(1).max(128),
  consent_version: z.string().trim().min(1).max(32),
  consents: z.array(ConsentItem).min(1).max(10),
});

export type ConsentPayload = z.infer<typeof BodySchema>;

/**
 * DPDP/GDPR consent recorder (migrated from the `record-consent` edge fn).
 * Clients cannot write dpdp_consents directly; this validates the payload,
 * captures the IP server-side (never from the body), and writes privileged.
 */
export const recordConsent = createServerFn({ method: 'POST' })
  .inputValidator((input: unknown) => BodySchema.parse(input))
  .handler(async ({ data }) => {
    const ipAddress =
      getRequestHeader('cf-connecting-ip') ??
      getRequestHeader('x-forwarded-for')?.split(',')[0]?.trim() ??
      null;
    const userAgent = getRequestHeader('user-agent') ?? null;

    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');

    const nowIso = new Date().toISOString();
    const rows = data.consents.map(({ consent_type, granted }) => ({
      visitor_id: data.visitor_id,
      consent_type,
      granted,
      granted_at: granted ? nowIso : null,
      consent_version: data.consent_version,
      ip_address: ipAddress,
      user_agent: userAgent,
    }));

    const { error } = await supabaseAdmin
      .from('dpdp_consents')
      .upsert(rows, { onConflict: 'visitor_id,consent_type' });

    if (error) {
      console.error('[recordConsent] upsert error:', error.message);
      throw new Error('Failed to record consent');
    }

    return { success: true, recorded: rows.length };
  });
