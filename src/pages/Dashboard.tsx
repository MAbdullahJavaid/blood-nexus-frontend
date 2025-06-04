
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
import { toast } from "@/hooks/use-toast";

type FormType = 'donor' | 'patient' | 'bleeding' | 'crossmatch' | 'patientInvoice' | 'category' | 'testInformation' | null;

interface FormRef {
  handleAddItem?: () => void;
  handleDeleteItem?: () => void;
  handleSave?: () => Promise<{success: boolean, invoiceId?: string, error?: any}>;
  clearForm: () => void; // Make clearForm required to match form component interfaces
}

const Dashboard = () => {
  const [showCrudBar, setShowCrudBar] = useState(false);
  const [activeForm, setActiveForm] = useState<FormType>(null);
  const [isSearchEnabled, setIsSearchEnabled] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  
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
    
    activeFormRef.current = {
      clearForm: () => {} // Reset to default
    };
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
    clearActiveForm();
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setIsSearchEnabled(true);
    setIsAdding(false);
    setIsDeleting(false);
    clearActiveForm();
  };

  const handleDeleteClick = () => {
    setIsDeleting(true);
    setIsSearchEnabled(true);
    setIsEditing(false);
    setIsAdding(false);
    clearActiveForm();
  };

  const handleSaveClick = async () => {
    if (activeFormRef.current && activeFormRef.current.handleSave) {
      const result = await activeFormRef.current.handleSave();
      if (result.success) {
        toast({
          title: "Form Saved",
          description: `${activeForm} data has been saved successfully.`
        });
        setIsEditing(false);
        setIsAdding(false);
        setIsDeleting(false);
        setIsSearchEnabled(false);
      }
    } else {
      toast({
        title: "Form Saved",
        description: `${activeForm} data has been saved successfully.`
      });
      setIsEditing(false);
      setIsAdding(false);
      setIsDeleting(false);
      setIsSearchEnabled(false);
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setIsAdding(false);
    setIsDeleting(false);
    setIsSearchEnabled(false);
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
                 ref={activeFormRef as any}
               />;
      case 'patient':
        return <PatientForm 
                 isSearchEnabled={isSearchEnabled} 
                 isEditable={isEditable}
                 isDeleting={isDeleting}
                 ref={activeFormRef as any}
               />;
      case 'bleeding':
        return <BleedingForm 
                 isSearchEnabled={isSearchEnabled} 
                 isEditable={isEditable}
                 isDeleting={isDeleting}
                 ref={activeFormRef as any}
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
