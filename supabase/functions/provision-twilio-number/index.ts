import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, areaCode, phoneNumberSid } = await req.json();
    
    const twilioAccountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const twilioAuthToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    if (!twilioAccountSid || !twilioAuthToken) {
      throw new Error('Twilio credentials not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get user's customer_id
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('No authorization header');
    
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) throw new Error('Unauthorized');

    const { data: profile } = await supabase
      .from('profiles')
      .select('customer_id')
      .eq('user_id', user.id)
      .single();

    if (!profile?.customer_id) throw new Error('No customer ID found');
    const customerId = profile.customer_id;

    const twilioAuth = btoa(`${twilioAccountSid}:${twilioAuthToken}`);

    if (action === 'search') {
      // Search available phone numbers
      console.log('Searching for numbers in area code:', areaCode);
      
      const searchUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/AvailablePhoneNumbers/US/Local.json?AreaCode=${areaCode}&Limit=10`;
      
      const response = await fetch(searchUrl, {
        headers: {
          'Authorization': `Basic ${twilioAuth}`,
        },
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('Twilio search error:', error);
        throw new Error('Failed to search phone numbers');
      }

      const data = await response.json();
      console.log('Found numbers:', data.available_phone_numbers?.length || 0);
      
      return new Response(JSON.stringify({ 
        numbers: data.available_phone_numbers || [] 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } 
    
    else if (action === 'purchase') {
      // Purchase a phone number
      console.log('Purchasing number:', phoneNumberSid);
      
      const purchaseUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/IncomingPhoneNumbers.json`;
      
      // Configure webhook URL for incoming calls
      const webhookUrl = `${supabaseUrl}/functions/v1/twilio-voice`;
      
      const formData = new URLSearchParams();
      formData.append('PhoneNumber', phoneNumberSid);
      formData.append('VoiceUrl', webhookUrl);
      formData.append('VoiceMethod', 'POST');
      formData.append('StatusCallback', `${webhookUrl}/status`);
      formData.append('StatusCallbackMethod', 'POST');
      
      const response = await fetch(purchaseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${twilioAuth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('Twilio purchase error:', error);
        throw new Error('Failed to purchase phone number');
      }

      const purchasedNumber = await response.json();
      console.log('Purchased number:', purchasedNumber.phone_number);

      // Store in database
      const { data: dbNumber, error: dbError } = await supabase
        .from('phone_numbers')
        .insert({
          customer_id: customerId,
          phone_number: purchasedNumber.phone_number,
          twilio_sid: purchasedNumber.sid,
          status: 'active',
          settings: {
            voice_url: webhookUrl,
            area_code: areaCode,
          },
        })
        .select()
        .single();

      if (dbError) {
        console.error('Database error:', dbError);
        throw new Error('Failed to save phone number to database');
      }

      return new Response(JSON.stringify({ 
        success: true,
        number: dbNumber 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    else if (action === 'list') {
      // List customer's phone numbers
      const { data: numbers, error } = await supabase
        .from('phone_numbers')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return new Response(JSON.stringify({ numbers: numbers || [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    else {
      throw new Error('Invalid action');
    }

  } catch (error) {
    console.error('Error in provision-twilio-number:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
