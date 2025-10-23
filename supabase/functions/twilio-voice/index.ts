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
    const url = new URL(req.url);
    const pathname = url.pathname;

    console.log('Twilio webhook called:', pathname);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Handle incoming call
    if (pathname.includes('/incoming')) {
      const formData = await req.formData();
      const from = formData.get('From') as string;
      const callSid = formData.get('CallSid') as string;

      console.log('Incoming call from:', from, 'CallSid:', callSid);

      // Create call record in database
      const { data: call, error } = await supabase
        .from('calls')
        .insert({
          phone_number: from,
          status: 'in-progress'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating call record:', error);
      } else {
        console.log('Call record created:', call.id);
      }

      // Get WebSocket URL for OpenAI edge function
      const wsUrl = `wss://${url.host}/functions/v1/openai-voice?callId=${call?.id || callSid}`;
      
      // Return TwiML to start Media Stream
      const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say>Please wait while we connect you to our AI assistant.</Say>
    <Connect>
        <Stream url="${wsUrl}">
            <Parameter name="callId" value="${call?.id || callSid}" />
        </Stream>
    </Connect>
</Response>`;

      return new Response(twiml, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/xml',
        },
      });
    }

    // Handle call status updates
    if (pathname.includes('/status')) {
      const formData = await req.formData();
      const callSid = formData.get('CallSid') as string;
      const callStatus = formData.get('CallStatus') as string;
      const callDuration = formData.get('CallDuration') as string;

      console.log('Call status update:', callSid, callStatus, callDuration);

      // Update call record when call ends
      if (callStatus === 'completed') {
        const { error } = await supabase
          .from('calls')
          .update({
            status: 'completed',
            ended_at: new Date().toISOString(),
            duration_sec: parseInt(callDuration || '0', 10)
          })
          .eq('phone_number', formData.get('From') as string)
          .is('ended_at', null);

        if (error) {
          console.error('Error updating call record:', error);
        } else {
          console.log('Call record updated to completed');
        }
      }

      return new Response('OK', {
        headers: corsHeaders,
      });
    }

    return new Response('Not Found', {
      status: 404,
      headers: corsHeaders,
    });

  } catch (error) {
    console.error('Error in twilio-voice function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
