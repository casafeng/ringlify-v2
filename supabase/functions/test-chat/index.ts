import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Smart relevance scoring using Lovable AI
async function scoreDocumentRelevance(query: string, docs: any[], lovableApiKey: string) {
  try {
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
          content: `Rate how relevant each document is for answering this query. Score from 0.0 to 1.0.
Consider: business info, services, hours, contact details, FAQs.

Query: "${query}"

Documents:
${docs.map((d, i) => `${i}. ${d.title}: ${d.content.substring(0, 300)}...`).join('\n\n')}

Return ONLY a JSON array of numbers: [0.9, 0.3, 0.8, ...]`
        }],
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || '[]';
      console.log('[KB Scoring] Raw response:', content);
      const match = content.match(/\[[\d.,\s]+\]/);
      if (match) {
        const scores = JSON.parse(match[0]);
        console.log('[KB Scoring] Parsed scores:', scores);
        return docs.map((doc, i) => ({ ...doc, relevance: scores[i] || 0.7 }));
      }
    }
  } catch (e) {
    console.error('[KB Scoring] Error:', e);
  }
  // Default to high relevance if scoring fails
  return docs.map(doc => ({ ...doc, relevance: 0.8 }));
}

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
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Load AI configuration
    const { data: aiConfig } = await supabase
      .from('ai_configurations')
      .select('*')
      .eq('customer_id', customerId)
      .single();

    // Load knowledge base documents (non-chunks only)
    const { data: kbDocs } = await supabase
      .from('kb_documents')
      .select('id, title, content')
      .eq('customer_id', customerId)
      .eq('is_active', true)
      .eq('is_chunk', false);

    const userQuery = messages[messages.length - 1]?.content || '';
    
    // Smart retrieval: Score and filter relevant documents
    let relevantDocs: any[] = [];
    let sources: any[] = [];
    let confidence = 'high';

    if (kbDocs && kbDocs.length > 0) {
      console.log('[KB] Scoring documents for query:', userQuery);
      const scoredDocs = await scoreDocumentRelevance(userQuery, kbDocs, lovableApiKey);
      console.log('[KB] Scored docs:', scoredDocs.map(d => ({ title: d.title, relevance: d.relevance })));
      
      relevantDocs = scoredDocs
        .filter(doc => doc.relevance >= 0.3)
        .sort((a, b) => b.relevance - a.relevance)
        .slice(0, 3);

      console.log('[KB] Relevant docs after filtering:', relevantDocs.length);

      if (relevantDocs.length === 0 || relevantDocs[0].relevance < 0.4) {
        confidence = 'low';
      }

      sources = relevantDocs.map(doc => ({
        id: doc.id,
        title: doc.title,
        relevance: doc.relevance
      }));

      // Update usage stats
      for (const doc of relevantDocs) {
        await supabase
          .from('kb_documents')
          .update({ 
            usage_count: (doc.usage_count || 0) + 1,
            last_used_at: new Date().toISOString()
          })
          .eq('id', doc.id);
      }
    }

    // Build context with only relevant documents
    const knowledgeContext = relevantDocs.length > 0
      ? relevantDocs.map(doc => `Source: ${doc.title}\nContent: ${doc.content}`).join('\n\n---\n\n')
      : '';

    // Extract business name from KB if available
    const businessName = kbDocs?.[0]?.content.match(/Name:\s*([^\n]+)/)?.[1] || 
                        kbDocs?.[0]?.content.match(/business[_\s]name[:\s]*([^\n]+)/i)?.[1] ||
                        'the business';

    let systemPrompt = `You are an AI assistant representing ${businessName}.

${aiConfig?.business_context ? `Business Context: ${aiConfig.business_context}` : ''}

Communication Style:
- Tone: ${aiConfig?.tone || 'professional and friendly'}
- Be helpful, accurate, and personable
${aiConfig?.greeting ? `- Use this greeting when appropriate: ${aiConfig.greeting}` : ''}

Knowledge Base:
${knowledgeContext || 'No knowledge base documents available.'}

Instructions:
1. You ARE the assistant for ${businessName} - answer as if you represent the business
2. When asked "who am I calling" or similar, explain you're the AI assistant for ${businessName}
3. Use the knowledge base to answer questions about services, hours, booking, etc.
4. If information isn't in the knowledge base, politely say so and offer to help with what you do know
5. Be conversational and helpful - don't just repeat "I don't have information"
6. Cite sources when using specific knowledge base information`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: 'Rate limit exceeded. Please try again in a moment.',
          sources 
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ 
          error: 'AI credits depleted. Please add credits to continue.',
          sources 
        }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      const error = await response.text();
      console.error('Lovable AI error:', error);
      throw new Error('Failed to get response from AI');
    }

    // Create a transform stream to inject metadata at the end
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const reader = response.body!.getReader();

    (async () => {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            // Inject sources and confidence as final SSE event
            const metadata = `data: ${JSON.stringify({
              choices: [{
                delta: { 
                  metadata: { sources, confidence }
                }
              }]
            })}\n\n`;
            await writer.write(new TextEncoder().encode(metadata));
            await writer.write(new TextEncoder().encode('data: [DONE]\n\n'));
            break;
          }
          await writer.write(value);
        }
      } finally {
        writer.close();
      }
    })();

    return new Response(readable, {
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
