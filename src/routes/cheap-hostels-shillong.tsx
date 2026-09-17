import { createFileRoute } from '@tanstack/react-router';
import BestHostelShillong from '@/pages/BestHostelShillong';
import { buildRouteHead } from '@/lib/seo-head';

export const Route = createFileRoute('/cheap-hostels-shillong')({
  head: () =>
    buildRouteHead({
      path: '/cheap-hostels-shillong',
      title: 'Cheap Hostels in Shillong — Beds from ₹369 | XTSY',
      description:
        'Compare cheap hostels in Shillong and book XTSY dorm beds from ₹369. Mixed and female-only dorms, lockers, WiFi and direct-booking support.',
      keywords:
        'cheap hostels in shillong, cheap hostel shillong, affordable hostel shillong, budget dorm shillong',
    }),
  component: BestHostelShillong,
});
