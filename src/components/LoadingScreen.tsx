import { memo } from "react";

interface LoadingScreenProps {
  onLoadingComplete?: () => void;
  minimal?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

// Inline critical styles
const loadingStyles = `
  @keyframes xtsy-loader-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
  @keyframes xtsy-loader-progress {
    0% { width: 0%; margin-left: 0; }
    50% { width: 60%; margin-left: 20%; }
    100% { width: 0%; margin-left: 100%; }
  }
`;

// Branded XTSY loader - matches route loader in App.tsx
const XTSYLoader = memo(({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizes = {
    sm: { logo: 48, bar: 60, heading: 18, sub: 11 },
    md: { logo: 80, bar: 80, heading: 24, sub: 13 },
    lg: { logo: 100, bar: 100, heading: 28, sub: 14 }
  };
  const s = sizes[size];

  return (
    <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: size === 'sm' ? 12 : 24 }}>
      {/* Logo */}
      <div style={{
        width: s.logo,
        height: s.logo,
        animation: 'xtsy-loader-pulse 2s ease-in-out infinite',
        overflow: 'hidden'
      }}>
        <img src="/xtsy-favicon.png" alt="XTSY" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </div>
      {/* Brand text */}
      {size !== 'sm' && (
        <div style={{ textAlign: 'center' }}>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: s.heading,
            fontWeight: 700,
            background: 'linear-gradient(90deg, hsl(28, 92%, 52%), hsl(0, 72%, 51%))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 6px 0',
            letterSpacing: '-0.02em'
          }}>
            Live the XTSY Vibe
          </h2>
          <p style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: s.sub,
            fontWeight: 400,
            margin: 0,
            letterSpacing: '0.05em'
          }}>
            Premium Stays in Northeast India
          </p>
        </div>
      )}
      {/* Progress bar */}
      <div style={{
        width: s.bar,
        height: 3,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 9999,
        overflow: 'hidden'
      }}>
        <div style={{
          height: '100%',
          background: 'linear-gradient(90deg, #f97316, #a31545)',
          borderRadius: 9999,
          animation: 'xtsy-loader-progress 1.2s ease-in-out infinite'
        }} />
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
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'linear-gradient(135deg, #020617 0%, #0f172a 50%, #020617 100%)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      touchAction: 'none',
      WebkitTapHighlightColor: 'transparent'
    }}>
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
  <div style={{
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9998
  }}>
    <XTSYLoader size="md" />
  </div>
));

XTSYModalLoader.displayName = 'XTSYModalLoader';

export { XTSYLoader };
export default LoadingScreen;
