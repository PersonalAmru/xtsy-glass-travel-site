import { Link } from '@/lib/router-compat';
import { navigateToGallery } from '@/utils/galleryNavigation';
import { Camera, ExternalLink } from 'lucide-react';
import UnifiedImage from './UnifiedImage';

interface GalleryImageProps {
  src: string;
  alt: string;
  className?: string;
  category?: string;
  tag?: string;
  children?: React.ReactNode;
  overlay?: boolean;
  title?: string;
}

const GalleryImage = ({ 
  src, 
  alt, 
  className = "", 
  category, 
  tag, 
  children, 
  overlay = true,
  title 
}: GalleryImageProps) => {
  const galleryLink = navigateToGallery(category, tag);
  
  return (
    <Link 
      to={galleryLink}
      className={`relative group overflow-hidden block ${className}`}
      title={title || `View in Gallery${category ? ` - ${category}` : ''}`}
    >
      <UnifiedImage
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        threshold={0.2}
      />
      
      {overlay && (
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
              <Camera className="h-5 w-5 text-gray-700" />
            </div>
          </div>
        </div>
      )}
      
      {title && overlay && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <p className="text-white text-sm font-medium flex items-center gap-2">
            <ExternalLink className="h-4 w-4" />
            {title}
          </p>
        </div>
      )}
      
      {children}
    </Link>
  );
};

export default GalleryImage;