import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/cheap-hostel-shillong')({
  beforeLoad: () => {
    throw redirect({ to: '/budget-hostels-shillong', statusCode: 301 });
  },
});
