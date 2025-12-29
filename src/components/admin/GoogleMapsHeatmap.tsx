/**
 * Google Maps Heatmap Component
 * Uses the Visualization Library for real gradient heatmaps
 */

import React, { memo, useMemo, useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MapPin, Users, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Dark theme map styles
const darkMapStyles: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry', stylers: [{ color: '#1a1a2e' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1a1a2e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8b8b9e' }] },
  { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#2d2d44' }] },
  { featureType: 'administrative.land_parcel', stylers: [{ visibility: 'off' }] },
  { featureType: 'administrative.neighborhood', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'road', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0e0e1a' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#4a4a5e' }] },
];

const GOOGLE_MAPS_API_KEY = 'AIzaSyAXfU4ljIaOS9NcgQy0hbCAPaXPDTglujk';

interface GoogleMapsHeatmapProps {
  data: {
    countries: Array<{
      country_code: string;
      country_name: string;
      latitude?: number;
      longitude?: number;
      visitors: number;
      sessions?: number;
      bookings?: number;
      revenue?: number;
      cities?: Array<{
        city: string;
        region?: string;
        lat?: number;
        lng?: number;
        visitors: number;
        bookings?: number;
      }>;
    }>;
  } | null;
}

// Load Google Maps script manually
const loadGoogleMapsScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.google?.maps?.visualization) {
      resolve();
      return;
    }

    // Check if script is already being loaded
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve());
      existingScript.addEventListener('error', () => reject(new Error('Failed to load Google Maps')));
      return;
    }

    // Create and load script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=visualization`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Maps script'));
    document.head.appendChild(script);
  });
};

const GoogleMapsHeatmap: React.FC<GoogleMapsHeatmapProps> = memo(({ data }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [heatmapLayer, setHeatmapLayer] = useState<google.maps.visualization.HeatmapLayer | null>(null);
  const mapContainerRef = React.useRef<HTMLDivElement>(null);

  // Load Google Maps
  useEffect(() => {
    let mounted = true;

    const loadMaps = async () => {
      try {
        await loadGoogleMapsScript();
        if (mounted) {
          setIsLoaded(true);
          setLoadError(null);
        }
      } catch (err) {
        if (mounted) {
          setLoadError(err instanceof Error ? err.message : 'Failed to load Google Maps');
        }
      }
    };

    loadMaps();

    return () => {
      mounted = false;
    };
  }, []);

  // Initialize map
  useEffect(() => {
    if (!isLoaded || !mapContainerRef.current || mapInstance) return;

    try {
      const map = new google.maps.Map(mapContainerRef.current, {
        center: { lat: 22, lng: 78 }, // Center on India
        zoom: 3,
        styles: darkMapStyles,
        disableDefaultUI: true,
        zoomControl: true,
        gestureHandling: 'cooperative',
        backgroundColor: '#1a1a2e',
      });

      setMapInstance(map);
    } catch (err) {
      console.error('Error initializing map:', err);
      setLoadError('Failed to initialize map');
    }
  }, [isLoaded, mapInstance]);

  // Update heatmap data
  useEffect(() => {
    if (!mapInstance || !data?.countries || !window.google?.maps?.visualization) return;

    // Remove existing heatmap
    if (heatmapLayer) {
      heatmapLayer.setMap(null);
    }

    // Build heatmap points
    const points: google.maps.visualization.WeightedLocation[] = [];

    data.countries.forEach((country) => {
      // Add city-level data if available
      if (country.cities?.length) {
        country.cities.forEach((city) => {
          if (city.lat && city.lng) {
            points.push({
              location: new google.maps.LatLng(city.lat, city.lng),
              weight: city.visitors,
            });
          }
        });
      } else if (country.latitude && country.longitude) {
        // Fallback to country-level
        points.push({
          location: new google.maps.LatLng(country.latitude, country.longitude),
          weight: country.visitors,
        });
      }
    });

    // Create new heatmap layer
    if (points.length > 0) {
      const newHeatmap = new google.maps.visualization.HeatmapLayer({
        data: points,
        map: mapInstance,
        radius: 30,
        opacity: 0.8,
        dissipating: true,
        gradient: [
          'rgba(0, 0, 0, 0)',
          'rgba(0, 255, 128, 0.4)',
          'rgba(0, 255, 0, 0.6)',
          'rgba(255, 255, 0, 0.8)',
          'rgba(255, 128, 0, 0.9)',
          'rgba(255, 0, 0, 1)',
        ],
      });
      setHeatmapLayer(newHeatmap);
    }
  }, [mapInstance, data]);

  const totalVisitors = useMemo(() => {
    return data?.countries?.reduce((sum, c) => sum + (c.visitors || 0), 0) || 0;
  }, [data]);

  const totalCountries = data?.countries?.length || 0;

  const handleRetry = useCallback(() => {
    setLoadError(null);
    setIsLoaded(false);
    // Remove any existing script
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      existingScript.remove();
    }
    // Reload
    loadGoogleMapsScript()
      .then(() => setIsLoaded(true))
      .catch((err) => setLoadError(err.message));
  }, []);

  // Error state
  if (loadError) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="w-5 h-5" />
            Map Loading Error
          </CardTitle>
          <CardDescription>{loadError}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={handleRetry} className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Loading state
  if (!isLoaded) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary animate-pulse" />
            Loading Google Maps...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] bg-muted/30 rounded-lg animate-pulse flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <RefreshCw className="w-8 h-8 text-primary animate-spin" />
              <span className="text-muted-foreground">Initializing map...</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Real-time Visitor Heatmap
            </CardTitle>
            <CardDescription>Live visitor density visualization</CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{totalVisitors.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Total Visitors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{totalCountries}</div>
              <div className="text-xs text-muted-foreground">Countries</div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* Google Maps Container */}
        <div 
          ref={mapContainerRef}
          className="h-[300px] md:h-[400px] w-full"
          style={{ backgroundColor: '#1a1a2e' }}
        />

        {/* Legend */}
        <div className="p-4 border-t border-border/50">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground">Intensity:</span>
              <div className="flex items-center gap-1">
                <div className="w-16 h-2 rounded-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500" />
              </div>
              <span className="text-xs text-muted-foreground">Low → High</span>
            </div>
          </div>
        </div>

        {/* Top Locations List */}
        <div className="p-4 border-t border-border/50">
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Top Visitor Locations
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {data?.countries?.slice(0, 9).map((country, index) => (
              <div
                key={country.country_code}
                className="flex items-center justify-between p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-primary w-5">#{index + 1}</span>
                  <div>
                    <p className="text-sm font-medium truncate max-w-[120px]">
                      {country.country_name || country.country_code}
                    </p>
                    {country.cities?.[0] && (
                      <p className="text-xs text-muted-foreground">{country.cities[0].city}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm font-semibold">
                    <Users className="w-3 h-3 text-muted-foreground" />
                    {country.visitors}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

GoogleMapsHeatmap.displayName = 'GoogleMapsHeatmap';

export default GoogleMapsHeatmap;
