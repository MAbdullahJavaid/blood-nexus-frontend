
import React from "react";
import { Shield, Users, Settings } from "lucide-react";

export const UserManagementHeader = () => {
  return (
    <div className="mb-8">
      <div className="flex items-center mb-4">
        <Shield className="w-8 h-8 text-blue-600 mr-3" />
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
      </div>
      <p className="text-gray-600 max-w-2xl">
        Manage system users, assign roles, and monitor user activity. 
        Control access permissions and maintain security across the platform.
      </p>
    </div>
  );
};
