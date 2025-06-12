
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
  FileTextIcon
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
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
};

const SidebarItem = ({ icon: Icon, label, onClick, active }: SidebarItemProps) => (
  <div
    className={cn(
      "flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer",
      active ? "bg-blood text-white" : "hover:bg-gray-100 dark:hover:bg-gray-800"
    )}
    onClick={onClick}
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
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("dashboard");
  
  // State to control which main accordion item is open
  const [openMainItem, setOpenMainItem] = useState<string | null>(null);
  
  // State to control which nested accordion items are open
  const [openNestedItems, setOpenNestedItems] = useState<{
    reception?: boolean;
    bds?: boolean;
    lab?: boolean;
  }>({});

  const handleNavigate = (path: string) => {
    setActivePage(path);
    navigate(`/${path}`);
  };

  const handleReportNavigate = (path: string) => {
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
      // Create a new object with all values set to false
      const newState = {
        reception: false,
        bds: false,
        lab: false
      };
      
      // Only set the current value to true if it's different from the previous one
      if (prev[value as keyof typeof prev] !== true) {
        newState[value as keyof typeof newState] = true;
      }
      
      return newState;
    });
  };

  const handleFormClick = (formType: string) => {
    if (onFormOpen) {
      onFormOpen(formType);
    }
  };

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
                />
                <SidebarItem 
                  icon={TestTubeIcon} 
                  label="Test Information" 
                  onClick={() => handleFormClick('testInformation')}
                />
                <SidebarItem icon={MailIcon} label="Thanks Letter" />
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
                />
                <SidebarItem 
                  icon={ReceiptIcon} 
                  label="Patient Invoice"
                  onClick={() => handleFormClick('patientInvoice')}
                />
                <SidebarItem 
                  icon={DropletIcon} 
                  label="Bleeding"
                  onClick={() => handleFormClick('bleeding')}
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
                  value={openNestedItems.reception ? "reception" : (openNestedItems.bds ? "bds" : (openNestedItems.lab ? "lab" : ""))}
                  onValueChange={handleNestedAccordionChange}
                  collapsible
                >
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
                        />
                        <SidebarItem 
                          icon={ReceiptIcon} 
                          label="Patient Request Summary" 
                          onClick={() => handleReportNavigate('/reports/reception/patient-request-summary')}
                          active={activePage === '/reports/reception/patient-request-summary'}
                        />
                        <SidebarItem 
                          icon={HistoryIcon} 
                          label="Patient Transfusion History" 
                          onClick={() => handleReportNavigate('/reports/reception/patient-transfusion-history')}
                          active={activePage === '/reports/reception/patient-transfusion-history'}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
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
                        />
                        <SidebarItem 
                          icon={GroupIcon} 
                          label="Record Group Wise" 
                          onClick={() => handleReportNavigate('/reports/bds/record-group-wise')}
                          active={activePage === '/reports/bds/record-group-wise'}
                        />
                        <SidebarItem 
                          icon={TestTubeIcon} 
                          label="Test Positive Report" 
                          onClick={() => handleReportNavigate('/reports/bds/test-positive')}
                          active={activePage === '/reports/bds/test-positive'}
                        />
                        <SidebarItem 
                          icon={CheckIcon} 
                          label="Donor Screening" 
                          onClick={() => handleReportNavigate('/reports/bds/donor-screening')}
                          active={activePage === '/reports/bds/donor-screening'}
                        />
                        <SidebarItem icon={ReceiptIcon} label="Donor Bleeded Summary" />
                        <SidebarItem icon={FileTextIcon} label="Bag Bleeded Summary" />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="lab" className="border-b-0">
                    <AccordionTrigger className="py-1">
                      <span>LAB</span>
                    </AccordionTrigger>
                    <AccordionContent className="pl-4">
                      <div className="flex flex-col gap-1">
                        <SidebarItem 
                          icon={DropletIcon} 
                          label="Blood Issue Record" 
                        />
                        <SidebarItem 
                          icon={TestTubeIcon} 
                          label="Test Report Detail" 
                          onClick={() => handleReportNavigate('/reports/lab/test-report-detail')}
                          active={activePage === '/reports/lab/test-report-detail'}
                        />
                        <SidebarItem 
                          icon={FileTextIcon} 
                          label="Product Wise Blood Issue" 
                          onClick={() => handleReportNavigate('/reports/lab/product-wise-blood-issue')}
                          active={activePage === '/reports/lab/product-wise-blood-issue'}
                        />
                        <SidebarItem 
                          icon={ReceiptIcon} 
                          label="Patient Wise Blood Issue" 
                          onClick={() => handleReportNavigate('/reports/lab/patient-wise-blood-issue')}
                          active={activePage === '/reports/lab/patient-wise-blood-issue'}
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
            <p className="font-medium">{user?.username }</p>
            <p className="text-xs text-muted-foreground">Staff</p>
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
