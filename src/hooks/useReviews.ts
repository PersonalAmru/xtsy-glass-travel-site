/**
 * Hook to fetch guest reviews from Supabase
 * Syncs with the reviews table and maps to the ReviewsSection format
 */

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

// Property IDs from the database
const PROPERTY_IDS = {
  'xtsy-travellers-hostel': '11978251-839f-4274-ab1b-ec9c2d8bbaae',
  'xtsy-luxury': '5d67fd82-c64c-4cd0-b051-a29deb9c9b3b',
} as const;

// Property names for display
const PROPERTY_NAMES: Record<string, string> = {
  '11978251-839f-4274-ab1b-ec9c2d8bbaae': 'XTSY Travellers Hostel',
  '5d67fd82-c64c-4cd0-b051-a29deb9c9b3b': 'XTSY Experience',
};

export interface Review {
  name: string;
  rating: number;
  comment: string;
  date: string;
  source: string;
  roomType?: string;
  property: string;
  highlights?: string;
  photos?: string[];
  verified?: boolean;
}

interface DBReview {
  id: string;
  guest_name: string;
  rating: number;
  review_text: string | null;
  photos: string[] | null;
  verified: boolean | null;
  created_at: string | null;
  property_id: string | null;
}

export function useReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      if (data && data.length > 0) {
        const mappedReviews: Review[] = data.map((review: DBReview) => ({
          name: review.guest_name,
          rating: review.rating,
          comment: review.review_text || 'Great experience!',
          date: review.created_at 
            ? format(new Date(review.created_at), 'MMMM yyyy')
            : 'Recent',
          source: 'Direct', // Reviews from our system
          property: review.property_id 
            ? (PROPERTY_NAMES[review.property_id] || 'XTSY Travellers Hostel')
            : 'XTSY Travellers Hostel',
          photos: review.photos || undefined,
          verified: review.verified || false,
        }));
        
        setReviews(mappedReviews);
      } else {
        // No reviews in DB, return empty array
        setReviews([]);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch reviews'));
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  // Get reviews by property
  const getReviewsByProperty = useMemo(() => {
    return (propertyName: string) => 
      reviews.filter(r => r.property === propertyName);
  }, [reviews]);

  // Get review counts by property
  const reviewCounts = useMemo(() => ({
    hostel: reviews.filter(r => r.property === 'XTSY Travellers Hostel').length,
    luxury: reviews.filter(r => r.property === 'XTSY Experience').length,
    total: reviews.length,
  }), [reviews]);

  // Calculate average rating by property
  const averageRatings = useMemo(() => {
    const hostelReviews = reviews.filter(r => r.property === 'XTSY Travellers Hostel');
    const luxuryReviews = reviews.filter(r => r.property === 'XTSY Experience');
    
    const calcAvg = (revs: Review[]) => 
      revs.length > 0 
        ? Math.round((revs.reduce((sum, r) => sum + r.rating, 0) / revs.length) * 10) / 10 
        : 0;
    
    return {
      hostel: calcAvg(hostelReviews),
      luxury: calcAvg(luxuryReviews),
      overall: calcAvg(reviews),
    };
  }, [reviews]);

  return {
    reviews,
    loading,
    error,
    refetch: fetchReviews,
    getReviewsByProperty,
    reviewCounts,
    averageRatings,
    hasReviews: reviews.length > 0,
  };
}

export { PROPERTY_IDS, PROPERTY_NAMES };
