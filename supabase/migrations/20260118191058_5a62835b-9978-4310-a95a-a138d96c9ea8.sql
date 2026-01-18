-- WhatsApp message templates table for admin-editable messages
CREATE TABLE public.whatsapp_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_key VARCHAR(50) NOT NULL UNIQUE,
  template_name VARCHAR(100) NOT NULL,
  message_body TEXT NOT NULL,
  cta_button_text VARCHAR(50),
  cta_button_url TEXT,
  is_active BOOLEAN DEFAULT true,
  variables_hint TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.whatsapp_templates ENABLE ROW LEVEL SECURITY;

-- Allow public read (for edge function to access)
CREATE POLICY "WhatsApp templates are readable by all"
ON public.whatsapp_templates FOR SELECT
USING (true);

-- Only authenticated users can update (admin will use service role)
CREATE POLICY "Authenticated users can update templates"
ON public.whatsapp_templates FOR UPDATE
USING (auth.uid() IS NOT NULL);

-- Insert default templates
INSERT INTO public.whatsapp_templates (template_key, template_name, message_body, cta_button_text, cta_button_url, variables_hint) VALUES
(
  'booking_confirmation',
  'Booking Confirmation',
  'Hey {{guest_name}}! 🎉

Your booking at XTSY is confirmed!

📅 Check-in: {{check_in}}
📅 Check-out: {{check_out}}
🛏️ Room: {{room_type}}
👥 Guests: {{guests}}
💰 Total: ₹{{total_amount}}

Booking ID: {{booking_id}}

See you soon! 🌿',
  'View Booking',
  'https://xtsy.one/booking/{{booking_id}}',
  'Variables: {{guest_name}}, {{check_in}}, {{check_out}}, {{room_type}}, {{guests}}, {{total_amount}}, {{booking_id}}'
),
(
  'booking_reminder',
  'Check-in Reminder',
  'Hi {{guest_name}}! 👋

Reminder: Your stay at XTSY begins tomorrow!

📅 Check-in: {{check_in}} (2 PM onwards)
🛏️ Room: {{room_type}}

📍 Location: XTSY, Shillong, Meghalaya

Need directions? Tap below! 🗺️',
  'Get Directions',
  'https://maps.google.com/?q=XTSY+Shillong',
  'Variables: {{guest_name}}, {{check_in}}, {{room_type}}'
),
(
  'payment_received',
  'Payment Confirmation',
  'Thank you {{guest_name}}! 💚

Payment of ₹{{amount}} received for your XTSY booking.

Booking ID: {{booking_id}}
Transaction ID: {{transaction_id}}

Your adventure awaits! 🏔️',
  'View Invoice',
  'https://xtsy.one/invoice/{{booking_id}}',
  'Variables: {{guest_name}}, {{amount}}, {{booking_id}}, {{transaction_id}}'
);

-- Trigger for updated_at
CREATE TRIGGER update_whatsapp_templates_updated_at
BEFORE UPDATE ON public.whatsapp_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();