
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req: Request) => {
  const url = new URL(req.url);
  const username = url.searchParams.get("username");
  
  if (!username) {
    return new Response(JSON.stringify({ error: "Username is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    
    // Get the GitHub token from environment variables
    const githubToken = Deno.env.get("GITHUB_TOKEN");
    
    // Call the external contributions API
    const contributionsApiUrl = `https://54p3k92j7i.execute-api.us-east-1.amazonaws.com/api/contributions?username=${username}${githubToken ? `&token=${githubToken}` : ''}`;
    
    const response = await fetch(contributionsApiUrl);
    
    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText}`);
      return new Response(JSON.stringify({ error: "Failed to fetch GitHub contributions" }), {
        status: response.status,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    const data = await response.json();
    
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=1800" // Cache for 30 minutes
      },
    });
  } catch (error) {
    console.error("Error fetching GitHub contributions:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
