import { Sidebar } from "@/components/dashboard/Sidebar";
import { FormToolbar } from "@/components/dashboard/FormToolbar";
import { CrudBar } from "@/components/dashboard/CrudBar";
import { useState, useRef } from "react";
import DonorForm from "@/components/forms/DonorForm";
import PatientForm from "@/components/forms/PatientForm";
import CrossmatchForm from "@/components/forms/CrossmatchForm";
import BleedingForm from "@/components/forms/BleedingForm";
import PatientInvoiceForm from "@/components/forms/PatientInvoiceForm";
import CategoryForm from "@/components/forms/CategoryForm";
import TestInformationForm from "@/components/forms/TestInformationForm";

// Import necessary hooks and functions
import { toast } from "@/hooks/use-toast";

type FormType = 'donor' | 'patient' | 'bleeding' | 'crossmatch' | 'patientInvoice' | 'category' | 'testInformation' | null;

// Updated FormRef interface to make clearForm required
interface FormRef {
  handleAddItem?: () => void;
  handleDeleteItem?: () => void;
  clearForm: () => void; // Made required to match DonorFormRef and BleedingFormRef
}

const Dashboard = () => {
  const [showCrudBar, setShowCrudBar] = useState(false);
  const [activeForm, setActiveForm] = useState<FormType>(null);
  const [isSearchEnabled, setIsSearchEnabled] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  
  // Reference to the active form component
  const activeFormRef = useRef<FormRef>({
    clearForm: () => {} // Provide default implementation
  });
  
  const handleFormButtonClick = (formType: FormType) => {
    setShowCrudBar(true);
    setActiveForm(formType);
    setIsSearchEnabled(false);
    setIsEditing(false);
    setIsAdding(false);
    setIsDeleting(false);
    
    // Reset the form ref when changing forms
    activeFormRef.current = { clearForm: () => {} };
  };

  const clearActiveForm = () => {
    if (activeFormRef.current && activeFormRef.current.clearForm) {
      activeFormRef.current.clearForm();
    }
  };

  const handleAddClick = () => {
    setIsAdding(true);
    setIsSearchEnabled(false);
    setIsEditing(false);
    setIsDeleting(false);
    // Clear form when switching to add mode
    clearActiveForm();
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setIsSearchEnabled(true);
    setIsAdding(false);
    setIsDeleting(false);
    // Clear form when switching to edit mode
    clearActiveForm();
  };

  const handleDeleteClick = () => {
    setIsDeleting(true);
    setIsSearchEnabled(true);
    setIsEditing(false);
    setIsAdding(false);
    // Clear form when switching to delete mode
    clearActiveForm();
  };

  const handleSaveClick = () => {
    // Would typically save form data here
    toast({
      title: "Form Saved",
      description: `${activeForm} data has been saved successfully.`
    });
    setIsEditing(false);
    setIsAdding(false);
    setIsDeleting(false);
    setIsSearchEnabled(false);
  };

  const handleCancelClick = () => {
    // Would typically reset form data here
    setIsEditing(false);
    setIsAdding(false);
    setIsDeleting(false);
    setIsSearchEnabled(false);
    // Clear form when canceling
    clearActiveForm();
  };

  const handleCloseClick = () => {
    setShowCrudBar(false);
    setActiveForm(null);
    setIsSearchEnabled(false);
    setIsEditing(false);
    setIsAdding(false);
    setIsDeleting(false);
  };

  const handleAddItemClick = () => {
    if (activeFormRef.current && activeFormRef.current.handleAddItem) {
      activeFormRef.current.handleAddItem();
    }
  };

  const handleDeleteItemClick = () => {
    if (activeFormRef.current && activeFormRef.current.handleDeleteItem) {
      activeFormRef.current.handleDeleteItem();
    }
  };

  const renderActiveForm = () => {
    const isEditable = isEditing || isAdding;
    
    switch(activeForm) {
      case 'donor':
        return <DonorForm 
                 isSearchEnabled={isSearchEnabled} 
                 isEditable={isEditable}
                 isDeleting={isDeleting}
                 ref={activeFormRef}
               />;
      case 'patient':
        return <PatientForm isSearchEnabled={isSearchEnabled} isEditable={isEditable} />;
      case 'bleeding':
        return <BleedingForm 
                 isSearchEnabled={isSearchEnabled} 
                 isEditable={isEditable}
                 isDeleting={isDeleting}
                 ref={activeFormRef}
               />;
      case 'crossmatch':
        return <CrossmatchForm isSearchEnabled={isSearchEnabled} isEditable={isEditable} />;
      case 'patientInvoice':
        return <PatientInvoiceForm 
                 isSearchEnabled={isSearchEnabled} 
                 isEditable={isEditable} 
                 ref={activeFormRef}
               />;
      case 'category':
        return <CategoryForm isSearchEnabled={isSearchEnabled} isEditable={isEditable} />;
      case 'testInformation':
        return <TestInformationForm isSearchEnabled={isSearchEnabled} isEditable={isEditable} categories={categories} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar onFormOpen={handleFormButtonClick} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <FormToolbar 
          onButtonClick={(formType) => handleFormButtonClick(formType as FormType)} 
        />
        {showCrudBar && (
          <CrudBar 
            onEditClick={handleEditClick}
            onDeleteClick={handleDeleteClick}
            onCloseClick={handleCloseClick}
            onAddClick={handleAddClick}
            onCancelClick={handleCancelClick}
            onSaveClick={handleSaveClick}
            onAddItemClick={handleAddItemClick}
            onDeleteItemClick={handleDeleteItemClick}
            activeForm={activeForm}
            isEditing={isEditing}
            isAdding={isAdding}
            isDeleting={isDeleting}
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
