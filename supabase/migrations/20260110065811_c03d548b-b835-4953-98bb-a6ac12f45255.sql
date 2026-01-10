
-- =====================================================
-- PHASE 1: COMMERCIAL READINESS DATABASE MIGRATIONS
-- =====================================================

-- 1. ENHANCED AUDIT LOGS
-- Add new columns to existing audit_logs table
ALTER TABLE public.audit_logs 
ADD COLUMN IF NOT EXISTS actor_role text DEFAULT 'system',
ADD COLUMN IF NOT EXISTS property_id uuid,
ADD COLUMN IF NOT EXISTS snapshot_type text DEFAULT 'mutation',
ADD COLUMN IF NOT EXISTS rollback_of uuid REFERENCES public.audit_logs(id),
ADD COLUMN IF NOT EXISTS is_rollback boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb;

-- Create index for property-based queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_property_id ON public.audit_logs(property_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);

-- 2. BOOKING SETTLEMENT STATUS
-- Create enum for settlement states
DO $$ BEGIN
    CREATE TYPE booking_settlement_status AS ENUM (
        'initiated',
        'confirmed',
        'stayed',
        'cancelled',
        'no_show',
        'refund_pending',
        'refunded',
        'settled'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add settlement tracking columns to bookings
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS settlement_status text DEFAULT 'initiated',
ADD COLUMN IF NOT EXISTS settlement_amount numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS refund_amount numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS settled_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS settled_by uuid,
ADD COLUMN IF NOT EXISTS payout_eligible boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS payout_released_at timestamp with time zone;

-- Create settlement history table
CREATE TABLE IF NOT EXISTS public.booking_settlement_history (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_id uuid NOT NULL,
    booking_reference text NOT NULL,
    previous_status text,
    new_status text NOT NULL,
    amount numeric DEFAULT 0,
    notes text,
    actor_id uuid,
    actor_role text DEFAULT 'system',
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on settlement history
ALTER TABLE public.booking_settlement_history ENABLE ROW LEVEL SECURITY;

-- RLS policies for settlement history
CREATE POLICY "settlement_history_admin_full_access" ON public.booking_settlement_history
FOR ALL USING (
    (get_user_role() = ANY (ARRAY['admin'::text, 'staff'::text])) 
    OR (auth.role() = 'service_role'::text)
)
WITH CHECK (
    (get_user_role() = ANY (ARRAY['admin'::text, 'staff'::text])) 
    OR (auth.role() = 'service_role'::text)
);

CREATE POLICY "settlement_history_deny_public" ON public.booking_settlement_history
FOR ALL USING (false) WITH CHECK (false);

CREATE POLICY "settlement_history_franchise_read" ON public.booking_settlement_history
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.bookings b
        JOIN public.franchise_assignments fa ON fa.property_id = b.property_id
        WHERE b.booking_id = booking_reference
        AND fa.user_id = auth.uid()
        AND fa.is_active = true
    )
);

-- 3. IDEMPOTENCY KEYS TABLE
CREATE TABLE IF NOT EXISTS public.idempotency_keys (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    idempotency_key text NOT NULL UNIQUE,
    operation_type text NOT NULL, -- 'payment', 'booking_create', 'ota_sync', 'inventory_update'
    request_hash text, -- Hash of the request payload
    status text NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
    result jsonb,
    error_message text,
    booking_id text,
    payment_id text,
    property_id uuid,
    expires_at timestamp with time zone NOT NULL DEFAULT (now() + interval '24 hours'),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    completed_at timestamp with time zone,
    retry_count integer DEFAULT 0,
    last_retry_at timestamp with time zone
);

-- Indexes for idempotency
CREATE INDEX IF NOT EXISTS idx_idempotency_key ON public.idempotency_keys(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_idempotency_expires ON public.idempotency_keys(expires_at);
CREATE INDEX IF NOT EXISTS idx_idempotency_status ON public.idempotency_keys(status);

-- Enable RLS
ALTER TABLE public.idempotency_keys ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "idempotency_service_role_all" ON public.idempotency_keys
FOR ALL USING (auth.role() = 'service_role'::text)
WITH CHECK (auth.role() = 'service_role'::text);

CREATE POLICY "idempotency_admin_read" ON public.idempotency_keys
FOR SELECT USING (is_admin_or_staff());

CREATE POLICY "idempotency_deny_public" ON public.idempotency_keys
FOR ALL USING (false) WITH CHECK (false);

-- 4. CHANNEL STRATEGY TABLE
CREATE TABLE IF NOT EXISTS public.channel_strategy (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    property_id uuid NOT NULL,
    channel_name text NOT NULL, -- 'booking_com', 'airbnb', 'goibibo', 'makemytrip', 'direct'
    is_active boolean DEFAULT true,
    
    -- Inventory controls
    inventory_cap_percent integer DEFAULT 100, -- Max % of inventory available to this channel
    inventory_cap_units integer, -- Hard cap on units
    blackout_dates jsonb DEFAULT '[]'::jsonb,
    
    -- Rate controls
    rate_modifier_type text DEFAULT 'none', -- 'none', 'percent', 'fixed'
    rate_modifier_value numeric DEFAULT 0,
    min_rate numeric,
    max_rate numeric,
    
    -- Performance metrics (updated by system)
    total_bookings integer DEFAULT 0,
    total_revenue numeric DEFAULT 0,
    cancellation_count integer DEFAULT 0,
    cancellation_rate numeric DEFAULT 0,
    avg_lead_time_days integer DEFAULT 0,
    conversion_rate numeric DEFAULT 0,
    
    -- Health scoring
    health_score integer DEFAULT 100, -- 0-100
    health_factors jsonb DEFAULT '{}'::jsonb,
    
    -- Parity warnings
    parity_check_enabled boolean DEFAULT true,
    last_parity_check timestamp with time zone,
    parity_violations jsonb DEFAULT '[]'::jsonb,
    
    -- Sync status
    last_sync_at timestamp with time zone,
    sync_status text DEFAULT 'pending',
    sync_error text,
    
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    created_by uuid,
    
    UNIQUE(property_id, channel_name)
);

-- Enable RLS
ALTER TABLE public.channel_strategy ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "channel_strategy_admin_full" ON public.channel_strategy
FOR ALL USING (
    (get_user_role() = ANY (ARRAY['admin'::text, 'staff'::text])) 
    OR (auth.role() = 'service_role'::text)
)
WITH CHECK (
    (get_user_role() = ANY (ARRAY['admin'::text, 'staff'::text])) 
    OR (auth.role() = 'service_role'::text)
);

CREATE POLICY "channel_strategy_franchise_read" ON public.channel_strategy
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.franchise_assignments fa
        WHERE fa.property_id = channel_strategy.property_id
        AND fa.user_id = auth.uid()
        AND fa.is_active = true
    )
);

CREATE POLICY "channel_strategy_deny_public" ON public.channel_strategy
FOR ALL USING (false) WITH CHECK (false);

-- 5. DEMAND SIGNALS TABLE
CREATE TABLE IF NOT EXISTS public.demand_signals (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    property_id uuid NOT NULL,
    room_type_id text,
    signal_date date NOT NULL,
    
    -- Occupancy signals
    occupancy_7d numeric DEFAULT 0,
    occupancy_14d numeric DEFAULT 0,
    occupancy_30d numeric DEFAULT 0,
    occupancy_delta_7d numeric DEFAULT 0, -- Change vs previous period
    
    -- Booking velocity
    bookings_last_24h integer DEFAULT 0,
    bookings_last_7d integer DEFAULT 0,
    booking_velocity_trend text DEFAULT 'stable', -- 'increasing', 'stable', 'decreasing'
    
    -- Lead time analysis
    avg_lead_time_days integer DEFAULT 0,
    lead_time_compression boolean DEFAULT false, -- True if lead times shrinking
    
    -- Day performance
    weekend_occupancy numeric DEFAULT 0,
    weekday_occupancy numeric DEFAULT 0,
    weekend_rate_premium numeric DEFAULT 0,
    
    -- Channel mix
    direct_booking_ratio numeric DEFAULT 0,
    ota_booking_ratio numeric DEFAULT 0,
    best_performing_channel text,
    
    -- Computed insights
    suggested_action text,
    action_type text, -- 'rate_increase', 'rate_decrease', 'close_ota', 'open_ota', 'none'
    confidence_level text DEFAULT 'low', -- 'low', 'medium', 'high'
    confidence_score numeric DEFAULT 0,
    
    -- Admin response
    action_taken boolean DEFAULT false,
    action_taken_at timestamp with time zone,
    action_taken_by uuid,
    action_notes text,
    
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    
    UNIQUE(property_id, room_type_id, signal_date)
);

-- Enable RLS
ALTER TABLE public.demand_signals ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "demand_signals_admin_full" ON public.demand_signals
FOR ALL USING (
    (get_user_role() = ANY (ARRAY['admin'::text, 'staff'::text])) 
    OR (auth.role() = 'service_role'::text)
)
WITH CHECK (
    (get_user_role() = ANY (ARRAY['admin'::text, 'staff'::text])) 
    OR (auth.role() = 'service_role'::text)
);

CREATE POLICY "demand_signals_franchise_read" ON public.demand_signals
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.franchise_assignments fa
        WHERE fa.property_id = demand_signals.property_id
        AND fa.user_id = auth.uid()
        AND fa.is_active = true
    )
);

CREATE POLICY "demand_signals_deny_public" ON public.demand_signals
FOR ALL USING (false) WITH CHECK (false);

-- 6. PROPERTY ONBOARDING TABLE
CREATE TABLE IF NOT EXISTS public.property_onboarding (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    property_id uuid NOT NULL UNIQUE,
    
    -- Template info
    property_type text NOT NULL DEFAULT 'hostel', -- 'hostel', 'hotel', 'homestay', 'resort'
    template_applied text,
    
    -- Onboarding progress
    onboarding_status text DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'live'
    started_at timestamp with time zone,
    completed_at timestamp with time zone,
    first_booking_at timestamp with time zone,
    
    -- Checklist items (jsonb for flexibility)
    checklist jsonb DEFAULT '{
        "basic_info": false,
        "room_types": false,
        "inventory": false,
        "rates": false,
        "photos": false,
        "policies": false,
        "payment_setup": false,
        "tax_info": false,
        "franchise_assigned": false,
        "test_booking": false
    }'::jsonb,
    
    -- Readiness scoring
    readiness_score integer DEFAULT 0, -- 0-100
    readiness_factors jsonb DEFAULT '{}'::jsonb,
    minimum_readiness_met boolean DEFAULT false,
    
    -- Auto-generated defaults
    base_rates_generated boolean DEFAULT false,
    inventory_scaffolded boolean DEFAULT false,
    default_policies_applied boolean DEFAULT false,
    
    -- Blocking issues
    blocking_issues jsonb DEFAULT '[]'::jsonb,
    warnings jsonb DEFAULT '[]'::jsonb,
    
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    completed_by uuid
);

-- Enable RLS
ALTER TABLE public.property_onboarding ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "onboarding_admin_full" ON public.property_onboarding
FOR ALL USING (
    (get_user_role() = ANY (ARRAY['admin'::text, 'staff'::text])) 
    OR (auth.role() = 'service_role'::text)
)
WITH CHECK (
    (get_user_role() = ANY (ARRAY['admin'::text, 'staff'::text])) 
    OR (auth.role() = 'service_role'::text)
);

CREATE POLICY "onboarding_franchise_read" ON public.property_onboarding
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.franchise_assignments fa
        WHERE fa.property_id = property_onboarding.property_id
        AND fa.user_id = auth.uid()
        AND fa.is_active = true
    )
);

CREATE POLICY "onboarding_deny_public" ON public.property_onboarding
FOR ALL USING (false) WITH CHECK (false);

-- 7. PROPERTY TEMPLATES TABLE
CREATE TABLE IF NOT EXISTS public.property_templates (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    template_name text NOT NULL UNIQUE,
    property_type text NOT NULL, -- 'hostel', 'hotel', 'homestay', 'resort'
    description text,
    
    -- Default room types to create
    default_room_types jsonb NOT NULL DEFAULT '[]'::jsonb,
    
    -- Default rate structure
    default_base_rates jsonb DEFAULT '{}'::jsonb,
    default_weekend_markup numeric DEFAULT 0,
    default_holiday_markup numeric DEFAULT 0,
    
    -- Default policies
    default_policies jsonb DEFAULT '{
        "check_in_time": "14:00",
        "check_out_time": "11:00",
        "cancellation_policy": "flexible",
        "payment_terms": "pay_at_property"
    }'::jsonb,
    
    -- Default inventory setup
    default_inventory_days integer DEFAULT 90,
    
    is_active boolean DEFAULT true,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.property_templates ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "templates_admin_full" ON public.property_templates
FOR ALL USING (
    (get_user_role() = ANY (ARRAY['admin'::text, 'staff'::text])) 
    OR (auth.role() = 'service_role'::text)
)
WITH CHECK (
    (get_user_role() = ANY (ARRAY['admin'::text, 'staff'::text])) 
    OR (auth.role() = 'service_role'::text)
);

CREATE POLICY "templates_public_read" ON public.property_templates
FOR SELECT USING (is_active = true);

-- Insert default templates
INSERT INTO public.property_templates (template_name, property_type, description, default_room_types, default_base_rates)
VALUES 
    ('Hostel Standard', 'hostel', 'Standard hostel with dorms and private rooms', 
     '[{"name": "4-Bed Mixed Dorm", "capacity": 4, "base_price": 500}, {"name": "6-Bed Mixed Dorm", "capacity": 6, "base_price": 400}, {"name": "Private Double", "capacity": 2, "base_price": 1500}]'::jsonb,
     '{"weekday": 1.0, "weekend": 1.2, "peak": 1.5}'::jsonb),
    ('Boutique Hotel', 'hotel', 'Boutique hotel with varied room categories',
     '[{"name": "Standard Room", "capacity": 2, "base_price": 2500}, {"name": "Deluxe Room", "capacity": 2, "base_price": 3500}, {"name": "Suite", "capacity": 4, "base_price": 5000}]'::jsonb,
     '{"weekday": 1.0, "weekend": 1.15, "peak": 1.4}'::jsonb),
    ('Homestay Basic', 'homestay', 'Basic homestay with limited rooms',
     '[{"name": "Guest Room", "capacity": 2, "base_price": 1200}, {"name": "Family Room", "capacity": 4, "base_price": 2000}]'::jsonb,
     '{"weekday": 1.0, "weekend": 1.1, "peak": 1.3}'::jsonb)
ON CONFLICT (template_name) DO NOTHING;

-- 8. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_settlement_history_booking ON public.booking_settlement_history(booking_id);
CREATE INDEX IF NOT EXISTS idx_settlement_history_created ON public.booking_settlement_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_channel_strategy_property ON public.channel_strategy(property_id);
CREATE INDEX IF NOT EXISTS idx_demand_signals_property_date ON public.demand_signals(property_id, signal_date DESC);
CREATE INDEX IF NOT EXISTS idx_onboarding_status ON public.property_onboarding(onboarding_status);
CREATE INDEX IF NOT EXISTS idx_bookings_settlement ON public.bookings(settlement_status);

-- 9. FUNCTION: Record Settlement State Change
CREATE OR REPLACE FUNCTION public.record_settlement_transition(
    p_booking_id uuid,
    p_booking_reference text,
    p_new_status text,
    p_amount numeric DEFAULT 0,
    p_notes text DEFAULT NULL,
    p_actor_id uuid DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_previous_status text;
    v_history_id uuid;
    v_actor_role text;
BEGIN
    -- Get current status
    SELECT settlement_status INTO v_previous_status
    FROM public.bookings
    WHERE id = p_booking_id;
    
    -- Determine actor role
    SELECT COALESCE(
        (SELECT 'admin' FROM public.profiles WHERE id = p_actor_id AND role IN ('admin', 'staff')),
        (SELECT 'franchise' FROM public.franchise_assignments WHERE user_id = p_actor_id AND is_active),
        'system'
    ) INTO v_actor_role;
    
    -- Update booking
    UPDATE public.bookings
    SET 
        settlement_status = p_new_status,
        settlement_amount = CASE WHEN p_new_status = 'settled' THEN p_amount ELSE settlement_amount END,
        settled_at = CASE WHEN p_new_status = 'settled' THEN now() ELSE settled_at END,
        settled_by = CASE WHEN p_new_status = 'settled' THEN p_actor_id ELSE settled_by END,
        payout_eligible = CASE WHEN p_new_status = 'settled' THEN true ELSE payout_eligible END,
        updated_at = now()
    WHERE id = p_booking_id;
    
    -- Record history
    INSERT INTO public.booking_settlement_history (
        booking_id, booking_reference, previous_status, new_status, 
        amount, notes, actor_id, actor_role
    )
    VALUES (
        p_booking_id, p_booking_reference, v_previous_status, p_new_status,
        p_amount, p_notes, p_actor_id, v_actor_role
    )
    RETURNING id INTO v_history_id;
    
    RETURN v_history_id;
END;
$$;

-- 10. FUNCTION: Check Idempotency
CREATE OR REPLACE FUNCTION public.check_idempotency(
    p_key text,
    p_operation_type text,
    p_request_hash text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_existing record;
BEGIN
    -- Check for existing key
    SELECT * INTO v_existing
    FROM public.idempotency_keys
    WHERE idempotency_key = p_key
    AND expires_at > now();
    
    IF FOUND THEN
        -- Return existing result if completed
        IF v_existing.status = 'completed' THEN
            RETURN jsonb_build_object(
                'exists', true,
                'status', v_existing.status,
                'result', v_existing.result,
                'can_proceed', false
            );
        ELSIF v_existing.status = 'processing' THEN
            RETURN jsonb_build_object(
                'exists', true,
                'status', 'processing',
                'can_proceed', false,
                'message', 'Operation already in progress'
            );
        ELSIF v_existing.status = 'failed' AND v_existing.retry_count < 3 THEN
            -- Allow retry
            UPDATE public.idempotency_keys
            SET status = 'processing', 
                retry_count = retry_count + 1,
                last_retry_at = now()
            WHERE id = v_existing.id;
            
            RETURN jsonb_build_object(
                'exists', true,
                'status', 'retrying',
                'can_proceed', true,
                'idempotency_id', v_existing.id
            );
        END IF;
    END IF;
    
    -- Create new idempotency record
    INSERT INTO public.idempotency_keys (
        idempotency_key, operation_type, request_hash, status
    )
    VALUES (p_key, p_operation_type, p_request_hash, 'processing')
    ON CONFLICT (idempotency_key) DO UPDATE
    SET status = 'processing', last_retry_at = now()
    RETURNING id INTO v_existing;
    
    RETURN jsonb_build_object(
        'exists', false,
        'status', 'new',
        'can_proceed', true,
        'idempotency_id', v_existing.id
    );
END;
$$;

-- 11. FUNCTION: Calculate Property Readiness Score
CREATE OR REPLACE FUNCTION public.calculate_readiness_score(p_property_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_score integer := 0;
    v_checklist jsonb;
    v_room_count integer;
    v_inventory_count integer;
BEGIN
    -- Get checklist
    SELECT checklist INTO v_checklist
    FROM public.property_onboarding
    WHERE property_id = p_property_id;
    
    IF v_checklist IS NULL THEN
        RETURN 0;
    END IF;
    
    -- Score each checklist item (10 points each, 100 total)
    IF (v_checklist->>'basic_info')::boolean THEN v_score := v_score + 10; END IF;
    IF (v_checklist->>'room_types')::boolean THEN v_score := v_score + 15; END IF;
    IF (v_checklist->>'inventory')::boolean THEN v_score := v_score + 15; END IF;
    IF (v_checklist->>'rates')::boolean THEN v_score := v_score + 15; END IF;
    IF (v_checklist->>'photos')::boolean THEN v_score := v_score + 10; END IF;
    IF (v_checklist->>'policies')::boolean THEN v_score := v_score + 10; END IF;
    IF (v_checklist->>'payment_setup')::boolean THEN v_score := v_score + 10; END IF;
    IF (v_checklist->>'tax_info')::boolean THEN v_score := v_score + 5; END IF;
    IF (v_checklist->>'franchise_assigned')::boolean THEN v_score := v_score + 5; END IF;
    IF (v_checklist->>'test_booking')::boolean THEN v_score := v_score + 5; END IF;
    
    -- Update the score
    UPDATE public.property_onboarding
    SET 
        readiness_score = v_score,
        minimum_readiness_met = (v_score >= 60),
        updated_at = now()
    WHERE property_id = p_property_id;
    
    RETURN v_score;
END;
$$;
