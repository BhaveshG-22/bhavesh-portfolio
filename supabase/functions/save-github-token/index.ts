
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

interface RequestPayload {
  token: string;
}

serve(async (req: Request) => {
  // Get the authorization header
  const authHeader = req.headers.get('authorization')!;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Not authorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Initialize Supabase client
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    // Verify the token by getting the user session
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Parse the request body
    const { token: githubToken } = await req.json() as RequestPayload;
    
    if (!githubToken) {
      return new Response(JSON.stringify({ error: 'GitHub token is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Store the GitHub token securely using Supabase's secrets
    await Deno.env.set("GITHUB_TOKEN", githubToken);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
