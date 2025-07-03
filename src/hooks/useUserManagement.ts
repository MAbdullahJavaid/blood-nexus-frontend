
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { toast } from "@/hooks/use-toast";

export interface UserWithRoles {
  id: string;
  username: string;
  full_name: string;
  email: string;
  phone: string;
  status: string;
  created_at: string;
  last_login: string;
  roles: string[];
}

type AppRole = "admin" | "bds" | "lab" | "reception";

export const useUserManagement = () => {
  const { user: currentUser } = useAuth();
  const { hasRole } = useRoleAccess();
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const checkAdminAccess = () => {
    if (!currentUser || !hasRole(['admin'])) {
      throw new Error('Admin access required');
    }
  };

  const fetchUsers = async () => {
    try {
      checkAdminAccess();
      setIsLoading(true);

      const { data: profiles, error } = await supabase
        .from('profiles')
        .select(`
          id,
          username,
          full_name,
          email,
          phone,
          status,
          created_at,
          last_login
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get roles for each user
      const usersWithRoles = await Promise.all(
        (profiles || []).map(async (profile) => {
          const { data: roles } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', profile.id);

          return {
            ...profile,
            roles: roles?.map(r => r.role) || [],
            last_login: profile.last_login || 'Never',
          };
        })
      );

      setUsers(usersWithRoles);
      return usersWithRoles;
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch users",
        variant: "destructive",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const createUser = async (userData: {
    email: string;
    password: string;
    username: string;
    full_name?: string;
    phone?: string;
    status?: string;
    roles: string[];
  }) => {
    try {
      checkAdminAccess();

      // Use signUp to create the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            username: userData.username,
            full_name: userData.full_name,
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Failed to create user");

      // Wait a moment for the trigger to create the profile
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update profile with additional information
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          username: userData.username,
          full_name: userData.full_name,
          email: userData.email,
          phone: userData.phone,
          status: userData.status || 'active',
          created_by: currentUser?.id,
        })
        .eq('id', authData.user.id);

      if (profileError) {
        console.error('Profile update error:', profileError);
      }

      // Add roles
      if (userData.roles.length > 0) {
        const roleInserts = userData.roles.map(role => ({
          user_id: authData.user.id,
          role: role as AppRole,
        }));

        const { error: rolesError } = await supabase
          .from('user_roles')
          .insert(roleInserts);

        if (rolesError) {
          console.error('Roles insert error:', rolesError);
        }
      }

      // Log the action
      const { error: logError } = await supabase.rpc('log_user_management_action', {
        admin_id: currentUser?.id,
        target_id: authData.user.id,
        action_type: 'created',
        action_details: {
          username: userData.username,
          email: userData.email,
          roles: userData.roles,
        },
      });

      if (logError) {
        console.error('Failed to log action:', logError);
      }

      return authData.user;
    } catch (error: any) {
      console.error('Error creating user:', error);
      throw error;
    }
  };

  const updateUser = async (userId: string, userData: {
    username?: string;
    full_name?: string;
    email?: string;
    phone?: string;
    status?: string;
    roles?: string[];
  }) => {
    try {
      checkAdminAccess();

      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          username: userData.username,
          full_name: userData.full_name,
          email: userData.email,
          phone: userData.phone,
          status: userData.status,
        })
        .eq('id', userId);

      if (profileError) throw profileError;

      // Update roles if provided
      if (userData.roles !== undefined) {
        // Remove all existing roles
        const { error: deleteRolesError } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', userId);

        if (deleteRolesError) throw deleteRolesError;

        // Add new roles
        if (userData.roles.length > 0) {
          const roleInserts = userData.roles.map(role => ({
            user_id: userId,
            role: role as AppRole,
          }));

          const { error: rolesError } = await supabase
            .from('user_roles')
            .insert(roleInserts);

          if (rolesError) throw rolesError;
        }
      }

      // Log the action
      const { error: logError } = await supabase.rpc('log_user_management_action', {
        admin_id: currentUser?.id,
        target_id: userId,
        action_type: 'updated',
        action_details: userData,
      });

      if (logError) {
        console.error('Failed to log action:', logError);
      }

      return true;
    } catch (error: any) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      checkAdminAccess();

      // Get user info for logging before deletion
      const { data: userInfo } = await supabase
        .from('profiles')
        .select('username, email')
        .eq('id', userId)
        .single();

      // Delete user profile (this will cascade delete roles due to foreign key)
      const { error: deleteError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (deleteError) throw deleteError;

      // Log the action
      if (userInfo) {
        const { error: logError } = await supabase.rpc('log_user_management_action', {
          admin_id: currentUser?.id,
          target_id: userId,
          action_type: 'deleted',
          action_details: {
            username: userInfo.username,
            email: userInfo.email,
          },
        });

        if (logError) {
          console.error('Failed to log action:', logError);
        }
      }

      return true;
    } catch (error: any) {
      console.error('Error deleting user:', error);
      throw error;
    }
  };

  return {
    users,
    isLoading,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  };
};
