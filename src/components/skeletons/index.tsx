import RoomCardSkeleton from './RoomCardSkeleton';
import TourPackageCardSkeleton from './TourPackageCardSkeleton';
import ContentSkeleton from './ContentSkeleton';

export { RoomCardSkeleton, TourPackageCardSkeleton, ContentSkeleton };

// Grid skeleton helpers
export const RoomCardsGridSkeleton = ({ count = 3, isLuxury = false }: { count?: number; isLuxury?: boolean }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <RoomCardSkeleton key={i} isLuxury={isLuxury} />
      ))}
    </>
  );
};

export const TourPackagesGridSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <TourPackageCardSkeleton key={i} />
      ))}
    </div>
  );
};
