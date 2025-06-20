
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, UserX, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  adminUsers: number;
}

interface UserManagementStatsProps {
  refreshTrigger: number;
}

export const UserManagementStats: React.FC<UserManagementStatsProps> = ({ refreshTrigger }) => {
  const [stats, setStats] = useState<UserStats>({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    adminUsers: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setIsLoading(true);

      // Get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, status');

      if (profilesError) throw profilesError;

      // Get admin users
      const { data: adminRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'admin');

      if (rolesError) throw rolesError;

      const totalUsers = profiles?.length || 0;
      const activeUsers = profiles?.filter(p => p.status === 'active').length || 0;
      const inactiveUsers = profiles?.filter(p => p.status !== 'active').length || 0;
      const adminUsers = adminRoles?.length || 0;

      setStats({
        totalUsers,
        activeUsers,
        inactiveUsers,
        adminUsers,
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [refreshTrigger]);

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Active Users",
      value: stats.activeUsers,
      icon: UserCheck,
      color: "text-green-600",
    },
    {
      title: "Inactive Users",
      value: stats.inactiveUsers,
      icon: UserX,
      color: "text-red-600",
    },
    {
      title: "Admin Users",
      value: stats.adminUsers,
      icon: Shield,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : stat.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
