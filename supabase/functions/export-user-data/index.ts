import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create export request
    const { data: exportRequest, error: requestError } = await supabaseClient
      .from('data_export_requests')
      .insert({
        user_id: user.id,
        status: 'processing',
      })
      .select()
      .single();

    if (requestError) throw requestError;

    // Gather all user data
    const userData: any = {
      user_info: {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
      },
      consents: [],
      access_logs: [],
      contact_messages: [],
    };

    // Get user consents
    const { data: consents } = await supabaseClient
      .from('user_legal_consents')
      .select('*')
      .eq('user_id', user.id);
    userData.consents = consents || [];

    // Get access logs
    const { data: logs } = await supabaseClient
      .from('legal_document_access_logs')
      .select('*')
      .eq('user_id', user.id);
    userData.access_logs = logs || [];

    // Get contact messages (if email matches)
    const { data: messages } = await supabaseClient
      .from('contact_messages')
      .select('*')
      .eq('email', user.email);
    userData.contact_messages = messages || [];

    // Create JSON export
    const jsonData = JSON.stringify(userData, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });

    // In a real implementation, you would upload this to storage
    // and return a download URL that expires after 7 days
    // For now, we'll return the data directly

    // Update export request
    await supabaseClient
      .from('data_export_requests')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      })
      .eq('id', exportRequest.id);

    return new Response(jsonData, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="user-data-${user.id}.json"`,
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
