
import { Sidebar } from "@/components/dashboard/Sidebar";
import { FormToolbar } from "@/components/dashboard/FormToolbar";
import { CrudBar } from "@/components/dashboard/CrudBar";
import { useState } from "react";
import DonorForm from "@/components/forms/DonorForm";
import PatientForm from "@/components/forms/PatientForm";
import CrossmatchForm from "@/components/forms/CrossmatchForm";
import BleedingForm from "@/components/forms/BleedingForm";
import PatientInvoiceForm from "@/components/forms/PatientInvoiceForm";

type FormType = 'donor' | 'patient' | 'bleeding' | 'crossmatch' | 'patientInvoice' | null;

const Dashboard = () => {
  const [showCrudBar, setShowCrudBar] = useState(false);
  const [activeForm, setActiveForm] = useState<FormType>(null);
  const [isSearchEnabled, setIsSearchEnabled] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  
  const handleFormButtonClick = (formType: FormType) => {
    setShowCrudBar(true);
    setActiveForm(formType);
    setIsSearchEnabled(false);
    setIsEditing(false);
    setIsAdding(false);
  };

  const handleAddClick = () => {
    setIsAdding(true);
    setIsSearchEnabled(false);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setIsSearchEnabled(true);
  };

  const handleSaveClick = () => {
    // Would typically save form data here
    setIsEditing(false);
    setIsAdding(false);
    setIsSearchEnabled(false);
  };

  const handleCancelClick = () => {
    // Would typically reset form data here
    setIsEditing(false);
    setIsAdding(false);
    setIsSearchEnabled(false);
  };

  const handleCloseClick = () => {
    setShowCrudBar(false);
    setActiveForm(null);
    setIsSearchEnabled(false);
    setIsEditing(false);
    setIsAdding(false);
  };

  const renderActiveForm = () => {
    const isEditable = isEditing || isAdding;
    
    switch(activeForm) {
      case 'donor':
        return <DonorForm isSearchEnabled={isSearchEnabled} isEditable={isEditable} />;
      case 'patient':
        return <PatientForm isSearchEnabled={isSearchEnabled} isEditable={isEditable} />;
      case 'bleeding':
        return <BleedingForm isSearchEnabled={isSearchEnabled} isEditable={isEditable} />;
      case 'crossmatch':
        return <CrossmatchForm isSearchEnabled={isSearchEnabled} isEditable={isEditable} />;
      case 'patientInvoice':
        return <PatientInvoiceForm isSearchEnabled={isSearchEnabled} isEditable={isEditable} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <FormToolbar 
          onButtonClick={(formType) => handleFormButtonClick(formType as FormType)} 
        />
        {showCrudBar && (
          <CrudBar 
            onEditClick={handleEditClick} 
            onCloseClick={handleCloseClick}
            onAddClick={handleAddClick}
            onCancelClick={handleCancelClick}
            onSaveClick={handleSaveClick}
            activeForm={activeForm}
            isEditing={isEditing}
            isAdding={isAdding}
          />
        )}
        <div className="flex-1 overflow-auto p-6">
          {activeForm && renderActiveForm()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
