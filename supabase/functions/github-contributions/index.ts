
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

serve(async (req: Request) => {
  try {
    const url = new URL(req.url);
    const username = url.searchParams.get("username");
    
    if (!username) {
      return new Response(JSON.stringify({ error: "Username is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

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
      
      // Generate fallback data
      const fallbackData = generateFallbackData(username);
      
      return new Response(JSON.stringify({
        ...fallbackData,
        error: "Failed to fetch from GitHub API, using simulated data",
      }), {
        status: 200,
        headers: { 
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=1800" // Cache for 30 minutes
        },
      });
    }
    
    const data = await response.json() as ApiResponse;
    
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=1800" // Cache for 30 minutes
      },
    });
  } catch (error) {
    console.error("Error fetching GitHub contributions:", error);
    
    // Generate fallback data with the default username
    const fallbackData = generateFallbackData("octocat");
    
    return new Response(JSON.stringify({
      ...fallbackData,
      error: "Internal server error, using simulated data"
    }), {
      status: 200, // Still return 200 with fallback data
      headers: { "Content-Type": "application/json" },
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
