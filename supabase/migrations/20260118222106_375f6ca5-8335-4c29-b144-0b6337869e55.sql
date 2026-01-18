-- Drop the existing check constraint and add a new one that includes 'enquiry' type
ALTER TABLE public.admin_notifications DROP CONSTRAINT IF EXISTS admin_notifications_type_check;

ALTER TABLE public.admin_notifications ADD CONSTRAINT admin_notifications_type_check 
CHECK (type IN ('booking', 'enquiry', 'payment', 'cancellation', 'review', 'security', 'system', 'alert', 'info'));