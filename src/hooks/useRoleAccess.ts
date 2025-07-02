
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
        // Fetch user roles from user_roles table
        const { data: rolesData, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);

        if (error) throw error;

        const roles = rolesData?.map(r => r.role) || [];
        setUserRoles(roles);
      } catch (error) {
        console.error('Error fetching user roles:', error);
        setUserRoles([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRoles();
  }, [user?.id]);

  const hasRole = (requiredRoles: string[] | string): boolean => {
    if (!user || isLoading) return false;
    
    // Admin has access to everything
    if (userRoles.includes('admin')) return true;
    
    const rolesArray = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    return rolesArray.some(role => userRoles.includes(role));
  };

  const canAccessForm = (formType: string): boolean => {
    const formPermissions: Record<string, string[]> = {
      'donor': ['admin', 'bds'],
      'patient': ['admin', 'reception'],
      'bleeding': ['admin', 'bds'],
      'crossmatch': ['admin', 'lab'],
      'patientInvoice': ['admin', 'reception'],
      'category': ['admin'],
      'testInformation': ['admin'],
      'reportDataEntry': ['admin', 'lab'],
      'thanksLetter': ['admin']
    };

    return hasRole(formPermissions[formType] || []);
  };

  const canAccessReport = (reportPath: string): boolean => {
    const reportPermissions: Record<string, string[]> = {
      '/reports/reception/patient-request': ['admin', 'reception'],
      '/reports/reception/patient-request-summary': ['admin', 'reception'],
      '/reports/reception/patient-transfusion-history': ['admin', 'reception'],
      '/reports/reception/patient-list': ['admin', 'reception'],
      '/reports/bds/blood-bleed-record': ['admin', 'bds'],
      '/reports/bds/record-group-wise': ['admin', 'bds'],
      '/reports/bds/test-positive': ['admin', 'bds'],
      '/reports/bds/donor-screening': ['admin', 'bds'],
      '/reports/bds/donor-bleed-summary': ['admin', 'bds'],
      '/reports/bds/bag-bleed-summary': ['admin', 'bds'],
      '/reports/bds/donor-list': ['admin', 'bds'],
      '/reports/lab/blood-issue-record': ['admin', 'lab'],
      '/reports/lab/test-report-detail': ['admin', 'lab'],
      '/reports/lab/product-wise-blood-issue': ['admin', 'lab'],
      '/reports/lab/crossmatch': ['admin', 'lab'],
      '/reports/admin/donations': ['admin'],
      '/reports/admin/blood-drive': ['admin'],
      '/reports/admin/volunteer': ['admin']
    };

    return hasRole(reportPermissions[reportPath] || []);
  };

  const canAccessUserManagement = (): boolean => {
    return hasRole(['admin']);
  };

  const canDeleteUser = (targetUserId: string): boolean => {
    // Users cannot delete themselves
    if (user?.id === targetUserId) return false;
    // Only admins can delete users
    return hasRole(['admin']);
  };

  return {
    hasRole,
    canAccessForm,
    canAccessReport,
    canAccessUserManagement,
    canDeleteUser,
    userRoles,
    isLoading,
    isAdmin: userRoles.includes('admin')
  };
};
