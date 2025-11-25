import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

console.log("🚀 [send-verification-code] Function loaded and ready");

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerificationCodeRequest {
  email: string;
  code: string;
  role: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log(`[send-verification-code] Request received - Method: ${req.method}`);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("[send-verification-code] Handling CORS preflight request");
    return new Response(null, { 
      status: 200,
      headers: corsHeaders 
    });
  }

  try {
    const { email, code, role }: VerificationCodeRequest = await req.json();

    console.log("Sending verification code to:", email);

    const emailResponse = await resend.emails.send({
      from: "UMA AUTOMAÇÃO <noreply@uma-automacao.com.br>",
      to: [email],
      subject: "Código de Verificação - Painel Administrativo",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7C2D3E;">Código de Verificação</h2>
          <p>Olá,</p>
          <p>Foi solicitado acesso ao painel administrativo como <strong>${role === 'admin' ? 'Administrador' : 'Moderador'}</strong>.</p>
          <p>Use o código abaixo para completar seu login:</p>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0; border-radius: 5px;">
            <h1 style="color: #7C2D3E; font-size: 32px; letter-spacing: 5px; margin: 0;">${code}</h1>
          </div>
          <p style="color: #d9534f;"><strong>⚠️ Este código expira em 10 minutos.</strong></p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            Se você não solicitou este código, por favor ignore este email. 
            Sua conta permanece segura e nenhuma ação é necessária.
          </p>
          <p style="color: #666; font-size: 12px;">
            Atenciosamente,<br>
            <strong>Equipe UMA AUTOMAÇÃO</strong>
          </p>
        </div>
      `,
    });

    console.log("Verification code email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true,
      email_response: emailResponse 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-verification-code function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
