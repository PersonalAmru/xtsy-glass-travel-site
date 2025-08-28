-- Create whatsapp_logs table for logging WhatsApp interactions
CREATE TABLE public.whatsapp_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('booking', 'travel', 'group', 'xtsy270', 'contact')),
  phone TEXT,
  email TEXT,
  message TEXT NOT NULL,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.whatsapp_logs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Service role can manage whatsapp logs"
ON public.whatsapp_logs
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Users can insert their own whatsapp logs"
ON public.whatsapp_logs
FOR INSERT
WITH CHECK (true); -- Allow anyone to insert for silent logging