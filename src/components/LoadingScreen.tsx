
import { useEffect, useState } from "react";

interface LoadingScreenProps {
  onLoadingComplete?: () => void;
}

const LoadingScreen = ({ onLoadingComplete }: LoadingScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onLoadingComplete?.();
    }, 2000); // Show for 2 seconds

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex items-center justify-center">
      <div className="text-center">
        {/* XTSY Logo Animation */}
        <div className="w-20 h-20 mx-auto mb-6 animate-pulse">
          {!logoError ? (
            <img 
              src="https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/Color%20logo%20-%20no%20background.png"
              alt="XTSY Logo" 
              className="w-full h-full object-contain"
              onError={() => setLogoError(true)}
            />
          ) : (
            <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">XTSY</span>
            </div>
          )}
        </div>
        
        {/* Loading Text */}
        <div className="text-white font-medium text-lg mb-2">
          Loading XTSY Experience...
        </div>
        
        <div className="text-gray-400 text-sm mb-6">
          Live the Shillong Vibe
        </div>
        
        {/* Progress Bar */}
        <div className="w-64 h-1 bg-gray-700 rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
