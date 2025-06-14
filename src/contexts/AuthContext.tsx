import React, { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from '@supabase/supabase-js';

type UserProfile = {
  id: string;
  username: string;
  role: string;
  roles?: string[]; // Add roles array for application roles
};

type AuthContextType = {
  user: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, username: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  roles: string[]; // Expose roles (read-only)
  hasRole: (role: string) => boolean; // Helper to check for specific roles
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [roles, setRoles] = useState<string[]>([]);
  const { toast } = useToast();

  // Helper: fetch roles for user
  const fetchRoles = async (userId: string) => {
    // User roles are in user_roles table with role values 'lab', 'bds', 'reception'
    if (!userId) return [];
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId);
    if (error) {
      console.error("Unable to fetch user roles", error);
      return [];
    }
    return data.map((r: { role: string }) => r.role);
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        
        if (session?.user) {
          setTimeout(async () => {
            const { data, error } = await supabase
              .from('profiles')
              .select('id, username, role')
              .eq('id', session.user.id)
              .single();
            
            let customProfile = null;
            if (data) {
              customProfile = {
                id: data.id,
                username: data.username,
                role: data.role,
              };
            }
            const userRoles = await fetchRoles(session.user.id);
            setRoles(userRoles);
            setUser(customProfile ? { ...customProfile, roles: userRoles } : null);
          }, 0);
        } else {
          setUser(null);
          setRoles([]);
        }
        setIsLoading(false);
      }
    );

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, username, role')
          .eq('id', session.user.id)
          .single();
        let customProfile = null;
        if (data) {
          customProfile = {
            id: data.id,
            username: data.username,
            role: data.role,
          };
        }
        const userRoles = await fetchRoles(session.user.id);
        setRoles(userRoles);
        setUser(customProfile ? { ...customProfile, roles: userRoles } : null);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        setRoles([]);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }
      toast({
        title: "Login successful",
        description: `Welcome back!`,
      });
      // Fetch roles again after login
      if (data?.user) {
        const userRoles = await fetchRoles(data.user.id);
        setRoles(userRoles);
        setUser(prev => prev ? { ...prev, roles: userRoles } : prev);
      }
      return true;
    } catch (error: any) {
      console.error('Unexpected error during login:', error);
      toast({
        title: "Login failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, username: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username
          }
        }
      });
      if (signUpError) {
        toast({
          title: "Signup failed",
          description: signUpError.message,
          variant: "destructive",
        });
        return false;
      }
      toast({
        title: "Account created",
        description: "Your account has been created successfully!",
      });
      return true;
    } catch (error: any) {
      console.error('Unexpected error during signup:', error);
      toast({
        title: "Signup failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
        toast({
          title: "Logout failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      setUser(null);
      setSession(null);
      setRoles([]);
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
    } catch (error: any) {
      console.error('Unexpected error during logout:', error);
      toast({
        title: "Logout failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to check roles
  const hasRole = (role: string) => roles.includes(role);

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        session,
        isLoading,
        login, 
        signup, 
        logout, 
        isAuthenticated: !!session,
        roles,
        hasRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
