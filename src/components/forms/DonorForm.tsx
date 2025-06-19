
import React, { forwardRef, useImperativeHandle } from "react";
import { DonorFormProvider, useDonorForm } from "./donor/DonorFormContext";
import { 
  PersonalInfoSection,
  AddressSection,
  DemographicsSection,
  BloodGroupSection,
  RemarksSection,
  StatusSection,
  FormSubmitSection,
  DonorSearchModal
} from "./donor";

interface DonorFormProps {
  isSearchEnabled?: boolean;
  isEditable?: boolean;
  isDeleting?: boolean;
}

interface DonorFormRef {
  clearForm: () => void;
  handleSave: () => Promise<{success: boolean, error?: any}>;
  handleDelete: () => Promise<{success: boolean, error?: any}>;
}

const DonorFormContent = forwardRef<DonorFormRef, DonorFormProps>(
  ({ isSearchEnabled = false, isEditable = false, isDeleting = false }, ref) => {
    const { clearForm, handleSubmit, handleDelete } = useDonorForm();

    useImperativeHandle(ref, () => ({
      clearForm,
      handleSave: async () => {
        try {
          console.log("DonorForm: Starting save operation");
          await handleSubmit();
          return { success: true };
        } catch (error) {
          console.error("DonorForm: Error saving donor:", error);
          return { success: false, error };
        }
      },
      handleDelete: async () => {
        try {
          console.log("DonorForm: Starting delete operation");
          await handleDelete();
          return { success: true };
        } catch (error) {
          console.error("DonorForm: Error deleting donor:", error);
          return { success: false, error };
        }
      }
    }));

    return (
      <div className="bg-white p-4 rounded-md">
        <PersonalInfoSection 
          isEditable={isEditable} 
          isSearchEnabled={isSearchEnabled}
          isDeleting={isDeleting}
        />
        <AddressSection isEditable={isEditable} />
        <DemographicsSection isEditable={isEditable} />
        <BloodGroupSection isEditable={isEditable} />
        <RemarksSection isEditable={isEditable} />
        <StatusSection isEditable={isEditable} />
        <FormSubmitSection isEditable={isEditable} isDeleting={isDeleting} />
        
        <DonorSearchModal />
      </div>
    );
  }
);

const DonorForm = forwardRef<DonorFormRef, DonorFormProps>(
  ({ isSearchEnabled = false, isEditable = false, isDeleting = false }, ref) => {
    return (
      <DonorFormProvider isEditable={isEditable} isDeleting={isDeleting}>
        <DonorFormContent 
          ref={ref}
          isSearchEnabled={isSearchEnabled}
          isEditable={isEditable}
          isDeleting={isDeleting}
        />
      </DonorFormProvider>
    );
  }
);

DonorForm.displayName = "DonorForm";
DonorFormContent.displayName = "DonorFormContent";

export default DonorForm;
