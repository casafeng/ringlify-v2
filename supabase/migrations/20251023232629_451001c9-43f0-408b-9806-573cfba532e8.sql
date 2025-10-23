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