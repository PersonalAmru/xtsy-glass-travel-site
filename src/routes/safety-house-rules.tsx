import { createFileRoute } from '@tanstack/react-router';
import HostelSafetyV2 from '@/pages/v2/HostelSafetyV2';
import { buildRouteHead } from '@/lib/seo-head';
import { COVERS } from '@/data/v2Images';

export const Route = createFileRoute('/safety-house-rules')({
  head: () => buildRouteHead({
    path: '/safety-house-rules',
    title: 'Hostel Safety & House Rules | XTSY Travellers Hostel',
    description: 'XTSY dorm rules, women-only stays, 11 AM check-in, strict 10 AM check-out and quiet hours 10 PM–7 AM in New Shillong Township.',
    image: new URL(COVERS.home, 'https://xtsy.one').href,
    ogType: 'article',
  }),
  component: HostelSafetyV2,
});