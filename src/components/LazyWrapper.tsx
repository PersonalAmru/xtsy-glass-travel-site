import React, { Suspense, memo } from 'react';
import { useComponentOptimization } from '@/hooks/useOptimizedPerformance';

interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  threshold?: number;
}

// Minimal static fallback for mobile - no animations
const MobileFallback = () => (
  <div 
    className="bg-muted/50 rounded" 
    style={{ 
      minHeight: '200px',
      contain: 'layout style',
    }} 
  />
);

const LazyWrapper: React.FC<LazyWrapperProps> = memo(({ 
  children, 
  fallback,
  threshold = 0.1 
}) => {
  const { elementRef, shouldRender } = useComponentOptimization();
  
  // Check if mobile for simpler fallback
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const actualFallback = fallback || (isMobile ? <MobileFallback /> : (
    <div className="bg-muted/30 h-32 rounded" />
  ));

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