import { useEffect, useState, memo } from "react";

interface LoadingScreenProps {
  onLoadingComplete?: () => void;
  minimal?: boolean; // For route transitions - ultra lightweight
}

// Inline critical styles to avoid external CSS load on mobile
const loadingStyles = `
  @keyframes xtsy-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
  @keyframes xtsy-loading {
    0% { width: 0%; margin-left: 0; }
    50% { width: 50%; margin-left: 25%; }
    100% { width: 0%; margin-left: 100%; }
  }
`;

const LoadingScreen = memo(({ onLoadingComplete, minimal = false }: LoadingScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Ultra-fast timeout - prevent blocking first paint
    const timer = setTimeout(() => {
      setIsVisible(false);
      onLoadingComplete?.();
    }, minimal ? 20 : 50);

    return () => clearTimeout(timer);
  }, [onLoadingComplete, minimal]);

  if (!isVisible) return null;

  // Minimal loader for route transitions - prevents "page cannot be loaded" on mobile
  if (minimal) {
    return (
      <div 
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: '#111827',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div 
          style={{
            width: '48px',
            height: '48px',
            border: '3px solid #374151',
            borderTopColor: '#f97316',
            borderRadius: '50%',
            animation: 'spin 0.6s linear infinite'
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Full loading screen for initial app load
  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#111827',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // Mobile touch optimization
        touchAction: 'none',
        WebkitTapHighlightColor: 'transparent'
      }}
    >
      <div style={{ textAlign: 'center' }}>
        {/* Simple XTSY text logo - no image load required */}
        <div 
          style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 20px',
            background: 'linear-gradient(135deg, #a31545, #dc2626)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'xtsy-pulse 1s ease-in-out infinite'
          }}
        >
          <span style={{ color: 'white', fontWeight: 'bold', fontSize: '20px', letterSpacing: '1px' }}>XTSY</span>
        </div>
        
        {/* Progress bar */}
        <div 
          style={{
            width: '120px',
            height: '3px',
            backgroundColor: '#374151',
            borderRadius: '9999px',
            margin: '0 auto',
            overflow: 'hidden'
          }}
        >
          <div 
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, #f97316, #dc2626)',
              borderRadius: '9999px',
              animation: 'xtsy-loading 0.6s ease-in-out infinite'
            }}
          />
        </div>
      </div>
      
      <style>{loadingStyles}</style>
    </div>
  );
});

LoadingScreen.displayName = 'LoadingScreen';

export default LoadingScreen;
