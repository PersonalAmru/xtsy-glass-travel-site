/**
 * PropertyBookingFlow - Property-specific booking flow wrapper
 * Routes to the appropriate inventory based on selected property
 */

import { useEffect, useMemo } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { getPropertyBySlug, getLocationById } from '@/data/properties';
import { ROOM_INVENTORY } from '@/data/roomInventory';

// Import the original BookingFlow component
import BookingFlowOriginal from './BookingFlow';

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

  // Store property context in sessionStorage for BookingFlow to use
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('xtsy_booking_property', JSON.stringify({
      propertyId: property.id,
      propertyName: property.name,
      propertySlug: property.slug,
      locationId: location.id,
      locationName: location.name,
      roomTypeIds: property.roomTypeIds,
    }));
  }

  // Render the original BookingFlow - it will read the property context
  return <BookingFlowOriginal />;
};

export default PropertyBookingFlow;
