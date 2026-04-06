import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import UnifiedImage from '@/components/UnifiedImage';
import { getDestinationImageUrl, type MeghalayaDestination } from '@/data/meghalayaDestinations';

interface DestinationCardProps {
  destination: MeghalayaDestination;
  className?: string;
}

const DestinationCard = ({ destination, className = '' }: DestinationCardProps) => {
  return (
    <Link
      to={`/places-to-visit/${destination.slug}`}
      className={`group block rounded-xl overflow-hidden bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg ${className}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <UnifiedImage
          src={getDestinationImageUrl(destination.slug)}
          alt={`${destination.name} Meghalaya`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          threshold={0.2}
        />
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 text-xs font-medium bg-black/60 backdrop-blur-sm text-white rounded-full capitalize">
            {destination.category}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
          {destination.name}
        </h3>
        <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          <span>{destination.region}</span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
          {destination.shortDescription}
        </p>
        <div className="mt-3 flex items-center text-sm font-medium text-primary">
          Explore
          <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
};

export default DestinationCard;
