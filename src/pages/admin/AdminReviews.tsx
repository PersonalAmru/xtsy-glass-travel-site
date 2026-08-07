/**
 * Admin Reviews Page
 * Manage guest reviews across all properties
 */

import { useState, useEffect } from 'react';
import { UnifiedAdminLayout } from '@/layouts/UnifiedAdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  Star,
  RefreshCw,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Check,
  X,
  Image,
} from 'lucide-react';

interface Review {
  id: string;
  guest_name: string;
  rating: number;
  review_text: string | null;
  verified: boolean;
  photos: string[] | null;
  created_at: string;
}

interface ReviewMetrics {
  totalReviews: number;
  averageRating: number;
  verifiedReviews: number;
  withPhotos: number;
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [metrics, setMetrics] = useState<ReviewMetrics>({
    totalReviews: 0,
    averageRating: 0,
    verifiedReviews: 0,
    withPhotos: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const allReviews = data || [];
      const avgRating = allReviews.length > 0 
        ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length 
        : 0;

      setMetrics({
        totalReviews: allReviews.length,
        averageRating: Math.round(avgRating * 10) / 10,
        verifiedReviews: allReviews.filter(r => r.verified).length,
        withPhotos: allReviews.filter(r => r.photos && r.photos.length > 0).length,
      });

      setReviews(allReviews as Review[]);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              'w-4 h-4',
              star <= rating ? 'text-amber-500 fill-amber-500' : 'text-muted-foreground'
            )}
          />
        ))}
      </div>
    );
  };

  const metricCards = [
    {
      title: 'Total Reviews',
      value: metrics.totalReviews.toString(),
      icon: MessageSquare,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Average Rating',
      value: metrics.averageRating.toString(),
      icon: Star,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
    },
    {
      title: 'Verified',
      value: metrics.verifiedReviews.toString(),
      icon: Check,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
    },
    {
      title: 'With Photos',
      value: metrics.withPhotos.toString(),
      icon: Image,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
  ];

  return (
    <UnifiedAdminLayout>
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Star className="w-6 h-6 text-primary" />
              Reviews
            </h1>
            <p className="text-sm text-muted-foreground">Manage guest reviews and ratings</p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchReviews} disabled={loading}>
            <RefreshCw className={cn('w-4 h-4 mr-2', loading && 'animate-spin')} />
            Refresh
          </Button>
        </header>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metricCards.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className={cn('p-2 rounded-lg w-fit', metric.bgColor)}>
                    <Icon className={cn('w-5 h-5', metric.color)} />
                  </div>
                  <div className="mt-3">
                    <p className="text-2xl font-bold">{metric.value}</p>
                    <p className="text-xs text-muted-foreground">{metric.title}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Reviews List */}
        <Card>
          <CardHeader>
            <CardTitle>All Reviews</CardTitle>
            <CardDescription>Guest feedback and ratings</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Star className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No reviews yet</p>
                <p className="text-sm">Reviews will appear here once guests submit them</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="p-4 bg-muted/50 rounded-xl">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-primary font-semibold">
                            {review.guest_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{review.guest_name}</p>
                            {review.verified && (
                              <Badge variant="secondary" className="text-xs">
                                <Check className="w-3 h-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                          {renderStars(review.rating)}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(review.created_at), 'MMM d, yyyy')}
                      </span>
                    </div>
                    
                    {review.review_text && (
                      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                        {review.review_text}
                      </p>
                    )}

                    {review.photos && review.photos.length > 0 && (
                      <div className="mt-3 flex gap-2 overflow-x-auto">
                        {review.photos.map((photo, idx) => (
                          <img
                            key={idx}
                            src={photo}
                            alt={`Review photo ${idx + 1}`}
                            className="w-20 h-20 rounded-lg object-cover"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </UnifiedAdminLayout>
  );
}
