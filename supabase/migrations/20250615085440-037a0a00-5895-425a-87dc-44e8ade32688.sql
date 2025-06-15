
-- 1. Create the 'donations' table for tracking donation attempts and completions
CREATE TABLE public.donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  amount INTEGER NOT NULL,                 -- In cents
  currency TEXT DEFAULT 'usd' NOT NULL,
  status TEXT DEFAULT 'pending' NOT NULL,  -- 'pending', 'paid', 'canceled'
  stripe_session_id TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Enable Row Level Security
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- 3. Policy: allow users to view only their own donations
CREATE POLICY "Select own donations" ON public.donations
  FOR SELECT
  USING (user_id = auth.uid());

-- 4. Policy: allow users to insert donations tied to their user_id (for logged in users)
CREATE POLICY "Users can insert their own donations" ON public.donations
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- 5. Policy: allow users to update or delete their own donations (future-proof; not required but safe)
CREATE POLICY "Users can update their own donations" ON public.donations
  FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own donations" ON public.donations
  FOR DELETE
  USING (user_id = auth.uid());

-- 6. Policy: allow insert/update from service role (edge function, via supabase service key)
CREATE POLICY "Edge functions can insert/update any donation" ON public.donations
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (true);

