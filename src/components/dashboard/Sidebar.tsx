
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  DropletIcon, 
  Users, 
  UserPlus, 
  Beaker, 
  FileText, 
  Heart,
  User,
  Shield,
  Settings,
  LogOut,
  Activity,
  FlaskConical,
  UserCheck,
  Microscope,
  FileBarChart,
  HeartHandshake,
  ClipboardList
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface SidebarProps {
  onFormOpen?: (formType: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onFormOpen }) => {
  const { user, logout } = useAuth();
  const { hasRole, hasAnyRole, isAdmin } = useRoleAccess();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const navigationItems = [
    {
      label: "Dashboard",
      icon: Activity,
      path: "/dashboard",
      roles: ["admin", "bds", "lab", "reception"]
    },
    // Admin only sections
    {
      label: "User Management",
      icon: Shield,
      path: "/user-management",
      roles: ["admin"]
    },
    // Reception section
    {
      label: "Reception Reports",
      icon: ClipboardList,
      isHeader: true,
      roles: ["reception", "admin"]
    },
    {
      label: "Patient List",
      icon: User,
      path: "/patient-list",
      roles: ["reception", "admin"]
    },
    {
      label: "Patient Request",
      icon: FileText,
      path: "/reports/reception/patient-request",
      roles: ["reception", "admin"]
    },
    {
      label: "Patient Request Summary",
      icon: FileBarChart,
      path: "/reports/reception/patient-request-summary",
      roles: ["reception", "admin"]
    },
    {
      label: "Patient Transfusion History",
      icon: Activity,
      path: "/reports/reception/patient-transfusion-history",
      roles: ["reception", "admin"]
    },
    // BDS section
    {
      label: "BDS Reports",
      icon: Heart,
      isHeader: true,
      roles: ["bds", "admin"]
    },
    {
      label: "Donor List",
      icon: Heart,
      path: "/donor-list",
      roles: ["bds", "admin"]
    },
    {
      label: "Blood Bleed Record",
      icon: DropletIcon,
      path: "/reports/bds/blood-bleed-record",
      roles: ["bds", "admin"]
    },
    {
      label: "Record Group Wise",
      icon: Users,
      path: "/reports/bds/record-group-wise",
      roles: ["bds", "admin"]
    },
    {
      label: "Test Positive",
      icon: Beaker,
      path: "/reports/bds/test-positive",
      roles: ["bds", "admin"]
    },
    {
      label: "Donor Screening",
      icon: UserCheck,
      path: "/reports/bds/donor-screening",
      roles: ["bds", "admin"]
    },
    {
      label: "Donor Bleed Summary",
      icon: HeartHandshake,
      path: "/reports/bds/donor-bleed-summary",
      roles: ["bds", "admin"]
    },
    {
      label: "Bag Bleed Summary",
      icon: DropletIcon,
      path: "/reports/bds/bag-bleed-summary",
      roles: ["bds", "admin"]
    },
    // Lab section
    {
      label: "Lab Reports",
      icon: Microscope,
      isHeader: true,
      roles: ["lab", "admin"]
    },
    {
      label: "Test Report Detail",
      icon: FlaskConical,
      path: "/reports/lab/test-report-detail",
      roles: ["lab", "admin"]
    },
    {
      label: "Product Wise Blood Issue",
      icon: DropletIcon,
      path: "/reports/lab/product-wise-blood-issue",
      roles: ["lab", "admin"]
    },
    {
      label: "Blood Issue Record",
      icon: FileText,
      path: "/reports/lab/blood-issue-record",
      roles: ["lab", "admin"]
    },
    {
      label: "Crossmatch Report",
      icon: Beaker,
      path: "/reports/lab/crossmatch",
      roles: ["lab", "admin"]
    },
    // Admin reports section
    {
      label: "Admin Reports",
      icon: Settings,
      isHeader: true,
      roles: ["admin"]
    },
    {
      label: "Donations Report",
      icon: Heart,
      path: "/reports/admin/donations",
      roles: ["admin"]
    },
    {
      label: "Blood Drive Report",
      icon: Users,
      path: "/reports/admin/blood-drive",
      roles: ["admin"]
    },
    {
      label: "Volunteer Report",
      icon: UserPlus,
      path: "/reports/admin/volunteer",
      roles: ["admin"]
    },
  ];

  const filteredNavItems = navigationItems.filter(item => 
    hasAnyRole(item.roles)
  );

  return (
    <div className="w-64 bg-white shadow-lg h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center space-x-3">
          <DropletIcon className="h-8 w-8 text-red-600" />
          <div>
            <h1 className="text-lg font-bold text-gray-900">Blood Bank</h1>
            <p className="text-sm text-gray-500">Management System</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.username || "User"}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {isAdmin() ? "Administrator" : user?.role || "User"}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {filteredNavItems.map((item, index) => {
          const Icon = item.icon;
          
          if (item.isHeader) {
            return (
              <div key={index}>
                {index > 0 && <Separator className="my-3" />}
                <div className="flex items-center space-x-2 px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
              </div>
            );
          }

          return (
            <Button
              key={index}
              variant="ghost"
              className="w-full justify-start text-left h-10 px-3"
              onClick={() => navigate(item.path)}
            >
              <Icon className="w-4 h-4 mr-3" />
              <span className="truncate">{item.label}</span>
            </Button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
