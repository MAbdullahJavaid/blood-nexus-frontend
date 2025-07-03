
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { UserManagementTable } from "@/components/admin/UserManagementTable";
import { CreateUserModal } from "@/components/admin/CreateUserModal";
import { UserManagementHeader } from "@/components/admin/UserManagementHeader";
import { UserManagementStats } from "@/components/admin/UserManagementStats";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import { useRoleAccess } from "@/hooks/useRoleAccess";

const UserManagement = () => {
  const { user } = useAuth();
  const { hasRole, isLoading: rolesLoading } = useRoleAccess();
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Show loading state while roles are being fetched
  if (rolesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying permissions...</p>
        </div>
      </div>
    );
  }

  // Check if user has admin role
  if (!hasRole(['admin'])) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
          <Button 
            onClick={() => navigate("/dashboard")}
            className="mt-4"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const handleUserCreated = () => {
    setRefreshTrigger(prev => prev + 1);
    setIsCreateModalOpen(false);
    toast({
      title: "Success",
      description: "User created successfully",
    });
  };

  const handleUserUpdated = () => {
    setRefreshTrigger(prev => prev + 1);
    toast({
      title: "Success",
      description: "User updated successfully",
    });
  };

  const handleUserDeleted = () => {
    setRefreshTrigger(prev => prev + 1);
    toast({
      title: "Success",
      description: "User deleted successfully",
    });
  };

  const handleExitToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex items-center justify-between mb-6">
        <UserManagementHeader />
        <Button 
          onClick={handleExitToDashboard}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>
      </div>
      
      <div className="mb-6">
        <UserManagementStats refreshTrigger={refreshTrigger} />
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">All Users</h2>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create User
            </Button>
          </div>
        </div>

        <UserManagementTable
          refreshTrigger={refreshTrigger}
          onUserUpdated={handleUserUpdated}
          onUserDeleted={handleUserDeleted}
        />
      </div>

      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onUserCreated={handleUserCreated}
      />
    </div>
  );
};

export default UserManagement;
