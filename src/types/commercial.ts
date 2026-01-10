// Commercial Readiness Types

// Settlement State Machine
export type SettlementStatus = 
  | 'initiated'
  | 'confirmed'
  | 'stayed'
  | 'cancelled'
  | 'no_show'
  | 'refund_pending'
  | 'refunded'
  | 'settled';

export interface SettlementTransition {
  from: SettlementStatus;
  to: SettlementStatus[];
  requiresApproval?: boolean;
  autoTransition?: boolean;
}

// Valid state transitions
export const SETTLEMENT_TRANSITIONS: Record<SettlementStatus, SettlementStatus[]> = {
  initiated: ['confirmed', 'cancelled'],
  confirmed: ['stayed', 'cancelled', 'no_show'],
  stayed: ['settled', 'refund_pending'],
  cancelled: ['refund_pending', 'refunded'],
  no_show: ['settled', 'refund_pending'],
  refund_pending: ['refunded'],
  refunded: ['settled'],
  settled: [], // Terminal state
};

export interface BookingSettlementHistory {
  id: string;
  booking_id: string;
  booking_reference: string;
  previous_status: SettlementStatus | null;
  new_status: SettlementStatus;
  amount: number;
  notes: string | null;
  actor_id: string | null;
  actor_role: 'admin' | 'franchise' | 'system';
  created_at: string;
}

// Idempotency
export type OperationType = 'payment' | 'booking_create' | 'ota_sync' | 'inventory_update';
export type IdempotencyStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface IdempotencyKey {
  id: string;
  idempotency_key: string;
  operation_type: OperationType;
  request_hash: string | null;
  status: IdempotencyStatus;
  result: Record<string, unknown> | null;
  error_message: string | null;
  booking_id: string | null;
  payment_id: string | null;
  property_id: string | null;
  expires_at: string;
  created_at: string;
  completed_at: string | null;
  retry_count: number;
  last_retry_at: string | null;
}

export interface IdempotencyCheckResult {
  exists: boolean;
  status: string;
  can_proceed: boolean;
  result?: Record<string, unknown>;
  message?: string;
  idempotency_id?: string;
}

// Channel Strategy
export type ChannelName = 'booking_com' | 'airbnb' | 'goibibo' | 'makemytrip' | 'agoda' | 'direct';
export type RateModifierType = 'none' | 'percent' | 'fixed';

export interface ChannelStrategy {
  id: string;
  property_id: string;
  channel_name: ChannelName;
  is_active: boolean;
  
  // Inventory controls
  inventory_cap_percent: number;
  inventory_cap_units: number | null;
  blackout_dates: string[];
  
  // Rate controls
  rate_modifier_type: RateModifierType;
  rate_modifier_value: number;
  min_rate: number | null;
  max_rate: number | null;
  
  // Performance metrics
  total_bookings: number;
  total_revenue: number;
  cancellation_count: number;
  cancellation_rate: number;
  avg_lead_time_days: number;
  conversion_rate: number;
  
  // Health scoring
  health_score: number;
  health_factors: HealthFactors;
  
  // Parity
  parity_check_enabled: boolean;
  last_parity_check: string | null;
  parity_violations: ParityViolation[];
  
  // Sync
  last_sync_at: string | null;
  sync_status: string;
  sync_error: string | null;
  
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export interface HealthFactors {
  conversion_score: number;
  cancellation_score: number;
  revenue_score: number;
  reliability_score: number;
}

export interface ParityViolation {
  detected_at: string;
  channel: string;
  our_rate: number;
  channel_rate: number;
  difference_percent: number;
}

// Demand Signals
export type DemandTrend = 'increasing' | 'stable' | 'decreasing';
export type ActionType = 'rate_increase' | 'rate_decrease' | 'close_ota' | 'open_ota' | 'none';
export type ConfidenceLevel = 'low' | 'medium' | 'high';

export interface DemandSignal {
  id: string;
  property_id: string;
  room_type_id: string | null;
  signal_date: string;
  
  // Occupancy signals
  occupancy_7d: number;
  occupancy_14d: number;
  occupancy_30d: number;
  occupancy_delta_7d: number;
  
  // Booking velocity
  bookings_last_24h: number;
  bookings_last_7d: number;
  booking_velocity_trend: DemandTrend;
  
  // Lead time
  avg_lead_time_days: number;
  lead_time_compression: boolean;
  
  // Day performance
  weekend_occupancy: number;
  weekday_occupancy: number;
  weekend_rate_premium: number;
  
  // Channel mix
  direct_booking_ratio: number;
  ota_booking_ratio: number;
  best_performing_channel: string | null;
  
  // Insights
  suggested_action: string | null;
  action_type: ActionType;
  confidence_level: ConfidenceLevel;
  confidence_score: number;
  
  // Response
  action_taken: boolean;
  action_taken_at: string | null;
  action_taken_by: string | null;
  action_notes: string | null;
  
  created_at: string;
  updated_at: string;
}

// Property Onboarding
export type PropertyType = 'hostel' | 'hotel' | 'homestay' | 'resort';
export type OnboardingStatus = 'pending' | 'in_progress' | 'completed' | 'live';

export interface OnboardingChecklist {
  basic_info: boolean;
  room_types: boolean;
  inventory: boolean;
  rates: boolean;
  photos: boolean;
  policies: boolean;
  payment_setup: boolean;
  tax_info: boolean;
  franchise_assigned: boolean;
  test_booking: boolean;
}

export interface PropertyOnboarding {
  id: string;
  property_id: string;
  property_type: PropertyType;
  template_applied: string | null;
  onboarding_status: OnboardingStatus;
  started_at: string | null;
  completed_at: string | null;
  first_booking_at: string | null;
  checklist: OnboardingChecklist;
  readiness_score: number;
  readiness_factors: Record<string, number>;
  minimum_readiness_met: boolean;
  base_rates_generated: boolean;
  inventory_scaffolded: boolean;
  default_policies_applied: boolean;
  blocking_issues: string[];
  warnings: string[];
  created_at: string;
  updated_at: string;
  completed_by: string | null;
}

export interface PropertyTemplate {
  id: string;
  template_name: string;
  property_type: PropertyType;
  description: string | null;
  default_room_types: DefaultRoomType[];
  default_base_rates: DefaultRates;
  default_policies: DefaultPolicies;
  default_inventory_days: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DefaultRoomType {
  name: string;
  capacity: number;
  base_price: number;
}

export interface DefaultRates {
  weekday: number;
  weekend: number;
  peak: number;
}

export interface DefaultPolicies {
  check_in_time: string;
  check_out_time: string;
  cancellation_policy: string;
  payment_terms: string;
}

// Audit Log Enhanced
export interface EnhancedAuditLog {
  id: string;
  action: string;
  table_name: string;
  record_id: string | null;
  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
  user_id: string | null;
  user_agent: string | null;
  actor_role: 'admin' | 'franchise' | 'system';
  property_id: string | null;
  snapshot_type: 'mutation' | 'rollback' | 'system';
  rollback_of: string | null;
  is_rollback: boolean;
  metadata: Record<string, unknown>;
  created_at: string;
}

// Settlement Summary
export interface SettlementSummary {
  property_id: string;
  property_name: string;
  total_bookings: number;
  initiated: number;
  confirmed: number;
  stayed: number;
  settled: number;
  cancelled: number;
  no_show: number;
  refund_pending: number;
  refunded: number;
  total_revenue: number;
  settled_revenue: number;
  outstanding_liability: number;
  payout_eligible: number;
}

// Channel Performance
export interface ChannelPerformance {
  channel_name: ChannelName;
  display_name: string;
  bookings: number;
  revenue: number;
  cancellations: number;
  cancellation_rate: number;
  avg_booking_value: number;
  conversion_rate: number;
  health_score: number;
  trend: 'up' | 'down' | 'stable';
}
