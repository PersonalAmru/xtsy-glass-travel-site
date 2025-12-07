import { useEffect, useState } from "react";

interface LoadingScreenProps {
  onLoadingComplete?: () => void;
}

const LoadingScreen = ({ onLoadingComplete }: LoadingScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Ultra-fast loading - minimal delay
    const timer = setTimeout(() => {
      setIsVisible(false);
      onLoadingComplete?.();
    }, 150);

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  if (!isVisible) return null;

  // Minimal, fast-rendering loading screen with inline styles (no external resources)
  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#111827',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div style={{ textAlign: 'center' }}>
        {/* Pure CSS logo - no external image fetch */}
        <div 
          style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 24px',
            background: 'linear-gradient(135deg, #f97316, #dc2626)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'pulse 1s ease-in-out infinite'
          }}
        >
          <span style={{ color: 'white', fontWeight: 'bold', fontSize: '24px' }}>XTSY</span>
        </div>
        
        {/* Inline progress animation */}
        <div 
          style={{
            width: '160px',
            height: '4px',
            backgroundColor: '#374151',
            borderRadius: '9999px',
            margin: '0 auto',
            overflow: 'hidden'
          }}
        >
          <div 
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, #a855f7, #ec4899)',
              borderRadius: '9999px',
              animation: 'loading 0.8s ease-in-out infinite'
            }}
          />
        </div>
      </div>
      
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(0.95); }
        }
        @keyframes loading {
          0% { width: 0%; margin-left: 0; }
          50% { width: 60%; margin-left: 20%; }
          100% { width: 0%; margin-left: 100%; }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
