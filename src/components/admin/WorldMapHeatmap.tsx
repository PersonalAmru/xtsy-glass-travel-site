import React, { memo, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MapPin, Users, TrendingUp, Globe } from 'lucide-react';

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
  const totalVisitors = useMemo(() => {
    return data?.countries?.reduce((sum, c) => sum + (c.visitors || 0), 0) || 0;
  }, [data]);

  const totalCountries = data?.countries?.length || 0;
  const maxVisitors = useMemo(() => {
    if (!data?.countries?.length) return 1;
    return Math.max(...data.countries.map(c => c.visitors));
  }, [data]);

  if (!data?.countries?.length) {
    return (
      <Card className="bg-card/50 backdrop-blur-xs">
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
    <Card className="bg-card/50 backdrop-blur-xs overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
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
      <CardContent className="p-4">
        {/* Top Locations with visual bars */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Top Visitor Locations
          </h4>
          <div className="space-y-2">
            {data.countries.slice(0, 12).map((country, index) => {
              const intensity = country.visitors / maxVisitors;
              return (
                <div key={country.country_code} className="group">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-primary w-5">#{index + 1}</span>
                      <div>
                        <p className="text-sm font-medium">
                          {country.country_name || country.country_code}
                        </p>
                        {country.cities?.[0] && (
                          <p className="text-xs text-muted-foreground">{country.cities[0].city}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-right">
                      <div className="flex items-center gap-1 text-sm font-semibold">
                        <Users className="w-3 h-3 text-muted-foreground" />
                        {country.visitors}
                      </div>
                      {country.bookings != null && country.bookings > 0 && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                          {country.bookings} bookings
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="h-1.5 bg-muted/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary/60 to-primary rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(4, intensity * 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

WorldMapHeatmap.displayName = 'WorldMapHeatmap';

export default WorldMapHeatmap;
