import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, customerId } = await req.json();

    if (!customerId) {
      throw new Error('Customer ID is required');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Load AI configuration
    const { data: aiConfig } = await supabase
      .from('ai_configurations')
      .select('*')
      .eq('customer_id', customerId)
      .single();

    // Load knowledge base documents
    const { data: kbDocs } = await supabase
      .from('kb_documents')
      .select('title, content')
      .eq('customer_id', customerId)
      .eq('is_active', true);

    // Build context
    let systemPrompt = `You are an AI assistant for a business.

Business Information:
${aiConfig?.business_context || 'No business context provided'}

Tone: ${aiConfig?.tone || 'professional'}
${aiConfig?.greeting ? `Greeting: ${aiConfig.greeting}` : ''}

Knowledge Base:
${kbDocs?.map(doc => `${doc.title}:\n${doc.content}`).join('\n\n') || 'No knowledge base available'}

Instructions:
- Be helpful and respond based on the business information and knowledge base
- Use the specified tone in your responses
- If you don't know something, say so clearly`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      throw new Error('Failed to get response from AI');
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
    });

  } catch (error) {
    console.error('Error in test-chat function:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
