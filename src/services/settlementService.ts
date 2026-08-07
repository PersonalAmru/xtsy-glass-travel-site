// Settlement State Machine Service
import { supabase } from '@/integrations/supabase/client';
import { 
  SettlementStatus, 
  SETTLEMENT_TRANSITIONS, 
  BookingSettlementHistory,
  SettlementSummary 
} from '@/types/commercial';

/**
 * Validate if a state transition is allowed
 */
export function isValidTransition(from: SettlementStatus, to: SettlementStatus): boolean {
  const allowedTransitions = SETTLEMENT_TRANSITIONS[from];
  return allowedTransitions.includes(to);
}

/**
 * Get allowed next states for a given status
 */
export function getAllowedNextStates(currentStatus: SettlementStatus): SettlementStatus[] {
  return SETTLEMENT_TRANSITIONS[currentStatus] || [];
}

/**
 * Transition a booking to a new settlement status
 */
export async function transitionSettlementStatus(
  bookingId: string,
  bookingReference: string,
  newStatus: SettlementStatus,
  amount: number = 0,
  notes?: string
): Promise<{ success: boolean; error?: string; historyId?: string }> {
  try {
    // Get current booking status
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('id, settlement_status')
      .eq('id', bookingId)
      .single();

    if (fetchError || !booking) {
      return { success: false, error: 'Booking not found' };
    }

    const currentStatus = (booking.settlement_status || 'initiated') as SettlementStatus;

    // Validate transition
    if (!isValidTransition(currentStatus, newStatus)) {
      return { 
        success: false, 
        error: `Invalid transition from ${currentStatus} to ${newStatus}` 
      };
    }

    // Call the database function to record transition
    const { data, error } = await supabase.rpc('record_settlement_transition', {
      p_booking_id: bookingId,
      p_booking_reference: bookingReference,
      p_new_status: newStatus,
      p_amount: amount,
      p_notes: notes || undefined,
      p_actor_id: undefined, // Will be set by function based on auth
    });

    if (error) {
      console.error('Settlement transition error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, historyId: data };
  } catch (err) {
    console.error('Settlement transition exception:', err);
    return { success: false, error: 'Failed to transition settlement status' };
  }
}

/**
 * Get settlement history for a booking
 */
export async function getSettlementHistory(
  bookingReference: string
): Promise<BookingSettlementHistory[]> {
  const { data, error } = await supabase
    .from('booking_settlement_history')
    .select('*')
    .eq('booking_reference', bookingReference)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching settlement history:', error);
    return [];
  }

  return data as BookingSettlementHistory[];
}

/**
 * Get settlement summary for a property
 */
export async function getPropertySettlementSummary(
  propertyId: string
): Promise<SettlementSummary | null> {
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('settlement_status, total_amount, settlement_amount, payout_eligible')
    .eq('property_id', propertyId);

  if (error) {
    console.error('Error fetching settlement summary:', error);
    return null;
  }

  const summary: SettlementSummary = {
    property_id: propertyId,
    property_name: '',
    total_bookings: bookings.length,
    initiated: 0,
    confirmed: 0,
    stayed: 0,
    settled: 0,
    cancelled: 0,
    no_show: 0,
    refund_pending: 0,
    refunded: 0,
    total_revenue: 0,
    settled_revenue: 0,
    outstanding_liability: 0,
    payout_eligible: 0,
  };

  bookings.forEach((booking) => {
    const status = (booking.settlement_status || 'initiated') as SettlementStatus;
    summary[status]++;
    summary.total_revenue += booking.total_amount || 0;
    
    if (status === 'settled') {
      summary.settled_revenue += booking.settlement_amount || booking.total_amount || 0;
    }
    
    if (booking.payout_eligible) {
      summary.payout_eligible += booking.settlement_amount || booking.total_amount || 0;
    }

    // Outstanding liability = confirmed + stayed but not settled
    if (['confirmed', 'stayed', 'refund_pending'].includes(status)) {
      summary.outstanding_liability += booking.total_amount || 0;
    }
  });

  return summary;
}

/**
 * Get all bookings pending settlement
 */
export async function getPendingSettlements(
  propertyId?: string
): Promise<{ booking_id: string; booking_reference: string; status: SettlementStatus; amount: number; check_out: string }[]> {
  let query = supabase
    .from('bookings')
    .select('id, booking_id, settlement_status, total_amount, check_out')
    .in('settlement_status', ['stayed', 'no_show', 'refund_pending'])
    .order('check_out', { ascending: true });

  if (propertyId) {
    query = query.eq('property_id', propertyId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching pending settlements:', error);
    return [];
  }

  return data.map((b) => ({
    booking_id: b.id,
    booking_reference: b.booking_id,
    status: (b.settlement_status || 'initiated') as SettlementStatus,
    amount: b.total_amount || 0,
    check_out: b.check_out,
  }));
}

/**
 * Bulk settle multiple bookings
 */
export async function bulkSettle(
  bookingIds: string[],
  notes?: string
): Promise<{ success: number; failed: number; errors: string[] }> {
  const results = { success: 0, failed: 0, errors: [] as string[] };

  for (const bookingId of bookingIds) {
    const { data: booking } = await supabase
      .from('bookings')
      .select('id, booking_id, total_amount')
      .eq('id', bookingId)
      .single();

    if (!booking) {
      results.failed++;
      results.errors.push(`Booking ${bookingId} not found`);
      continue;
    }

    const result = await transitionSettlementStatus(
      booking.id,
      booking.booking_id,
      'settled',
      booking.total_amount || 0,
      notes || 'Bulk settlement'
    );

    if (result.success) {
      results.success++;
    } else {
      results.failed++;
      results.errors.push(`${booking.booking_id}: ${result.error}`);
    }
  }

  return results;
}

/**
 * Auto-transition bookings based on dates
 * - Check-out passed + confirmed → stayed
 * - Stayed for 24h+ → eligible for settlement
 */
export async function autoTransitionBookings(): Promise<{ transitioned: number; errors: string[] }> {
  const results = { transitioned: 0, errors: [] as string[] };
  const today = new Date().toISOString().split('T')[0];

  // Find confirmed bookings where check-out has passed
  const { data: confirmedBookings, error } = await supabase
    .from('bookings')
    .select('id, booking_id, check_out, total_amount')
    .eq('settlement_status', 'confirmed')
    .lt('check_out', today);

  if (error) {
    results.errors.push(`Query error: ${error.message}`);
    return results;
  }

  for (const booking of confirmedBookings || []) {
    const result = await transitionSettlementStatus(
      booking.id,
      booking.booking_id,
      'stayed',
      booking.total_amount || 0,
      'Auto-transitioned: check-out date passed'
    );

    if (result.success) {
      results.transitioned++;
    } else {
      results.errors.push(`${booking.booking_id}: ${result.error}`);
    }
  }

  return results;
}
