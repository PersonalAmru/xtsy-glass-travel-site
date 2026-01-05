import React, { Suspense, memo } from 'react';
import { useComponentOptimization } from '@/hooks/useOptimizedPerformance';
import { XTSYInlineLoader } from '@/components/LoadingScreen';

interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  threshold?: number;
  showBrandedLoader?: boolean;
  eager?: boolean; // Render immediately without waiting for intersection
}

// Minimal static fallback for sections - no animations for mobile performance
const SectionFallback = () => (
  <div 
    className="bg-muted/30 rounded-lg" 
    style={{ 
      minHeight: '200px',
      contain: 'layout style',
    }} 
  />
);

const LazyWrapper: React.FC<LazyWrapperProps> = memo(({ 
  children, 
  fallback,
  threshold = 0.1,
  showBrandedLoader = false,
  eager = false
}) => {
  const { elementRef, shouldRender } = useComponentOptimization({ eager });
  
  // Use branded XTSY loader or minimal fallback
  const actualFallback = fallback || (
    showBrandedLoader ? <XTSYInlineLoader size="sm" /> : <SectionFallback />
  );

  return (
    <div 
      ref={elementRef as any}
      style={{ 
        contain: 'layout style',
        contentVisibility: 'auto',
        containIntrinsicSize: 'auto 300px',
      }}
    >
      {shouldRender ? (
        <Suspense fallback={actualFallback}>
          {children}
        </Suspense>
      ) : (
        actualFallback
      )}
    </div>
  );
});

LazyWrapper.displayName = 'LazyWrapper';

export default LazyWrapper;