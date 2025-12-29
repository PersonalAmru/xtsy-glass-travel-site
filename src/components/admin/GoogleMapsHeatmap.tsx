/**
 * Google Maps Heatmap Component
 * Uses the Visualization Library for real gradient heatmaps
 */

import React, { memo, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, HeatmapLayer } from '@react-google-maps/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MapPin, Users, TrendingUp, AlertCircle } from 'lucide-react';

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

const libraries: ('visualization')[] = ['visualization'];

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

const GoogleMapsHeatmap: React.FC<GoogleMapsHeatmapProps> = memo(({ data }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries,
  });

  // Convert data to heatmap points
  const heatmapData = useMemo(() => {
    if (!data?.countries || !isLoaded || !window.google) return [];

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

    return points;
  }, [data, isLoaded]);

  const totalVisitors = useMemo(() => {
    return data?.countries?.reduce((sum, c) => sum + (c.visitors || 0), 0) || 0;
  }, [data]);

  const totalCountries = data?.countries?.length || 0;

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
            <span className="text-muted-foreground">Initializing map...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (loadError) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="w-5 h-5" />
            Map Loading Error
          </CardTitle>
          <CardDescription>Failed to load Google Maps.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{loadError.message}</p>
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
        <div className="h-[300px] md:h-[400px]">
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={{ lat: 22, lng: 78 }} // Center on India
            zoom={3}
            options={{
              styles: darkMapStyles,
              disableDefaultUI: true,
              zoomControl: true,
              gestureHandling: 'cooperative',
              backgroundColor: '#1a1a2e',
            }}
          >
            {heatmapData.length > 0 && (
              <HeatmapLayer
                data={heatmapData}
                options={{
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
                }}
              />
            )}
          </GoogleMap>
        </div>

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
