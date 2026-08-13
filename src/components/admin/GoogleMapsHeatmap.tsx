/**
 * Google Maps Heatmap Component
 * Uses the Visualization Library for real gradient heatmaps
 */

import React, { memo, useMemo, useEffect, useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MapPin, Users, TrendingUp, AlertCircle, RefreshCw, CheckCircle, Info, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  interface Window {
    google: typeof google;
  }
  namespace google.maps {
    interface MapTypeStyle {
      elementType?: string;
      featureType?: string;
      stylers: Array<Record<string, string>>;
    }
    class Map {
      constructor(el: HTMLElement, opts?: any);
      setCenter(latLng: any): void;
      setZoom(zoom: number): void;
      getZoom(): number;
      fitBounds(bounds: any): void;
      addListener(event: string, handler: () => void): any;
      controls: any[];
    }
    class LatLng {
      constructor(lat: number, lng: number);
    }
    class LatLngBounds {
      extend(latLng: any): void;
    }
    class InfoWindow {
      constructor(opts?: any);
      open(opts: any): void;
      close(): void;
    }
    class Marker {
      constructor(opts?: any);
      addListener(event: string, handler: () => void): any;
      setMap(map: any): void;
    }
    class Size {
      constructor(w: number, h: number);
    }
    namespace visualization {
      class HeatmapLayer {
        constructor(opts?: any);
        setMap(map: any): void;
      }
      interface WeightedLocation {
        location: any;
        weight: number;
      }
    }
    namespace event {
      function removeListener(listener: any): void;
    }
    const ControlPosition: Record<string, number>;
  }
}

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
  const lowerError = error.toLowerCase();
  
  if (lowerError.includes('apinotactivated') || lowerError.includes('not activated') || lowerError.includes('api project is not authorized')) {
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
  if (lowerError.includes('referernotallowed') || lowerError.includes('referrer') || lowerError.includes('this referrer is not allowed')) {
    return {
      title: 'Domain Not Authorized',
      description: 'Your current domain is not allowed to use this API key.',
      steps: [
        'Go to Google Cloud Console → APIs & Services → Credentials',
        'Edit your API key → Application restrictions → HTTP referrers',
        'Add: *.lovable.app/*, *.lovableproject.com/*, localhost:*',
      ],
    };
  }
  if (lowerError.includes('billingnotenabled') || lowerError.includes('billing') || lowerError.includes('you must enable billing')) {
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
  if (lowerError.includes('invalidkey') || lowerError.includes('invalid key') || lowerError.includes('api key not valid')) {
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
  if (lowerError.includes('api key not configured') || lowerError.includes('not found')) {
    return {
      title: 'API Key Not Configured',
      description: 'The Google Maps API key has not been set up in secrets.',
      steps: [
        'Add GOOGLE_MAPS_API_KEY to your project secrets',
        'Refresh the page after adding the key',
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

// Global script loading state
let googleMapsScriptPromise: Promise<void> | null = null;
let googleMapsLoaded = false;

const loadGoogleMapsScript = (apiKey: string): Promise<void> => {
  // If already loaded, resolve immediately
  if (googleMapsLoaded && window.google?.maps?.visualization) {
    return Promise.resolve();
  }
  
  // If loading in progress, return existing promise
  if (googleMapsScriptPromise) {
    return googleMapsScriptPromise;
  }
  
  googleMapsScriptPromise = new Promise((resolve, reject) => {
    // Check if script already exists
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      // Wait for it to load
      const checkLoaded = setInterval(() => {
        if (window.google?.maps?.visualization) {
          clearInterval(checkLoaded);
          googleMapsLoaded = true;
          resolve();
        }
      }, 100);
      
      setTimeout(() => {
        clearInterval(checkLoaded);
        reject(new Error('Timeout waiting for existing Google Maps script'));
      }, 10000);
      return;
    }
    
    // Create callback name
    const callbackName = `initGoogleMapsHeatmap_${Date.now()}`;
    
    // Set up callback
    (window as any)[callbackName] = () => {
      console.log('[GoogleMapsHeatmap] Google Maps loaded via callback');
      googleMapsLoaded = true;
      delete (window as any)[callbackName];
      resolve();
    };
    
    // Create and inject script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=visualization&callback=${callbackName}`;
    script.async = true;
    script.defer = true;
    
    script.onerror = (event) => {
      console.error('[GoogleMapsHeatmap] Script load error:', event);
      googleMapsScriptPromise = null;
      delete (window as any)[callbackName];
      reject(new Error('Failed to load Google Maps script. Check API key and domain restrictions.'));
    };
    
    document.head.appendChild(script);
    console.log('[GoogleMapsHeatmap] Loading Google Maps script...');
    
    // Timeout fallback
    setTimeout(() => {
      if (!googleMapsLoaded) {
        googleMapsScriptPromise = null;
        delete (window as any)[callbackName];
        reject(new Error('Google Maps script load timeout. The API may be blocked or the key may be invalid.'));
      }
    }, 15000);
  });
  
  return googleMapsScriptPromise;
};

const GoogleMapsHeatmap: React.FC<GoogleMapsHeatmapProps> = memo(({ data }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const heatmapRef = useRef<google.maps.visualization.HeatmapLayer | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [mapReady, setMapReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKeyLoaded, setApiKeyLoaded] = useState(false);

  // Load Google Maps using environment variable
  // Security: Google Maps JS API keys are designed to be public with HTTP referrer restrictions
  // Configure allowed domains in Google Cloud Console (e.g., *.lovable.app, your-domain.com)
  useEffect(() => {
    let cancelled = false;
    
    const init = async () => {
      try {
        console.log('[GoogleMapsHeatmap] Loading Google Maps...');
        
        // Use environment variable for API key
        // This key should be restricted by HTTP referrer in Google Cloud Console
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        
        if (!apiKey) {
          throw new Error('Google Maps API key not configured. Please add VITE_GOOGLE_MAPS_API_KEY to your environment variables and configure HTTP referrer restrictions in Google Cloud Console.');
        }
        
        if (cancelled) return;
        
        setApiKeyLoaded(true);
        
        // Load Google Maps script
        await loadGoogleMapsScript(apiKey);
        
        if (cancelled) return;
        
        console.log('[GoogleMapsHeatmap] Google Maps loaded successfully');
        setLoading(false);
      } catch (err) {
        if (cancelled) return;
        console.error('[GoogleMapsHeatmap] Initialization error:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize map');
        setLoading(false);
      }
    };
    
    init();
    
    return () => {
      cancelled = true;
    };
  }, []);

  // Initialize map once Google Maps is loaded
  useEffect(() => {
    if (loading || error || !mapContainerRef.current || mapRef.current) return;
    if (!window.google?.maps) return;

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
      setError(err instanceof Error ? err.message : 'Failed to initialize map');
    }
  }, [loading, error]);

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
              weight: Math.max(city.visitors, 1),
            });
          }
        });
      } else if (country.latitude && country.longitude && !isNaN(country.latitude) && !isNaN(country.longitude)) {
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
    googleMapsScriptPromise = null;
    googleMapsLoaded = false;
    window.location.reload();
  }, []);

  // Error state with detailed help
  if (error) {
    const errorHelp = getErrorHelp(error);
    
    return (
      <Card className="bg-card/50 backdrop-blur-xs border-destructive/30">
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
          
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" onClick={handleRetry} className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Retry
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => window.open('https://console.cloud.google.com/apis/credentials', '_blank')}
              className="flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Google Cloud Console
            </Button>
          </div>

          <details className="text-xs text-muted-foreground">
            <summary className="cursor-pointer hover:text-foreground">Technical Details</summary>
            <pre className="mt-2 p-2 bg-muted rounded text-[10px] overflow-x-auto whitespace-pre-wrap">
              {error}
            </pre>
          </details>
        </CardContent>
      </Card>
    );
  }

  // Loading state
  if (loading) {
    return (
      <Card className="bg-card/50 backdrop-blur-xs">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary animate-pulse" />
            {apiKeyLoaded ? 'Loading Google Maps...' : 'Fetching API Key...'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] bg-muted/30 rounded-lg animate-pulse flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <RefreshCw className="w-8 h-8 text-primary animate-spin" />
              <span className="text-muted-foreground text-sm">
                {apiKeyLoaded ? 'Initializing visualization library...' : 'Connecting to maps service...'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/50 backdrop-blur-xs overflow-hidden">
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
