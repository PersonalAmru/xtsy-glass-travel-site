/**
 * Geo Traffic List Component
 * Shows countries and states/regions where real traffic is coming from
 * States/Regions shown as drill-down after selecting a country
 * Excludes Lovable admin traffic
 */

import React, { memo, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Globe, MapPin, Users, Building, ChevronRight, ArrowLeft, X } from 'lucide-react';
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
  // Selected country for drill-down
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  // Process and sort data
  const processedData = useMemo(() => {
    if (!data?.countries?.length) return { countries: [], totalVisitors: 0, totalCountries: 0 };

    // Sort countries by visitors (descending)
    const sortedCountries = [...data.countries]
      .filter(c => c.visitors > 0)
      .sort((a, b) => b.visitors - a.visitors);

    const totalVisitors = sortedCountries.reduce((sum, c) => sum + c.visitors, 0);

    return {
      countries: sortedCountries,
      totalVisitors,
      totalCountries: sortedCountries.length,
    };
  }, [data]);

  // Get states/regions for selected country
  const selectedCountryData = useMemo(() => {
    if (!selectedCountry || !processedData.countries.length) return null;

    const country = processedData.countries.find(c => c.country_code === selectedCountry);
    if (!country) return null;

    // Aggregate states/regions for this country
    const statesMap = new Map<string, { state: string; visitors: number; bookings: number; cities: string[] }>();
    
    country.cities?.forEach(city => {
      if (city.region) {
        const key = city.region;
        const existing = statesMap.get(key);
        if (existing) {
          existing.visitors += city.visitors;
          existing.bookings += city.bookings || 0;
          if (city.city && !existing.cities.includes(city.city)) {
            existing.cities.push(city.city);
          }
        } else {
          statesMap.set(key, {
            state: city.region,
            visitors: city.visitors,
            bookings: city.bookings || 0,
            cities: city.city ? [city.city] : [],
          });
        }
      }
    });

    const sortedStates = Array.from(statesMap.values()).sort((a, b) => b.visitors - a.visitors);
    const totalStateVisitors = sortedStates.reduce((sum, s) => sum + s.visitors, 0);

    return {
      country,
      states: sortedStates,
      totalStateVisitors,
    };
  }, [selectedCountry, processedData.countries]);

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
                const isSelected = selectedCountry === country.country_code;
                const hasRegions = country.cities?.some(c => c.region);
                
                return (
                  <div
                    key={country.country_code}
                    onClick={() => hasRegions && setSelectedCountry(isSelected ? null : country.country_code)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg transition-all",
                      hasRegions && "cursor-pointer",
                      isSelected 
                        ? "bg-primary/20 ring-1 ring-primary/50" 
                        : "hover:bg-muted/50 group"
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

                    {/* Percentage Bar + Drill-down indicator */}
                    <div className="flex items-center gap-2">
                      <div className="w-20 hidden sm:block">
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
                      {hasRegions && (
                        <ChevronRight className={cn(
                          "w-4 h-4 text-muted-foreground transition-transform",
                          isSelected && "rotate-90 text-primary"
                        )} />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* States/Regions List - Only shows when country is selected */}
      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <Building className="w-5 h-5 text-primary" />
                Traffic by State/Region
              </CardTitle>
              <CardDescription className="text-xs">
                {selectedCountryData 
                  ? `${selectedCountryData.states.length} regions in ${selectedCountryData.country.country_name}`
                  : 'Select a country to view regional breakdown'
                }
              </CardDescription>
            </div>
            {selectedCountry && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCountry(null)}
                className="h-8 px-2 text-xs"
              >
                <X className="w-3 h-3 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[320px]">
            <div className="px-4 pb-4 space-y-1">
              {selectedCountryData?.states.length ? (
                <>
                  {/* Selected country header */}
                  <div className="flex items-center gap-2 px-3 py-2 mb-2 bg-primary/10 rounded-lg">
                    <span className="text-lg">{getCountryFlag(selectedCountryData.country.country_code)}</span>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{selectedCountryData.country.country_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {selectedCountryData.totalStateVisitors.toLocaleString()} visitors across {selectedCountryData.states.length} regions
                      </p>
                    </div>
                  </div>

                  {/* States list */}
                  {selectedCountryData.states.map((state, index) => {
                    const maxVisitors = selectedCountryData.states[0]?.visitors || 1;
                    const barWidth = (state.visitors / maxVisitors) * 100;
                    return (
                      <div
                        key={state.state}
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
                              {state.cities.length > 0 && (
                                <p className="text-xs text-muted-foreground truncate">
                                  {state.cities.slice(0, 3).join(', ')}
                                  {state.cities.length > 3 && ` +${state.cities.length - 3} more`}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="text-right min-w-[80px]">
                          <div className="flex items-center justify-end gap-1 text-sm font-medium">
                            <Users className="w-3 h-3 text-muted-foreground" />
                            {state.visitors.toLocaleString()}
                          </div>
                          {state.bookings > 0 && (
                            <Badge variant="outline" className="text-[10px] px-1 py-0 mt-0.5">
                              {state.bookings} bookings
                            </Badge>
                          )}
                          <div className="h-1 bg-muted rounded-full overflow-hidden mt-1">
                            <div
                              className="h-full bg-gradient-to-r from-accent to-accent/70"
                              style={{ width: `${barWidth}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              ) : (
                <div className="h-[280px] flex items-center justify-center text-muted-foreground text-sm">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/30 flex items-center justify-center">
                      <ArrowLeft className="w-6 h-6 opacity-50" />
                    </div>
                    <p className="font-medium">Select a Country</p>
                    <p className="text-xs mt-1 max-w-[200px] mx-auto">
                      Click on a country from the list to see state/region breakdown
                    </p>
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
