-- Add call forwarding support to phone_numbers table
ALTER TABLE public.phone_numbers 
  ADD COLUMN business_phone_number TEXT,
  ADD COLUMN setup_method TEXT DEFAULT 'purchased' CHECK (setup_method IN ('forwarding', 'purchased')),
  ADD COLUMN forwarding_verified BOOLEAN DEFAULT false,
  ADD COLUMN forwarding_instructions JSONB DEFAULT '{}'::jsonb;

-- Migrate existing data (existing numbers are purchased numbers)
UPDATE public.phone_numbers 
SET setup_method = 'purchased'
WHERE setup_method IS NULL;

-- Add forwarded_from column to calls table to track original business number
ALTER TABLE public.calls
  ADD COLUMN forwarded_from TEXT;

-- Add comment for clarity
COMMENT ON COLUMN phone_numbers.business_phone_number IS 'The customer''s actual business phone number (for forwarding setup)';
COMMENT ON COLUMN phone_numbers.phone_number IS 'The Twilio number (purchased or forwarding destination)';
COMMENT ON COLUMN phone_numbers.setup_method IS 'How the number was set up: forwarding or purchased';
COMMENT ON COLUMN calls.forwarded_from IS 'Original business number that forwarded the call (from Twilio ForwardedFrom parameter)';