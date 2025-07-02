
import { useAuth } from "@/contexts/AuthContext";

export const useRoleAccess = () => {
  const { user } = useAuth();

  const hasRole = (requiredRoles: string[] | string): boolean => {
    if (!user) return false;
    
    // Admin has access to everything
    if (user.role === 'admin') return true;
    
    const rolesArray = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    return rolesArray.includes(user.role || '');
  };

  const canAccessForm = (formType: string): boolean => {
    const formPermissions: Record<string, string[]> = {
      'donor': ['admin', 'bds'],
      'patient': ['admin', 'reception'],
      'bleeding': ['admin', 'bds'],
      'crossmatch': ['admin', 'lab'],
      'patientInvoice': ['admin', 'reception'],
      'category': ['admin'],
      'testInformation': ['admin', 'lab'],
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

  return {
    hasRole,
    canAccessForm,
    canAccessReport,
    canAccessUserManagement,
    isAdmin: user?.role === 'admin'
  };
};
