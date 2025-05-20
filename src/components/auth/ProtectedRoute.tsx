
import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { DropletIcon } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  // Show loading indicator while checking authentication
  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50">
        <DropletIcon className="h-16 w-16 text-blood mb-4 animate-pulse" />
        <div className="text-xl font-medium text-gray-700">Loading Blood Transfusion Management System</div>
        <div className="mt-8 animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blood"></div>
      </div>
    );
  }
  
  // If not authenticated and not loading, return null (redirect will happen via useEffect)
  if (!isAuthenticated) {
    return null;
  }
  
  // If authenticated, render the children
  return <>{children}</>;
}
