
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Define response type matching the API format
interface ContributionDay {
  contributionCount: number;
  date: string;
}

interface ApiResponse {
  userName: string;
  totalContributions: number;
  contributionDays: ContributionDay[];
}

// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json'
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const url = new URL(req.url);
    const username = url.searchParams.get("username");
    
    if (!username) {
      console.error("Error: Username is required");
      return new Response(JSON.stringify({ error: "Username is required" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    
    // Get the GitHub token from environment variables
    const githubToken = Deno.env.get("GITHUB_TOKEN");
    
    // Check if GitHub token is available
    if (!githubToken) {
      console.error("Error: GitHub token is required but not configured");
      return new Response(JSON.stringify({ error: "GitHub token is required but not configured" }), {
        status: 400,
        headers: corsHeaders,
      });
    }
    
    // Call the external contributions API
    const contributionsApiUrl = `https://54p3k92j7i.execute-api.us-east-1.amazonaws.com/api/contributions?username=${username}${githubToken ? `&token=${githubToken}` : ''}`;
    
    // Log the API URL for debugging (without the token)
    console.log(`Calling GitHub contributions API for user ${username}`);
    
    const response = await fetch(contributionsApiUrl);
    const contentType = response.headers.get('content-type');
    
    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText}`);
      console.error(`Content-Type: ${contentType}`);
      
      if (contentType && contentType.includes('text/html')) {
        const text = await response.text();
        console.error(`Received HTML response instead of JSON: ${text.substring(0, 200)}...`);
      }
      
      // Generate fallback data
      const fallbackData = generateFallbackData(username);
      
      return new Response(JSON.stringify({
        ...fallbackData,
        error: `Failed to fetch from GitHub API (status: ${response.status}), using simulated data`,
      }), {
        status: 200,
        headers: corsHeaders,
      });
    }
    
    if (!contentType || !contentType.includes('application/json')) {
      console.error(`Invalid content type: ${contentType}`);
      const text = await response.text();
      console.error(`Non-JSON response: ${text.substring(0, 200)}...`);
      
      // Generate fallback data
      const fallbackData = generateFallbackData(username);
      
      return new Response(JSON.stringify({
        ...fallbackData,
        error: "API returned non-JSON response, using simulated data",
      }), {
        status: 200,
        headers: corsHeaders,
      });
    }
    
    const data = await response.json() as ApiResponse;
    
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("Error fetching GitHub contributions:", error);
    
    // Generate fallback data with the provided username or default to "octocat"
    const username = new URL(req.url).searchParams.get("username") || "octocat";
    const fallbackData = generateFallbackData(username);
    
    return new Response(JSON.stringify({
      ...fallbackData,
      error: `Internal server error: ${error.message}, using simulated data`
    }), {
      status: 200, // Still return 200 with fallback data
      headers: corsHeaders,
    });
  }
});

// Function to generate fallback contribution data
function generateFallbackData(username: string): ApiResponse {
  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(today.getFullYear() - 1);
  
  const contributionDays: ContributionDay[] = [];
  let totalContributions = 0;
  
  // Generate 365 days of data (1 year)
  for (let dayIndex = 0; dayIndex < 365; dayIndex++) {
    const date = new Date(oneYearAgo);
    date.setDate(date.getDate() + dayIndex);
    const dateStr = date.toISOString().split('T')[0];
    
    // Random contribution count
    const rand = Math.random();
    let contributionCount = 0;
    
    if (rand < 0.6) {
      contributionCount = 0;
    } else if (rand < 0.75) {
      contributionCount = 1;
    } else if (rand < 0.85) {
      contributionCount = Math.floor(Math.random() * 3) + 2; // 2-4
    } else if (rand < 0.95) {
      contributionCount = Math.floor(Math.random() * 5) + 5; // 5-9
    } else {
      contributionCount = Math.floor(Math.random() * 15) + 10; // 10-24
    }
    
    contributionDays.push({
      contributionCount,
      date: dateStr,
    });
    
    totalContributions += contributionCount;
  }
  
  return {
    userName: username,
    totalContributions,
    contributionDays,
  };
}
