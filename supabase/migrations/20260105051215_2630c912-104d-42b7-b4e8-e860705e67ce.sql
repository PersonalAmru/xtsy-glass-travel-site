-- =====================================================
-- XTSY MULTI-TENANT ARCHITECTURE - Part 2
-- Create franchise system tables and functions
-- =====================================================

-- 1) Create franchise_assignments table
CREATE TABLE IF NOT EXISTS public.franchise_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMPTZ DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  permissions JSONB DEFAULT '{"manage_inventory": true, "view_bookings": true, "view_analytics": true, "view_payouts": true}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, property_id)
);

-- 2) Create franchise_invites table
CREATE TABLE IF NOT EXISTS public.franchise_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  invite_token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  invited_by UUID REFERENCES auth.users(id),
  expires_at TIMESTAMPTZ DEFAULT (now() + interval '7 days'),
  accepted_at TIMESTAMPTZ,
  is_used BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3) Create property_wallets table
CREATE TABLE IF NOT EXISTS public.property_wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE UNIQUE,
  balance DECIMAL(12, 2) DEFAULT 0,
  pending_amount DECIMAL(12, 2) DEFAULT 0,
  total_earnings DECIMAL(12, 2) DEFAULT 0,
  total_payouts DECIMAL(12, 2) DEFAULT 0,
  royalty_rate DECIMAL(5, 2) DEFAULT 15.00,
  tds_rate DECIMAL(5, 2) DEFAULT 1.00,
  currency TEXT DEFAULT 'INR',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4) Create settlements table
CREATE TABLE IF NOT EXISTS public.settlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id),
  wallet_id UUID REFERENCES public.property_wallets(id),
  amount DECIMAL(12, 2) NOT NULL,
  royalty_deducted DECIMAL(12, 2) DEFAULT 0,
  tds_deducted DECIMAL(12, 2) DEFAULT 0,
  net_amount DECIMAL(12, 2) NOT NULL,
  settlement_date DATE NOT NULL,
  payment_reference TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5) Add property_id to reviews if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'property_id') THEN
    ALTER TABLE public.reviews ADD COLUMN property_id UUID REFERENCES public.properties(id);
  END IF;
END $$;

-- 6) Enable RLS
ALTER TABLE public.franchise_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.franchise_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settlements ENABLE ROW LEVEL SECURITY;

-- 7) Create helper function to get user's assigned properties
CREATE OR REPLACE FUNCTION public.get_user_properties(_user_id UUID)
RETURNS SETOF UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT property_id FROM public.franchise_assignments
  WHERE user_id = _user_id AND is_active = true;
$$;

-- 8) Create helper function to check if user is franchise for a property
CREATE OR REPLACE FUNCTION public.is_franchise_for_property(_user_id UUID, _property_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.franchise_assignments fa
    WHERE fa.user_id = _user_id 
      AND fa.property_id = _property_id
      AND fa.is_active = true
  );
$$;

-- 9) Create indexes
CREATE INDEX IF NOT EXISTS idx_franchise_assignments_user_id ON public.franchise_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_franchise_assignments_property_id ON public.franchise_assignments(property_id);
CREATE INDEX IF NOT EXISTS idx_reviews_property_id ON public.reviews(property_id);

-- 10) Create wallet for default property
INSERT INTO public.property_wallets (property_id)
SELECT id FROM public.properties WHERE slug = 'xtsy-shillong'
ON CONFLICT (property_id) DO NOTHING;