-- Add verified-identity owner column
ALTER TABLE public.chat_conversations
  ADD COLUMN IF NOT EXISTS user_id uuid DEFAULT auth.uid();

-- Drop old email-matching policies
DROP POLICY IF EXISTS "Anyone can create a conversation" ON public.chat_conversations;
DROP POLICY IF EXISTS "Users can delete their conversations" ON public.chat_conversations;
DROP POLICY IF EXISTS "Users can update their conversations" ON public.chat_conversations;
DROP POLICY IF EXISTS "Users can view their conversations by email" ON public.chat_conversations;

-- Restrict grants to authenticated + service_role only (no anon)
REVOKE ALL ON public.chat_conversations FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chat_conversations TO authenticated;
GRANT ALL ON public.chat_conversations TO service_role;

-- New policies based on verified auth.uid()
CREATE POLICY "Users can create their own conversations"
  ON public.chat_conversations
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view their own conversations"
  ON public.chat_conversations
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own conversations"
  ON public.chat_conversations
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own conversations"
  ON public.chat_conversations
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());