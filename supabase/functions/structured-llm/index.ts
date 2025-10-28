import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface StructuredRequest {
  transcript: string;
  conversationHistory: Array<{ role: string; content: string }>;
  customerId: string;
  callId: string;
  intentName?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { transcript, conversationHistory, customerId, callId, intentName }: StructuredRequest = await req.json();

    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get AI configuration
    const { data: aiConfig } = await supabase
      .from('ai_configurations')
      .select('voice_pipeline, business_context, greeting, tone, personality')
      .eq('customer_id', customerId)
      .single();

    const llmConfig = aiConfig?.voice_pipeline?.llm || {
      provider: 'openai',
      model: 'gpt-4o-mini',
      temperature: 0.7,
    };

    // Get KB documents
    const { data: kbDocs } = await supabase
      .from('kb_documents')
      .select('title, content')
      .eq('customer_id', customerId)
      .eq('is_active', true);

    const knowledgeBase = kbDocs?.map(doc => `${doc.title}: ${doc.content}`).join('\n\n') || '';

    // Get intent schemas
    const { data: intentSchemas } = await supabase
      .from('intent_schemas')
      .select('*')
      .eq('customer_id', customerId)
      .eq('is_active', true)
      .order('priority', { ascending: false });

    if (!intentSchemas || intentSchemas.length === 0) {
      throw new Error('No intent schemas configured');
    }

    // Build tools for function calling
    const tools = intentSchemas.map(schema => ({
      type: 'function',
      function: {
        name: schema.intent_name,
        description: schema.description || `Extract ${schema.intent_name} information`,
        parameters: schema.schema,
      },
    }));

    // Build system prompt
    const systemPrompt = `You are an AI assistant for a business.

Business Context: ${aiConfig?.business_context || 'A professional service business'}

Personality: ${aiConfig?.personality || 'Professional and friendly'}
Tone: ${aiConfig?.tone || 'Warm'}

Knowledge Base:
${knowledgeBase}

Your task is to:
1. Understand the customer's intent from the transcript
2. Extract structured information using the appropriate function call
3. If information is missing, ask clarifying questions
4. Be conversational and natural

Current transcript: "${transcript}"`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: transcript },
    ];

    console.log(`[LLM] Processing transcript for call ${callId}`);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: llmConfig.model,
        messages,
        tools,
        tool_choice: intentName ? { type: 'function', function: { name: intentName } } : 'auto',
        temperature: llmConfig.temperature,
        max_tokens: llmConfig.max_tokens,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[LLM] OpenAI error:', error);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const message = data.choices[0]?.message;

    if (!message) {
      throw new Error('No response from LLM');
    }

    // Check for function call
    if (message.tool_calls && message.tool_calls.length > 0) {
      const toolCall = message.tool_calls[0];
      const functionName = toolCall.function.name;
      let functionArgs;

      try {
        functionArgs = JSON.parse(toolCall.function.arguments);
      } catch (error) {
        console.error('[LLM] Error parsing function arguments:', error);
        return new Response(
          JSON.stringify({
            intent: functionName,
            entities: null,
            valid: false,
            confidence: 0,
            error: 'Invalid function arguments',
            response: 'I had trouble understanding that. Could you please repeat?',
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Get the intent schema for validation
      const intentSchema = intentSchemas.find(s => s.intent_name === functionName);
      const confidence = intentSchema?.confidence_threshold || 0.7;

      console.log(`[LLM] Extracted intent: ${functionName}`, functionArgs);

      return new Response(
        JSON.stringify({
          intent: functionName,
          entities: functionArgs,
          valid: true,
          confidence,
          response: message.content || null,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // No function call - return conversational response
    return new Response(
      JSON.stringify({
        intent: 'general_inquiry',
        entities: { question: transcript },
        valid: true,
        confidence: 0.8,
        response: message.content,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[LLM] Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
