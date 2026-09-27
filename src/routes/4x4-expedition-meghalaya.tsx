import { createFileRoute } from '@tanstack/react-router';
import AdventureLanding from '@/pages/expeditions/AdventureLanding';
import { buildRouteHead } from '@/lib/seo-head';
import { IMG } from '@/data/v2Images';

export const Route = createFileRoute('/4x4-expedition-meghalaya')({
  head: () => buildRouteHead({ path: '/4x4-expedition-meghalaya', title: '4x4 Expedition Meghalaya | Shillong–Dawki Circuit | XTSY', description: 'Explore a 3–4 day Meghalaya 4x4 circuit through Shillong, Dawki, Mawlynnong and Sohra, with realistic road, permit and season advice.', image: IMG.dawki }),
  component: () => <AdventureLanding guide="4x4-expedition-meghalaya" />,
});