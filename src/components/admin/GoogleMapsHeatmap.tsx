/**
 * Google Maps Heatmap Component
 * Uses the Visualization Library for real gradient heatmaps
 */

import React, { memo, useMemo, useEffect, useState, useCallback, useRef } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MapPin, Users, TrendingUp, AlertCircle, RefreshCw, CheckCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Google Maps API key
const GOOGLE_MAPS_API_KEY = 'AIzaSyAXfU4ljIaOS9NcgQy0hbCAPaXPDTglujk';

// IMPORTANT: This array must be stable (outside component) to prevent infinite reloads
const GOOGLE_MAPS_LIBRARIES: ("visualization")[] = ["visualization"];

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

// Error message helper for common Google Maps API errors
const getErrorHelp = (error: string): { title: string; description: string; steps: string[] } => {
  if (error.includes('ApiNotActivatedMapError') || error.includes('not activated')) {
    return {
      title: 'Maps JavaScript API Not Enabled',
      description: 'The Maps JavaScript API needs to be enabled in Google Cloud Console.',
      steps: [
        'Go to Google Cloud Console → APIs & Services → Library',
        'Search for "Maps JavaScript API"',
        'Click Enable',
      ],
    };
  }
  if (error.includes('RefererNotAllowedMapError') || error.includes('referrer')) {
    return {
      title: 'Domain Not Authorized',
      description: 'Your domain is not allowed to use this API key.',
      steps: [
        'Go to Google Cloud Console → APIs & Services → Credentials',
        'Edit your API key → Application restrictions',
        'Add these domains: *.lovable.app/*, *.lovableproject.com/*, localhost:*',
      ],
    };
  }
  if (error.includes('BillingNotEnabled') || error.includes('billing')) {
    return {
      title: 'Billing Not Enabled',
      description: 'A billing account must be linked to your Google Cloud project.',
      steps: [
        'Go to Google Cloud Console → Billing',
        'Link a billing account to your project',
        'Google Maps offers $200 free credit monthly',
      ],
    };
  }
  if (error.includes('InvalidKeyMapError') || error.includes('invalid key')) {
    return {
      title: 'Invalid API Key',
      description: 'The API key is invalid or has been revoked.',
      steps: [
        'Check that the API key is correct',
        'Generate a new API key if needed',
        'Ensure the key has Maps JavaScript API enabled',
      ],
    };
  }
  return {
    title: 'Map Loading Error',
    description: error || 'Failed to load Google Maps',
    steps: [
      'Check your internet connection',
      'Verify API key configuration in Google Cloud Console',
      'Try refreshing the page',
    ],
  };
};

const GoogleMapsHeatmap: React.FC<GoogleMapsHeatmapProps> = memo(({ data }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const heatmapRef = useRef<google.maps.visualization.HeatmapLayer | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [detailedError, setDetailedError] = useState<string | null>(null);

  // Use the hook with stable libraries array
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  // Listen for Google Maps API errors via the global callback
  useEffect(() => {
    const handleGoogleMapsError = (event: ErrorEvent) => {
      if (event.message && event.message.includes('google')) {
        console.error('[GoogleMapsHeatmap] Caught error:', event.message);
        setDetailedError(event.message);
      }
    };

    window.addEventListener('error', handleGoogleMapsError);
    return () => window.removeEventListener('error', handleGoogleMapsError);
  }, []);

  // Initialize map once loaded
  useEffect(() => {
    if (!isLoaded || !mapContainerRef.current || mapRef.current) return;

    try {
      console.log('[GoogleMapsHeatmap] Initializing map...');
      
      const map = new google.maps.Map(mapContainerRef.current, {
        center: { lat: 22, lng: 78 }, // Center on India
        zoom: 3,
        styles: darkMapStyles,
        disableDefaultUI: true,
        zoomControl: true,
        gestureHandling: 'cooperative',
        backgroundColor: '#1a1a2e',
      });

      mapRef.current = map;
      setMapReady(true);
      console.log('[GoogleMapsHeatmap] Map initialized successfully');
    } catch (err) {
      console.error('[GoogleMapsHeatmap] Map initialization error:', err);
      setDetailedError(err instanceof Error ? err.message : 'Failed to initialize map');
    }
  }, [isLoaded]);

  // Build and update heatmap data
  useEffect(() => {
    if (!mapReady || !mapRef.current || !window.google?.maps?.visualization) {
      return;
    }

    console.log('[GoogleMapsHeatmap] Updating heatmap data...', data?.countries?.length || 0, 'countries');

    // Remove existing heatmap layer
    if (heatmapRef.current) {
      heatmapRef.current.setMap(null);
      heatmapRef.current = null;
    }

    if (!data?.countries?.length) {
      console.log('[GoogleMapsHeatmap] No data to display');
      return;
    }

    // Build heatmap points from data
    const points: google.maps.visualization.WeightedLocation[] = [];

    data.countries.forEach((country) => {
      // Prioritize city-level data for better precision
      if (country.cities?.length) {
        country.cities.forEach((city) => {
          if (city.lat && city.lng && !isNaN(city.lat) && !isNaN(city.lng)) {
            points.push({
              location: new google.maps.LatLng(city.lat, city.lng),
              weight: Math.max(city.visitors, 1), // Ensure minimum weight
            });
          }
        });
      } else if (country.latitude && country.longitude && !isNaN(country.latitude) && !isNaN(country.longitude)) {
        // Fallback to country-level coordinates
        points.push({
          location: new google.maps.LatLng(country.latitude, country.longitude),
          weight: Math.max(country.visitors, 1),
        });
      }
    });

    console.log('[GoogleMapsHeatmap] Created', points.length, 'heatmap points');

    if (points.length === 0) {
      console.log('[GoogleMapsHeatmap] No valid coordinates found');
      return;
    }

    // Create new heatmap layer
    const heatmap = new google.maps.visualization.HeatmapLayer({
      data: points,
      map: mapRef.current,
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

    heatmapRef.current = heatmap;
    console.log('[GoogleMapsHeatmap] Heatmap layer created successfully');
  }, [mapReady, data]);

  // Calculate totals
  const totalVisitors = useMemo(() => {
    return data?.countries?.reduce((sum, c) => sum + (c.visitors || 0), 0) || 0;
  }, [data]);

  const totalCountries = data?.countries?.length || 0;

  const handleRetry = useCallback(() => {
    window.location.reload();
  }, []);

  // Error state with detailed help
  const errorToShow = loadError?.message || detailedError;
  if (errorToShow) {
    const errorHelp = getErrorHelp(errorToShow);
    
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-destructive/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="w-5 h-5" />
            {errorHelp.title}
          </CardTitle>
          <CardDescription>{errorHelp.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive" className="bg-destructive/10">
            <Info className="h-4 w-4" />
            <AlertTitle>How to fix:</AlertTitle>
            <AlertDescription>
              <ol className="list-decimal list-inside space-y-1 mt-2 text-sm">
                {errorHelp.steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </AlertDescription>
          </Alert>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRetry} className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Retry
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => window.open('https://console.cloud.google.com/apis/dashboard', '_blank')}
            >
              Open Google Cloud Console
            </Button>
          </div>

          <details className="text-xs text-muted-foreground">
            <summary className="cursor-pointer">Technical Details</summary>
            <pre className="mt-2 p-2 bg-muted rounded text-[10px] overflow-x-auto">
              {errorToShow}
            </pre>
          </details>
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
              <span className="text-muted-foreground text-sm">Initializing map...</span>
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
              {mapReady && (
                <CheckCircle className="w-4 h-4 text-success" />
              )}
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

        {/* No Data Warning */}
        {mapReady && (!data?.countries?.length) && (
          <div className="p-4 bg-warning/10 border-t border-warning/20">
            <div className="flex items-center gap-2 text-warning text-sm">
              <Info className="w-4 h-4" />
              <span>No geo-location data available yet. Visit your site to generate analytics.</span>
            </div>
          </div>
        )}

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
        {data?.countries && data.countries.length > 0 && (
          <div className="p-4 border-t border-border/50">
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Top Visitor Locations
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {data.countries.slice(0, 9).map((country, index) => (
                <div
                  key={`${country.country_code}-${index}`}
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
        )}
      </CardContent>
    </Card>
  );
});

GoogleMapsHeatmap.displayName = 'GoogleMapsHeatmap';

export default GoogleMapsHeatmap;
