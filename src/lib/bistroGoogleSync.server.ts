import { timingSafeEqual } from 'node:crypto';
import { reconcileBistroGoogleProfile, type BistroGoogleFields } from './bistroGoogleProfile';

const LOCATION = 'locations/1512849057338858758';
const GATEWAY_URL = 'https://connector-gateway.lovable.dev/google_business_profile/business_information/v1';

export async function handleBistroGoogleSync(request: Request): Promise<Response> {
  const secret = process.env['BISTRO_GOOGLE_SYNC_SECRET'];
  const supplied = request.headers.get('authorization')?.replace(/^Bearer /, '') ?? '';
  if (!secret) return Response.json({ error: 'Sync credentials unavailable' }, { status: 503 });
  const expectedBytes = new TextEncoder().encode(secret);
  const suppliedBytes = new TextEncoder().encode(supplied);
  if (expectedBytes.length !== suppliedBytes.length || !timingSafeEqual(expectedBytes, suppliedBytes))
    return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const lovableKey = process.env['LOVABLE_API_KEY'];
  const googleKey = process.env['GOOGLE_BUSINESS_PROFILE_API_KEY'];
  if (!lovableKey || !googleKey) return Response.json({ error: 'Google connection unavailable' }, { status: 503 });
  const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
  const { error: initError } = await supabaseAdmin.from('bistro_google_sync_state')
    .upsert({ id: true, callback_token: secret }, { onConflict: 'id', ignoreDuplicates: true });
  if (initError) return Response.json({ error: 'Cannot initialize sync state' }, { status: 500 });
  const { data: claimed, error: claimError } = await supabaseAdmin.rpc('claim_bistro_google_sync');
  if (claimError) return Response.json({ error: 'Cannot lock sync' }, { status: 500 });
  if (!claimed) return Response.json({ status: 'busy' }, { status: 202 });
  try {
    const result = await reconcileBistroGoogleProfile(async (method, validateOnly, fields) => {
      const query = method === 'GET' ? 'readMask=regularHours,profile' : `updateMask=regularHours,profile${validateOnly ? '&validateOnly=true' : ''}`;
      const response = await fetch(`${GATEWAY_URL}/${LOCATION}?${query}`, {
        method,
        headers: { Authorization: `Bearer ${lovableKey}`, 'X-Connection-Api-Key': googleKey, 'Content-Type': 'application/json' },
        ...(fields ? { body: JSON.stringify({ name: LOCATION, ...fields }) } : {}),
        signal: AbortSignal.timeout(25000),
      });
      if (!response.ok) {
        const errorBody = await response.text();
        console.error(`Bistro Google sync [${response.status}]: ${errorBody}`);
        throw new Error(`Google request failed [${response.status}]: ${errorBody}`);
      }
      return await response.json() as BistroGoogleFields;
    });
    const { error } = await supabaseAdmin.from('bistro_google_sync_state').update({
      synced_payload: JSON.stringify((await import('./bistroGoogleProfile')).buildBistroGoogleFields()),
      last_synced_at: new Date().toISOString(), last_error: null, lease_until: null,
    }).eq('id', true);
    if (error) throw new Error('Google checked but sync state could not be saved');
    return Response.json({ status: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Google sync failed';
    await supabaseAdmin.from('bistro_google_sync_state').update({ last_error: message, lease_until: null }).eq('id', true);
    return Response.json({ error: message }, { status: 502 });
  }
}