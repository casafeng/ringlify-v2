-- Add chunk metadata to kb_documents table for smart document splitting
ALTER TABLE kb_documents 
ADD COLUMN IF NOT EXISTS chunk_index INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS parent_document_id UUID REFERENCES kb_documents(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS is_chunk BOOLEAN DEFAULT false;

-- Add index for better query performance on chunks
CREATE INDEX IF NOT EXISTS idx_kb_documents_parent ON kb_documents(parent_document_id) WHERE parent_document_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_kb_documents_is_chunk ON kb_documents(is_chunk);

-- Add relevance tracking for analytics
ALTER TABLE kb_documents
ADD COLUMN IF NOT EXISTS usage_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_used_at TIMESTAMPTZ;