
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
  clearForm: () => void;
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
            onDeleteClick={handleDeleteClick}
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
