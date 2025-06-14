
import { useAuth } from "@/contexts/AuthContext";

// This hook provides a convenient way to check user roles
export function useRoles() {
  const { roles, hasRole } = useAuth();
  return {
    roles,
    hasRole,
    isLab: hasRole('lab'),
    isBds: hasRole('bds'),
    isReception: hasRole('reception'),
  };
}
