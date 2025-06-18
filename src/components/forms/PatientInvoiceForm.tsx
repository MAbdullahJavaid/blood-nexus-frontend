
import React, { forwardRef, useImperativeHandle } from "react";
import { PatientInvoiceFormProvider, usePatientInvoiceState } from "./patient-invoice/hooks/usePatientInvoiceState";
import { PatientInfoSection } from "./patient-invoice/PatientInfoSection";
import { HospitalDetailsSection } from "./patient-invoice/HospitalDetailsSection";
import { BloodDetailsSection } from "./patient-invoice/BloodDetailsSection";
import { TestsSection } from "./patient-invoice/TestsSection";
import { TotalSection } from "./patient-invoice/TotalSection";
import { PatientSearchModal } from "./patient-invoice/PatientSearchModal";
import { TestSearchModal } from "./patient-invoice/TestSearchModal";
import { DocumentSearchModal } from "./patient-invoice/DocumentSearchModal";
import { useSaveInvoice } from "./patient-invoice/hooks/useSaveInvoice";

interface PatientInvoiceFormProps {
  isSearchEnabled?: boolean;
  isEditable?: boolean;
}

interface PatientInvoiceFormRef {
  clearForm: () => void;
  handleSave: () => Promise<{success: boolean, invoiceId?: string, error?: any}>;
  handleDelete: () => Promise<{success: boolean, error?: any}>;
  handleAddItem: () => void;
  handleDeleteItem: () => void;
}

const PatientInvoiceFormContent = forwardRef<PatientInvoiceFormRef, PatientInvoiceFormProps>(
  ({ isSearchEnabled = false, isEditable = false }, ref) => {
    const {
      patientInfo,
      hospitalDetails,
      bloodDetails,
      tests,
      totals,
      isPatientModalOpen,
      setIsPatientModalOpen,
      isTestModalOpen,
      setIsTestModalOpen,
      isDocumentModalOpen,
      setIsDocumentModalOpen,
      addTest,
      removeTest,
      clearForm,
      ...handlers
    } = usePatientInvoiceState();

    const { saveInvoice } = useSaveInvoice();

    useImperativeHandle(ref, () => ({
      clearForm,
      handleSave: async () => {
        try {
          const result = await saveInvoice({
            patientInfo,
            hospitalDetails,
            bloodDetails,
            tests,
            totals
          });
          return { success: true, invoiceId: result.invoiceId };
        } catch (error) {
          console.error("Error saving invoice:", error);
          return { success: false, error };
        }
      },
      handleDelete: async () => {
        try {
          // Add delete logic here if needed
          return { success: true };
        } catch (error) {
          console.error("Error deleting invoice:", error);
          return { success: false, error };
        }
      },
      handleAddItem: addTest,
      handleDeleteItem: () => {
        if (tests.length > 0) {
          removeTest(tests.length - 1);
        }
      }
    }));

    return (
      <div className="bg-white p-4 rounded-md space-y-6">
        <PatientInfoSection 
          patientInfo={patientInfo}
          onPatientInfoChange={handlers.handlePatientInfoChange}
          onSearchClick={() => setIsPatientModalOpen(true)}
          isEditable={isEditable}
          isSearchEnabled={isSearchEnabled}
        />

        <HospitalDetailsSection 
          hospitalDetails={hospitalDetails}
          onHospitalDetailsChange={handlers.handleHospitalDetailsChange}
          isEditable={isEditable}
        />

        <BloodDetailsSection 
          bloodDetails={bloodDetails}
          onBloodDetailsChange={handlers.handleBloodDetailsChange}
          isEditable={isEditable}
        />

        <TestsSection 
          tests={tests}
          onTestChange={handlers.handleTestChange}
          onAddTest={() => setIsTestModalOpen(true)}
          onRemoveTest={removeTest}
          isEditable={isEditable}
        />

        <TotalSection totals={totals} />

        <PatientSearchModal
          isOpen={isPatientModalOpen}
          onClose={() => setIsPatientModalOpen(false)}
          onSelectPatient={handlers.handlePatientSelect}
        />

        <TestSearchModal
          isOpen={isTestModalOpen}
          onClose={() => setIsTestModalOpen(false)}
          onSelectTest={handlers.handleTestSelect}
        />

        <DocumentSearchModal
          isOpen={isDocumentModalOpen}
          onClose={() => setIsDocumentModalOpen(false)}
          onSelectDocument={handlers.handleDocumentSelect}
        />
      </div>
    );
  }
);

const PatientInvoiceForm = forwardRef<PatientInvoiceFormRef, PatientInvoiceFormProps>(
  ({ isSearchEnabled = false, isEditable = false }, ref) => {
    return (
      <PatientInvoiceFormProvider>
        <PatientInvoiceFormContent 
          ref={ref}
          isSearchEnabled={isSearchEnabled}
          isEditable={isEditable}
        />
      </PatientInvoiceFormProvider>
    );
  }
);

PatientInvoiceForm.displayName = "PatientInvoiceForm";
PatientInvoiceFormContent.displayName = "PatientInvoiceFormContent";

export default PatientInvoiceForm;
