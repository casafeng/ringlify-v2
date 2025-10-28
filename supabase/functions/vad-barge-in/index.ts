import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple energy-based VAD (Voice Activity Detection)
function detectSpeech(audioData: Uint8Array, threshold: number): boolean {
  if (audioData.length === 0) return false;

  // Calculate RMS (Root Mean Square) energy
  let sum = 0;
  for (let i = 0; i < audioData.length; i += 2) {
    // Read 16-bit PCM sample (little-endian)
    const sample = (audioData[i + 1] << 8) | audioData[i];
    const normalized = sample / 32768.0;
    sum += normalized * normalized;
  }
  
  const rms = Math.sqrt(sum / (audioData.length / 2));
  return rms > threshold;
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
    const customerId = url.searchParams.get('customerId');
    const callId = url.searchParams.get('callId');

    if (!customerId || !callId) {
      socket.close(1008, 'Missing customerId or callId');
      return response;
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get VAD config
    const { data: config } = await supabase
      .from('ai_configurations')
      .select('voice_pipeline')
      .eq('customer_id', customerId)
      .single();

    const vadConfig = config?.voice_pipeline?.vad || {
      enabled: true,
      threshold: 0.02,
      silence_duration_ms: 1000,
      prefix_padding_ms: 300,
    };

    let silenceStart: number | null = null;
    let speechDetected = false;
    let bargeInCount = 0;

    socket.onopen = () => {
      console.log(`[VAD] WebSocket opened for call ${callId}`);
      socket.send(JSON.stringify({
        type: 'vad.ready',
        config: vadConfig,
      }));
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);

        if (message.type === 'audio') {
          const audioData = Uint8Array.from(atob(message.data), c => c.charCodeAt(0));
          const hasSpeech = detectSpeech(audioData, vadConfig.threshold);

          if (hasSpeech) {
            if (!speechDetected) {
              speechDetected = true;
              bargeInCount++;
              
              console.log(`[VAD] Speech detected (barge-in #${bargeInCount})`);
              
              socket.send(JSON.stringify({
                type: 'speech.detected',
                confidence: 0.9,
                action: 'stop_tts',
                timestamp: Date.now(),
                bargeInCount,
              }));
            }
            silenceStart = null;
          } else {
            if (speechDetected) {
              if (silenceStart === null) {
                silenceStart = Date.now();
              } else if (Date.now() - silenceStart > vadConfig.silence_duration_ms) {
                speechDetected = false;
                silenceStart = null;
                
                console.log(`[VAD] Speech ended after ${vadConfig.silence_duration_ms}ms silence`);
                
                socket.send(JSON.stringify({
                  type: 'speech.ended',
                  timestamp: Date.now(),
                }));
              }
            }
          }
        } else if (message.type === 'reset') {
          speechDetected = false;
          silenceStart = null;
          console.log('[VAD] Reset state');
        }
      } catch (error) {
        console.error('[VAD] Error processing message:', error);
      }
    };

    socket.onclose = async () => {
      console.log(`[VAD] Client disconnected for call ${callId}`);
      
      // Update call metrics with barge-in count
      await supabase
        .from('call_metrics')
        .update({ barge_in_count: bargeInCount })
        .eq('call_id', callId);
    };

    socket.onerror = (error) => {
      console.error('[VAD] WebSocket error:', error);
    };

    return response;
  } catch (error) {
    console.error('[VAD] Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
