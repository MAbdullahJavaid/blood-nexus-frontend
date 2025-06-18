
import React, { forwardRef, useImperativeHandle } from "react";
import PatientInvoiceFormComponent from "./patient-invoice/PatientInvoiceForm";

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

const PatientInvoiceForm = forwardRef<PatientInvoiceFormRef, PatientInvoiceFormProps>(
  ({ isSearchEnabled = false, isEditable = false }, ref) => {
    const innerRef = React.useRef<any>(null);

    useImperativeHandle(ref, () => ({
      clearForm: () => {
        if (innerRef.current?.clearForm) {
          innerRef.current.clearForm();
        }
      },
      handleSave: async () => {
        if (innerRef.current?.handleSave) {
          return await innerRef.current.handleSave();
        }
        return { success: false, error: "No save handler available" };
      },
      handleDelete: async () => {
        if (innerRef.current?.handleDelete) {
          return await innerRef.current.handleDelete();
        }
        return { success: false, error: "No delete handler available" };
      },
      handleAddItem: () => {
        if (innerRef.current?.handleAddItem) {
          innerRef.current.handleAddItem();
        }
      },
      handleDeleteItem: () => {
        if (innerRef.current?.handleDeleteItem) {
          innerRef.current.handleDeleteItem();
        }
      }
    }));

    return (
      <PatientInvoiceFormComponent
        ref={innerRef}
        isSearchEnabled={isSearchEnabled}
        isEditable={isEditable}
      />
    );
  }
);

PatientInvoiceForm.displayName = "PatientInvoiceForm";

export default PatientInvoiceForm;
