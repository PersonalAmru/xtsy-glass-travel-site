/**
 * Shared building blocks for the 2026 redesign (v2).
 */
import { useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { responsiveImage } from '@/data/cdnImages';

export const XTSY_MARK_PATH =
  'M22.32,0 L0,22.36 L18.68,41.10 L25.28,34.52 L13.13,22.36 L22.32,13.15 L54.14,44.99 L48.97,50.16 L55.53,56.74 L67.29,45.01 Z M71.29,48.93 L64.70,55.48 L76.87,67.67 L67.68,76.85 L35.86,44.99 L41.03,39.81 L34.47,33.23 L22.71,44.93 L67.68,90 L90,67.64 Z M22.32,76.85 L13.13,67.64 L25.28,55.48 L18.74,48.88 L0,67.64 L22.32,90 L41.03,71.26 L34.47,64.68 Z M90,22.36 L67.68,0 L48.99,18.74 L55.53,25.32 L67.68,13.15 L76.87,22.36 L64.75,34.49 L71.29,41.07 Z';

export const WHATSAPP_NUMBER = '918837317070';
export const WHATSAPP_DISPLAY = '+91 88373 17070';
export const waLink = (text?: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

export function XtsyMark({ className, fill = '#A12444', size = 24 }: { className?: string; fill?: string; size?: number }) {
  return (
    <svg viewBox="0 0 90 90" width={size} height={size} aria-hidden="true" className={className}>
      <path d={XTSY_MARK_PATH} fill={fill} />
    </svg>
  );
}

/** Big slowly spinning brand mark used as a background ornament. */
export function SpinningMark({ className, fill = '#A12444' }: { className?: string; fill?: string }) {
  return (
    <svg viewBox="0 0 90 90" aria-hidden="true" className={cn('xt-spin pointer-events-none absolute', className)}>
      <path d={XTSY_MARK_PATH} fill={fill} />
    </svg>
  );
}

export function Eyebrow({ children, className, light }: { children: ReactNode; className?: string; light?: boolean }) {
  return (
    <div className={cn('xt-eyebrow text-[15px] sm:text-[17px]', light && 'text-[#F7C9D1]!', className)}>{children}</div>
  );
}

export function LiveDot({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cn('xt-live inline-block h-2 w-2 rounded-full bg-xt-leaf', className)} />;
}

export function SectionHead({
  eyebrow,
  title,
  aside,
  light,
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  aside?: ReactNode;
  light?: boolean;
  className?: string;
}) {
  return (
    <div className={cn('xt-reveal flex flex-col gap-4 md:flex-row md:items-end md:justify-between', className)}>
      <div className="flex flex-col gap-2.5">
        {eyebrow && <Eyebrow light={light}>{eyebrow}</Eyebrow>}
        <h2 className="xt-display m-0 text-[44px] leading-[0.95] sm:text-[56px] lg:text-[68px]">{title}</h2>
      </div>
      {aside}
    </div>
  );
}

/**
 * Real photo with a branded fallback: if the image fails to load we show the
 * XTSY mark on a tinted panel instead of a broken-image icon.
 */
/** Responsive WebP versions of a Lovable CDN photo, when the optimiser has made them. */
export const responsive = responsiveImage;

export function Photo({
  src,
  alt,
  className,
  tone = 'slate',
  eager,
  children,
  sizes = '(max-width: 768px) 100vw, 50vw',
  position,
}: {
  src?: string;
  alt: string;
  className?: string;
  tone?: 'sand' | 'slate' | 'crimson' | 'pine' | 'night';
  eager?: boolean;
  children?: ReactNode;
  /** Rendered width hint for the responsive WebP versions. */
  sizes?: string;
  /** CSS object-position, e.g. "50% 30%". */
  position?: string;
}) {
  const [failed, setFailed] = useState(false);
  const opt = responsive(src);
  const bg = { sand: '#E6DACA', slate: '#45506A', crimson: '#8A1D3A', pine: '#2F4A3F', night: '#1F2438' }[tone];
  return (
    <div className={cn('relative overflow-hidden', className)} style={{ background: bg }}>
      <XtsyMark className="absolute -right-[12%] -top-[14%] h-[70%] w-[70%] opacity-[0.12]" fill="#F4EFE8" />
      {src && !failed && (
        <img
          src={opt?.src ?? src}
          srcSet={opt?.srcSet}
          sizes={opt ? sizes : undefined}
          width={opt?.w}
          height={opt?.h}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          fetchPriority={eager ? 'high' : undefined}
          decoding="async"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
          style={position ? { objectPosition: position } : undefined}
        />
      )}
      {children}
    </div>
  );
}

export function Marquee({ words, className, markFill = '#BD2E30' }: { words: string[]; className?: string; markFill?: string }) {
  const doubled = words.concat(words);
  return (
    <div className={cn('flex h-[60px] items-center overflow-hidden sm:h-[72px]', className)} aria-hidden="true">
      <div className="xt-marquee flex shrink-0 gap-10 whitespace-nowrap pr-10 font-display text-[22px] tracking-[0.3em] sm:text-[28px]">
        {doubled.map((w, i) => (
          <span key={`${w}-${i}`} className="flex items-center gap-10">
            {w}
            <XtsyMark size={16} fill={markFill} />
          </span>
        ))}
      </div>
    </div>
  );
}
