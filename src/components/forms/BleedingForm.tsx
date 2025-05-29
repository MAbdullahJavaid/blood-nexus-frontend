
import { BleedingFormProvider } from "./bleeding/BleedingFormContext";
import { BleedingFormProps } from "./bleeding/types";
import DonorInfoSection from "./bleeding/DonorInfoSection";
import BagInfoSection from "./bleeding/BagInfoSection";
import BloodGroupSection from "./bleeding/BloodGroupSection";
import AddressSection from "./bleeding/AddressSection";
import ScreeningResultsPanel from "./bleeding/ScreeningResultsPanel";
import HBAndDateSection from "./bleeding/HBAndDateSection";
import ProductInfoSection from "./bleeding/ProductInfoSection";
import FormSubmitSection from "./bleeding/FormSubmitSection";
import { getFormattedDate } from "./bleeding/utils";

interface ExtendedBleedingFormProps extends BleedingFormProps {
  isDeleting?: boolean;
}

const BleedingForm = ({ isSearchEnabled = true, isEditable = true, isDeleting = false }: ExtendedBleedingFormProps) => {
  const formattedDate = getFormattedDate();

  return (
    <BleedingFormProvider isEditable={isEditable} isDeleting={isDeleting}>
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
        <HBAndDateSection isEditable={isEditable} formattedDate={formattedDate} />
        <ProductInfoSection isEditable={isEditable} />
        <FormSubmitSection isEditable={isEditable} isDeleting={isDeleting} />
      </form>
    </BleedingFormProvider>
  );
};

export default BleedingForm;
