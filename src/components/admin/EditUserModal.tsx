
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUserManagement } from "@/hooks/useUserManagement";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface UserProfile {
  id: string;
  username: string;
  full_name: string;
  email: string;
  phone: string;
  status: string;
  roles: string[];
}

interface EditUserModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onUserUpdated: () => void;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({
  user,
  isOpen,
  onClose,
  onUserUpdated,
}) => {
  const { updateUser } = useUserManagement();
  const { user: currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    email: "",
    phone: "",
    status: "active",
    roles: [] as string[],
    password: "",
    changePassword: false,
  });

  const availableRoles = ["admin", "bds", "lab", "reception"];

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        full_name: user.full_name || "",
        email: user.email || "",
        phone: user.phone || "",
        status: user.status || "active",
        roles: user.roles || [],
        password: "",
        changePassword: false,
      });
    }
  }, [user]);

  const handleRoleChange = (role: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        roles: [...prev.roles, role]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        roles: prev.roles.filter(r => r !== role)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateUser(user.id, {
        username: formData.username,
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        status: formData.status,
        roles: formData.roles,
      });

      // Update password if requested
      if (formData.changePassword && formData.password) {
        try {
          const { error: passwordError } = await supabase.auth.admin.updateUserById(
            user.id,
            { password: formData.password }
          );

          if (passwordError) {
            console.error('Password update error:', passwordError);
            toast({
              title: "User updated but password change failed",
              description: "The user was updated but the password couldn't be changed.",
              variant: "destructive",
            });
          } else {
            // Test login with new credentials
            try {
              const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
              });

              if (loginError) {
                console.error('Login test failed:', loginError);
                toast({
                  title: "User updated but login test failed",
                  description: "The user was updated but couldn't be logged in with new credentials.",
                  variant: "destructive",
                });
              } else {
                toast({
                  title: "Success",
                  description: "User updated successfully and login test passed",
                });
                
                // Sign out the test login to restore admin session
                await supabase.auth.signOut();
                
                // Reload to restore admin session
                window.location.reload();
              }
            } catch (loginTestError) {
              console.error('Login test error:', loginTestError);
              toast({
                title: "User updated successfully",
                description: "Password changed but login test couldn't be performed",
              });
            }
          }
        } catch (error) {
          console.error('Error updating password:', error);
          toast({
            title: "User updated but password change failed",
            description: "The user was updated but the password couldn't be changed.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Success",
          description: "User updated successfully",
        });
      }

      onUserUpdated();
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update user",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-[60vh] pr-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Roles</Label>
                <div className="space-y-2">
                  {availableRoles.map((role) => (
                    <div key={role} className="flex items-center space-x-2">
                      <Checkbox
                        id={role}
                        checked={formData.roles.includes(role)}
                        onCheckedChange={(checked) => handleRoleChange(role, checked as boolean)}
                      />
                      <Label htmlFor={role} className="capitalize">{role}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="changePassword"
                    checked={formData.changePassword}
                    onCheckedChange={(checked) => setFormData(prev => ({ 
                      ...prev, 
                      changePassword: checked as boolean,
                      password: checked ? prev.password : ""
                    }))}
                  />
                  <Label htmlFor="changePassword">Change Password</Label>
                </div>
                
                {formData.changePassword && (
                  <Input
                    type="password"
                    placeholder="New password (minimum 6 characters)"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    minLength={6}
                    required={formData.changePassword}
                  />
                )}
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Updating..." : "Update User"}
                </Button>
              </div>
            </form>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};
