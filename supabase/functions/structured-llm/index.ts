import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
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

async function scoreDocumentRelevance(query: string, docs: any[], lovableApiKey: string) {
  try {
    const docsForScoring = docs.map(doc => ({
      id: doc.id,
      title: doc.title,
      content: doc.content.substring(0, 300)
    }));

    console.log(`[LLM] Scoring ${docs.length} documents for relevance to query: "${query}"`);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [{
          role: 'user',
          content: `Rate the relevance of these documents to the query: "${query}"\n\nDocuments:\n${JSON.stringify(docsForScoring, null, 2)}\n\nReturn ONLY a JSON array of scores from 0.0 to 1.0, one per document. Consider if documents contain information about business info, services, hours, pricing, policies, etc. that could help answer the query. Format: [0.8, 0.3, 0.9, ...]`
        }],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      console.error('[LLM] Lovable AI scoring error:', response.status);
      return docs.map(doc => ({ ...doc, relevance: 0.8 }));
    }

    const data = await response.json();
    const rawResponse = data.choices[0]?.message?.content || '';
    console.log('[LLM] Raw scoring response:', rawResponse);

    const match = rawResponse.match(/\[([\d\.,\s]+)\]/);
    if (!match) {
      console.warn('[LLM] Could not parse scores, using default relevance');
      return docs.map(doc => ({ ...doc, relevance: 0.8 }));
    }

    const scores = match[1].split(',').map((s: string) => parseFloat(s.trim()));
    console.log('[LLM] Parsed scores:', scores);

    return docs.map((doc, i) => ({
      ...doc,
      relevance: scores[i] !== undefined ? scores[i] : 0.8
    }));
  } catch (error) {
    console.error('[LLM] Error scoring documents:', error);
    return docs.map(doc => ({ ...doc, relevance: 0.8 }));
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { transcript, conversationHistory, customerId, callId, intentName }: StructuredRequest = await req.json();

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
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
      .select('*')
      .eq('customer_id', customerId)
      .eq('is_active', true);

    console.log(`[LLM] Found ${kbDocs?.length || 0} KB documents`);

    // Score and filter relevant documents
    let relevantDocs = kbDocs || [];
    if (kbDocs && kbDocs.length > 0) {
      const scoredDocs = await scoreDocumentRelevance(transcript, kbDocs, LOVABLE_API_KEY);
      console.log('[LLM] Document relevance scores:', scoredDocs.map(d => ({ title: d.title, score: d.relevance })));
      
      relevantDocs = scoredDocs.filter(doc => doc.relevance > 0.3);
      console.log(`[LLM] Using ${relevantDocs.length} relevant documents (threshold: 0.3)`);
    }

    const knowledgeBase = relevantDocs.map(doc => `${doc.title}:\n${doc.content}`).join('\n\n---\n\n') || '';
    
    // Extract business name from KB
    const businessName = relevantDocs.find(doc => 
      doc.title.toLowerCase().includes('business') || 
      doc.title.toLowerCase().includes('company') ||
      doc.title.toLowerCase().includes('about')
    )?.content.split('\n')[0] || 'our business';

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
    const systemPrompt = `You are an AI voice assistant representing ${businessName}.

Business Context: ${aiConfig?.business_context || 'A professional service business'}

Personality & Tone: ${aiConfig?.personality || 'Professional and friendly'}, ${aiConfig?.tone || 'warm and helpful'}

Communication Style:
- Be conversational and natural in speech
- Keep responses concise and clear for phone calls
- Use everyday language, avoid technical jargon
- Show empathy and understanding
- Be proactive in offering help

Knowledge Base:
${knowledgeBase || 'No specific business information available yet.'}

Your tasks:
1. Understand the customer's intent from what they say
2. Extract structured information using the appropriate function call when needed
3. If information is missing, ask clarifying questions naturally
4. Provide helpful, accurate information from the knowledge base
5. If you don't know something, be honest and offer to help in other ways

Remember: You're having a natural phone conversation. Be warm, helpful, and human-like.

Current customer said: "${transcript}"`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: transcript },
    ];

    console.log(`[LLM] Processing transcript for call ${callId}`);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages,
        tools,
        tool_choice: intentName ? { type: 'function', function: { name: intentName } } : 'auto',
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[LLM] Lovable AI error:', error);
      throw new Error(`Lovable AI error: ${response.status}`);
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
