-- Phase 1: Database Schema Updates for Modular Voice Pipeline

-- 1.1 Extend ai_configurations table with voice pipeline configuration
ALTER TABLE ai_configurations 
ADD COLUMN IF NOT EXISTS voice_pipeline jsonb DEFAULT '{
  "asr": {
    "provider": "deepgram",
    "model": "nova-2",
    "language": "en-US",
    "interim_results": true
  },
  "llm": {
    "provider": "openai",
    "model": "gpt-4o-mini",
    "temperature": 0.7,
    "max_tokens": 500
  },
  "tts": {
    "provider": "elevenlabs",
    "voice_id": "21m00Tcm4TlvDq8ikWAM",
    "model_id": "eleven_turbo_v2_5",
    "stability": 0.5,
    "similarity_boost": 0.75,
    "stream_latency": 2
  },
  "vad": {
    "enabled": true,
    "threshold": 0.5,
    "silence_duration_ms": 1000,
    "prefix_padding_ms": 300
  },
  "fallback": {
    "confidence_threshold": 0.7,
    "max_invalid_attempts": 3,
    "rag_threshold": 0.6,
    "action": "human_transfer"
  }
}'::jsonb;

-- 1.2 Create intent_schemas table for structured intent definitions
CREATE TABLE IF NOT EXISTS intent_schemas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  intent_name text NOT NULL,
  description text,
  schema jsonb NOT NULL,
  validation_rules jsonb,
  fallback_action text DEFAULT 'human_transfer',
  confidence_threshold decimal DEFAULT 0.7,
  priority integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on intent_schemas
ALTER TABLE intent_schemas ENABLE ROW LEVEL SECURITY;

-- RLS policies for intent_schemas
CREATE POLICY "Users can view their customer's intent schemas"
  ON intent_schemas FOR SELECT
  USING (customer_id = get_user_customer_id(auth.uid()));

CREATE POLICY "Users can manage their customer's intent schemas"
  ON intent_schemas FOR ALL
  USING (customer_id = get_user_customer_id(auth.uid()));

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_intent_schemas_customer_id ON intent_schemas(customer_id);
CREATE INDEX IF NOT EXISTS idx_intent_schemas_intent_name ON intent_schemas(customer_id, intent_name);

-- Add trigger for updated_at
CREATE TRIGGER update_intent_schemas_updated_at
  BEFORE UPDATE ON intent_schemas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 1.3 Create call_metrics table for performance tracking
CREATE TABLE IF NOT EXISTS call_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  call_id uuid REFERENCES calls(id) ON DELETE CASCADE NOT NULL,
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  asr_latency_ms integer,
  llm_latency_ms integer,
  tts_latency_ms integer,
  total_latency_ms integer,
  confidence_score decimal,
  intent_recognized boolean,
  intent_name text,
  escalated_to_human boolean DEFAULT false,
  escalation_reason text,
  barge_in_count integer DEFAULT 0,
  invalid_attempts integer DEFAULT 0,
  rag_score decimal,
  pipeline_config jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on call_metrics
ALTER TABLE call_metrics ENABLE ROW LEVEL SECURITY;

-- RLS policies for call_metrics
CREATE POLICY "Users can view their customer's call metrics"
  ON call_metrics FOR SELECT
  USING (customer_id = get_user_customer_id(auth.uid()));

CREATE POLICY "Service role can manage all call metrics"
  ON call_metrics FOR ALL
  USING (true);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_call_metrics_call_id ON call_metrics(call_id);
CREATE INDEX IF NOT EXISTS idx_call_metrics_customer_id ON call_metrics(customer_id);
CREATE INDEX IF NOT EXISTS idx_call_metrics_created_at ON call_metrics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_call_metrics_intent ON call_metrics(customer_id, intent_name);

-- Add default booking intent schema for existing customers
INSERT INTO intent_schemas (customer_id, intent_name, description, schema, priority)
SELECT 
  id,
  'book_appointment',
  'Schedule a new appointment with the business',
  '{
    "type": "object",
    "properties": {
      "name": {
        "type": "string",
        "minLength": 2,
        "description": "Customer full name"
      },
      "phone": {
        "type": "string",
        "pattern": "^\\+?[1-9]\\d{1,14}$",
        "description": "Customer phone number in E.164 format"
      },
      "email": {
        "type": "string",
        "format": "email",
        "description": "Customer email address"
      },
      "service": {
        "type": "string",
        "description": "Type of service requested"
      },
      "datetime_iso": {
        "type": "string",
        "format": "date-time",
        "description": "Appointment date and time in ISO 8601 format"
      },
      "notes": {
        "type": "string",
        "description": "Additional notes or special requests"
      }
    },
    "required": ["name", "phone", "service", "datetime_iso"]
  }'::jsonb,
  1
FROM customers
WHERE NOT EXISTS (
  SELECT 1 FROM intent_schemas 
  WHERE intent_schemas.customer_id = customers.id 
  AND intent_schemas.intent_name = 'book_appointment'
);

-- Add general inquiry intent schema
INSERT INTO intent_schemas (customer_id, intent_name, description, schema, priority)
SELECT 
  id,
  'general_inquiry',
  'General questions about business, services, or hours',
  '{
    "type": "object",
    "properties": {
      "question": {
        "type": "string",
        "description": "The customer question or inquiry"
      },
      "category": {
        "type": "string",
        "enum": ["hours", "services", "pricing", "location", "other"],
        "description": "Category of the inquiry"
      }
    },
    "required": ["question", "category"]
  }'::jsonb,
  0
FROM customers
WHERE NOT EXISTS (
  SELECT 1 FROM intent_schemas 
  WHERE intent_schemas.customer_id = customers.id 
  AND intent_schemas.intent_name = 'general_inquiry'
);