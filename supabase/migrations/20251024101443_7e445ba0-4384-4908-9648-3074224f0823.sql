-- Create contacts table for caller information
CREATE TABLE public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  phone_number TEXT,
  whatsapp_id TEXT,
  email TEXT,
  name TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(customer_id, phone_number)
);

ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their customer's contacts"
  ON public.contacts FOR SELECT
  USING (customer_id = get_user_customer_id(auth.uid()));

CREATE POLICY "Users can insert contacts for their customer"
  ON public.contacts FOR INSERT
  WITH CHECK (customer_id = get_user_customer_id(auth.uid()));

CREATE POLICY "Users can update their customer's contacts"
  ON public.contacts FOR UPDATE
  USING (customer_id = get_user_customer_id(auth.uid()));

CREATE POLICY "Service role can manage all contacts"
  ON public.contacts FOR ALL
  USING (true);

-- Create conversations table
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES public.contacts(id) ON DELETE CASCADE,
  channel TEXT NOT NULL CHECK (channel IN ('voice', 'whatsapp', 'sms')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed', 'archived')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their customer's conversations"
  ON public.conversations FOR SELECT
  USING (customer_id = get_user_customer_id(auth.uid()));

CREATE POLICY "Service role can manage all conversations"
  ON public.conversations FOR ALL
  USING (true);

-- Create messages table
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their customer's messages"
  ON public.messages FOR SELECT
  USING (customer_id = get_user_customer_id(auth.uid()));

CREATE POLICY "Service role can manage all messages"
  ON public.messages FOR ALL
  USING (true);

CREATE INDEX idx_messages_conversation ON public.messages(conversation_id, created_at DESC);

-- Create call_events table for Twilio event logging
CREATE TABLE public.call_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  call_id UUID NOT NULL REFERENCES public.calls(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.call_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their customer's call events"
  ON public.call_events FOR SELECT
  USING (customer_id = get_user_customer_id(auth.uid()));

CREATE POLICY "Service role can manage all call events"
  ON public.call_events FOR ALL
  USING (true);

CREATE INDEX idx_call_events_call ON public.call_events(call_id, created_at);

-- Create transcripts table
CREATE TABLE public.transcripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  call_id UUID NOT NULL REFERENCES public.calls(id) ON DELETE CASCADE,
  full_text TEXT,
  segments JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.transcripts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their customer's transcripts"
  ON public.transcripts FOR SELECT
  USING (customer_id = get_user_customer_id(auth.uid()));

CREATE POLICY "Service role can manage all transcripts"
  ON public.transcripts FOR ALL
  USING (true);

-- Create business_hours table
CREATE TABLE public.business_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  schedule JSONB NOT NULL DEFAULT '{
    "monday": {"open": "09:00", "close": "17:00", "enabled": true},
    "tuesday": {"open": "09:00", "close": "17:00", "enabled": true},
    "wednesday": {"open": "09:00", "close": "17:00", "enabled": true},
    "thursday": {"open": "09:00", "close": "17:00", "enabled": true},
    "friday": {"open": "09:00", "close": "17:00", "enabled": true},
    "saturday": {"open": "10:00", "close": "14:00", "enabled": false},
    "sunday": {"open": "10:00", "close": "14:00", "enabled": false}
  }',
  timezone TEXT NOT NULL DEFAULT 'America/New_York',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(customer_id)
);

ALTER TABLE public.business_hours ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their customer's business hours"
  ON public.business_hours FOR SELECT
  USING (customer_id = get_user_customer_id(auth.uid()));

CREATE POLICY "Users can manage their customer's business hours"
  ON public.business_hours FOR ALL
  USING (customer_id = get_user_customer_id(auth.uid()));

-- Create services table
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  price DECIMAL(10, 2),
  currency TEXT DEFAULT 'USD',
  is_active BOOLEAN NOT NULL DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their customer's services"
  ON public.services FOR SELECT
  USING (customer_id = get_user_customer_id(auth.uid()));

CREATE POLICY "Users can manage their customer's services"
  ON public.services FOR ALL
  USING (customer_id = get_user_customer_id(auth.uid()));

-- Create kb_documents table for knowledge base
CREATE TABLE public.kb_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT,
  version INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.kb_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their customer's kb documents"
  ON public.kb_documents FOR SELECT
  USING (customer_id = get_user_customer_id(auth.uid()));

CREATE POLICY "Users can manage their customer's kb documents"
  ON public.kb_documents FOR ALL
  USING (customer_id = get_user_customer_id(auth.uid()));

-- Add unique constraint to bookings to prevent double-booking
ALTER TABLE public.bookings
ADD CONSTRAINT bookings_no_overlap UNIQUE (customer_id, appointment_date, appointment_time);

-- Add conversation_id to calls table for linking
ALTER TABLE public.calls
ADD COLUMN conversation_id UUID REFERENCES public.conversations(id) ON DELETE SET NULL;

-- Create trigger for updating updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON public.contacts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_business_hours_updated_at
  BEFORE UPDATE ON public.business_hours
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_kb_documents_updated_at
  BEFORE UPDATE ON public.kb_documents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();