import { useState, useEffect } from 'react';

interface ValidatedImage {
  src: string;
  alt: string;
  loaded: boolean;
}

/**
 * Validates image URLs by attempting to load them with retry.
 * Returns only images that successfully load, filtering out broken/missing ones.
 */
export function useValidatedImages(
  images: { src: string; alt: string }[],
  maxRetries: number = 2
): { validImages: ValidatedImage[]; loading: boolean } {
  const [validImages, setValidImages] = useState<ValidatedImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!images.length) {
      setValidImages([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    const loadWithRetry = (img: { src: string; alt: string }, retries: number): Promise<ValidatedImage> => {
      return new Promise((resolve, reject) => {
        const el = new Image();
        el.onload = () => resolve({ ...img, loaded: true });
        el.onerror = () => {
          if (retries > 0) {
            // Wait briefly then retry with cache-bust
            setTimeout(() => {
              const sep = img.src.includes('?') ? '&' : '?';
              const retryUrl = `${img.src}${sep}_r=${Date.now()}`;
              loadWithRetry({ ...img, src: retryUrl }, retries - 1)
                .then(resolve)
                .catch(reject);
            }, 500);
          } else {
            reject();
          }
        };
        el.src = img.src;
      });
    };

    const validate = async () => {
      const results = await Promise.allSettled(
        images.map((img) => loadWithRetry(img, maxRetries))
      );

      if (cancelled) return;

      const valid = results
        .filter((r): r is PromiseFulfilledResult<ValidatedImage> => r.status === 'fulfilled')
        .map((r) => r.value);

      setValidImages(valid);
      setLoading(false);
    };

    validate();
    return () => { cancelled = true; };
  }, [images.map(i => i.src).join(','), maxRetries]);

  return { validImages, loading };
}
