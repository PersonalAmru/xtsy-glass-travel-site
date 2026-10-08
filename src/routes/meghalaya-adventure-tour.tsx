import { createFileRoute } from '@tanstack/react-router';
import AdventureLanding from '@/pages/expeditions/AdventureLanding';
import { buildRouteHead } from '@/lib/seo-head';
import { IMG } from '@/data/v2Images';

export const Route = createFileRoute('/meghalaya-adventure-tour')({
  head: () => buildRouteHead({ path: '/meghalaya-adventure-tour', title: 'Meghalaya Adventure Tour | Trek, River & Waterfalls | XTSY', description: 'Plan a Shillong-based Meghalaya adventure tour with Nongriat trekking, Sohra waterfalls, Dawki river activities, season advice and a 4-day outline.', image: new URL(IMG.rootBridge, 'https://xtsy.one').href, ogType: 'article' }),
  component: () => <AdventureLanding guide="meghalaya-adventure-tour" />,
});