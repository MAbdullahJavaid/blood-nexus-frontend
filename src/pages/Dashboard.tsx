import { Sidebar } from "@/components/dashboard/Sidebar";
import { FormToolbar } from "@/components/dashboard/FormToolbar";
import { CrudBar } from "@/components/dashboard/CrudBar";
import { StockDisplay } from "@/components/dashboard/StockDisplay";
import { useState, useRef } from "react";
import DonorForm from "@/components/forms/DonorForm";
import PatientForm from "@/components/forms/PatientForm";
import CrossmatchForm from "@/components/forms/CrossmatchForm";
import BleedingForm from "@/components/forms/BleedingForm";
import PatientInvoiceForm from "@/components/forms/PatientInvoiceForm";
import CategoryForm from "@/components/forms/CategoryForm";
import TestInformationForm from "@/components/forms/TestInformationForm";
import ReportDataEntryForm from "@/components/forms/ReportDataEntryForm";
import { toast } from "@/hooks/use-toast";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import ThanksLetter from "@/components/thanks-letter/ThanksLetter";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

type FormType = 'donor' | 'patient' | 'bleeding' | 'crossmatch' | 'patientInvoice' | 'category' | 'testInformation' | 'reportDataEntry' | 'thanksLetter' | null;

interface FormRef {
  handleAddItem?: () => void;
  handleDeleteItem?: () => void;
  handleSave?: () => Promise<{success: boolean, invoiceId?: string, error?: any}>;
  handleDelete?: () => Promise<{success: boolean, error?: any}>;
  clearForm: () => void;
}

const Dashboard = () => {
  const { canAccessForm } = useRoleAccess();
  const [showCrudBar, setShowCrudBar] = useState(false);
  const [activeForm, setActiveForm] = useState<FormType>(null);
  const [isSearchEnabled, setIsSearchEnabled] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeletingRecord, setIsDeletingRecord] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  
  const activeFormRef = useRef<FormRef>({
    clearForm: () => {}
  });
  
  const reportFormRef = useRef<{ clearForm: () => void } | null>(null);
  const thanksLetterRef = useRef<HTMLDivElement | null>(null);

  // Stock display is visible when no form is active or crud bar is hidden
  const isStockVisible = !showCrudBar || activeForm === null;

  const handleFormButtonClick = (formType: FormType) => {
    // Check if user has access to this form
    if (!canAccessForm(formType || '')) {
      toast({
        title: "Access Denied",
        description: `You don't have permission to access ${formType}.`,
        variant: "destructive"
      });
      return;
    }

    console.log("Dashboard: Opening form:", formType);
    setShowCrudBar(true);
    setActiveForm(formType);
    resetFormState();
    
    activeFormRef.current = {
      clearForm: () => {}
    };
  };

  const clearActiveForm = () => {
    console.log("Dashboard: Clearing active form");
    if (activeFormRef.current && activeFormRef.current.clearForm) {
      activeFormRef.current.clearForm();
    }
    if (activeForm === "reportDataEntry" && reportFormRef.current && reportFormRef.current.clearForm) {
      reportFormRef.current.clearForm();
    }
  };

  const resetFormState = () => {
    setIsEditing(false);
    setIsAdding(false);
    setIsDeleting(false);
    setIsSearchEnabled(false);
    setIsSaving(false);
    setIsDeletingRecord(false);
  };

  const handleAddClick = () => {
    console.log("Dashboard: Add clicked");
    setIsAdding(true);
    setIsSearchEnabled(false);
    setIsEditing(false);
    setIsDeleting(false);
    clearActiveForm();
  };

  const handleEditClick = () => {
    console.log("Dashboard: Edit clicked");
    setIsEditing(true);
    setIsSearchEnabled(true);
    setIsAdding(false);
    setIsDeleting(false);
    clearActiveForm();
  };

  const handleDeleteClick = () => {
    console.log("Dashboard: Delete clicked");
    setIsDeleting(true);
    setIsSearchEnabled(true);
    setIsEditing(false);
    setIsAdding(false);
    clearActiveForm();
  };

  const handleSaveClick = async () => {
    console.log("Dashboard: Save clicked for form:", activeForm);
    
    if (!activeFormRef.current?.handleSave) {
      console.log("Dashboard: No save handler found for form:", activeForm);
      toast({
        title: "Save Not Available",
        description: `Save functionality is not implemented for ${activeForm}.`,
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    
    try {
      console.log("Dashboard: Starting save operation for form:", activeForm);
      const result = await activeFormRef.current.handleSave();
      
      if (result.success) {
        console.log("Dashboard: Save successful");
        toast({
          title: "Success",
          description: `${activeForm} saved successfully.${result.invoiceId ? ` Invoice ID: ${result.invoiceId}` : ''}`
        });
        resetFormState();
      } else {
        console.error("Dashboard: Save failed:", result.error);
        toast({
          title: "Save Failed",
          description: result.error?.message || `Failed to save ${activeForm}.`,
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error("Dashboard: Unexpected error during save:", error);
      toast({
        title: "Save Error", 
        description: error?.message || `An unexpected error occurred while saving ${activeForm}.`,
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteRecord = async () => {
    console.log("Dashboard: Delete record clicked for form:", activeForm);
    
    if (!activeFormRef.current?.handleDelete) {
      console.log("Dashboard: No delete handler found for form:", activeForm);
      toast({
        title: "Delete Not Available", 
        description: `Delete functionality is not implemented for ${activeForm}.`,
        variant: "destructive"
      });
      return;
    }

    const confirmed = window.confirm(`Are you sure you want to delete this ${activeForm} record? This action cannot be undone.`);
    if (!confirmed) {
      console.log("Dashboard: Delete cancelled by user");
      return;
    }

    setIsDeletingRecord(true);
    
    try {
      console.log("Dashboard: Starting delete operation for form:", activeForm);
      const result = await activeFormRef.current.handleDelete();
      
      if (result.success) {
        console.log("Dashboard: Delete successful");
        toast({
          title: "Success",
          description: `${activeForm} deleted successfully.`
        });
        resetFormState();
      } else {
        console.error("Dashboard: Delete failed:", result.error);
        toast({
          title: "Delete Failed",
          description: result.error?.message || `Failed to delete ${activeForm}.`,
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error("Dashboard: Unexpected error during delete:", error);
      toast({
        title: "Delete Error",
        description: error?.message || `An unexpected error occurred while deleting ${activeForm}.`,
        variant: "destructive"
      });
    } finally {
      setIsDeletingRecord(false);
    }
  };

  const handleCancelClick = () => {
    console.log("Dashboard: Cancel clicked");
    resetFormState();
    clearActiveForm();
  };

  const handleCloseClick = () => {
    console.log("Dashboard: Close clicked");
    setShowCrudBar(false);
    setActiveForm(null);
    resetFormState();
    clearActiveForm();
  };

  const handleAddItemClick = () => {
    console.log("Dashboard: Add item clicked");
    if (activeFormRef.current && activeFormRef.current.handleAddItem) {
      activeFormRef.current.handleAddItem();
    }
  };

  const handleDeleteItemClick = () => {
    console.log("Dashboard: Delete item clicked");
    if (activeFormRef.current && activeFormRef.current.handleDeleteItem) {
      activeFormRef.current.handleDeleteItem();
    }
  };

  const handlePrintThanksLetter = async () => {
    console.log("Dashboard: Print thanks letter clicked");
    if (thanksLetterRef.current) {
      const input = thanksLetterRef.current;
      input.scrollIntoView({ behavior: 'smooth', block: 'center' });
      await new Promise(res => setTimeout(res, 200));
      html2canvas(input, { scale: 2 }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = pdfWidth - 20;
        const imgProps = canvas.width / canvas.height;
        const imgHeight = imgWidth / imgProps;

        let y = (pdfHeight - imgHeight) / 2;
        if (y < 10) y = 10;
        pdf.addImage(imgData, 'PNG', 10, y, imgWidth, imgHeight);
        pdf.save("ThankYouLetter.pdf");
      });
    } else {
      toast({
        title: "Error",
        description: "Could not find the letter to print."
      });
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
        return <CrossmatchForm 
                 isSearchEnabled={isSearchEnabled} 
                 isEditable={isEditable} 
                 ref={activeFormRef as any}
               />;
      case 'patientInvoice':
        return <PatientInvoiceForm 
                 isSearchEnabled={isSearchEnabled} 
                 isEditable={isEditable} 
                 ref={activeFormRef}
               />;
      case 'category':
        return <CategoryForm isSearchEnabled={isSearchEnabled} isEditable={isEditable} />;
      case 'testInformation':
        return <TestInformationForm 
                 isSearchEnabled={isSearchEnabled} 
                 isEditable={isEditable} 
                 categories={categories}
                 ref={activeFormRef as any}
               />;
      case 'reportDataEntry':
        return (
          <ReportDataEntryForm
            isSearchEnabled={isSearchEnabled}
            isEditable={isEditable}
            isDeleting={isDeleting}
            key="report-data-entry"
            ref={reportFormRef}
          />
        );
      case 'thanksLetter':
        return (
          <div className="flex w-full justify-center mt-8">
            <div ref={thanksLetterRef}>
              <ThanksLetter />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const onlyPrintAndClose = activeForm === "thanksLetter";

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
            onDeleteClick={isDeleting ? handleDeleteRecord : handleDeleteClick}
            onCloseClick={handleCloseClick}
            onAddClick={handleAddClick}
            onCancelClick={handleCancelClick}
            onSaveClick={handleSaveClick}
            onAddItemClick={handleAddItemClick}
            onDeleteItemClick={handleDeleteItemClick}
            onPrintClick={onlyPrintAndClose ? handlePrintThanksLetter : undefined}
            activeForm={activeForm}
            isEditing={isEditing}
            isAdding={isAdding}
            isDeleting={isDeleting}
            onlyPrintAndClose={onlyPrintAndClose}
            isSaving={isSaving}
            isDeletingRecord={isDeletingRecord}
          />
        )}
        <div className="flex-1 overflow-auto p-6">
          <StockDisplay isVisible={isStockVisible} />
          {activeForm && renderActiveForm()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
