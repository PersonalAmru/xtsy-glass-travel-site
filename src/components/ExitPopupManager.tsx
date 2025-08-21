import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LazyXTSYDealsExitPopup = React.lazy(() => import('./XTSYDealsExitPopup'));

const ExitPopupManager = () => {
  const [showDealsPopup, setShowDealsPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleDialogExit = () => {
      // Check if popup has already been shown this session
      const hasShownPopup = sessionStorage.getItem('xtsy-deals-popup-shown');
      
      if (!hasShownPopup) {
        sessionStorage.setItem('xtsy-deals-popup-shown', 'true');
        setShowDealsPopup(true);
      }
    };

    // Listen for dialog exit events
    document.addEventListener('dialog-exit-request', handleDialogExit);

    return () => {
      document.removeEventListener('dialog-exit-request', handleDialogExit);
    };
  }, []);

  const handleDealsPopupClose = () => {
    setShowDealsPopup(false);
    navigate('/');
  };

  const handleReturnHome = () => {
    setShowDealsPopup(false);
    navigate('/');
  };

  const handleViewDeals = () => {
    setShowDealsPopup(false);
    navigate('/deals');
  };

  if (!showDealsPopup) {
    return null;
  }

  return (
    <React.Suspense fallback={null}>
      <LazyXTSYDealsExitPopup
        isOpen={showDealsPopup}
        onClose={handleDealsPopupClose}
        onReturnHome={handleReturnHome}
        onViewDeals={handleViewDeals}
      />
    </React.Suspense>
  );
};

export default ExitPopupManager;