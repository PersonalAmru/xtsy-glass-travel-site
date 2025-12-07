import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface RoomCardSkeletonProps {
  isLuxury?: boolean;
}

const RoomCardSkeleton = ({ isLuxury = false }: RoomCardSkeletonProps) => {
  const imageHeight = isLuxury ? "h-72" : "h-48";
  const cardMinHeight = isLuxury ? "min-h-[580px]" : "min-h-[420px]";

  return (
    <Card className={`bg-card border-border overflow-hidden ${cardMinHeight} flex flex-col`}>
      {/* Image skeleton with shimmer */}
      <Skeleton className={`${imageHeight} w-full rounded-none`} shimmer />
      
      <CardHeader className="pb-2 px-4">
        {/* Title skeleton */}
        <Skeleton className="h-6 w-3/4 mb-2" shimmer />
        {/* Description skeleton */}
        <Skeleton className="h-4 w-full" shimmer />
        <Skeleton className="h-4 w-2/3 mt-1" shimmer />
      </CardHeader>
      
      <CardContent className="px-4 pb-4 flex-1 flex flex-col">
        {/* Features section */}
        <div className="mb-4">
          <Skeleton className="h-4 w-24 mb-2" shimmer />
          <div className="flex flex-wrap gap-1">
            <Skeleton className="h-5 w-16 rounded-full" shimmer />
            <Skeleton className="h-5 w-20 rounded-full" shimmer />
            <Skeleton className="h-5 w-14 rounded-full" shimmer />
            <Skeleton className="h-5 w-18 rounded-full" shimmer />
          </div>
        </div>
        
        <div className="mt-auto">
          {/* Price and guests row */}
          <div className="flex items-center justify-between mb-3">
            <Skeleton className="h-4 w-20" shimmer />
            <Skeleton className="h-6 w-28" shimmer />
          </div>
          {/* Button skeleton */}
          <Skeleton className="h-10 w-full rounded-lg" shimmer />
        </div>
      </CardContent>
    </Card>
  );
};

export default RoomCardSkeleton;
