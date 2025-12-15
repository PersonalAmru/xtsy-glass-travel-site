import React, { memo, useMemo } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MapPin, Users, TrendingUp } from 'lucide-react';

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

interface LocationPoint {
  city: string;
  region: string;
  country: string;
  country_code: string;
  latitude: number;
  longitude: number;
  visitors: number;
  sessions: number;
  bookings?: number;
}

interface WorldMapHeatmapProps {
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

const WorldMapHeatmap: React.FC<WorldMapHeatmapProps> = memo(({ data }) => {
  // Convert data to marker points
  const markers: LocationPoint[] = useMemo(() => {
    if (!data?.countries) return [];
    
    const points: LocationPoint[] = [];
    
    data.countries.forEach(country => {
      // Add city-level markers if available
      if (country.cities?.length) {
        country.cities.forEach(city => {
          if (city.lat && city.lng) {
            points.push({
              city: city.city || 'Unknown',
              region: city.region || '',
              country: country.country_name || country.country_code,
              country_code: country.country_code,
              latitude: city.lat,
              longitude: city.lng,
              visitors: city.visitors,
              sessions: country.sessions || 0,
              bookings: city.bookings,
            });
          }
        });
      } else if (country.latitude && country.longitude) {
        // Fallback to country-level marker
        points.push({
          city: '',
          region: '',
          country: country.country_name || country.country_code,
          country_code: country.country_code,
          latitude: country.latitude,
          longitude: country.longitude,
          visitors: country.visitors,
          sessions: country.sessions || 0,
          bookings: country.bookings,
        });
      }
    });
    
    return points.sort((a, b) => b.visitors - a.visitors);
  }, [data]);

  const maxVisitors = useMemo(() => {
    return markers.length > 0 ? Math.max(...markers.map(m => m.visitors)) : 1;
  }, [markers]);

  const totalVisitors = useMemo(() => {
    return data?.countries?.reduce((sum, c) => sum + (c.visitors || 0), 0) || 0;
  }, [data]);

  const totalCountries = data?.countries?.length || 0;

  if (!data?.countries?.length) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Real-time Visitor Map
          </CardTitle>
          <CardDescription>Live visitor locations from around the world</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            Collecting location data...
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
              Real-time Visitor Map
            </CardTitle>
            <CardDescription>Live visitor locations worldwide</CardDescription>
          </div>
          <div className="flex gap-4">
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
        {/* Map Container */}
        <div className="relative h-[300px] md:h-[400px] bg-gradient-to-b from-background to-muted/20 overflow-hidden">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              scale: 120,
              center: [78, 22], // Center on India
            }}
            style={{ width: '100%', height: '100%' }}
          >
            <ZoomableGroup zoom={1}>
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="hsl(var(--muted))"
                      stroke="hsl(var(--border))"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: 'none' },
                        hover: { fill: 'hsl(var(--accent))', outline: 'none' },
                        pressed: { outline: 'none' },
                      }}
                    />
                  ))
                }
              </Geographies>
              
              {/* Visitor Markers */}
              {markers.slice(0, 50).map((marker, index) => {
                const intensity = marker.visitors / maxVisitors;
                const radius = Math.max(4, Math.min(20, 4 + intensity * 16));
                
                return (
                  <Marker key={`${marker.country_code}-${marker.city}-${index}`} coordinates={[marker.longitude, marker.latitude]}>
                    {/* Glow effect */}
                    <circle
                      r={radius + 4}
                      fill={`hsl(var(--primary) / ${0.2 + intensity * 0.3})`}
                      className="animate-pulse"
                    />
                    {/* Main marker */}
                    <circle
                      r={radius}
                      fill={`hsl(var(--primary) / ${0.6 + intensity * 0.4})`}
                      stroke="hsl(var(--background))"
                      strokeWidth={1}
                    />
                    {/* Center dot */}
                    <circle
                      r={2}
                      fill="hsl(var(--background))"
                    />
                  </Marker>
                );
              })}
            </ZoomableGroup>
          </ComposableMap>
          
          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm rounded-lg p-3 text-xs">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-primary/40" />
              <span>Low activity</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span>High activity</span>
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
            {data.countries.slice(0, 9).map((country, index) => (
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

WorldMapHeatmap.displayName = 'WorldMapHeatmap';

export default WorldMapHeatmap;
