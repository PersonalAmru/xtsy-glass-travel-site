
import { useEffect, useState } from "react";

const LoadingScreen = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-slate-900 via-black to-slate-900 flex items-center justify-center">
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-orange-400/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Main logo container */}
      <div className="relative z-10 flex flex-col items-center">
        {/* XTSY Logo with glow effect */}
        <div className="relative mb-8">
          <img 
            src="https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/image-assets/Header/Color%20logo%20-%20no%20background.png"
            alt="XTSY Logo"
            className="h-16 sm:h-20 w-auto animate-pulse"
          />
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-400 rounded-full blur-xl opacity-30 animate-ping" />
        </div>

        {/* Loading animation */}
        <div className="flex items-center space-x-2 mb-6">
          <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>

        {/* Loading text */}
        <p className="text-white text-lg font-seasons animate-pulse">
          Welcome to XTSY
        </p>
        <p className="text-gray-400 text-sm font-seasons mt-2">
          Loading your experience...
        </p>

        {/* Progress bar */}
        <div className="w-64 h-1 bg-gray-700 rounded-full mt-6 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full animate-pulse" 
               style={{ 
                 animation: 'loading-progress 2s ease-in-out forwards',
               }} />
        </div>
      </div>

      <style jsx>{`
        @keyframes loading-progress {
          0% { width: 0%; }
          50% { width: 60%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
