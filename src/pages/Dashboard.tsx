
import { useState } from "react";
import { FormToolbar } from "@/components/dashboard/FormToolbar";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { BloodInventory } from "@/components/dashboard/BloodInventory";
import { DonorForm } from "@/components/forms/DonorForm";
import { BleedingForm } from "@/components/forms/BleedingForm";
import { CrossmatchForm } from "@/components/forms/CrossmatchForm";
import { PatientForm } from "@/components/forms/PatientForm";
import { TestInformationForm } from "@/components/forms/TestInformationForm";
import { CategoryForm } from "@/components/forms/CategoryForm";

const Dashboard = () => {
  const [activeForm, setActiveForm] = useState<string | null>(null);

  const handleFormSelection = (formType: string) => {
    setActiveForm(formType);
  };

  const renderActiveForm = () => {
    switch (activeForm) {
      case 'donor':
        return <DonorForm />;
      case 'bleeding':
        return <BleedingForm />;
      case 'crossmatch':
        return <CrossmatchForm />;
      case 'patient':
        return <PatientForm />;
      case 'testInformation':
        return <TestInformationForm />;
      case 'category':
        return <CategoryForm />;
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DashboardStats />
            <RecentActivity />
            <BloodInventory />
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <FormToolbar onButtonClick={handleFormSelection} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-6">
          {renderActiveForm()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
