
import { DonorFormProvider } from "./donor/DonorFormContext";
import { useState } from "react";
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

const DonorForm = ({ isSearchEnabled = false, isEditable = false, isDeleting = false }: DonorFormProps) => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  return (
    <DonorFormProvider isEditable={isEditable} isDeleting={isDeleting}>
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
        
        {/* Donor Search Modal */}
        <DonorSearchModal 
          isOpen={isSearchModalOpen}
          onClose={() => setIsSearchModalOpen(false)}
        />
      </div>
    </DonorFormProvider>
  );
};

export default DonorForm;
