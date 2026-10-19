import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// Live permission regression checks: no writes, no personal data returned or logged.
const config = Object.fromEntries(readFileSync('.env', 'utf8').split('\n').filter(line => line.includes('=')).map(line => {
  const position = line.indexOf('=');
  return [line.slice(0, position), line.slice(position + 1).replace(/^['"]|['"]$/g, '')];
}));
const url = config.VITE_SUPABASE_URL;
const key = config.VITE_SUPABASE_PUBLISHABLE_KEY ?? config.VITE_SUPABASE_ANON_KEY;
const session = process.env.LOVABLE_BROWSER_SUPABASE_SESSION_JSON;
const token = session ? JSON.parse(session).access_token as string : undefined;

async function rpc(name: string, body: Record<string, unknown>, authenticated = false) {
  const response = await fetch(`${url}/rest/v1/rpc/${name}`, {
    method: 'POST',
    headers: { apikey: key, Authorization: `Bearer ${authenticated ? token : key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return { status: response.status, data: await response.json() };
}

describe('booking function execution boundaries', () => {
  it('guests cannot retrieve password reset codes', async () => {
    const result = await rpc('generate_password_reset_otp', { p_email: 'ownership-check@example.invalid' });
    expect(result.status).toBe(401);
    expect(result.data.code).toBe('42501');
  });
  it('guests cannot approve bookings', async () => {
    const result = await rpc('approve_booking_and_block_inventory', { p_booking_id: '00000000-0000-0000-0000-000000000000', p_admin_id: '00000000-0000-0000-0000-000000000000' });
    expect(result.status).toBe(401);
    expect(result.data.code).toBe('42501');
  });
  it('booking validation runs instead of failing at auth schema access', async () => {
    const result = await rpc('create_booking_secure', { p_guest_name: '', p_email: 'ownership-check@example.invalid', p_whatsapp_number: '+919999999999', p_check_in: '2027-01-01', p_check_out: '2027-01-02', p_guests: 1, p_room_type: 'Dorm', p_room_type_id: null, p_quantity: 1, p_subtotal: 399, p_taxes: 0, p_total_amount: 399 });
    expect(result.status).toBe(200);
    expect(result.data).toMatchObject({ success: false, error: 'Invalid guest name' });
  });
  it.skipIf(!token)('signed-in role checks can access auth', async () => {
    const result = await rpc('get_user_role', {}, true);
    expect(result.status).toBe(200);
    expect(['admin', 'staff', 'user', 'guest']).toContain(result.data);
  });
  it.skipIf(!token)('an admin action rejects a forged actor before touching a booking', async () => {
    const result = await rpc('approve_enquiry', { p_enquiry_uuid: '00000000-0000-0000-0000-000000000000', p_admin_id: '00000000-0000-0000-0000-000000000000' }, true);
    expect(result.status).toBe(403);
    expect(result.data.code).toBe('42501');
  });
});