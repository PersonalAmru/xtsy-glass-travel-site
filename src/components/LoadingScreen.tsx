import { memo } from "react";

interface LoadingScreenProps {
  onLoadingComplete?: () => void;
  minimal?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

// Inline critical styles - no external CSS dependency
const loadingStyles = `
  @keyframes xtsy-spin {
    to { transform: rotate(360deg); }
  }
  @keyframes xtsy-pulse-glow {
    0%, 100% { 
      opacity: 1;
      box-shadow: 0 0 20px rgba(163, 21, 69, 0.4);
    }
    50% { 
      opacity: 0.85;
      box-shadow: 0 0 30px rgba(163, 21, 69, 0.6);
    }
  }
  @keyframes xtsy-progress {
    0% { width: 0%; margin-left: 0; }
    50% { width: 60%; margin-left: 20%; }
    100% { width: 0%; margin-left: 100%; }
  }
`;

// Memoized XTSY branded loader - consistent across all uses
const XTSYLoader = memo(({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizes = {
    sm: { box: 40, text: 12, bar: 60 },
    md: { box: 64, text: 16, bar: 100 },
    lg: { box: 80, text: 20, bar: 120 }
  };
  
  const s = sizes[size];
  
  return (
    <div style={{ textAlign: 'center' }}>
      {/* XTSY Brand Icon */}
      <div 
        style={{
          width: s.box,
          height: s.box,
          margin: '0 auto 16px',
          background: 'linear-gradient(135deg, #a31545 0%, #dc2626 100%)',
          borderRadius: size === 'sm' ? '10px' : '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'xtsy-pulse-glow 1.5s ease-in-out infinite',
          boxShadow: '0 4px 20px rgba(163, 21, 69, 0.3)'
        }}
      >
        <span style={{ 
          color: 'white', 
          fontWeight: 'bold', 
          fontSize: s.text, 
          letterSpacing: '1px',
          textShadow: '0 1px 2px rgba(0,0,0,0.2)'
        }}>
          XTSY
        </span>
      </div>
      
      {/* Progress bar */}
      <div 
        style={{
          width: s.bar,
          height: 3,
          backgroundColor: 'rgba(255,255,255,0.2)',
          borderRadius: 9999,
          margin: '0 auto',
          overflow: 'hidden'
        }}
      >
        <div 
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, #f97316, #a31545)',
            borderRadius: 9999,
            animation: 'xtsy-progress 1s ease-in-out infinite'
          }}
        />
      </div>
      <style>{loadingStyles}</style>
    </div>
  );
});

XTSYLoader.displayName = 'XTSYLoader';

// Main loading screen for full-page loading
const LoadingScreen = memo(({ minimal = false, size }: LoadingScreenProps) => {
  const loaderSize = minimal ? 'sm' : (size || 'lg');
  
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
        touchAction: 'none',
        WebkitTapHighlightColor: 'transparent'
      }}
    >
      <XTSYLoader size={loaderSize} />
    </div>
  );
});

LoadingScreen.displayName = 'LoadingScreen';

// Inline loader for modals and sections
export const XTSYInlineLoader = memo(({ 
  size = 'sm',
  className = ''
}: { 
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) => (
  <div 
    className={className}
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      minHeight: size === 'sm' ? '100px' : size === 'md' ? '200px' : '300px'
    }}
  >
    <XTSYLoader size={size} />
  </div>
));

XTSYInlineLoader.displayName = 'XTSYInlineLoader';

// Modal loading overlay
export const XTSYModalLoader = memo(() => (
  <div 
    style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9998
    }}
  >
    <XTSYLoader size="md" />
  </div>
));

XTSYModalLoader.displayName = 'XTSYModalLoader';

export { XTSYLoader };
export default LoadingScreen;
