import { useState, useEffect } from 'react';

interface NetworkInfo {
  isSlowConnection: boolean;
  connectionType: string;
  isOnline: boolean;
  dataUsageOptimized: boolean;
}

export const useNetworkOptimization = (): NetworkInfo => {
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo>({
    isSlowConnection: false,
    connectionType: 'unknown',
    isOnline: true,
    dataUsageOptimized: false
  });

  useEffect(() => {
    const updateNetworkStatus = () => {
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      
      const isOnline = navigator.onLine;
      let isSlowConnection = false;
      let connectionType = 'unknown';
      let dataUsageOptimized = false;

      if (connection) {
        connectionType = connection.effectiveType || connection.type || 'unknown';
        isSlowConnection = ['slow-2g', '2g'].includes(connection.effectiveType);
        dataUsageOptimized = connection.saveData || isSlowConnection;
      }

      setNetworkInfo({
        isSlowConnection,
        connectionType,
        isOnline,
        dataUsageOptimized
      });

      // Apply global classes for CSS optimization
      if (isSlowConnection) {
        document.body.classList.add('slow-connection');
      } else {
        document.body.classList.remove('slow-connection');
      }
    };

    // Initial check
    updateNetworkStatus();

    // Listen for connection changes
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);
    
    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', updateNetworkStatus);
    }

    return () => {
      window.removeEventListener('online', updateNetworkStatus);
      window.removeEventListener('offline', updateNetworkStatus);
      if (connection) {
        connection.removeEventListener('change', updateNetworkStatus);
      }
    };
  }, []);

  return networkInfo;
};