
import React, { forwardRef, useImperativeHandle, useEffect } from "react";
import { BleedingFormProvider, useBleedingForm } from "./bleeding/BleedingFormContext";
import { BleedingFormProps } from "./bleeding/types";
import DonorInfoSection from "./bleeding/DonorInfoSection";
import BagInfoSection from "./bleeding/BagInfoSection";
import BloodGroupSection from "./bleeding/BloodGroupSection";
import AddressSection from "./bleeding/AddressSection";
import ScreeningResultsPanel from "./bleeding/ScreeningResultsPanel";
import HBAndDateSection from "./bleeding/HBAndDateSection";
import ProductInfoSection from "./bleeding/ProductInfoSection";
import FormSubmitSection from "./bleeding/FormSubmitSection";

interface ExtendedBleedingFormProps extends BleedingFormProps {
  isDeleting?: boolean;
}

interface BleedingFormRef {
  clearForm: () => void;
  handleSave: () => Promise<{success: boolean, error?: any}>;
  handleDelete: () => Promise<{success: boolean, error?: any}>;
}

const BleedingFormContent = forwardRef<BleedingFormRef, ExtendedBleedingFormProps>(
  ({ isSearchEnabled = true, isEditable = true, isDeleting = false }, ref) => {
    const { clearForm, handleSubmit, handleDelete } = useBleedingForm();

    // Clear form when entering add, edit, or delete mode
    useEffect(() => {
      if (isEditable || isDeleting) {
        clearForm();
      }
    }, [isEditable, isDeleting, clearForm]);

    useImperativeHandle(ref, () => ({
      clearForm,
      handleSave: async () => {
        try {
          await handleSubmit();
          return { success: true };
        } catch (error) {
          console.error("Error saving bleeding record:", error);
          return { success: false, error };
        }
      },
      handleDelete: async () => {
        try {
          await handleDelete();
          return { success: true };
        } catch (error) {
          console.error("Error deleting bleeding record:", error);
          return { success: false, error };
        }
      }
    }));

    return (
      <form className="bg-white p-4 rounded-md" onSubmit={(e) => e.preventDefault()}>
        <DonorInfoSection 
          isEditable={isEditable} 
          isSearchEnabled={isSearchEnabled}
          isDeleting={isDeleting}
        />
        <BagInfoSection 
          isEditable={isEditable} 
          isSearchEnabled={isSearchEnabled}
          isDeleting={isDeleting}
        />
        <BloodGroupSection />
        <AddressSection />

        <div className="mt-6 mb-2">
          <h3 className="text-lg font-medium text-red-600">Screening Results</h3>
        </div>
        
        <ScreeningResultsPanel isEditable={isEditable} />
        <HBAndDateSection isEditable={isEditable} />
        <ProductInfoSection isEditable={isEditable} />
        <FormSubmitSection isEditable={isEditable} isDeleting={isDeleting} />
      </form>
    );
  }
);

const BleedingForm = forwardRef<BleedingFormRef, ExtendedBleedingFormProps>(
  ({ isSearchEnabled = true, isEditable = true, isDeleting = false }, ref) => {
    return (
      <BleedingFormProvider isEditable={isEditable} isDeleting={isDeleting}>
        <BleedingFormContent 
          ref={ref}
          isSearchEnabled={isSearchEnabled}
          isEditable={isEditable}
          isDeleting={isDeleting}
        />
      </BleedingFormProvider>
    );
  }
);

BleedingForm.displayName = "BleedingForm";
BleedingFormContent.displayName = "BleedingFormContent";

export default BleedingForm;
