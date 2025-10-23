-- Add twilio_call_sid column to calls table
ALTER TABLE public.calls 
ADD COLUMN IF NOT EXISTS twilio_call_sid TEXT;

-- Create index for faster lookups by call SID
CREATE INDEX IF NOT EXISTS idx_calls_twilio_call_sid 
ON public.calls(twilio_call_sid);