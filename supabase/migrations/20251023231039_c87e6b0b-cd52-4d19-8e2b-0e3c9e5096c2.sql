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