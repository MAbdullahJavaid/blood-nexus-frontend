import { Sidebar } from "@/components/dashboard/Sidebar";
import { FormToolbar } from "@/components/dashboard/FormToolbar";
import { CrudBar } from "@/components/dashboard/CrudBar";
import { useState } from "react";

const Dashboard = () => {
  const [showCrudBar, setShowCrudBar] = useState(false);
  
  const handleFormButtonClick = () => {
    setShowCrudBar(true);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <FormToolbar onButtonClick={handleFormButtonClick} />
        {showCrudBar && <CrudBar />}
        <div className="flex-1 overflow-auto p-6">
          {/* Empty dashboard as per requirement */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
