import { useState, useCallback } from 'react';

export interface LocationData {
  latitude?: number;
  longitude?: number;
  city?: string;
  region?: string;
  country?: string;
  countryCode?: string;
  granted: boolean;
  declined?: boolean;
}

// Reverse geocode using free Nominatim API (OpenStreetMap)
async function reverseGeocode(lat: number, lon: number): Promise<Partial<LocationData>> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'en',
          'User-Agent': 'XTSY-Travellers-Hostel/1.0',
        },
      }
    );
    
    if (!response.ok) return {};
    
    const data = await response.json();
    const address = data.address || {};
    
    return {
      city: address.city || address.town || address.village || address.county,
      region: address.state || address.state_district,
      country: address.country,
      countryCode: address.country_code?.toUpperCase(),
    };
  } catch {
    return {};
  }
}

export function useLocationConsent() {
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestLocation = useCallback(async (): Promise<LocationData | null> => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLocationData({ granted: false, declined: true });
      return null;
    }

    setIsLoading(true);
    setError(null);

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          // Reverse geocode to get city/region
          const geoDetails = await reverseGeocode(latitude, longitude);
          
          const data: LocationData = {
            latitude,
            longitude,
            ...geoDetails,
            granted: true,
          };
          
          setLocationData(data);
          setIsLoading(false);
          resolve(data);
        },
        (err) => {
          console.log('Location permission denied:', err.message);
          const data: LocationData = { granted: false, declined: true };
          setLocationData(data);
          setIsLoading(false);
          setError(err.message);
          resolve(data);
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000, // Cache for 5 minutes
        }
      );
    });
  }, []);

  const clearLocation = useCallback(() => {
    setLocationData(null);
    setError(null);
  }, []);

  return {
    locationData,
    isLoading,
    error,
    requestLocation,
    clearLocation,
    hasConsented: locationData?.granted === true,
    hasDeclined: locationData?.declined === true,
  };
}
