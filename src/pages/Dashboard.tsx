
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
import ReportDataEntryForm from "@/components/forms/ReportDataEntryForm";
import { toast } from "@/hooks/use-toast";
import ThanksLetter from "@/components/thanks-letter/ThanksLetter";
// Import required for PDF export
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

  // We'll store the ref to the ThanksLetter DOM node for PDF export
  const thanksLetterRef = useRef<HTMLDivElement | null>(null);

  const handleFormButtonClick = (formType: FormType) => {
    setShowCrudBar(true);
    setActiveForm(formType);
    setIsSearchEnabled(false);
    setIsEditing(false);
    setIsAdding(false);
    setIsDeleting(false);
    setIsSaving(false);
    setIsDeletingRecord(false);
    
    activeFormRef.current = {
      clearForm: () => {}
    };
  };

  const clearActiveForm = () => {
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
    if (!activeFormRef.current?.handleSave) {
      // For forms that don't have integrated save functionality yet
      toast({
        title: "Form Saved",
        description: `${activeForm} data has been saved successfully.`
      });
      resetFormState();
      return;
    }

    setIsSaving(true);
    
    try {
      console.log("Starting save operation for form:", activeForm);
      const result = await activeFormRef.current.handleSave();
      
      if (result.success) {
        toast({
          title: "Save Successful",
          description: `${activeForm} data has been saved successfully.${result.invoiceId ? ` Invoice ID: ${result.invoiceId}` : ''}`
        });
        resetFormState();
        clearActiveForm();
      } else {
        console.error("Save operation failed:", result.error);
        toast({
          title: "Save Failed",
          description: result.error?.message || `Failed to save ${activeForm} data. Please check your input and try again.`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Unexpected error during save:", error);
      toast({
        title: "Save Error",
        description: `An unexpected error occurred while saving ${activeForm} data.`,
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteRecord = async () => {
    if (!activeFormRef.current?.handleDelete) {
      toast({
        title: "Delete Not Supported",
        description: `Delete functionality is not implemented for ${activeForm}.`,
        variant: "destructive"
      });
      return;
    }

    // Show confirmation dialog
    const confirmed = window.confirm(`Are you sure you want to delete this ${activeForm} record? This action cannot be undone.`);
    if (!confirmed) {
      return;
    }

    setIsDeletingRecord(true);
    
    try {
      console.log("Starting delete operation for form:", activeForm);
      const result = await activeFormRef.current.handleDelete();
      
      if (result.success) {
        toast({
          title: "Delete Successful",
          description: `${activeForm} record has been deleted successfully.`
        });
        resetFormState();
        clearActiveForm();
      } else {
        console.error("Delete operation failed:", result.error);
        toast({
          title: "Delete Failed",
          description: result.error?.message || `Failed to delete ${activeForm} record.`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Unexpected error during delete:", error);
      toast({
        title: "Delete Error",
        description: `An unexpected error occurred while deleting ${activeForm} record.`,
        variant: "destructive"
      });
    } finally {
      setIsDeletingRecord(false);
    }
  };

  const handleCancelClick = () => {
    resetFormState();
    clearActiveForm();
  };

  const handleCloseClick = () => {
    setShowCrudBar(false);
    setActiveForm(null);
    resetFormState();
    clearActiveForm(); // Clear form when closing
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

  // PRINT (to PDF) LOGIC for ThanksLetter
  const handlePrintThanksLetter = async () => {
    if (thanksLetterRef.current) {
      const input = thanksLetterRef.current;
      // Optionally, scroll into view so all styles are resolved
      input.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // wait a short moment to ensure fully rendered
      await new Promise(res => setTimeout(res, 200));
      html2canvas(input, { scale: 2 }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        // Letter size in mm for A4: 210 x 297
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });
        // Center the image (about 170mm usable width)
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = pdfWidth - 20; // horizontal padding
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

  // Is thanks letter active?
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
          {activeForm && renderActiveForm()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
