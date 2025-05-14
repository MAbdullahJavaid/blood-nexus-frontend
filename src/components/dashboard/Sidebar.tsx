
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  DropletIcon, 
  LogOutIcon, 
  UserIcon, 
  LayoutDashboardIcon,
  FolderIcon,
  FileIcon,
  TestTubeIcon,
  MailIcon,
  FilePenIcon,
  FileInputIcon,
  FileTextIcon,
  ReceiptIcon,
  BloodIcon,
  HistoryIcon,
  CheckIcon,
  GroupIcon
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

export function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("dashboard");

  const handleNavigate = (path: string) => {
    setActivePage(path);
    navigate(`/${path}`);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
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
        <Accordion type="multiple" className="w-full">
          <AccordionItem value="maintain" className="border-b-0">
            <AccordionTrigger className="py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md px-3">
              <div className="flex items-center gap-3">
                <FolderIcon className="h-5 w-5" />
                <span>Maintain</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pl-8">
              <div className="flex flex-col gap-1">
                <SidebarItem icon={FileIcon} label="Category" />
                <SidebarItem icon={TestTubeIcon} label="Test Information" />
                <SidebarItem icon={MailIcon} label="Thanks Letter" />
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="task" className="border-b-0">
            <AccordionTrigger className="py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md px-3">
              <div className="flex items-center gap-3">
                <FilePenIcon className="h-5 w-5" />
                <span>Task</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pl-8">
              <div className="flex flex-col gap-1">
                <SidebarItem icon={FileInputIcon} label="Report Data Entry" />
                <SidebarItem icon={ReceiptIcon} label="Patient Invoice" />
                <SidebarItem icon={DropletIcon} label="Bleeding" />
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="reports" className="border-b-0">
            <AccordionTrigger className="py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md px-3">
              <div className="flex items-center gap-3">
                <FileTextIcon className="h-5 w-5" />
                <span>Reports</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pl-8">
              <div className="space-y-2">
                <AccordionItem value="reception" className="border-b-0">
                  <AccordionTrigger className="py-1">
                    <span>Reception</span>
                  </AccordionTrigger>
                  <AccordionContent className="pl-4">
                    <div className="flex flex-col gap-1">
                      <SidebarItem icon={FileTextIcon} label="Patient Request" />
                      <SidebarItem icon={ReceiptIcon} label="Patient Request Summary" />
                      <SidebarItem icon={HistoryIcon} label="Patient Transfusion History" />
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="bds" className="border-b-0">
                  <AccordionTrigger className="py-1">
                    <span>BDS</span>
                  </AccordionTrigger>
                  <AccordionContent className="pl-4">
                    <div className="flex flex-col gap-1">
                      <SidebarItem icon={BloodIcon} label="Blood Bleeded Record" />
                      <SidebarItem icon={GroupIcon} label="Record Group Wise" />
                      <SidebarItem icon={TestTubeIcon} label="Test Positive Report" />
                      <SidebarItem icon={CheckIcon} label="Donor Screening" />
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
                      <SidebarItem icon={BloodIcon} label="Blood Issue Record" />
                      <SidebarItem icon={TestTubeIcon} label="Test Report Detail" />
                      <SidebarItem icon={FileTextIcon} label="Product Wise Blood Issue" />
                      <SidebarItem icon={ReceiptIcon} label="Patient Wise Blood Issue" />
                    </div>
                  </AccordionContent>
                </AccordionItem>
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
            <p className="font-medium">{user?.username || 'User'}</p>
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
