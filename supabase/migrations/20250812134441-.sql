-- Secure RLS for chat_conversations: restrict public access to private chats
BEGIN;

-- Drop existing permissive policies if present
DROP POLICY IF EXISTS "Users can view their own conversations" ON public.chat_conversations;
DROP POLICY IF EXISTS "Users can create conversations" ON public.chat_conversations;
DROP POLICY IF EXISTS "Users can update their own conversations" ON public.chat_conversations;
DROP POLICY IF EXISTS "Service role can manage all conversations" ON public.chat_conversations;

-- Ensure RLS is enabled
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;

-- Helper function to read JWT email (idempotent)
CREATE OR REPLACE FUNCTION public.get_jwt_email()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT NULLIF((current_setting('request.jwt.claims', true))::json ->> 'email', '')::text;
$$;

-- Allow anonymous and authenticated users to create conversations, but prevent forging another user's email
CREATE POLICY "Anyone can create a conversation"
ON public.chat_conversations
FOR INSERT
WITH CHECK (
  user_email IS NULL OR user_email = public.get_jwt_email()
);

-- Authenticated users can read only their own conversations by email
CREATE POLICY "Users can view their conversations by email"
ON public.chat_conversations
FOR SELECT
USING (
  public.get_jwt_email() IS NOT NULL AND user_email = public.get_jwt_email()
);

-- Authenticated users can update only their own conversations
CREATE POLICY "Users can update their conversations"
ON public.chat_conversations
FOR UPDATE
USING (
  public.get_jwt_email() IS NOT NULL AND user_email = public.get_jwt_email()
)
WITH CHECK (
  public.get_jwt_email() IS NOT NULL AND user_email = public.get_jwt_email()
);

-- Authenticated users can delete only their own conversations
CREATE POLICY "Users can delete their conversations"
ON public.chat_conversations
FOR DELETE
USING (
  public.get_jwt_email() IS NOT NULL AND user_email = public.get_jwt_email()
);

-- Service role retains full access (edge functions)
CREATE POLICY "Service role full access to conversations"
ON public.chat_conversations
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

COMMIT;