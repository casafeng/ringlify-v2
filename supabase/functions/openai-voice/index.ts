import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const { headers } = req;
  const upgradeHeader = headers.get("upgrade") || "";

  if (upgradeHeader.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket connection", { status: 400 });
  }

  const url = new URL(req.url);
  const callId = url.searchParams.get('callId');

  console.log('OpenAI Voice WebSocket connection requested for callId:', callId);

  try {
    // Upgrade to WebSocket
    const { socket: clientSocket, response } = Deno.upgradeWebSocket(req);

    // Get OpenAI API key
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let openAISocket: WebSocket | null = null;
    let transcriptBuffer = '';

    clientSocket.onopen = () => {
      console.log('Client WebSocket connected');

      // Connect to OpenAI Realtime API
      openAISocket = new WebSocket(
        'wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01',
        {
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'OpenAI-Beta': 'realtime=v1',
          }
        }
      );

      openAISocket.onopen = () => {
        console.log('OpenAI WebSocket connected');
        
        // Send session configuration
        openAISocket?.send(JSON.stringify({
          type: 'session.update',
          session: {
            modalities: ['text', 'audio'],
            instructions: 'You are a friendly AI receptionist for a business. Your job is to:\n1. Greet callers warmly\n2. Ask how you can help them today\n3. Listen carefully to their needs\n4. Provide helpful information\n5. Thank them for calling\n\nKeep responses concise and natural. If they want to book an appointment, acknowledge their request and confirm the details.',
            voice: 'alloy',
            input_audio_format: 'pcm16',
            output_audio_format: 'pcm16',
            input_audio_transcription: {
              model: 'whisper-1'
            },
            turn_detection: {
              type: 'server_vad',
              threshold: 0.5,
              prefix_padding_ms: 300,
              silence_duration_ms: 1000
            },
            temperature: 0.8,
            max_response_output_tokens: 'inf'
          }
        }));
      };

      openAISocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('OpenAI event:', data.type);

        // Handle audio responses - forward to Twilio
        if (data.type === 'response.audio.delta' && data.delta) {
          clientSocket.send(JSON.stringify({
            event: 'media',
            media: {
              payload: data.delta
            }
          }));
        }

        // Collect transcript
        if (data.type === 'conversation.item.input_audio_transcription.completed') {
          transcriptBuffer += `User: ${data.transcript}\n`;
        }

        if (data.type === 'response.audio_transcript.delta') {
          if (data.delta) {
            transcriptBuffer += data.delta;
          }
        }

        if (data.type === 'response.audio_transcript.done') {
          transcriptBuffer += `\nAI: ${data.transcript}\n`;
        }

        // Handle session created
        if (data.type === 'session.created') {
          console.log('OpenAI session created:', data.session.id);
        }

        // Handle errors
        if (data.type === 'error') {
          console.error('OpenAI error:', data.error);
        }
      };

      openAISocket.onerror = (error) => {
        console.error('OpenAI WebSocket error:', error);
      };

      openAISocket.onclose = () => {
        console.log('OpenAI WebSocket closed');
      };
    };

    clientSocket.onmessage = async (event) => {
      const message = JSON.parse(event.data);

      // Forward audio from Twilio to OpenAI
      if (message.event === 'media' && message.media?.payload) {
        openAISocket?.send(JSON.stringify({
          type: 'input_audio_buffer.append',
          audio: message.media.payload
        }));
      }

      // Handle stream start
      if (message.event === 'start') {
        console.log('Media stream started:', message.start);
      }

      // Handle stream stop - save transcript
      if (message.event === 'stop') {
        console.log('Media stream stopped');
        
        if (callId && transcriptBuffer) {
          // Save transcript to database
          const { error } = await supabase
            .from('calls')
            .update({ transcript: transcriptBuffer })
            .eq('id', callId);

          if (error) {
            console.error('Error saving transcript:', error);
          } else {
            console.log('Transcript saved for call:', callId);
          }
        }
      }
    };

    clientSocket.onerror = (error) => {
      console.error('Client WebSocket error:', error);
    };

    clientSocket.onclose = () => {
      console.log('Client WebSocket closed');
      openAISocket?.close();
    };

    return response;

  } catch (error) {
    console.error('Error in openai-voice function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
