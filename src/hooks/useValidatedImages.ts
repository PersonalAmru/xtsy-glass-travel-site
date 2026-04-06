import { useState, useEffect } from 'react';

interface ValidatedImage {
  src: string;
  alt: string;
  loaded: boolean;
}

/**
 * Validates image URLs by attempting to load them.
 * Returns only images that successfully load, filtering out broken/missing ones.
 */
export function useValidatedImages(
  images: { src: string; alt: string }[]
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

    const validate = async () => {
      const results = await Promise.allSettled(
        images.map(
          (img) =>
            new Promise<ValidatedImage>((resolve, reject) => {
              const el = new Image();
              el.onload = () => resolve({ ...img, loaded: true });
              el.onerror = () => reject();
              el.src = img.src;
            })
        )
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
  }, [images.map(i => i.src).join(',')]);

  return { validImages, loading };
}
