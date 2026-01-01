/**
 * Geo Traffic List Component
 * Shows countries and states/regions where real traffic is coming from
 * Excludes Lovable admin traffic
 */

import React, { memo, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Globe, MapPin, Users, TrendingUp, Building, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GeoTrafficListProps {
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

// Country flag emoji helper
const getCountryFlag = (countryCode: string): string => {
  if (!countryCode || countryCode.length !== 2) return '🌍';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

const GeoTrafficList: React.FC<GeoTrafficListProps> = memo(({ data }) => {
  // Process and sort data
  const processedData = useMemo(() => {
    if (!data?.countries?.length) return { countries: [], totalVisitors: 0, totalCountries: 0 };

    // Sort countries by visitors (descending)
    const sortedCountries = [...data.countries]
      .filter(c => c.visitors > 0)
      .sort((a, b) => b.visitors - a.visitors);

    const totalVisitors = sortedCountries.reduce((sum, c) => sum + c.visitors, 0);

    // Aggregate states/regions across all countries
    const statesMap = new Map<string, { state: string; country: string; countryCode: string; visitors: number; bookings: number }>();
    
    sortedCountries.forEach(country => {
      country.cities?.forEach(city => {
        if (city.region) {
          const key = `${city.region}-${country.country_code}`;
          const existing = statesMap.get(key);
          if (existing) {
            existing.visitors += city.visitors;
            existing.bookings += city.bookings || 0;
          } else {
            statesMap.set(key, {
              state: city.region,
              country: country.country_name,
              countryCode: country.country_code,
              visitors: city.visitors,
              bookings: city.bookings || 0,
            });
          }
        }
      });
    });

    const sortedStates = Array.from(statesMap.values()).sort((a, b) => b.visitors - a.visitors);

    return {
      countries: sortedCountries,
      states: sortedStates,
      totalVisitors,
      totalCountries: sortedCountries.length,
    };
  }, [data]);

  if (!processedData.countries.length) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            Geographic Traffic
          </CardTitle>
          <CardDescription>Where your visitors are coming from</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
            <div className="text-center">
              <Globe className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No geographic data available yet</p>
              <p className="text-xs mt-1">Visit your site to generate analytics</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Countries List */}
      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <Globe className="w-5 h-5 text-primary" />
                Traffic by Country
              </CardTitle>
              <CardDescription className="text-xs">
                {processedData.totalCountries} countries • {processedData.totalVisitors.toLocaleString()} total visitors
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[320px]">
            <div className="px-4 pb-4 space-y-1">
              {processedData.countries.map((country, index) => {
                const percentage = ((country.visitors / processedData.totalVisitors) * 100).toFixed(1);
                return (
                  <div
                    key={country.country_code}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg transition-colors",
                      "hover:bg-muted/50 group"
                    )}
                  >
                    {/* Rank */}
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-semibold text-primary">{index + 1}</span>
                    </div>

                    {/* Flag & Country */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{getCountryFlag(country.country_code)}</span>
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">{country.country_name || country.country_code}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {country.visitors.toLocaleString()}
                            </span>
                            {country.bookings !== undefined && country.bookings > 0 && (
                              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                {country.bookings} bookings
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Percentage Bar */}
                    <div className="w-24 hidden sm:block">
                      <div className="flex items-center justify-end gap-2 mb-1">
                        <span className="text-xs font-medium">{percentage}%</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* States/Regions List */}
      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <Building className="w-5 h-5 text-primary" />
                Traffic by State/Region
              </CardTitle>
              <CardDescription className="text-xs">
                {processedData.states?.length || 0} regions identified
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[320px]">
            <div className="px-4 pb-4 space-y-1">
              {processedData.states?.length ? (
                processedData.states.map((state, index) => {
                  const maxVisitors = processedData.states?.[0]?.visitors || 1;
                  const barWidth = (state.visitors / maxVisitors) * 100;
                  return (
                    <div
                      key={`${state.state}-${state.countryCode}`}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg transition-colors",
                        "hover:bg-muted/50 group"
                      )}
                    >
                      {/* Rank */}
                      <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center">
                        <span className="text-xs font-semibold text-accent-foreground">{index + 1}</span>
                      </div>

                      {/* State Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="font-medium text-sm truncate">{state.state}</p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <span>{getCountryFlag(state.countryCode)}</span>
                              <span className="truncate">{state.country}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="text-right min-w-[80px]">
                        <div className="flex items-center justify-end gap-1 text-sm font-medium">
                          <Users className="w-3 h-3 text-muted-foreground" />
                          {state.visitors.toLocaleString()}
                        </div>
                        <div className="h-1 bg-muted rounded-full overflow-hidden mt-1">
                          <div
                            className="h-full bg-gradient-to-r from-accent to-accent/70"
                            style={{ width: `${barWidth}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
                  <div className="text-center">
                    <MapPin className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p>No state/region data available</p>
                    <p className="text-xs mt-1">City-level tracking provides regional data</p>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
});

GeoTrafficList.displayName = 'GeoTrafficList';

export default GeoTrafficList;
