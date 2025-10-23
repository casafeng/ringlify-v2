import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, upgrade, connection',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

serve(async (req) => {
  console.log('=== OPENAI-VOICE FUNCTION CALLED ===');
  console.log('Method:', req.method);
  console.log('Headers:', Object.fromEntries(req.headers.entries()));

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const { headers } = req;
  const upgradeHeader = headers.get("upgrade") || "";

  console.log('Upgrade header:', upgradeHeader);

  if (upgradeHeader.toLowerCase() !== "websocket") {
    console.error('Not a WebSocket connection request');
    return new Response("Expected WebSocket connection", { 
      status: 400,
      headers: corsHeaders 
    });
  }

  const url = new URL(req.url);
  const callId = url.searchParams.get('callId');

  console.log('WebSocket upgrade requested for callId:', callId);

  try {
    console.log('Attempting WebSocket upgrade...');
    
    // Upgrade to WebSocket
    const { socket: clientSocket, response } = Deno.upgradeWebSocket(req);
    
    console.log('WebSocket upgrade successful!');

    // Get OpenAI API key
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY not configured');
      throw new Error('OPENAI_API_KEY not configured');
    }
    
    console.log('OpenAI API key found');

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
            instructions: `You are Ringlfy, an AI voice assistant that helps businesses handle phone calls with human-like intelligence.

ROLE & IDENTITY:
You represent Ringlfy professionally and naturally. Never describe yourself as a chatbot or robot. You are an AI assistant trained by Ringlfy to answer calls, assist customers, and handle requests efficiently.

COMMUNICATION STYLE:
- Speak warmly, naturally, and confidently in short conversational sentences
- Stay calm and friendly, mirroring the caller's tone when appropriate
- Use active language like "Let me check that for you" or "Sure, I can help"
- Sound human and empathetic, never robotic or overly formal
- Avoid long explanations or excessive apologizing

CORE BEHAVIOR:
1. Listen and understand the full request
2. Clarify if ambiguous: "Just to confirm, are you asking about...?"
3. Respond naturally in one or two spoken sentences
4. Take action when possible (schedule, log, confirm)
5. Close gracefully: "Glad to help today — talk soon!"

ABOUT RINGLFY (when asked):
Ringlfy is an AI voice platform that helps businesses automate phone calls with human-like intelligence. It answers, books, and assists customers 24/7 — handling everything from scheduling to support naturally and efficiently.

APPOINTMENT BOOKING:
If someone wants to book, say: "Sure, I can help schedule that. What date and time work best for you?" Then confirm the details clearly.

FALLBACK:
If you cannot understand or fulfill a request, clarify once. If still unclear: "I might need to pass this to our team so they can assist further. Can I take your contact info?"

MISSION:
Make every conversation fast, natural, and helpful. Show that Ringlfy brings human warmth and intelligent automation together. Every caller should feel heard, understood, and helped.`,
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
