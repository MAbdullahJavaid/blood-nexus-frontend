
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  DropletIcon, 
  LogOutIcon, 
  UserIcon, 
  LayoutDashboardIcon,
  FileIcon,
  TestTubeIcon,
  MailIcon,
  ReceiptIcon,
  ActivityIcon,
  HistoryIcon,
  CheckIcon,
  GroupIcon,
  SettingsIcon,
  ListTodoIcon,
  BarChartIcon,
  FileTextIcon,
  ShieldIcon,
  UsersIcon,
  ListIcon
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

type SidebarItemProps = {
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
};

const SidebarItem = ({ icon: Icon, label, onClick, active, disabled = false }: SidebarItemProps) => (
  <div
    className={cn(
      "flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer",
      active ? "bg-blood text-white" : "hover:bg-gray-100 dark:hover:bg-gray-800",
      disabled ? "opacity-50 cursor-not-allowed" : ""
    )}
    onClick={disabled ? undefined : onClick}
  >
    <Icon className="h-5 w-5" />
    <span>{label}</span>
  </div>
);

interface SidebarProps {
  onFormOpen?: (formType: string) => void;
}

export function Sidebar({ onFormOpen }: SidebarProps) {
  const { user, logout } = useAuth();
  const { canAccessForm, canAccessReport, canAccessUserManagement } = useRoleAccess();
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("dashboard");
  
  // State to control which main accordion item is open
  const [openMainItem, setOpenMainItem] = useState<string | null>(null);
  
  // Add "admin" to the nested items state structure
  const [openNestedItems, setOpenNestedItems] = useState<{
    reception?: boolean;
    bds?: boolean;
    lab?: boolean;
    admin?: boolean;
  }>({});

  const handleNavigate = (path: string) => {
    setActivePage(path);
    navigate(`/${path}`);
  };

  const handleReportNavigate = (path: string) => {
    if (!canAccessReport(path)) {
      return; // Silently prevent navigation if no access
    }
    setActivePage(path);
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  
  const handleMainAccordionChange = (value: string) => {
    setOpenMainItem(prevValue => prevValue === value ? null : value);
  };
  
  const handleNestedAccordionChange = (value: string) => {
    setOpenNestedItems(prev => {
      const newState = {
        reception: false,
        bds: false,
        lab: false,
        admin: false
      };      
      if (prev[value as keyof typeof prev] !== true) {
        newState[value as keyof typeof newState] = true;
      }      
      return newState;
    });
  };

  const handleFormClick = (formType: string) => {
    if (!canAccessForm(formType)) {
      return; // Silently prevent form opening if no access
    }
    if (onFormOpen) {
      onFormOpen(formType);
    }
  };

  // Utility to strip "@gmail.com" from the username
  const displayUsername = user?.username
    ? user.username.replace(/@gmail\.com$/, "")
    : "";

  return (
    <div className="w-64 h-screen bg-sidebar border-r border-border flex flex-col">
      <div className="p-4 flex items-center gap-3">
        <DropletIcon className="h-8 w-8 text-blood" />
        <div>
          <h1 className="font-bold text-lg leading-none">BTMS</h1>
          <p className="text-xs text-muted-foreground">Blood Transfusion System</p>
        </div>
      </div>
      
      <div className="px-3 py-2">
        <SidebarItem 
          icon={LayoutDashboardIcon} 
          label="Dashboard" 
          onClick={() => handleNavigate("dashboard")} 
          active={activePage === "dashboard"}
        />
      </div>
      
      <div className="flex-1 overflow-auto px-3 py-2">
        <Accordion 
          type="single" 
          value={openMainItem || ""} 
          onValueChange={handleMainAccordionChange}
          collapsible
          className="w-full"
        >
          <AccordionItem value="maintain" className="border-b-0">
            <AccordionTrigger className="py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md px-3">
              <div className="flex items-center gap-3">
                <SettingsIcon className="h-5 w-5" />
                <span>Maintain</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pl-8">
              <div className="flex flex-col gap-1">
                <SidebarItem 
                  icon={FileIcon} 
                  label="Category" 
                  onClick={() => handleFormClick('category')}
                  disabled={!canAccessForm('category')}
                />
                <SidebarItem 
                  icon={TestTubeIcon} 
                  label="Test Information" 
                  onClick={() => handleFormClick('testInformation')}
                  disabled={!canAccessForm('testInformation')}
                />
                <SidebarItem 
                  icon={MailIcon} 
                  label="Thanks Letter"
                  onClick={() => handleFormClick('thanksLetter')}
                  disabled={!canAccessForm('thanksLetter')}
                />
                {canAccessUserManagement() && (
                  <SidebarItem 
                    icon={UsersIcon} 
                    label="User Management"
                    onClick={() => handleNavigate('user-management')}
                    active={activePage === 'user-management'}
                  />
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="task" className="border-b-0">
            <AccordionTrigger className="py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md px-3">
              <div className="flex items-center gap-3">
                <ListTodoIcon className="h-5 w-5" />
                <span>Task</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pl-8">
              <div className="flex flex-col gap-1">
                <SidebarItem 
                  icon={FileTextIcon} 
                  label="Report Data Entry" 
                  onClick={() => handleFormClick('reportDataEntry')}
                  disabled={!canAccessForm('reportDataEntry')}
                />
                <SidebarItem 
                  icon={ReceiptIcon} 
                  label="Patient Invoice"
                  onClick={() => handleFormClick('patientInvoice')}
                  disabled={!canAccessForm('patientInvoice')}
                />
                <SidebarItem 
                  icon={DropletIcon} 
                  label="Bleeding"
                  onClick={() => handleFormClick('bleeding')}
                  disabled={!canAccessForm('bleeding')}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="reports" className="border-b-0">
            <AccordionTrigger className="py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md px-3">
              <div className="flex items-center gap-3">
                <BarChartIcon className="h-5 w-5" />
                <span>Reports</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pl-8">
              <div className="space-y-2">
                <Accordion 
                  type="single" 
                  value={
                    openNestedItems.reception ? "reception"
                      : openNestedItems.bds ? "bds"
                      : openNestedItems.lab ? "lab"
                      : openNestedItems.admin ? "admin"
                      : ""
                  }
                  onValueChange={handleNestedAccordionChange}
                  collapsible
                >
                  {/* Reception Section */}
                  <AccordionItem value="reception" className="border-b-0">
                    <AccordionTrigger className="py-1">
                      <span>Reception</span>
                    </AccordionTrigger>
                    <AccordionContent className="pl-4">
                      <div className="flex flex-col gap-1">
                        <SidebarItem 
                          icon={FileTextIcon} 
                          label="Patient Request" 
                          onClick={() => handleReportNavigate('/reports/reception/patient-request')}
                          active={activePage === '/reports/reception/patient-request'}
                          disabled={!canAccessReport('/reports/reception/patient-request')}
                        />
                        <SidebarItem 
                          icon={ReceiptIcon} 
                          label="Patient Request Summary" 
                          onClick={() => handleReportNavigate('/reports/reception/patient-request-summary')}
                          active={activePage === '/reports/reception/patient-request-summary'}
                          disabled={!canAccessReport('/reports/reception/patient-request-summary')}
                        />
                        <SidebarItem 
                          icon={HistoryIcon} 
                          label="Patient Transfusion History" 
                          onClick={() => handleReportNavigate('/reports/reception/patient-transfusion-history')}
                          active={activePage === '/reports/reception/patient-transfusion-history'}
                          disabled={!canAccessReport('/reports/reception/patient-transfusion-history')}
                        />
                        <SidebarItem 
                          icon={ListIcon} 
                          label="Patient List" 
                          onClick={() => handleReportNavigate('/reports/reception/patient-list')}
                          active={activePage === '/reports/reception/patient-list'}
                          disabled={!canAccessReport('/reports/reception/patient-list')}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  {/* BDS Section */}
                  <AccordionItem value="bds" className="border-b-0">
                    <AccordionTrigger className="py-1">
                      <span>BDS</span>
                    </AccordionTrigger>
                    <AccordionContent className="pl-4">
                      <div className="flex flex-col gap-1">
                        <SidebarItem 
                          icon={DropletIcon} 
                          label="Blood Bleeded Record" 
                          onClick={() => handleReportNavigate('/reports/bds/blood-bleed-record')}
                          active={activePage === '/reports/bds/blood-bleed-record'}
                          disabled={!canAccessReport('/reports/bds/blood-bleed-record')}
                        />
                        <SidebarItem 
                          icon={GroupIcon} 
                          label="Record Group Wise" 
                          onClick={() => handleReportNavigate('/reports/bds/record-group-wise')}
                          active={activePage === '/reports/bds/record-group-wise'}
                          disabled={!canAccessReport('/reports/bds/record-group-wise')}
                        />
                        <SidebarItem 
                          icon={TestTubeIcon} 
                          label="Test Positive Report" 
                          onClick={() => handleReportNavigate('/reports/bds/test-positive')}
                          active={activePage === '/reports/bds/test-positive'}
                          disabled={!canAccessReport('/reports/bds/test-positive')}
                        />
                        <SidebarItem 
                          icon={CheckIcon} 
                          label="Donor Screening" 
                          onClick={() => handleReportNavigate('/reports/bds/donor-screening')}
                          active={activePage === '/reports/bds/donor-screening'}
                          disabled={!canAccessReport('/reports/bds/donor-screening')}
                        />
                        <SidebarItem 
                          icon={ReceiptIcon} 
                          label="Donor Bleeded Summary" 
                          onClick={() => handleReportNavigate('/reports/bds/donor-bleed-summary')}
                          active={activePage === '/reports/bds/donor-bleed-summary'}
                          disabled={!canAccessReport('/reports/bds/donor-bleed-summary')}
                        />
                        <SidebarItem 
                          icon={FileTextIcon} 
                          label="Bag Bleeded Summary" 
                          onClick={() => handleReportNavigate('/reports/bds/bag-bleed-summary')}
                          active={activePage === '/reports/bds/bag-bleed-summary'}
                          disabled={!canAccessReport('/reports/bds/bag-bleed-summary')}
                        />
                        <SidebarItem 
                          icon={ListIcon} 
                          label="Donor List" 
                          onClick={() => handleReportNavigate('/reports/bds/donor-list')}
                          active={activePage === '/reports/bds/donor-list'}
                          disabled={!canAccessReport('/reports/bds/donor-list')}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  {/* LAB Section */}
                  <AccordionItem value="lab" className="border-b-0">
                    <AccordionTrigger className="py-1">
                      <span>LAB</span>
                    </AccordionTrigger>
                    <AccordionContent className="pl-4">
                      <div className="flex flex-col gap-1">
                        <SidebarItem 
                          icon={DropletIcon} 
                          label="Blood Issue Record" 
                          onClick={() => handleReportNavigate('/reports/lab/blood-issue-record')}
                          active={activePage === '/reports/lab/blood-issue-record'}
                          disabled={!canAccessReport('/reports/lab/blood-issue-record')}
                        />
                        <SidebarItem 
                          icon={TestTubeIcon} 
                          label="Test Report Detail" 
                          onClick={() => handleReportNavigate('/reports/lab/test-report-detail')}
                          active={activePage === '/reports/lab/test-report-detail'}
                          disabled={!canAccessReport('/reports/lab/test-report-detail')}
                        />
                        <SidebarItem 
                          icon={FileTextIcon} 
                          label="Product Wise Blood Issue" 
                          onClick={() => handleReportNavigate('/reports/lab/product-wise-blood-issue')}
                          active={activePage === '/reports/lab/product-wise-blood-issue'}
                          disabled={!canAccessReport('/reports/lab/product-wise-blood-issue')}
                        />
                        <SidebarItem 
                          icon={ActivityIcon} 
                          label="Crossmatch Report" 
                          onClick={() => handleReportNavigate('/reports/lab/crossmatch')}
                          active={activePage === '/reports/lab/crossmatch'}
                          disabled={!canAccessReport('/reports/lab/crossmatch')}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Admin Section */}
                  <AccordionItem value="admin" className="border-b-0">
                    <AccordionTrigger className="py-1">
                      <span>Admin</span>
                    </AccordionTrigger>
                    <AccordionContent className="pl-4">
                      <div className="flex flex-col gap-1">
                        <SidebarItem
                          icon={ShieldIcon}
                          label="Donations"
                          onClick={() => handleReportNavigate('/reports/admin/donations')}
                          active={activePage === '/reports/admin/donations'}
                          disabled={!canAccessReport('/reports/admin/donations')}
                        />
                        <SidebarItem
                          icon={DropletIcon}
                          label="Blood Drive"
                          onClick={() => handleReportNavigate('/reports/admin/blood-drive')}
                          active={activePage === '/reports/admin/blood-drive'}
                          disabled={!canAccessReport('/reports/admin/blood-drive')}
                        />
                        <SidebarItem
                          icon={GroupIcon}
                          label="Volunteer"
                          onClick={() => handleReportNavigate('/reports/admin/volunteer')}
                          active={activePage === '/reports/admin/volunteer'}
                          disabled={!canAccessReport('/reports/admin/volunteer')}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      
      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <UserIcon className="h-5 w-5 text-gray-500" />
          </div>
          <div>
            <p className="font-medium">
              {displayUsername}
            </p>
            <p className="text-xs text-muted-foreground">
              {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Staff'}
            </p>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="w-full flex items-center gap-2 justify-center"
          onClick={handleLogout}
        >
          <LogOutIcon className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
