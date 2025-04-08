import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { AuthUser, getCurrentSession, signInWithEmail, signOut } from "@/services/authService";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on load
  useEffect(() => {
    async function loadUser() {
      try {
        const session = await getCurrentSession();
        setUser(session);
      } catch (error) {
        console.error("Error loading user session:", error);
      } finally {
        setLoading(false);
      }
    }
    
    loadUser();
    
    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          // User is signed in
          setUser({
            id: session.user.id,
            email: session.user.email!,
            isAdmin: true, // Simplified for demo
          });
        } else {
          // User is signed out
          setUser(null);
        }
        setLoading(false);
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const user = await signInWithEmail(email, password);
      setUser(user);
      toast.success("Successfully logged in");
    } catch (error: any) {
      toast.error(`Login failed: ${error.message}`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await signOut();
      setUser(null);
      toast.success("Successfully logged out");
    } catch (error: any) {
      toast.error(`Logout failed: ${error.message}`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAdmin: !!user?.isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
