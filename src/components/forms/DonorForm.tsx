
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
}

const DonorFormContent = forwardRef<DonorFormRef, DonorFormProps>(
  ({ isSearchEnabled = false, isEditable = false, isDeleting = false }, ref) => {
    const { clearForm } = useDonorForm();

    useImperativeHandle(ref, () => ({
      clearForm
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
        
        {/* Donor Search Modal - This will be controlled by the context */}
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
