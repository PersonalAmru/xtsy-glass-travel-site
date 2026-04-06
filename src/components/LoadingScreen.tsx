import { memo } from "react";

interface LoadingScreenProps {
  onLoadingComplete?: () => void;
  minimal?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const loadingStyles = `
  @keyframes xtsy-loader-progress {
    0% { width: 0%; }
    50% { width: 60%; }
    100% { width: 100%; }
  }
`;

const XTSYLoader = memo(({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizes = {
    sm: { logo: 100, bar: 80 },
    md: { logo: 140, bar: 100 },
    lg: { logo: 160, bar: 120 }
  };
  const s = sizes[size];

  return (
    <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
      <img
        src="/xtsy-color-logo.png"
        alt="XTSY"
        style={{ width: s.logo, height: 'auto', objectFit: 'contain' }}
        onError={(e) => {
          // Fallback to favicon
          (e.target as HTMLImageElement).src = '/xtsy-favicon.png';
        }}
      />
      <div style={{
        width: s.bar,
        height: 3,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 9999,
        overflow: 'hidden'
      }}>
        <div style={{
          height: '100%',
          background: 'linear-gradient(90deg, hsl(28, 92%, 52%), hsl(12, 85%, 48%))',
          borderRadius: 9999,
          animation: 'xtsy-loader-progress 1.2s ease-in-out infinite'
        }} />
      </div>
      <style>{loadingStyles}</style>
    </div>
  );
});

XTSYLoader.displayName = 'XTSYLoader';

const LoadingScreen = memo(({ minimal = false, size }: LoadingScreenProps) => {
  const loaderSize = minimal ? 'sm' : (size || 'lg');

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'linear-gradient(135deg, hsl(225, 40%, 3%) 0%, hsl(225, 28%, 7%) 50%, hsl(225, 40%, 3%) 100%)',
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
