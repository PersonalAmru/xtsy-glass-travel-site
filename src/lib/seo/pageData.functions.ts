/**
 * Server functions that hand each page only its own data (guide text, tour head data).
 * The heavy data modules are imported inside the handlers, so they stay on the server:
 * during SSR the loader calls these directly; on client navigation they are fetched as JSON.
 */
import { createServerFn } from '@tanstack/react-start';

const slugInput = (input: unknown) => String(input ?? '').slice(0, 160);

export const fetchProgrammaticPage = createServerFn({ method: 'GET' })
  .validator(slugInput)
  .handler(async ({ data }) => {
    const { programmaticPayload } = await import('./pageHeads');
    return programmaticPayload(data);
  });

export const fetchGuideDirectory = createServerFn({ method: 'GET' }).handler(async () => {
  const { guidesPayload } = await import('./pageHeads');
  return guidesPayload();
});

export const fetchTourHead = createServerFn({ method: 'GET' })
  .validator(slugInput)
  .handler(async ({ data }) => {
    const { tourHead } = await import('./pageHeads');
    return tourHead(data);
  });
