-- Create calls table for storing call data
CREATE TABLE IF NOT EXISTS public.calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at TIMESTAMPTZ,
  duration_sec INTEGER,
  transcript TEXT,
  status TEXT NOT NULL DEFAULT 'in-progress',
  sentiment TEXT,
  intent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.calls ENABLE ROW LEVEL SECURITY;

-- Create policy for viewing calls (public for now, will restrict later)
CREATE POLICY "Allow all to view calls" 
ON public.calls 
FOR SELECT 
USING (true);

-- Create policy for inserting calls (public for now, from edge functions)
CREATE POLICY "Allow all to insert calls" 
ON public.calls 
FOR INSERT 
WITH CHECK (true);

-- Create policy for updating calls
CREATE POLICY "Allow all to update calls" 
ON public.calls 
FOR UPDATE 
USING (true);

-- Create index on phone_number for faster lookups
CREATE INDEX idx_calls_phone_number ON public.calls(phone_number);

-- Create index on started_at for date range queries
CREATE INDEX idx_calls_started_at ON public.calls(started_at DESC);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_calls_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_calls_updated_at
BEFORE UPDATE ON public.calls
FOR EACH ROW
EXECUTE FUNCTION public.update_calls_updated_at();