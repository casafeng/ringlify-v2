import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CallState {
  callId: string;
  customerId: string;
  conversationHistory: Array<{ role: string; content: string }>;
  currentIntent: string | null;
  partialEntities: Record<string, any>;
  invalidAttempts: number;
  confidenceScore: number;
  ragScore: number;
  metrics: {
    startTime: number;
    asrLatency: number[];
    llmLatency: number[];
    ttsLatency: number[];
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const upgrade = req.headers.get('upgrade') || '';
    if (upgrade.toLowerCase() !== 'websocket') {
      return new Response('Expected WebSocket', { status: 426, headers: corsHeaders });
    }

    const { socket, response } = Deno.upgradeWebSocket(req);
    const url = new URL(req.url);
    const callId = url.searchParams.get('callId');
    const customerId = url.searchParams.get('customerId');

    if (!callId || !customerId) {
      socket.close(1008, 'Missing callId or customerId');
      return response;
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Initialize call state
    const state: CallState = {
      callId,
      customerId,
      conversationHistory: [],
      currentIntent: null,
      partialEntities: {},
      invalidAttempts: 0,
      confidenceScore: 1.0,
      ragScore: 1.0,
      metrics: {
        startTime: Date.now(),
        asrLatency: [],
        llmLatency: [],
        ttsLatency: [],
      },
    };

    // Get AI configuration
    const { data: config } = await supabase
      .from('ai_configurations')
      .select('voice_pipeline, greeting')
      .eq('customer_id', customerId)
      .single();

    const fallbackConfig = config?.voice_pipeline?.fallback || {
      confidence_threshold: 0.7,
      max_invalid_attempts: 3,
      rag_threshold: 0.6,
      action: 'human_transfer',
    };

    // Create call metrics record
    await supabase
      .from('call_metrics')
      .insert({
        call_id: callId,
        customer_id: customerId,
        pipeline_config: config?.voice_pipeline,
      });

    function shouldEscalate(): boolean {
      return (
        state.confidenceScore < fallbackConfig.confidence_threshold ||
        state.invalidAttempts >= fallbackConfig.max_invalid_attempts ||
        state.ragScore < fallbackConfig.rag_threshold
      );
    }

    socket.onopen = () => {
      console.log(`[Orchestrator] Call ${callId} started`);
      
      // Send greeting
      socket.send(JSON.stringify({
        type: 'greeting',
        text: config?.greeting || 'Hello! How can I help you today?',
      }));
    };

    socket.onmessage = async (event) => {
      try {
        const message = JSON.parse(event.data);

        if (message.type === 'transcript.final') {
          const transcript = message.text;
          console.log(`[Orchestrator] Final transcript: "${transcript}"`);

          const asrLatency = Date.now() - message.timestamp;
          state.metrics.asrLatency.push(asrLatency);

          // Check for escalation before processing
          if (shouldEscalate()) {
            console.log(`[Orchestrator] Escalating call ${callId} - Reason: ${
              state.confidenceScore < fallbackConfig.confidence_threshold ? 'Low confidence' :
              state.invalidAttempts >= fallbackConfig.max_invalid_attempts ? 'Too many invalid attempts' :
              'Low RAG score'
            }`);

            socket.send(JSON.stringify({
              type: 'escalate',
              reason: 'Low confidence or too many errors',
              action: fallbackConfig.action,
            }));

            await supabase
              .from('call_metrics')
              .update({
                escalated_to_human: true,
                escalation_reason: shouldEscalate() ? 'confidence_threshold' : 'invalid_attempts',
              })
              .eq('call_id', callId);

            return;
          }

          // Call structured LLM
          const llmStart = Date.now();
          const llmResponse = await fetch(`${SUPABASE_URL}/functions/v1/structured-llm`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              transcript,
              conversationHistory: state.conversationHistory,
              customerId,
              callId,
              intentName: state.currentIntent,
            }),
          });

          const llmData = await llmResponse.json();
          const llmLatency = Date.now() - llmStart;
          state.metrics.llmLatency.push(llmLatency);

          console.log(`[Orchestrator] LLM response:`, llmData);

          // Update state
          state.conversationHistory.push(
            { role: 'user', content: transcript },
            { role: 'assistant', content: llmData.response || '' }
          );

          if (llmData.valid) {
            state.currentIntent = llmData.intent;
            state.partialEntities = { ...state.partialEntities, ...llmData.entities };
            state.confidenceScore = llmData.confidence;
            state.invalidAttempts = 0;

            // Send response for TTS
            socket.send(JSON.stringify({
              type: 'response',
              text: llmData.response,
              intent: llmData.intent,
              entities: llmData.entities,
              confidence: llmData.confidence,
            }));

            // If intent is complete, process it
            if (llmData.intent === 'book_appointment' && llmData.entities.datetime_iso) {
              console.log(`[Orchestrator] Booking appointment for call ${callId}`);
              
              // Create booking
              await supabase
                .from('bookings')
                .insert({
                  customer_id: customerId,
                  call_id: callId,
                  customer_name: llmData.entities.name,
                  customer_phone: llmData.entities.phone,
                  customer_email: llmData.entities.email,
                  service: llmData.entities.service,
                  appointment_date: llmData.entities.datetime_iso.split('T')[0],
                  appointment_time: llmData.entities.datetime_iso.split('T')[1]?.split('.')[0] || '00:00:00',
                  notes: llmData.entities.notes || '',
                  status: 'scheduled',
                });

              // Update metrics
              await supabase
                .from('call_metrics')
                .update({
                  intent_recognized: true,
                  intent_name: llmData.intent,
                  confidence_score: llmData.confidence,
                })
                .eq('call_id', callId);
            }
          } else {
            state.invalidAttempts++;
            console.log(`[Orchestrator] Invalid attempt #${state.invalidAttempts} for call ${callId}`);
          }

        } else if (message.type === 'audio') {
          // Forward audio to VAD for barge-in detection
          // This would be handled by client-side routing in production
        }
      } catch (error) {
        console.error('[Orchestrator] Error processing message:', error);
        socket.send(JSON.stringify({
          type: 'error',
          message: 'Processing error',
        }));
      }
    };

    socket.onclose = async () => {
      console.log(`[Orchestrator] Call ${callId} ended`);

      // Calculate final metrics
      const totalLatency = 
        (state.metrics.asrLatency.reduce((a, b) => a + b, 0) / state.metrics.asrLatency.length || 0) +
        (state.metrics.llmLatency.reduce((a, b) => a + b, 0) / state.metrics.llmLatency.length || 0) +
        (state.metrics.ttsLatency.reduce((a, b) => a + b, 0) / state.metrics.ttsLatency.length || 0);

      // Update final metrics
      await supabase
        .from('call_metrics')
        .update({
          asr_latency_ms: Math.round(state.metrics.asrLatency.reduce((a, b) => a + b, 0) / state.metrics.asrLatency.length || 0),
          llm_latency_ms: Math.round(state.metrics.llmLatency.reduce((a, b) => a + b, 0) / state.metrics.llmLatency.length || 0),
          tts_latency_ms: Math.round(state.metrics.ttsLatency.reduce((a, b) => a + b, 0) / state.metrics.ttsLatency.length || 0),
          total_latency_ms: Math.round(totalLatency),
          confidence_score: state.confidenceScore,
          invalid_attempts: state.invalidAttempts,
          rag_score: state.ragScore,
        })
        .eq('call_id', callId);

      console.log(`[Orchestrator] Final metrics: ASR=${Math.round(state.metrics.asrLatency[0] || 0)}ms, LLM=${Math.round(state.metrics.llmLatency[0] || 0)}ms, Total=${Math.round(totalLatency)}ms`);
    };

    socket.onerror = (error) => {
      console.error('[Orchestrator] WebSocket error:', error);
    };

    return response;
  } catch (error) {
    console.error('[Orchestrator] Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
