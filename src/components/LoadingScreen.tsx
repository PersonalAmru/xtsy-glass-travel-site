
import { useEffect, useState } from "react";

interface LoadingScreenProps {
  onLoadingComplete?: () => void;
}

const LoadingScreen = ({ onLoadingComplete }: LoadingScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onLoadingComplete?.();
    }, 2000); // Show for 2 seconds

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="text-center">
        {/* XTSY Favicon Animation */}
        <div className="w-16 h-16 mx-auto mb-4 animate-spin">
          <div className="w-full h-full bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
            X
          </div>
        </div>
        
        {/* Loading Text */}
        <div className="text-gray-600 font-medium">
          Loading XTSY Experience...
        </div>
        
        {/* Progress Bar */}
        <div className="w-48 h-1 bg-gray-200 rounded-full mt-4 mx-auto overflow-hidden">
          <div className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
