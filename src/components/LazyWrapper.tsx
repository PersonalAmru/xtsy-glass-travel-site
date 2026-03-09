import React, { Suspense, memo } from 'react';
import { useComponentOptimization } from '@/hooks/useOptimizedPerformance';

interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  threshold?: number;
  showBrandedLoader?: boolean;
  eager?: boolean; // Render immediately without waiting for intersection
}

// Minimal static fallback for sections - zero animations for performance
const SectionFallback = memo(() => (
  <div 
    className="bg-muted/20 rounded-lg layout-stable" 
    style={{ 
      minHeight: '200px',
      contain: 'layout style paint',
      contentVisibility: 'auto',
    }} 
  />
));

SectionFallback.displayName = 'SectionFallback';

const LazyWrapper: React.FC<LazyWrapperProps> = memo(({ 
  children, 
  fallback,
  threshold = 0.1,
  showBrandedLoader = false,
  eager = false
}) => {
  const { elementRef, shouldRender } = useComponentOptimization({ eager });
  
  // Always use minimal fallback for performance - no branded loader
  const actualFallback = fallback || <SectionFallback />;

  return (
    <div 
      ref={elementRef as any}
      style={{ 
        contain: 'layout style',
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