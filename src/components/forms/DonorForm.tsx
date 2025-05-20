
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
}

const DonorForm = ({ isSearchEnabled = false, isEditable = false }: DonorFormProps) => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  return (
    <DonorFormProvider isEditable={isEditable}>
      <div className="bg-white p-4 rounded-md">
        <PersonalInfoSection isEditable={isEditable} isSearchEnabled={isSearchEnabled} />
        <AddressSection isEditable={isEditable} />
        <DemographicsSection isEditable={isEditable} />
        <BloodGroupSection isEditable={isEditable} />
        <RemarksSection isEditable={isEditable} />
        <StatusSection isEditable={isEditable} />
        <FormSubmitSection isEditable={isEditable} />
        
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
