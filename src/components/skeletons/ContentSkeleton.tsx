import { Skeleton } from "@/components/ui/skeleton";

interface ContentSkeletonProps {
  type: 'hero' | 'section' | 'grid' | 'text';
  lines?: number;
  className?: string;
}

/**
 * Generic content skeleton for fast perceived loading
 */
export const ContentSkeleton = ({ type, lines = 3, className = '' }: ContentSkeletonProps) => {
  switch (type) {
    case 'hero':
      return (
        <div className={`space-y-6 p-8 ${className}`}>
          <Skeleton className="h-10 w-3/4 mx-auto" shimmer />
          <Skeleton className="h-6 w-1/2 mx-auto" shimmer />
          <div className="flex justify-center gap-4 mt-8">
            <Skeleton className="h-12 w-32 rounded-lg" shimmer />
            <Skeleton className="h-12 w-32 rounded-lg" shimmer />
          </div>
        </div>
      );
    
    case 'section':
      return (
        <div className={`space-y-4 ${className}`}>
          <Skeleton className="h-8 w-48 mx-auto" shimmer />
          <Skeleton className="h-4 w-full max-w-2xl mx-auto" shimmer />
          <Skeleton className="h-4 w-3/4 max-w-2xl mx-auto" shimmer />
        </div>
      );
    
    case 'grid':
      return (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-48 w-full rounded-lg" shimmer />
              <Skeleton className="h-5 w-3/4" shimmer />
              <Skeleton className="h-4 w-full" shimmer />
              <Skeleton className="h-4 w-1/2" shimmer />
            </div>
          ))}
        </div>
      );
    
    case 'text':
    default:
      return (
        <div className={`space-y-2 ${className}`}>
          {Array.from({ length: lines }).map((_, i) => (
            <Skeleton 
              key={i} 
              className={`h-4 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`} 
              shimmer 
            />
          ))}
        </div>
      );
  }
};

export default ContentSkeleton;
