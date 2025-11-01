import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Buscar códigos expirados e não usados
    const { data: expiredCodes, error: fetchError } = await supabaseClient
      .from('access_codes')
      .select('*')
      .lt('expires_at', new Date().toISOString())
      .eq('used', false)

    if (fetchError) {
      throw fetchError
    }

    console.log(`Found ${expiredCodes?.length || 0} expired codes`)

    let renewedCount = 0
    
    // Para cada código expirado, criar um novo
    for (const expiredCode of expiredCodes || []) {
      // Gerar novo código
      const newCode = Math.random().toString(36).substring(2, 10).toUpperCase()
      const expiryDate = new Date()
      expiryDate.setMinutes(expiryDate.getMinutes() + 15) // 15 minutos

      // Inserir novo código
      const { error: insertError } = await supabaseClient
        .from('access_codes')
        .insert({
          code: newCode,
          expires_at: expiryDate.toISOString(),
          used: false,
          user_id: expiredCode.user_id
        })

      if (insertError) {
        console.error(`Error inserting new code for user ${expiredCode.user_id}:`, insertError)
        continue
      }

      // Marcar código antigo como usado
      await supabaseClient
        .from('access_codes')
        .update({ used: true })
        .eq('id', expiredCode.id)

      renewedCount++
      console.log(`Renewed code for user ${expiredCode.user_id}: ${newCode}`)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Renovados ${renewedCount} códigos de acesso`,
        renewedCount 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})