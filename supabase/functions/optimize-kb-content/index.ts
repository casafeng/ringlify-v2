import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content, customerId } = await req.json();

    if (!content || !customerId) {
      throw new Error('Missing required fields: content and customerId');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get Lovable API key
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    console.log('Optimizing content with AI...');

    // Call Lovable AI to optimize the content
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are an expert at organizing business information for AI assistants. 
Your task is to rewrite the provided business information to be clear, concise, and optimized for an AI phone assistant to use when answering customer questions.

Guidelines:
- Structure information in a clear, scannable format
- Use bullet points and sections where appropriate
- Expand on vague answers with helpful details
- Remove redundancy
- Keep the tone professional yet friendly
- Ensure all essential information is preserved
- Add context that would help an AI assistant provide better customer service

Return ONLY the optimized content, no additional commentary.`
          },
          {
            role: 'user',
            content: `Please optimize this business information for use by an AI phone assistant:\n\n${content}`
          }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI optimization error:', aiResponse.status, errorText);
      
      // Handle rate limits gracefully
      if (aiResponse.status === 429) {
        throw new Error('AI service rate limit exceeded. Please try again in a moment.');
      }
      if (aiResponse.status === 402) {
        throw new Error('AI service payment required. Please add credits to your workspace.');
      }
      
      throw new Error('Failed to optimize content with AI');
    }

    const aiData = await aiResponse.json();
    const optimizedContent = aiData.choices?.[0]?.message?.content || content;

    console.log('Content optimized successfully');

    // Save to knowledge base
    const { data: kbDocument, error: kbError } = await supabase
      .from('kb_documents')
      .insert({
        customer_id: customerId,
        title: 'Business Information (Onboarding)',
        content: optimizedContent,
        source_type: 'text',
        category: 'business_info',
        metadata: {
          source: 'onboarding',
          optimized_with_ai: true,
          created_at: new Date().toISOString()
        }
      })
      .select()
      .single();

    if (kbError) {
      console.error('Error saving to KB:', kbError);
      throw kbError;
    }

    console.log('Saved to knowledge base:', kbDocument.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        documentId: kbDocument.id,
        optimizedContent 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in optimize-kb-content function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
