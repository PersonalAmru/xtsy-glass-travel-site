/** Browser-safe external signal policy; internal diagnostics remain independent. */
export const APPROVED_CONVERSION_EVENTS = [
  'whatsapp_engaged_validated', 'call_engaged_validated', 'lead_qualified', 'booking_confirmed',
] as const;

export const DIAGNOSTIC_ONLY_CONVERSION_EVENTS = new Set([
  'conversion', 'form_submit', 'booking_initiated', 'booking_created',
  'booking_payment_initiated', 'get_directions_click', 'app_download',
  'whatsapp_hot_lead', 'qualified_booking_intent', 'group_enquiry_submit', 'b2b_enquiry_submit',
]);

export function isApprovedConversion(eventName: string): boolean {
  return APPROVED_CONVERSION_EVENTS.some(name => name === eventName);
}

export function hasValidatedIntent(params: Record<string, unknown>): boolean {
  if (params.validated !== true && params.validation_passed !== true) return false;
  const tier = params.intent_category ?? params.intent_tier ?? params.intent_level;
  const score = params.unified_intent_score ?? params.intent_score;
  if (tier !== undefined && tier !== 'high' && tier !== 'hot') return false;
  if (score !== undefined && (typeof score !== 'number' || !Number.isFinite(score) || score < 60)) return false;
  return tier === 'high' || tier === 'hot' || (typeof score === 'number' && score >= 60);
}

export function canForwardExternalEvent(eventName: string, params: Record<string, unknown>): boolean {
  if (DIAGNOSTIC_ONLY_CONVERSION_EVENTS.has(eventName)) return false;
  if (!isApprovedConversion(eventName)) return params.is_conversion !== true && params.is_validated_conversion !== true;
  if (!hasValidatedIntent(params)) return false;
  if (eventName === 'booking_confirmed') {
    return params.booking_status === 'confirmed' && typeof params.transaction_id === 'string' && params.transaction_id.length > 0;
  }
  return true;
}