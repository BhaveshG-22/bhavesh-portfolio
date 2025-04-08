
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@1.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// CORS headers to allow requests from our app
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Define the expected request body structure
interface NotificationRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse the request body
    const { name, email, subject, message }: NotificationRequest = await req.json();
    
    console.log(`Processing notification request for: ${name} <${email}>, Subject: ${subject}`);

    // Create HTML content for the email
    const htmlContent = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <h3>Message:</h3>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `;

    // Send the notification email
    const emailResponse = await resend.emails.send({
      from: "Contact Form <trial@trial.dev>", // Update with your verified domain later
      to: "bgavali@algomau.ca", // Replace with your actual email address
      subject: `[Contact Form] ${subject}`,
      html: htmlContent,
      reply_to: email,
    });

    console.log("Email notification sent:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 
        "Content-Type": "application/json",
        ...corsHeaders 
      },
    });
  } catch (error) {
    console.error("Error sending notification:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Failed to send notification" 
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        },
      }
    );
  }
});
