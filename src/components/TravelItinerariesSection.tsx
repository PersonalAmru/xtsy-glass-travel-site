import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Clock, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Itinerary {
  id: string;
  title: string;
  description: string;
  duration_days: number;
  destinations: any;
  activities: any;
  estimated_cost: number;
  difficulty_level: string;
  best_season: string;
  image_url?: string;
  tags?: string[];
  featured: boolean;
  source: string;
  external_url?: string;
}

const TravelItinerariesSection = () => {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItineraries();
  }, []);

  const fetchItineraries = async () => {
    try {
      const { data, error } = await supabase
        .from('itineraries')
        .select('*')
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching itineraries:', error);
      } else {
        setItineraries(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Travel Itineraries
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Loading amazing travel experiences...
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <Card className="h-full">
                  <div className="h-48 bg-muted rounded-t-lg"></div>
                  <CardHeader>
                    <div className="h-6 bg-muted rounded mb-2"></div>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="h-4 bg-muted rounded"></div>
                      <div className="h-4 bg-muted rounded w-2/3"></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Curated Travel Itineraries
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover handcrafted travel experiences across Northeast India
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {itineraries.map((itinerary) => (
            <Card key={itinerary.id} className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
              {itinerary.image_url && (
                <div className="h-48 overflow-hidden rounded-t-lg">
                  <img 
                    src={itinerary.image_url} 
                    alt={itinerary.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              
              <CardHeader className="flex-none">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2 line-clamp-2">
                      {itinerary.title}
                      {itinerary.featured && (
                        <Badge variant="secondary" className="ml-2">Featured</Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {itinerary.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col">
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{itinerary.duration_days} days</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{Array.isArray(itinerary.destinations) ? itinerary.destinations.length : 0} destinations</span>
                  </div>

                  {itinerary.estimated_cost && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>From {formatCurrency(itinerary.estimated_cost)}</span>
                    </div>
                  )}

                  {itinerary.difficulty_level && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{itinerary.difficulty_level}</span>
                    </div>
                  )}

                  {itinerary.best_season && (
                    <div className="text-sm text-muted-foreground">
                      <strong>Best time:</strong> {itinerary.best_season}
                    </div>
                  )}
                </div>

                {itinerary.tags && itinerary.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {itinerary.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="mt-auto">
                  {itinerary.source === 'external' && itinerary.external_url ? (
                    <Button 
                      className="w-full" 
                      onClick={() => window.open(itinerary.external_url, '_blank')}
                    >
                      View Details
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button className="w-full">
                      Explore Itinerary
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {itineraries.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No itineraries available at the moment. Check back soon!
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default TravelItinerariesSection;