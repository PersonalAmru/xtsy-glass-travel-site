import React, { Suspense } from 'react';
import { useLazyLoading } from '@/hooks/useLazyLoading';

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
  const { elementRef, isVisible } = useLazyLoading(threshold);

  return (
    <div ref={elementRef}>
      {isVisible ? (
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