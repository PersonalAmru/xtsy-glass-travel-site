// Channel Strategy Service for OTA Controls
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';
import { 
  ChannelStrategy, 
  ChannelName, 
  ChannelPerformance,
  HealthFactors,
  ParityViolation
} from '@/types/commercial';

const CHANNEL_DISPLAY_NAMES: Record<ChannelName, string> = {
  booking_com: 'Booking.com',
  airbnb: 'Airbnb',
  goibibo: 'Goibibo',
  makemytrip: 'MakeMyTrip',
  agoda: 'Agoda',
  direct: 'Direct Booking'
};

/**
 * Get all channel strategies for a property
 */
export async function getChannelStrategies(
  propertyId: string
): Promise<ChannelStrategy[]> {
  const { data, error } = await supabase
    .from('channel_strategy')
    .select('*')
    .eq('property_id', propertyId)
    .order('channel_name');

  if (error) {
    console.error('Error fetching channel strategies:', error);
    return [];
  }

  return (data || []).map(d => ({
    ...d,
    blackout_dates: (d.blackout_dates || []) as unknown as string[],
    health_factors: (d.health_factors || {}) as unknown as HealthFactors,
    parity_violations: (d.parity_violations || []) as unknown as ParityViolation[],
  })) as ChannelStrategy[];
}

/**
 * Create or update channel strategy
 */
export async function upsertChannelStrategy(
  strategy: Partial<ChannelStrategy> & { property_id: string; channel_name: ChannelName }
): Promise<{ success: boolean; error?: string }> {
  const { health_factors, parity_violations, blackout_dates, ...rest } = strategy;
  const { error } = await supabase
    .from('channel_strategy')
    .upsert({
      ...rest,
      health_factors: (health_factors || null) as unknown as Json,
      parity_violations: (parity_violations || null) as unknown as Json,
      blackout_dates: (blackout_dates || null) as unknown as Json,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'property_id,channel_name'
    });

  if (error) {
    console.error('Error upserting channel strategy:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Update inventory cap for a channel
 */
export async function updateInventoryCap(
  propertyId: string,
  channelName: ChannelName,
  capPercent: number,
  capUnits?: number
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('channel_strategy')
    .update({
      inventory_cap_percent: Math.min(100, Math.max(0, capPercent)),
      inventory_cap_units: capUnits || null,
      updated_at: new Date().toISOString()
    })
    .eq('property_id', propertyId)
    .eq('channel_name', channelName);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Update rate modifier for a channel
 */
export async function updateRateModifier(
  propertyId: string,
  channelName: ChannelName,
  modifierType: 'none' | 'percent' | 'fixed',
  modifierValue: number
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('channel_strategy')
    .update({
      rate_modifier_type: modifierType,
      rate_modifier_value: modifierValue,
      updated_at: new Date().toISOString()
    })
    .eq('property_id', propertyId)
    .eq('channel_name', channelName);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Toggle channel active status
 */
export async function toggleChannelStatus(
  propertyId: string,
  channelName: ChannelName,
  isActive: boolean
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('channel_strategy')
    .update({
      is_active: isActive,
      updated_at: new Date().toISOString()
    })
    .eq('property_id', propertyId)
    .eq('channel_name', channelName);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Calculate channel health score
 */
export function calculateHealthScore(metrics: {
  conversion_rate: number;
  cancellation_rate: number;
  avg_booking_value: number;
  target_booking_value: number;
  sync_failures: number;
}): { score: number; factors: HealthFactors } {
  // Conversion score (0-25): Higher is better
  const conversionScore = Math.min(25, (metrics.conversion_rate / 5) * 25);
  
  // Cancellation score (0-25): Lower is better
  const cancellationScore = Math.max(0, 25 - (metrics.cancellation_rate * 2.5));
  
  // Revenue score (0-25): Compare to target
  const revenueRatio = metrics.avg_booking_value / metrics.target_booking_value;
  const revenueScore = Math.min(25, revenueRatio * 25);
  
  // Reliability score (0-25): Fewer sync failures is better
  const reliabilityScore = Math.max(0, 25 - (metrics.sync_failures * 5));

  const factors: HealthFactors = {
    conversion_score: Math.round(conversionScore),
    cancellation_score: Math.round(cancellationScore),
    revenue_score: Math.round(revenueScore),
    reliability_score: Math.round(reliabilityScore)
  };

  const totalScore = Math.round(
    conversionScore + cancellationScore + revenueScore + reliabilityScore
  );

  return { score: totalScore, factors };
}

/**
 * Get channel performance summary
 */
export async function getChannelPerformance(
  propertyId: string
): Promise<ChannelPerformance[]> {
  const strategies = await getChannelStrategies(propertyId);
  
  return strategies.map((s) => {
    const avgBookingValue = s.total_bookings > 0 
      ? s.total_revenue / s.total_bookings 
      : 0;

    // Determine trend based on recent performance
    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (s.health_score > 80) trend = 'up';
    else if (s.health_score < 50) trend = 'down';

    return {
      channel_name: s.channel_name as ChannelName,
      display_name: CHANNEL_DISPLAY_NAMES[s.channel_name as ChannelName] || s.channel_name,
      bookings: s.total_bookings,
      revenue: s.total_revenue,
      cancellations: s.cancellation_count,
      cancellation_rate: s.cancellation_rate,
      avg_booking_value: avgBookingValue,
      conversion_rate: s.conversion_rate,
      health_score: s.health_score,
      trend
    };
  });
}

/**
 * Add blackout dates for a channel
 */
export async function addBlackoutDates(
  propertyId: string,
  channelName: ChannelName,
  dates: string[]
): Promise<{ success: boolean; error?: string }> {
  // Get current blackout dates
  const { data: current, error: fetchError } = await supabase
    .from('channel_strategy')
    .select('blackout_dates')
    .eq('property_id', propertyId)
    .eq('channel_name', channelName)
    .single();

  if (fetchError) {
    return { success: false, error: fetchError.message };
  }

  const existingDates = (current?.blackout_dates as string[]) || [];
  const newDates = [...new Set([...existingDates, ...dates])];

  const { error } = await supabase
    .from('channel_strategy')
    .update({
      blackout_dates: newDates,
      updated_at: new Date().toISOString()
    })
    .eq('property_id', propertyId)
    .eq('channel_name', channelName);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Check rate parity across channels
 */
export async function checkRateParity(
  propertyId: string,
  baseRate: number
): Promise<{ violations: { channel: string; rate: number; difference: number }[] }> {
  const strategies = await getChannelStrategies(propertyId);
  const violations: { channel: string; rate: number; difference: number }[] = [];

  for (const strategy of strategies) {
    if (!strategy.parity_check_enabled) continue;

    let channelRate = baseRate;
    
    if (strategy.rate_modifier_type === 'percent') {
      channelRate = baseRate * (1 + strategy.rate_modifier_value / 100);
    } else if (strategy.rate_modifier_type === 'fixed') {
      channelRate = baseRate + strategy.rate_modifier_value;
    }

    // Check if rate is within acceptable range (±5%)
    const acceptableMin = baseRate * 0.95;
    const acceptableMax = baseRate * 1.05;

    if (channelRate < acceptableMin || channelRate > acceptableMax) {
      violations.push({
        channel: CHANNEL_DISPLAY_NAMES[strategy.channel_name as ChannelName] || strategy.channel_name,
        rate: channelRate,
        difference: ((channelRate - baseRate) / baseRate) * 100
      });
    }
  }

  return { violations };
}

/**
 * Initialize default channels for a new property
 */
export async function initializeDefaultChannels(
  propertyId: string
): Promise<{ success: boolean; error?: string }> {
  const defaultChannels: ChannelName[] = ['direct', 'booking_com', 'airbnb', 'goibibo', 'makemytrip'];
  
  for (const channel of defaultChannels) {
    const { error } = await supabase
      .from('channel_strategy')
      .insert({
        property_id: propertyId,
        channel_name: channel,
        is_active: channel === 'direct', // Only direct active by default
        inventory_cap_percent: 100,
        rate_modifier_type: 'none',
        rate_modifier_value: 0,
        health_score: 100
      });

    if (error && !error.message.includes('duplicate')) {
      console.error(`Error creating ${channel} strategy:`, error);
    }
  }

  return { success: true };
}
