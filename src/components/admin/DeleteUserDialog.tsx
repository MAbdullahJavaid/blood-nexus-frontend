
import React, { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface UserProfile {
  id: string;
  username: string;
  full_name: string;
  email: string;
}

interface DeleteUserDialogProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onUserDeleted: () => void;
}

export const DeleteUserDialog: React.FC<DeleteUserDialogProps> = ({
  user,
  isOpen,
  onClose,
  onUserDeleted,
}) => {
  const { user: currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);

    try {
      // Delete user from Supabase Auth (this will cascade delete profile and roles)
      const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);

      if (deleteError) throw deleteError;

      // Log the action
      await supabase.rpc('log_user_management_action', {
        admin_id: currentUser?.id,
        target_id: user.id,
        action_type: 'deleted',
        action_details: {
          username: user.username,
          email: user.email,
        },
      });

      toast({
        title: "Success",
        description: "User deleted successfully",
      });

      onUserDeleted();
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete User</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the user "{user.full_name || user.username}"? 
            This action cannot be undone and will permanently remove all user data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading ? "Deleting..." : "Delete User"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
