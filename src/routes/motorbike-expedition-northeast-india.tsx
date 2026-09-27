import { createFileRoute } from '@tanstack/react-router';
import AdventureLanding from '@/pages/expeditions/AdventureLanding';
import { buildRouteHead } from '@/lib/seo-head';
import { IMG } from '@/data/v2Images';

export const Route = createFileRoute('/motorbike-expedition-northeast-india')({
  head: () => buildRouteHead({ path: '/motorbike-expedition-northeast-india', title: 'Motorbike Expedition Northeast India | Routes & Riding Guide | XTSY', description: 'Compare Meghalaya, Tawang and Kohima motorbike expeditions with practical advice on road conditions, permits, altitude, seasons and riding gear.', image: IMG.bumla }),
  component: () => <AdventureLanding guide="motorbike-expedition-northeast-india" />,
});