import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const DEEPGRAM_API_KEY = Deno.env.get('DEEPGRAM_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ASRConfig {
  model?: string;
  language?: string;
  interim_results?: boolean;
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

    // Get ASR config from ai_configurations
    const { data: config } = await supabase
      .from('ai_configurations')
      .select('voice_pipeline')
      .eq('customer_id', customerId)
      .single();

    const asrConfig: ASRConfig = config?.voice_pipeline?.asr || {
      model: 'nova-2',
      language: 'en-US',
      interim_results: true,
    };

    let deepgramSocket: WebSocket | null = null;

    socket.onopen = () => {
      console.log(`[ASR] WebSocket opened for call ${callId}`);

      if (!DEEPGRAM_API_KEY) {
        socket.send(JSON.stringify({
          type: 'error',
          message: 'DEEPGRAM_API_KEY not configured',
        }));
        socket.close(1011, 'Configuration error');
        return;
      }

      // Connect to Deepgram
      const deepgramUrl = `wss://api.deepgram.com/v1/listen?model=${asrConfig.model}&language=${asrConfig.language}&punctuate=true&interim_results=${asrConfig.interim_results}`;
      
      deepgramSocket = new WebSocket(deepgramUrl, {
        headers: {
          'Authorization': `Token ${DEEPGRAM_API_KEY}`,
        },
      });

      deepgramSocket.onopen = () => {
        console.log(`[ASR] Connected to Deepgram for call ${callId}`);
        socket.send(JSON.stringify({ type: 'asr.connected' }));
      };

      deepgramSocket.onmessage = (event) => {
        try {
          const response = JSON.parse(event.data);
          
          if (response.type === 'Results') {
            const transcript = response.channel?.alternatives?.[0];
            if (transcript?.transcript) {
              const isFinal = response.is_final || false;
              
              socket.send(JSON.stringify({
                type: isFinal ? 'transcript.final' : 'transcript.partial',
                text: transcript.transcript,
                confidence: transcript.confidence || 0,
                timestamp: Date.now(),
              }));

              console.log(`[ASR] ${isFinal ? 'Final' : 'Partial'}: "${transcript.transcript}" (confidence: ${transcript.confidence})`);
            }
          }
        } catch (error) {
          console.error('[ASR] Error parsing Deepgram response:', error);
        }
      };

      deepgramSocket.onerror = (error) => {
        console.error('[ASR] Deepgram error:', error);
        socket.send(JSON.stringify({
          type: 'error',
          message: 'ASR connection error',
        }));
      };

      deepgramSocket.onclose = () => {
        console.log(`[ASR] Deepgram connection closed for call ${callId}`);
        socket.send(JSON.stringify({ type: 'asr.disconnected' }));
      };
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);

        if (message.type === 'audio' && deepgramSocket && deepgramSocket.readyState === WebSocket.OPEN) {
          // Forward audio to Deepgram
          const audioData = Uint8Array.from(atob(message.data), c => c.charCodeAt(0));
          deepgramSocket.send(audioData);
        } else if (message.type === 'stop') {
          // Send finalize message to Deepgram
          if (deepgramSocket && deepgramSocket.readyState === WebSocket.OPEN) {
            deepgramSocket.send(JSON.stringify({ type: 'CloseStream' }));
          }
        }
      } catch (error) {
        console.error('[ASR] Error processing message:', error);
      }
    };

    socket.onclose = () => {
      console.log(`[ASR] Client disconnected for call ${callId}`);
      if (deepgramSocket) {
        deepgramSocket.close();
      }
    };

    socket.onerror = (error) => {
      console.error('[ASR] WebSocket error:', error);
      if (deepgramSocket) {
        deepgramSocket.close();
      }
    };

    return response;
  } catch (error) {
    console.error('[ASR] Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
