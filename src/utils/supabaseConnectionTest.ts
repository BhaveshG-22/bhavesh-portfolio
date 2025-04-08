
import { supabase } from "@/integrations/supabase/client";

/**
 * Tests the connection to Supabase and returns information about
 * the blog_posts, blog_categories and projects tables
 */
export const testSupabaseConnection = async () => {
  console.log("Testing Supabase connection...");
  
  try {
    // Test general connection
    const { data: healthData, error: healthError } = await supabase.from('blog_posts').select('count').limit(1);
    
    if (healthError) {
      return {
        success: false,
        error: `Connection error: ${healthError.message}`,
        details: healthError
      };
    }
    
    // Check blog_posts table
    const { data: postsData, error: postsError } = await supabase
      .from('blog_posts')
      .select('count')
      .limit(1);
    
    // Check blog_categories table
    const { data: categoriesData, error: categoriesError } = await supabase
      .from('blog_categories')
      .select('count')
      .limit(1);
    
    // Check projects table
    const { data: projectsData, error: projectsError } = await supabase
      .from('projects')
      .select('count')
      .limit(1);
    
    return {
      success: true,
      connection: "Successful",
      projectRef: healthData,
      tables: {
        blog_posts: {
          accessible: !postsError,
          error: postsError ? postsError.message : null
        },
        blog_categories: {
          accessible: !categoriesError,
          error: categoriesError ? categoriesError.message : null
        },
        projects: {
          accessible: !projectsError,
          error: projectsError ? projectsError.message : null,
          count: projectsData
        }
      }
    };
  } catch (error) {
    return {
      success: false,
      error: `Unexpected error: ${error instanceof Error ? error.message : String(error)}`,
      details: error
    };
  }
};

// Export a function that can be called from React components
export const runSupabaseConnectionTest = async () => {
  const result = await testSupabaseConnection();
  console.log("Supabase connection test result:", result);
  return result;
};
