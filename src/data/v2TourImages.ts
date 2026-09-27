/**
 * Picks a real XTSY / XTSY Voyage photo that matches a tour or place by
 * keyword. Returns '' when nothing relevant exists, so the UI shows a branded
 * placeholder instead of an unrelated or AI-generated image.
 */
import { IMG, first } from './v2Images';
import { cdn } from './cdnImages';

const RULES: [RegExp, string][] = [
  [/xtsy 270|experience by xtsy|glass|stargaz|honeymoon cloud|romantic/i, first(IMG.suite)],
  [/dawki|umngot|shnongpdeng/i, IMG.dawki],
  [/root bridge|nongriat/i, IMG.rootBridge],
  [/nohkalikai|cherrapunji|cherrapunjee|sohra/i, IMG.nohkalikai],
  [/seven sister/i, IMG.sevenSisters],
  [/krang suri|krang shuri|jaintia/i, IMG.krangSuri],
  [/mawlynnong/i, IMG.mawlynnong],
  [/mawsmai|cave|krem/i, IMG.mawsmai],
  [/laitlum/i, IMG.laitlum],
  [/umiam/i, IMG.umiam],
  [/elephant falls/i, IMG.elephant],
  [/bumla|bike|motorbike|royal enfield/i, IMG.bumla],
  [/tawang|arunachal|sela|bomdila|dirang/i, IMG.arunachal],
  [/kaziranga|assam|guwahati/i, IMG.assam],
  [/nagaland|kohima|dzukou|hornbill/i, IMG.nagaland],
  [/sikkim|pelling|gangtok|kanchenjunga/i, IMG.sikkim],
  [/bhutan/i, cdn('xtsyvoyage/Bhutan Mindful Kingdom Journey.jpeg')],
  [/ecolog|biodiversity/i, cdn('xtsyvoyage/Northeast Ecological Immersion.jpeg')],
  [/yoga|himachal yoga/i, cdn('xtsyvoyage/Himachal Yoga Retreat Program.jpeg')],
  [/dravidian|tamil|temple circuit/i, cdn('xtsyvoyage/Dravidian Architecture Masterclass.jpeg')],
  [/waterfall|meghalaya|shillong|wari chora/i, IMG.meghalaya],
];

export function photoFor(...texts: (string | undefined)[]): string {
  const s = texts.filter(Boolean).join(' ');
  for (const [re, src] of RULES) if (re.test(s) && src && !src.endsWith('placeholder.svg')) return src;
  return '';
}
