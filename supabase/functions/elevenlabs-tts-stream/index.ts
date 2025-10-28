import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
    const customerId = url.searchParams.get('customerId');
    const callId = url.searchParams.get('callId');

    if (!customerId || !callId) {
      socket.close(1008, 'Missing customerId or callId');
      return response;
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get TTS config
    const { data: config } = await supabase
      .from('ai_configurations')
      .select('voice_pipeline')
      .eq('customer_id', customerId)
      .single();

    const ttsConfig = config?.voice_pipeline?.tts || {
      voice_id: '21m00Tcm4TlvDq8ikWAM',
      model_id: 'eleven_turbo_v2_5',
      stability: 0.5,
      similarity_boost: 0.75,
    };

    let sequence = 0;
    let isStopped = false;

    socket.onopen = () => {
      console.log(`[TTS] WebSocket opened for call ${callId}`);
      if (!ELEVENLABS_API_KEY) {
        socket.send(JSON.stringify({
          type: 'error',
          message: 'ELEVENLABS_API_KEY not configured',
        }));
        socket.close(1011, 'Configuration error');
      }
    };

    socket.onmessage = async (event) => {
      try {
        const message = JSON.parse(event.data);

        if (message.type === 'text') {
          const text = message.text;
          console.log(`[TTS] Generating speech for: "${text}"`);
          
          isStopped = false;
          sequence = 0;

          const startTime = Date.now();

          // Call ElevenLabs streaming API
          const response = await fetch(
            `https://api.elevenlabs.io/v1/text-to-speech/${ttsConfig.voice_id}/stream?optimize_streaming_latency=${ttsConfig.stream_latency || 2}`,
            {
              method: 'POST',
              headers: {
                'Accept': 'audio/mpeg',
                'Content-Type': 'application/json',
                'xi-api-key': ELEVENLABS_API_KEY!,
              },
              body: JSON.stringify({
                text,
                model_id: ttsConfig.model_id,
                voice_settings: {
                  stability: ttsConfig.stability,
                  similarity_boost: ttsConfig.similarity_boost,
                },
              }),
            }
          );

          if (!response.ok) {
            const error = await response.text();
            console.error('[TTS] ElevenLabs error:', error);
            socket.send(JSON.stringify({
              type: 'error',
              message: 'TTS generation failed',
            }));
            return;
          }

          const reader = response.body?.getReader();
          if (!reader) {
            throw new Error('No response body');
          }

          let firstChunk = true;

          while (true) {
            if (isStopped) {
              console.log('[TTS] Stopped by barge-in');
              reader.cancel();
              break;
            }

            const { done, value } = await reader.read();
            if (done) break;

            if (firstChunk) {
              const latency = Date.now() - startTime;
              console.log(`[TTS] First chunk latency: ${latency}ms`);
              firstChunk = false;
            }

            // Convert audio chunk to base64
            const base64Audio = btoa(String.fromCharCode(...value));

            socket.send(JSON.stringify({
              type: 'audio.chunk',
              data: base64Audio,
              sequence: sequence++,
              timestamp: Date.now(),
            }));
          }

          if (!isStopped) {
            socket.send(JSON.stringify({
              type: 'audio.done',
              timestamp: Date.now(),
            }));
            console.log(`[TTS] Completed speech generation (${sequence} chunks)`);
          }

        } else if (message.type === 'stop') {
          console.log('[TTS] Stop signal received');
          isStopped = true;
          socket.send(JSON.stringify({
            type: 'audio.stopped',
            timestamp: Date.now(),
          }));
        }
      } catch (error) {
        console.error('[TTS] Error processing message:', error);
        socket.send(JSON.stringify({
          type: 'error',
          message: error instanceof Error ? error.message : 'Unknown error',
        }));
      }
    };

    socket.onclose = () => {
      console.log(`[TTS] Client disconnected for call ${callId}`);
      isStopped = true;
    };

    socket.onerror = (error) => {
      console.error('[TTS] WebSocket error:', error);
    };

    return response;
  } catch (error) {
    console.error('[TTS] Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
