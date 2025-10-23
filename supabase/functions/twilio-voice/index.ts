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

    console.log('=== TWILIO WEBHOOK RECEIVED ===');
    console.log('Path:', pathname);
    console.log('Method:', req.method);
    console.log('Content-Type:', req.headers.get('content-type'));

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Handle incoming call - Twilio can send GET or POST
    if (pathname.includes('/incoming')) {
      console.log('=== INCOMING CALL HANDLER ===');
      
      // Parse parameters from either GET query string or POST body
      let params: URLSearchParams;
      if (req.method === 'GET') {
        params = new URLSearchParams(url.search);
      } else {
        const body = await req.text();
        console.log('POST body:', body);
        params = new URLSearchParams(body);
      }
      
      const from = params.get('From') || '';
      const callSid = params.get('CallSid') || '';
      const to = params.get('To') || '';

      console.log('Call details - From:', from, 'To:', to, 'CallSid:', callSid);

      // Look up customer_id from phone_numbers table using the To number
      const { data: phoneNumber, error: phoneError } = await supabase
        .from('phone_numbers')
        .select('customer_id')
        .eq('phone_number', to)
        .maybeSingle();

      if (phoneError) {
        console.error('Error looking up phone number:', phoneError);
      }

      const customerId = phoneNumber?.customer_id;
      console.log('Customer ID for phone number:', customerId);

      // Create call record in database
      const { data: call, error } = await supabase
        .from('calls')
        .insert({
          phone_number: from,
          twilio_call_sid: callSid,
          status: 'in-progress',
          customer_id: customerId
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating call record:', error);
      } else {
        console.log('Call record created:', call.id);
      }

      // Build WebSocket URL for OpenAI edge function
      // CRITICAL: Use the full Supabase project URL for WebSocket
      const projectId = 'qwnollcgtkduspiojzpd';
      const wsUrl = `wss://${projectId}.supabase.co/functions/v1/openai-voice?callId=${call?.id || callSid}&customerId=${customerId || ''}`;
      
      console.log('WebSocket URL:', wsUrl);
      
      // Return TwiML to start Media Stream
      const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say>Connecting you to Ringlfy AI assistant.</Say>
    <Connect>
        <Stream url="${wsUrl}">
            <Parameter name="callId" value="${call?.id || callSid}" />
        </Stream>
    </Connect>
</Response>`;

      console.log('Returning TwiML:', twiml);

      return new Response(twiml, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/xml',
        },
      });
    }

    // Handle call status updates
    if (pathname.includes('/status')) {
      console.log('=== STATUS CALLBACK ===');
      
      // Parse parameters from either GET or POST
      let params: URLSearchParams;
      if (req.method === 'GET') {
        params = new URLSearchParams(url.search);
      } else {
        const body = await req.text();
        params = new URLSearchParams(body);
      }
      
      const callSid = params.get('CallSid') || '';
      const callStatus = params.get('CallStatus') || '';
      const callDuration = params.get('CallDuration') || '0';

      console.log('Status update - CallSid:', callSid, 'Status:', callStatus, 'Duration:', callDuration);

      // Update call record when call ends
      if (callStatus === 'completed') {
        const { error } = await supabase
          .from('calls')
          .update({
            status: 'completed',
            ended_at: new Date().toISOString(),
            duration_sec: parseInt(callDuration, 10)
          })
          .eq('twilio_call_sid', callSid);

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
