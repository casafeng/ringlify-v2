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