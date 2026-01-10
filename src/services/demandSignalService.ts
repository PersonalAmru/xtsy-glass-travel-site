// Demand Signal Service - Rule-Based Intelligence (No AI/ML)
import { supabase } from '@/integrations/supabase/client';
import { 
  DemandSignal, 
  DemandTrend, 
  ActionType, 
  ConfidenceLevel 
} from '@/types/commercial';

interface OccupancyMetrics {
  occupancy_7d: number;
  occupancy_14d: number;
  occupancy_30d: number;
  occupancy_delta_7d: number;
}

interface BookingVelocity {
  last_24h: number;
  last_7d: number;
  trend: DemandTrend;
}

interface DayPerformance {
  weekend_occupancy: number;
  weekday_occupancy: number;
  weekend_premium: number;
}

interface ChannelMix {
  direct_ratio: number;
  ota_ratio: number;
  best_channel: string | null;
}

/**
 * Get demand signals for a property
 */
export async function getDemandSignals(
  propertyId: string,
  days: number = 14
): Promise<DemandSignal[]> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabase
    .from('demand_signals')
    .select('*')
    .eq('property_id', propertyId)
    .gte('signal_date', startDate.toISOString().split('T')[0])
    .order('signal_date', { ascending: false });

  if (error) {
    console.error('Error fetching demand signals:', error);
    return [];
  }

  return data as DemandSignal[];
}

/**
 * Calculate occupancy metrics from bookings
 */
export async function calculateOccupancyMetrics(
  propertyId: string,
  totalUnits: number
): Promise<OccupancyMetrics> {
  const today = new Date();
  const dates = {
    day7: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    day14: new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    day30: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    prev7: new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  };

  // Get booking counts for each period
  const [result7d, result14d, result30d, resultPrev7d] = await Promise.all([
    supabase.from('bookings')
      .select('id', { count: 'exact' })
      .eq('property_id', propertyId)
      .gte('check_in', dates.day7)
      .in('booking_status', ['confirmed', 'approved']),
    supabase.from('bookings')
      .select('id', { count: 'exact' })
      .eq('property_id', propertyId)
      .gte('check_in', dates.day14)
      .in('booking_status', ['confirmed', 'approved']),
    supabase.from('bookings')
      .select('id', { count: 'exact' })
      .eq('property_id', propertyId)
      .gte('check_in', dates.day30)
      .in('booking_status', ['confirmed', 'approved']),
    supabase.from('bookings')
      .select('id', { count: 'exact' })
      .eq('property_id', propertyId)
      .gte('check_in', dates.prev7)
      .lt('check_in', dates.day7)
      .in('booking_status', ['confirmed', 'approved']),
  ]);

  const maxRoomNights7d = totalUnits * 7;
  const maxRoomNights14d = totalUnits * 14;
  const maxRoomNights30d = totalUnits * 30;

  const occupancy_7d = maxRoomNights7d > 0 
    ? ((result7d.count || 0) / maxRoomNights7d) * 100 
    : 0;
  const occupancy_14d = maxRoomNights14d > 0 
    ? ((result14d.count || 0) / maxRoomNights14d) * 100 
    : 0;
  const occupancy_30d = maxRoomNights30d > 0 
    ? ((result30d.count || 0) / maxRoomNights30d) * 100 
    : 0;

  const prevOccupancy7d = maxRoomNights7d > 0 
    ? ((resultPrev7d.count || 0) / maxRoomNights7d) * 100 
    : 0;
  
  const occupancy_delta_7d = occupancy_7d - prevOccupancy7d;

  return {
    occupancy_7d: Math.round(occupancy_7d * 100) / 100,
    occupancy_14d: Math.round(occupancy_14d * 100) / 100,
    occupancy_30d: Math.round(occupancy_30d * 100) / 100,
    occupancy_delta_7d: Math.round(occupancy_delta_7d * 100) / 100,
  };
}

/**
 * Calculate booking velocity
 */
export async function calculateBookingVelocity(
  propertyId: string
): Promise<BookingVelocity> {
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const prevWeek = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString();

  const [result24h, result7d, resultPrev7d] = await Promise.all([
    supabase.from('bookings')
      .select('id', { count: 'exact' })
      .eq('property_id', propertyId)
      .gte('created_at', yesterday),
    supabase.from('bookings')
      .select('id', { count: 'exact' })
      .eq('property_id', propertyId)
      .gte('created_at', lastWeek),
    supabase.from('bookings')
      .select('id', { count: 'exact' })
      .eq('property_id', propertyId)
      .gte('created_at', prevWeek)
      .lt('created_at', lastWeek),
  ]);

  const last_24h = result24h.count || 0;
  const last_7d = result7d.count || 0;
  const prev_7d = resultPrev7d.count || 0;

  let trend: DemandTrend = 'stable';
  if (last_7d > prev_7d * 1.2) trend = 'increasing';
  else if (last_7d < prev_7d * 0.8) trend = 'decreasing';

  return { last_24h, last_7d, trend };
}

/**
 * Calculate day-of-week performance
 */
export async function calculateDayPerformance(
  propertyId: string
): Promise<DayPerformance> {
  const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const { data: bookings } = await supabase
    .from('bookings')
    .select('check_in, total_amount')
    .eq('property_id', propertyId)
    .gte('check_in', last30Days)
    .in('booking_status', ['confirmed', 'approved']);

  let weekendBookings = 0;
  let weekdayBookings = 0;
  let weekendRevenue = 0;
  let weekdayRevenue = 0;

  (bookings || []).forEach((b) => {
    const dayOfWeek = new Date(b.check_in).getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6 || dayOfWeek === 5;

    if (isWeekend) {
      weekendBookings++;
      weekendRevenue += b.total_amount || 0;
    } else {
      weekdayBookings++;
      weekdayRevenue += b.total_amount || 0;
    }
  });

  const weekendAvg = weekendBookings > 0 ? weekendRevenue / weekendBookings : 0;
  const weekdayAvg = weekdayBookings > 0 ? weekdayRevenue / weekdayBookings : 0;
  const premium = weekdayAvg > 0 ? ((weekendAvg - weekdayAvg) / weekdayAvg) * 100 : 0;

  return {
    weekend_occupancy: weekendBookings,
    weekday_occupancy: weekdayBookings,
    weekend_premium: Math.round(premium * 100) / 100,
  };
}

/**
 * Calculate channel mix
 */
export async function calculateChannelMix(
  propertyId: string
): Promise<ChannelMix> {
  const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const { data: bookings } = await supabase
    .from('bookings')
    .select('source, total_amount')
    .eq('property_id', propertyId)
    .gte('check_in', last30Days)
    .in('booking_status', ['confirmed', 'approved']);

  let directCount = 0;
  let otaCount = 0;
  const channelRevenue: Record<string, number> = {};

  (bookings || []).forEach((b) => {
    const source = b.source || 'direct';
    if (source === 'direct') {
      directCount++;
    } else {
      otaCount++;
    }
    channelRevenue[source] = (channelRevenue[source] || 0) + (b.total_amount || 0);
  });

  const total = directCount + otaCount;
  const direct_ratio = total > 0 ? (directCount / total) * 100 : 0;
  const ota_ratio = total > 0 ? (otaCount / total) * 100 : 0;

  // Find best performing channel by revenue
  let best_channel: string | null = null;
  let maxRevenue = 0;
  Object.entries(channelRevenue).forEach(([channel, revenue]) => {
    if (revenue > maxRevenue) {
      maxRevenue = revenue;
      best_channel = channel;
    }
  });

  return {
    direct_ratio: Math.round(direct_ratio * 100) / 100,
    ota_ratio: Math.round(ota_ratio * 100) / 100,
    best_channel,
  };
}

/**
 * Generate suggested action based on signals
 */
export function generateSuggestedAction(
  occupancy: OccupancyMetrics,
  velocity: BookingVelocity,
  channelMix: ChannelMix
): { action: string; type: ActionType; confidence: ConfidenceLevel; score: number } {
  let action = '';
  let type: ActionType = 'none';
  let confidence: ConfidenceLevel = 'low';
  let score = 0;

  // High occupancy + increasing velocity = suggest rate increase
  if (occupancy.occupancy_7d >= 85 && velocity.trend === 'increasing') {
    action = `Occupancy at ${occupancy.occupancy_7d}% with increasing demand. Consider raising rates by 10-15%.`;
    type = 'rate_increase';
    confidence = 'high';
    score = 85;
  }
  // High occupancy = consider closing OTAs
  else if (occupancy.occupancy_7d >= 90) {
    action = `Occupancy at ${occupancy.occupancy_7d}%. Consider closing OTA inventory to prioritize direct bookings.`;
    type = 'close_ota';
    confidence = 'medium';
    score = 70;
  }
  // Low occupancy + decreasing velocity = suggest rate decrease
  else if (occupancy.occupancy_7d <= 40 && velocity.trend === 'decreasing') {
    action = `Occupancy at ${occupancy.occupancy_7d}% with declining demand. Consider promotional rates.`;
    type = 'rate_decrease';
    confidence = 'medium';
    score = 65;
  }
  // Low direct ratio = suggest OTA optimization
  else if (channelMix.direct_ratio < 30 && channelMix.ota_ratio > 70) {
    action = `Only ${channelMix.direct_ratio}% direct bookings. Consider promoting direct booking incentives.`;
    type = 'none';
    confidence = 'low';
    score = 40;
  }
  // Stable performance
  else {
    action = 'Performance is stable. No immediate action recommended.';
    type = 'none';
    confidence = 'low';
    score = 30;
  }

  return { action, type, confidence, score };
}

/**
 * Compute and store demand signal for a property
 */
export async function computeDemandSignal(
  propertyId: string,
  totalUnits: number = 10
): Promise<{ success: boolean; signal?: DemandSignal; error?: string }> {
  try {
    const [occupancy, velocity, dayPerf, channelMix] = await Promise.all([
      calculateOccupancyMetrics(propertyId, totalUnits),
      calculateBookingVelocity(propertyId),
      calculateDayPerformance(propertyId),
      calculateChannelMix(propertyId),
    ]);

    const suggestion = generateSuggestedAction(occupancy, velocity, channelMix);
    const today = new Date().toISOString().split('T')[0];

    const signalData = {
      property_id: propertyId,
      signal_date: today,
      occupancy_7d: occupancy.occupancy_7d,
      occupancy_14d: occupancy.occupancy_14d,
      occupancy_30d: occupancy.occupancy_30d,
      occupancy_delta_7d: occupancy.occupancy_delta_7d,
      bookings_last_24h: velocity.last_24h,
      bookings_last_7d: velocity.last_7d,
      booking_velocity_trend: velocity.trend,
      weekend_occupancy: dayPerf.weekend_occupancy,
      weekday_occupancy: dayPerf.weekday_occupancy,
      weekend_rate_premium: dayPerf.weekend_premium,
      direct_booking_ratio: channelMix.direct_ratio,
      ota_booking_ratio: channelMix.ota_ratio,
      best_performing_channel: channelMix.best_channel,
      suggested_action: suggestion.action,
      action_type: suggestion.type,
      confidence_level: suggestion.confidence,
      confidence_score: suggestion.score,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('demand_signals')
      .upsert(signalData, { onConflict: 'property_id,room_type_id,signal_date' })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, signal: data as DemandSignal };
  } catch (err) {
    console.error('Compute demand signal error:', err);
    return { success: false, error: 'Failed to compute demand signal' };
  }
}

/**
 * Mark action as taken on a demand signal
 */
export async function markActionTaken(
  signalId: string,
  notes?: string
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('demand_signals')
    .update({
      action_taken: true,
      action_taken_at: new Date().toISOString(),
      action_notes: notes || null,
    })
    .eq('id', signalId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}
