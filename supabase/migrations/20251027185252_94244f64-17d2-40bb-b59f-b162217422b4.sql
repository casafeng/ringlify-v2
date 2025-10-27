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