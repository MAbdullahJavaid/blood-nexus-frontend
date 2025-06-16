
import React, { forwardRef, useImperativeHandle } from "react";
import { BleedingFormProvider, useBleedingForm } from "./bleeding/BleedingFormContext";
import { BleedingFormProps } from "./bleeding/types";
import DonorInfoSection from "./bleeding/DonorInfoSection";
import BagInfoSection from "./bleeding/BagInfoSection";
import BloodGroupSection from "./bleeding/BloodGroupSection";
import AddressSection from "./bleeding/AddressSection";
// Removed DonorCategorySection import
import ScreeningResultsPanel from "./bleeding/ScreeningResultsPanel";
import HBAndDateSection from "./bleeding/HBAndDateSection";
import ProductInfoSection from "./bleeding/ProductInfoSection";
import FormSubmitSection from "./bleeding/FormSubmitSection";

interface ExtendedBleedingFormProps extends BleedingFormProps {
  isDeleting?: boolean;
}

interface BleedingFormRef {
  clearForm: () => void;
}

const BleedingFormContent = forwardRef<BleedingFormRef, ExtendedBleedingFormProps>(
  ({ isSearchEnabled = true, isEditable = true, isDeleting = false }, ref) => {
    const { clearForm } = useBleedingForm();

    useImperativeHandle(ref, () => ({
      clearForm
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
        {/* DonorCategorySection has been removed per your request */}

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
