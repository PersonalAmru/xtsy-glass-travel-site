-- Fix the invoice counter to avoid duplicate booking_id
UPDATE invoice_counter 
SET counter = 2, updated_at = now() 
WHERE prefix = 'XTH-INV-';