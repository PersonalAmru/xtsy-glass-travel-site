import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const TourPackageCardSkeleton = () => {
  return (
    <Card className="overflow-hidden border-0 bg-card/90 backdrop-blur-md h-[600px] flex flex-col">
      {/* Image skeleton with badge overlay position */}
      <div className="relative">
        <Skeleton className="w-full h-48 rounded-none" shimmer />
        {/* Category badge skeleton */}
        <div className="absolute top-4 left-4">
          <Skeleton className="h-5 w-20 rounded-full" shimmer />
        </div>
      </div>
      
      <CardHeader className="flex-grow">
        {/* Title and rating row */}
        <div className="flex justify-between items-start mb-2">
          <Skeleton className="h-7 w-3/4" shimmer />
          <Skeleton className="h-5 w-12" shimmer />
        </div>
        {/* Description skeleton */}
        <div className="space-y-2 flex-grow">
          <Skeleton className="h-4 w-full" shimmer />
          <Skeleton className="h-4 w-full" shimmer />
          <Skeleton className="h-4 w-2/3" shimmer />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 mt-auto">
        {/* Info row - duration, difficulty, season */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-16" shimmer />
          <Skeleton className="h-4 w-16" shimmer />
          <Skeleton className="h-4 w-20" shimmer />
        </div>
        
        {/* Highlights section */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" shimmer />
          <div className="flex flex-wrap gap-1">
            <Skeleton className="h-5 w-24 rounded-full" shimmer />
            <Skeleton className="h-5 w-20 rounded-full" shimmer />
            <Skeleton className="h-5 w-28 rounded-full" shimmer />
          </div>
        </div>
        
        {/* Button skeleton */}
        <div className="pt-4">
          <Skeleton className="h-10 w-full rounded-lg" shimmer />
        </div>
      </CardContent>
    </Card>
  );
};

export default TourPackageCardSkeleton;
