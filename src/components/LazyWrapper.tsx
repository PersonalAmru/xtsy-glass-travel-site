import React, { Suspense, memo } from 'react';
import { useComponentOptimization } from '@/hooks/useOptimizedPerformance';

interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  threshold?: number;
  showBrandedLoader?: boolean;
  eager?: boolean; // Render immediately without waiting for intersection
}

// Brand-aware fallback (dark theme matches site bg, prevents black flash)
const SectionFallback = memo(() => (
  <div
    className="bg-muted/10 rounded-lg layout-stable"
    style={{
      minHeight: '200px',
      contain: 'layout style',
    }}
  />
));

SectionFallback.displayName = 'SectionFallback';

/**
 * Stability fix (Apr 2026):
 * - Removed `content-visibility: auto` + `contain-intrinsic-size` which caused
 *   black/blank flashes during fast scroll on the dark-themed homepage. The
 *   browser was skipping paint for offscreen sections faster than the IO could
 *   re-mount them, exposing the near-black page background.
 * - Kept `contain: layout style` for layout stability without skipping paint.
 * - Fallback now renders a soft muted block (never empty) so the area is never
 *   visually "missing" while the chunk loads.
 */
const LazyWrapper: React.FC<LazyWrapperProps> = memo(({
  children,
  fallback,
  showBrandedLoader = false,
  eager = false,
}) => {
  const { elementRef, shouldRender } = useComponentOptimization({ eager });

  const actualFallback = fallback || <SectionFallback />;

  return (
    <div
      ref={elementRef as any}
      style={{ contain: 'layout style' }}
    >
      {shouldRender ? (
        <Suspense fallback={actualFallback}>{children}</Suspense>
      ) : (
        actualFallback
      )}
    </div>
  );
});

LazyWrapper.displayName = 'LazyWrapper';

export default LazyWrapper;
