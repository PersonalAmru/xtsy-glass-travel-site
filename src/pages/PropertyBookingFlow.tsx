/**
 * PropertyBookingFlow - Wrapper that sets property context and routes to BookingFlow
 * Supports skipping date selection if dates are already in session
 */

import { useMemo, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import BookingFlowOriginal from './BookingFlow';
import { getPropertyBySlug, getLocationById } from '@/data/properties';

const PropertyBookingFlow = () => {
  const { locationSlug, propertySlug } = useParams<{ locationSlug: string; propertySlug: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const property = useMemo(() => {
    if (!propertySlug) return null;
    return getPropertyBySlug(propertySlug);
  }, [propertySlug]);

  const location = useMemo(() => {
    if (!locationSlug) return null;
    return getLocationById(locationSlug);
  }, [locationSlug]);

  useEffect(() => {
    // Redirect to home if property or location not found
    if (!property || !location) {
      navigate('/');
    }
  }, [property, location, navigate]);

  if (!property || !location) {
    return null;
  }

  // Get URL params for dates
  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');
  const guests = searchParams.get('guests');
  const skipDates = searchParams.get('skipDates') === 'true';

  // Also check sessionStorage for dates
  let sessionCheckIn: string | null = null;
  let sessionCheckOut: string | null = null;
  let sessionGuests: number = 2;

  if (typeof window !== 'undefined') {
    try {
      const storedParams = sessionStorage.getItem('xtsy_search_params');
      if (storedParams) {
        const params = JSON.parse(storedParams);
        sessionCheckIn = params.checkIn || null;
        sessionCheckOut = params.checkOut || null;
        sessionGuests = params.guests || 2;
      }
    } catch {
      // Ignore parsing errors
    }
  }

  // Use URL params if available, otherwise fall back to session
  const finalCheckIn = checkIn || sessionCheckIn;
  const finalCheckOut = checkOut || sessionCheckOut;
  const finalGuests = guests ? parseInt(guests) : sessionGuests;

  // Determine if we should skip date selection
  const shouldSkipDates = (skipDates || (finalCheckIn && finalCheckOut));

  // Store property context in sessionStorage for BookingFlow to use
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('xtsy_booking_property', JSON.stringify({
      propertyId: property.id,
      propertyName: property.name,
      propertySlug: property.slug,
      locationId: location.id,
      locationName: location.name,
      roomTypeIds: property.roomTypeIds,
      skipDates: shouldSkipDates,
      checkIn: finalCheckIn,
      checkOut: finalCheckOut,
      guests: finalGuests,
    }));
  }

  // Render the original BookingFlow - it will read the property context
  return <BookingFlowOriginal />;
};

export default PropertyBookingFlow;
