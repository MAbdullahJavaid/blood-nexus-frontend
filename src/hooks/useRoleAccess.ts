
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useRoleAccess = () => {
  const { user } = useAuth();
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserRoles = async () => {
      if (!user?.id) {
        setUserRoles([]);
        setIsLoading(false);
        return;
      }

      try {
        const { data: roles, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error fetching user roles:', error);
          setUserRoles([]);
        } else {
          setUserRoles(roles?.map(r => r.role) || []);
        }
      } catch (error) {
        console.error('Error fetching user roles:', error);
        setUserRoles([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRoles();
  }, [user?.id]);

  const hasRole = (role: string) => {
    // Admin has access to everything
    if (userRoles.includes('admin')) return true;
    return userRoles.includes(role);
  };

  const hasAnyRole = (roles: string[]) => {
    // Admin has access to everything
    if (userRoles.includes('admin')) return true;
    return roles.some(role => userRoles.includes(role));
  };

  const isAdmin = () => userRoles.includes('admin');

  return {
    userRoles,
    isLoading,
    hasRole,
    hasAnyRole,
    isAdmin,
  };
};
