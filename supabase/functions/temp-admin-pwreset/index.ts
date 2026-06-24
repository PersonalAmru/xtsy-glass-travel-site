// TEMPORARY one-time admin diagnostic + password reset helper.
// Token-guarded. Delete immediately after use.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const GUARD = '8lI9PV25eIrNbjQfK_6wZYdh8H2pJ-W0';
const url = Deno.env.get('SUPABASE_URL')!;
const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  try {
    const body = await req.json();
    if (body.guard !== GUARD) {
      return new Response(JSON.stringify({ error: 'forbidden' }), { status: 403, headers: { ...cors, 'Content-Type': 'application/json' } });
    }
    const email = String(body.email || '').toLowerCase().trim();
    const admin = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });

    // Find user by paging through users
    let target: any = null;
    let page = 1;
    while (page <= 20 && !target) {
      const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
      if (error) return new Response(JSON.stringify({ step: 'listUsers', error: error.message }), { status: 500, headers: { ...cors, 'Content-Type': 'application/json' } });
      target = data.users.find((u) => (u.email || '').toLowerCase() === email) || null;
      if (data.users.length < 200) break;
      page++;
    }

    if (!target) {
      return new Response(JSON.stringify({ found: false, message: 'No auth user with that email' }), { headers: { ...cors, 'Content-Type': 'application/json' } });
    }

    const result: any = {
      found: true,
      user_id: target.id,
      email: target.email,
      email_confirmed: !!target.email_confirmed_at,
      last_sign_in_at: target.last_sign_in_at,
    };

    if (body.newPassword) {
      const { error: upErr } = await admin.auth.admin.updateUserById(target.id, {
        password: String(body.newPassword),
        email_confirm: true,
      });
      result.passwordUpdated = !upErr;
      if (upErr) result.updateError = upErr.message;
    }

    // Check admin role
    const { data: roleRow } = await admin.from('user_roles').select('role').eq('user_id', target.id);
    result.roles = (roleRow || []).map((r: any) => r.role);

    return new Response(JSON.stringify(result), { headers: { ...cors, 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...cors, 'Content-Type': 'application/json' } });
  }
});
