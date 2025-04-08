
import { supabase } from "@/integrations/supabase/client";

export type AuthUser = {
  id: string;
  email: string;
  isAdmin: boolean;
};

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string): Promise<AuthUser> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    console.error("Error signing in:", error);
    throw new Error(error.message);
  }
  
  // For this example, we'll consider any authenticated user as admin
  // In a real application, you would check against a database role or attribute
  const user: AuthUser = {
    id: data.user.id,
    email: data.user.email!,
    isAdmin: true, // Simplified for demo - assume all authenticated users are admins
  };
  
  return user;
};

// Sign out
export const signOut = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error("Error signing out:", error);
    throw new Error(error.message);
  }
};

// Get current session
export const getCurrentSession = async (): Promise<AuthUser | null> => {
  const { data, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error("Error getting session:", error);
    throw new Error(error.message);
  }
  
  if (!data.session) {
    return null;
  }
  
  // For this example, we'll consider any authenticated user as admin
  return {
    id: data.session.user.id,
    email: data.session.user.email!,
    isAdmin: true, // Simplified for demo - assume all authenticated users are admins
  };
};
