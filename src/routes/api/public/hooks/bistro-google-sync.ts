import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/api/public/hooks/bistro-google-sync')({
  server: { handlers: { POST: async ({ request }) => {
    const { handleBistroGoogleSync } = await import('@/lib/bistroGoogleSync.server');
    return handleBistroGoogleSync(request);
  } } },
});