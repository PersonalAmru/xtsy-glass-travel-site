import React, { Suspense } from 'react';
import { useComponentOptimization } from '@/hooks/useOptimizedPerformance';

interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  threshold?: number;
}

const LazyWrapper: React.FC<LazyWrapperProps> = ({ 
  children, 
  fallback = <div className="animate-pulse bg-gray-100 h-32 rounded"></div>,
  threshold = 0.1 
}) => {
  const { elementRef, shouldRender } = useComponentOptimization();

  return (
    <div ref={elementRef as any}>
      {shouldRender ? (
        <Suspense fallback={fallback}>
          {children}
        </Suspense>
      ) : (
        fallback
      )}
    </div>
  );
};

export default LazyWrapper;