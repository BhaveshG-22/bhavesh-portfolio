import { supabase } from "@/integrations/supabase/client";

export type BlogPost = {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
  image: string;
  read_time: string;
  hidden?: boolean;
  is_default?: boolean;
  created_at?: string;
  updated_at?: string;
};

// Fetch all blog posts
export const fetchBlogPosts = async (): Promise<BlogPost[]> => {
  console.log("Fetching all blog posts...");
  try {
    // Use a type assertion to tell TypeScript this is a valid query
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("is_default", { ascending: false })
      .order("id");
    
    if (error) {
      console.error("Error fetching blog posts:", error);
      throw new Error(`Error fetching blog posts: ${error.message}`);
    }
    
    console.log(`Successfully fetched ${data?.length || 0} blog posts`);
    return (data || []) as BlogPost[];
  } catch (error) {
    console.error("Unexpected error in fetchBlogPosts:", error);
    throw error;
  }
};

// Fetch only visible blog posts
export const fetchVisibleBlogPosts = async (): Promise<BlogPost[]> => {
  console.log("Fetching visible blog posts...");
  try {
    // Use a type assertion to tell TypeScript this is a valid query
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("hidden", false)
      .order("is_default", { ascending: false })
      .order("id");
    
    if (error) {
      console.error("Error fetching visible blog posts:", error);
      throw new Error(`Error fetching visible blog posts: ${error.message}`);
    }
    
    console.log(`Successfully fetched ${data?.length || 0} visible blog posts`);
    console.log("First visible blog post (if any):", data && data.length > 0 ? data[0] : "No blog posts");
    return (data || []) as BlogPost[];
  } catch (error) {
    console.error("Unexpected error in fetchVisibleBlogPosts:", error);
    throw error;
  }
};

// Fetch all categories
export const fetchCategories = async (): Promise<string[]> => {
  console.log("Fetching blog categories...");
  try {
    // Use a type assertion to tell TypeScript this is a valid query
    const { data, error } = await supabase
      .from("blog_categories")
      .select("name")
      .order("id");
    
    if (error) {
      console.error("Error fetching blog categories:", error);
      throw new Error(`Error fetching blog categories: ${error.message}`);
    }
    
    console.log(`Successfully fetched ${data?.length || 0} blog categories`);
    return ((data as { name: string }[] || []).map(category => category.name));
  } catch (error) {
    console.error("Unexpected error in fetchCategories:", error);
    throw error;
  }
};

// Add a new blog post
export const addBlogPost = async (blogPost: Omit<BlogPost, "id" | "created_at" | "updated_at">): Promise<BlogPost> => {
  // Use a type assertion to tell TypeScript this is a valid query
  const { data, error } = await supabase
    .from("blog_posts")
    .insert([blogPost])
    .select()
    .single();
  
  if (error) {
    console.error("Error adding blog post:", error);
    throw new Error(error.message);
  }
  
  return data as BlogPost;
};

// Update a blog post
export const updateBlogPost = async (id: number, updates: Partial<Omit<BlogPost, "id" | "created_at" | "updated_at">>): Promise<BlogPost> => {
  // Use a type assertion to tell TypeScript this is a valid query
  const { data, error } = await supabase
    .from("blog_posts")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating blog post:", error);
    throw new Error(error.message);
  }
  
  return data as BlogPost;
};

// Delete a blog post
export const deleteBlogPost = async (id: number): Promise<void> => {
  // Use a type assertion to tell TypeScript this is a valid query
  const { error } = await supabase
    .from("blog_posts")
    .delete()
    .eq("id", id);
  
  if (error) {
    console.error("Error deleting blog post:", error);
    throw new Error(error.message);
  }
};

// Toggle blog post visibility
export const toggleBlogVisibility = async (id: number, isHidden: boolean): Promise<BlogPost> => {
  return updateBlogPost(id, { hidden: !isHidden });
};

// Add a new category
export const addCategory = async (name: string): Promise<string> => {
  // Use a type assertion to tell TypeScript this is a valid query
  const { data, error } = await supabase
    .from("blog_categories")
    .insert([{ name }])
    .select()
    .single();
  
  if (error) {
    console.error("Error adding blog category:", error);
    throw new Error(error.message);
  }
  
  return (data as { name: string }).name;
};

// Delete a category
export const deleteCategory = async (name: string): Promise<void> => {
  // Use a type assertion to tell TypeScript this is a valid query
  const { error } = await supabase
    .from("blog_categories")
    .delete()
    .eq("name", name);
  
  if (error) {
    console.error("Error deleting blog category:", error);
    throw new Error(error.message);
  }
};

// Reset categories to default
export const resetCategories = async (): Promise<string[]> => {
  // First delete all non-default categories
  await supabase
    .from("blog_categories")
    .delete()
    .not("name", "in", '("All","React","TypeScript","CSS","UI/UX","JavaScript")');
  
  // Make sure default categories exist
  const defaultCategories = ["All", "React", "TypeScript", "CSS", "UI/UX", "JavaScript"];
  
  // Get existing categories
  const { data: existingCategoriesData } = await supabase
    .from("blog_categories")
    .select("name");
    
  const existingCategories = ((existingCategoriesData as { name: string }[] || []).map(cat => cat.name));
  
  // Add any missing default categories
  for (const category of defaultCategories) {
    if (!existingCategories.includes(category)) {
      await supabase
        .from("blog_categories")
        .insert({ name: category });
    }
  }
  
  return fetchCategories();
};
