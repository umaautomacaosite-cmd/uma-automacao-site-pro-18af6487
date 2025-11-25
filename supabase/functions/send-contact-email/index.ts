import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

console.log("🚀 [send-contact-email] Function loaded and ready");

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  phone: string;
  company?: string;
  service_type: string;
  message: string;
  recipient_email: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log(`[send-contact-email] Request received - Method: ${req.method}`);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("[send-contact-email] Handling CORS preflight request");
    return new Response(null, { 
      status: 200,
      headers: corsHeaders 
    });
  }

  try {
    // Check if request has a body
    const text = await req.text();
    if (!text) {
      console.error("Empty request body");
      return new Response(
        JSON.stringify({ error: "Request body is empty" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const requestData: ContactEmailRequest = JSON.parse(text);
    const { name, email, phone, service_type, message, recipient_email } = requestData;
    const company = requestData.company || '';

    console.log("Sending contact email to:", recipient_email);

    // Send email to company
    const emailResponse = await resend.emails.send({
      from: "UMA AUTOMAÇÃO <contato@uma-automacao.com.br>",
      to: [recipient_email],
      subject: `Nova Solicitação de Orçamento - ${service_type}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7C2D3E;">Nova Solicitação de Orçamento</h2>
          <div style="background-color: #f4f4f4; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Nome Completo:</strong> ${name}</p>
            ${company ? `<p><strong>Empresa:</strong> ${company}</p>` : ''}
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Telefone:</strong> ${phone}</p>
            <p><strong>Tipo de Serviço:</strong> ${service_type}</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 15px 0;">
            <p><strong>Descrição:</strong></p>
            <p style="white-space: pre-wrap;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            Esta mensagem foi enviada através do formulário de contato do site.<br>
            <strong>Equipe UMA AUTOMAÇÃO</strong>
          </p>
        </div>
      `,
    });

    console.log("Email sent successfully to company:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      email: emailResponse
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
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
