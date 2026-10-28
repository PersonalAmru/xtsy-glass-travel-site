/**
 * CI check for the "Plan a trip with AI" assistant: types real requests,
 * taps chips and action buttons, and saves screenshots + a log to shots/chat/.
 */
import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { blockAnalytics } from './audit/no-analytics';

const BASE = process.env.BASE_URL || 'http://localhost:8080';
const OUT = path.join(process.env.OUT_DIR || 'shots', 'chat');

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const log: string[] = [];
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
  await blockAnalytics(ctx);
  await ctx.addInitScript(() => { try { localStorage.setItem('xtsy_consent_v2', JSON.stringify({ necessary: true, analytics: true, marketing: false, personalization: false, timestamp: new Date().toISOString(), version: '2.0' })); } catch { /* */ } });
  await ctx.route('**/__l5e/**', async (r) => { try { const u = new URL(r.request().url()); await r.fulfill({ response: await r.fetch({ url: `https://xtsy.one${u.pathname}` }) }); } catch { await r.continue(); } });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => log.push(`pageerror: ${e.message}`));
  await page.goto(`${BASE}/plan-trip-with-ai`, { waitUntil: 'networkidle', timeout: 90000 });
  const input = page.locator('#trip-chat-input-embedded');
  const say = async (text: string, shot: string) => {
    await input.fill(text);
    await input.press('Enter');
    await page.waitForTimeout(1200);
    const last = await page.locator('section[aria-label="XTSY trip assistant"] .rounded-bl-md').last().innerText().catch(() => '');
    log.push(`> ${text}\n${last.slice(0, 1500)}\n`);
    await page.locator('section[aria-label="XTSY trip assistant"]').screenshot({ path: path.join(OUT, `${shot}.png`) });
  };
  await say('Plan 5 days with Wari Chora and Dawki for 4 of us in December', '1-wari-5days');
  const chip = page.getByRole('button', { name: /^Make it \d+ days$/ }).first();
  if (await chip.count()) { log.push(`chip: ${await chip.innerText()}`); await chip.click(); await page.waitForTimeout(1200); await page.locator('section[aria-label="XTSY trip assistant"]').screenshot({ path: path.join(OUT, '2-longer.png') }); }
  await say('How far is Wari Chora from Shillong?', '3-distance');
  await say('Where should I stay near Kaziranga?', '4-stay');
  await say('Tawang in 7 days, honeymoon', '5-tawang');
  await page.getByRole('button', { name: 'Get this plan confirmed' }).last().click().catch((e) => log.push(`send click failed ${e}`));
  await page.waitForTimeout(600);
  log.push(`lead form visible: ${await page.getByRole('button', { name: 'Send to the XTSY desk' }).isVisible().catch(() => false)}`);
  await page.locator('section[aria-label="XTSY trip assistant"]').screenshot({ path: path.join(OUT, '6-send-form.png') });
  // Pop-up launcher on the home page.
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle', timeout: 90000 });
  await page.getByRole('button', { name: 'Plan with AI' }).first().click().catch((e) => log.push(`header button failed ${e}`));
  await page.waitForTimeout(1500);
  log.push(`popup open: ${await page.getByRole('dialog', { name: 'Plan a trip with AI' }).isVisible().catch(() => false)}`);
  await page.screenshot({ path: path.join(OUT, '7-popup.png') });
  fs.writeFileSync(path.join(OUT, 'chat-log.txt'), log.join('\n'));
  await browser.close();
  console.log(log.join('\n').slice(0, 4000));
}
main().catch((e) => { console.error(e); process.exit(1); });
