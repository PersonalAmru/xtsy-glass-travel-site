/**
 * SafeImage — shared runtime image fallback.
 *
 * Renders a plain <img> that automatically swaps to /placeholder.svg if the
 * source fails to load AFTER the page has rendered (broken CDN link, network
 * blip, expired asset, etc.). Use this anywhere room, panorama, Dawki or other
 * site imagery is shown so a single dead asset never leaves an empty box.
 *
 * For the shared error behaviour without this wrapper (e.g. inside an existing
 * <img>), use `handleImageError` / `attachImageFallback` below.
 */
import React, { useState, useCallback } from 'react';

export const IMAGE_FALLBACK_SRC = '/placeholder.svg';

/**
 * Shared <img> onError handler: swaps to the placeholder exactly once and
 * guards against an infinite error loop if the placeholder itself is missing.
 */
export function handleImageError(
  e: React.SyntheticEvent<HTMLImageElement, Event> | Event,
  fallback: string = IMAGE_FALLBACK_SRC,
): void {
  const img = (e as React.SyntheticEvent<HTMLImageElement>).currentTarget
    ?? (e.target as HTMLImageElement);
  if (!img || img.dataset.fallbackApplied === 'true') return;
  img.dataset.fallbackApplied = 'true';
  img.src = fallback;
}

/** Imperatively attach the shared fallback to a raw <img> element. */
export function attachImageFallback(
  img: HTMLImageElement | null,
  fallback: string = IMAGE_FALLBACK_SRC,
): void {
  if (!img) return;
  img.addEventListener('error', (ev) => handleImageError(ev, fallback), { once: true });
}

export interface SafeImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** Fallback shown when the primary src fails to load. Defaults to placeholder. */
  fallbackSrc?: string;
}

const SafeImage: React.FC<SafeImageProps> = ({
  src,
  fallbackSrc = IMAGE_FALLBACK_SRC,
  onError,
  alt = '',
  ...rest
}) => {
  const [failed, setFailed] = useState(false);

  const onImgError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      if (!failed) {
        setFailed(true);
      }
      onError?.(e);
    },
    [failed, onError],
  );

  return (
    <img
      src={failed ? fallbackSrc : src}
      alt={alt}
      onError={onImgError}
      {...rest}
    />
  );
};

export default SafeImage;
