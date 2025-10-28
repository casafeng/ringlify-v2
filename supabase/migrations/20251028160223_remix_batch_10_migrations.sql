
-- Migration: 20251023212655
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

-- Migration: 20251023212717
-- Fix security warning: Set search_path for trigger function
CREATE OR REPLACE FUNCTION public.update_calls_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Migration: 20251023220215
-- Add twilio_call_sid column to calls table
ALTER TABLE public.calls 
ADD COLUMN IF NOT EXISTS twilio_call_sid TEXT;

-- Create index for faster lookups by call SID
CREATE INDEX IF NOT EXISTS idx_calls_twilio_call_sid 
ON public.calls(twilio_call_sid);

-- Migration: 20251023231037
-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('owner', 'admin', 'agent', 'viewer');

-- Create customers table
CREATE TABLE public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name TEXT NOT NULL,
  business_email TEXT,
  business_phone TEXT,
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, customer_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Add customer_id to calls table
ALTER TABLE public.calls ADD COLUMN customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE;

-- Create phone_numbers table
CREATE TABLE public.phone_numbers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE NOT NULL,
  phone_number TEXT NOT NULL UNIQUE,
  twilio_sid TEXT,
  status TEXT DEFAULT 'active' NOT NULL,
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.phone_numbers ENABLE ROW LEVEL SECURITY;

-- Create ai_configurations table
CREATE TABLE public.ai_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE NOT NULL UNIQUE,
  personality TEXT DEFAULT 'professional and friendly',
  tone TEXT DEFAULT 'warm',
  greeting TEXT DEFAULT 'Hello! How can I help you today?',
  business_context TEXT,
  faqs JSONB DEFAULT '[]'::jsonb,
  scheduling_rules JSONB DEFAULT '{}'::jsonb,
  memory_settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.ai_configurations ENABLE ROW LEVEL SECURITY;

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE NOT NULL,
  call_id UUID REFERENCES public.calls(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  service TEXT,
  status TEXT DEFAULT 'scheduled' NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create credits_usage table
CREATE TABLE public.credits_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE NOT NULL,
  usage_type TEXT NOT NULL,
  amount INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.credits_usage ENABLE ROW LEVEL SECURITY;

-- Create security definer function to get user's customer_id
CREATE OR REPLACE FUNCTION public.get_user_customer_id(_user_id UUID)
RETURNS UUID
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT customer_id FROM public.profiles WHERE user_id = _user_id LIMIT 1;
$$;

-- Create security definer function to check if user has role
CREATE OR REPLACE FUNCTION public.has_customer_role(_user_id UUID, _customer_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND customer_id = _customer_id
      AND role = _role
  );
$$;

-- RLS Policies for customers
CREATE POLICY "Users can view their own customer"
  ON public.customers FOR SELECT
  USING (id = public.get_user_customer_id(auth.uid()));

CREATE POLICY "Owners and admins can update their customer"
  ON public.customers FOR UPDATE
  USING (
    public.has_customer_role(auth.uid(), id, 'owner') OR
    public.has_customer_role(auth.uid(), id, 'admin')
  );

-- RLS Policies for profiles
CREATE POLICY "Users can view profiles in their customer"
  ON public.profiles FOR SELECT
  USING (customer_id = public.get_user_customer_id(auth.uid()));

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (user_id = auth.uid());

-- RLS Policies for user_roles
CREATE POLICY "Users can view roles in their customer"
  ON public.user_roles FOR SELECT
  USING (customer_id = public.get_user_customer_id(auth.uid()));

-- RLS Policies for calls
CREATE POLICY "Users can view calls for their customer"
  ON public.calls FOR SELECT
  USING (customer_id = public.get_user_customer_id(auth.uid()));

CREATE POLICY "System can insert calls"
  ON public.calls FOR INSERT
  WITH CHECK (true);

CREATE POLICY "System can update calls"
  ON public.calls FOR UPDATE
  USING (true);

-- RLS Policies for phone_numbers
CREATE POLICY "Users can view their customer's phone numbers"
  ON public.phone_numbers FOR SELECT
  USING (customer_id = public.get_user_customer_id(auth.uid()));

CREATE POLICY "Owners and admins can manage phone numbers"
  ON public.phone_numbers FOR ALL
  USING (
    public.has_customer_role(auth.uid(), customer_id, 'owner') OR
    public.has_customer_role(auth.uid(), customer_id, 'admin')
  );

-- RLS Policies for ai_configurations
CREATE POLICY "Users can view their customer's AI config"
  ON public.ai_configurations FOR SELECT
  USING (customer_id = public.get_user_customer_id(auth.uid()));

CREATE POLICY "Owners and admins can manage AI config"
  ON public.ai_configurations FOR ALL
  USING (
    public.has_customer_role(auth.uid(), customer_id, 'owner') OR
    public.has_customer_role(auth.uid(), customer_id, 'admin')
  );

-- RLS Policies for bookings
CREATE POLICY "Users can view their customer's bookings"
  ON public.bookings FOR SELECT
  USING (customer_id = public.get_user_customer_id(auth.uid()));

CREATE POLICY "Users can manage their customer's bookings"
  ON public.bookings FOR ALL
  USING (customer_id = public.get_user_customer_id(auth.uid()));

-- RLS Policies for credits_usage
CREATE POLICY "Users can view their customer's credits usage"
  ON public.credits_usage FOR SELECT
  USING (customer_id = public.get_user_customer_id(auth.uid()));

-- Triggers for updated_at
CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON public.customers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_calls_updated_at();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_calls_updated_at();

CREATE TRIGGER update_phone_numbers_updated_at
  BEFORE UPDATE ON public.phone_numbers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_calls_updated_at();

CREATE TRIGGER update_ai_configurations_updated_at
  BEFORE UPDATE ON public.ai_configurations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_calls_updated_at();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_calls_updated_at();

-- Migration: 20251023232626
-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_customer_id uuid;
BEGIN
  -- Create a new customer for this user
  INSERT INTO public.customers (business_name, business_email)
  VALUES (
    COALESCE(NEW.raw_user_meta_data->>'first_name', 'User') || ' ' || COALESCE(NEW.raw_user_meta_data->>'last_name', 'Business'),
    NEW.email
  )
  RETURNING id INTO new_customer_id;

  -- Create profile for the user
  INSERT INTO public.profiles (user_id, customer_id, email, first_name, last_name)
  VALUES (
    NEW.id,
    new_customer_id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );

  -- Assign owner role to the user
  INSERT INTO public.user_roles (user_id, customer_id, role)
  VALUES (NEW.id, new_customer_id, 'owner');

  -- Create default AI configuration for the customer
  INSERT INTO public.ai_configurations (customer_id)
  VALUES (new_customer_id);

  RETURN NEW;
END;
$$;

-- Create trigger to run on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Migration: 20251023233821
-- Fix RLS policies on calls table to ensure proper data isolation

-- Drop the overly permissive policies that allow all users to see all calls
DROP POLICY IF EXISTS "Allow all to view calls" ON public.calls;
DROP POLICY IF EXISTS "Allow all to insert calls" ON public.calls;
DROP POLICY IF EXISTS "Allow all to update calls" ON public.calls;

-- Keep the secure policy that filters by customer
-- (This policy already exists: "Users can view calls for their customer")

-- Allow system/service role to insert and update calls (for edge functions)
CREATE POLICY "Service role can insert calls"
ON public.calls
FOR INSERT
TO service_role
WITH CHECK (true);

CREATE POLICY "Service role can update calls"
ON public.calls
FOR UPDATE
TO service_role
USING (true);

-- Allow authenticated users to insert calls only for their own customer
CREATE POLICY "Users can insert calls for their customer"
ON public.calls
FOR INSERT
TO authenticated
WITH CHECK (customer_id = get_user_customer_id(auth.uid()));

-- Allow authenticated users to update calls only for their own customer
CREATE POLICY "Users can update calls for their customer"
ON public.calls
FOR UPDATE
TO authenticated
USING (customer_id = get_user_customer_id(auth.uid()));

-- Migration: 20251024101440
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

-- Migration: 20251024101751
-- Fix security issue: update function to set search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public;

-- Migration: 20251027185250
-- Add source tracking columns to kb_documents
ALTER TABLE public.kb_documents 
ADD COLUMN source_type text CHECK (source_type IN ('text', 'website', 'document')) DEFAULT 'text',
ADD COLUMN source_url text,
ADD COLUMN file_path text;

-- Create storage bucket for knowledge base documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('kb-documents', 'kb-documents', false);

-- RLS policies for kb-documents bucket
CREATE POLICY "Users can upload their customer's kb documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'kb-documents' 
  AND (storage.foldername(name))[1] IN (
    SELECT customer_id::text 
    FROM public.profiles 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can view their customer's kb documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'kb-documents' 
  AND (storage.foldername(name))[1] IN (
    SELECT customer_id::text 
    FROM public.profiles 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete their customer's kb documents"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'kb-documents' 
  AND (storage.foldername(name))[1] IN (
    SELECT customer_id::text 
    FROM public.profiles 
    WHERE user_id = auth.uid()
  )
);

-- Migration: 20251027192925
-- Drop the existing ALL policy for kb_documents
DROP POLICY IF EXISTS "Users can manage their customer's kb documents" ON public.kb_documents;

-- Create separate policies with explicit WITH CHECK for INSERT
CREATE POLICY "Users can insert their customer's kb documents"
ON public.kb_documents
FOR INSERT
TO authenticated
WITH CHECK (customer_id = get_user_customer_id(auth.uid()));

CREATE POLICY "Users can update their customer's kb documents"
ON public.kb_documents
FOR UPDATE
TO authenticated
USING (customer_id = get_user_customer_id(auth.uid()))
WITH CHECK (customer_id = get_user_customer_id(auth.uid()));

CREATE POLICY "Users can delete their customer's kb documents"
ON public.kb_documents
FOR DELETE
TO authenticated
USING (customer_id = get_user_customer_id(auth.uid()));
