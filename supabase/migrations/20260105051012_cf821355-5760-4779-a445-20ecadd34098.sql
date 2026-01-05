-- =====================================================
-- XTSY MULTI-TENANT ARCHITECTURE - Part 1
-- Add franchise role to enum
-- =====================================================

-- Add 'franchise' to the app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'franchise';