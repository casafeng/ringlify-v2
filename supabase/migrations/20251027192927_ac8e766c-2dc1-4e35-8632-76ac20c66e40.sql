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