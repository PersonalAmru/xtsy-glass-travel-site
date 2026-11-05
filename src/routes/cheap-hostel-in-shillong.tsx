import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/cheap-hostel-in-shillong')({
  beforeLoad: () => {
    throw redirect({ to: '/cheap-hostels-shillong', statusCode: 301 });
  },
});
