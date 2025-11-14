import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('[Status] Received Twilio status callback');
    
    // Parse form data from Twilio
    const formData = await req.formData();
    const callSid = formData.get('CallSid') as string;
    const callStatus = formData.get('CallStatus') as string;
    const callDuration = formData.get('CallDuration') as string;
    
    console.log(`[Status] Call ${callSid} status: ${callStatus}, duration: ${callDuration}s`);

    if (!callSid) {
      console.error('[Status] Missing CallSid');
      return new Response('Missing CallSid', { status: 400, headers: corsHeaders });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Update call record based on status
    const updateData: any = {
      status: callStatus,
      updated_at: new Date().toISOString(),
    };

    // If call is completed, set ended_at and duration
    if (callStatus === 'completed' || callStatus === 'failed' || callStatus === 'busy' || callStatus === 'no-answer') {
      updateData.ended_at = new Date().toISOString();
      
      if (callDuration) {
        updateData.duration_sec = parseInt(callDuration, 10);
      }
    }

    const { error } = await supabase
      .from('calls')
      .update(updateData)
      .eq('twilio_call_sid', callSid);

    if (error) {
      console.error('[Status] Error updating call:', error);
      throw error;
    }

    console.log(`[Status] Successfully updated call ${callSid}`);

    return new Response('OK', {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'text/plain' },
    });

  } catch (error) {
    console.error('[Status] Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
