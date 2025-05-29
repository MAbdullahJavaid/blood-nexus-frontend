
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SearchIcon } from "lucide-react";
import { useBleedingForm } from "./BleedingFormContext";
import { useState, useEffect } from "react";
import DonorSearchModal from "./DonorSearchModal";
import { toast } from "@/hooks/use-toast";

interface DonorInfoSectionProps {
  isEditable: boolean;
  isSearchEnabled: boolean;
  isDeleting?: boolean;
}

const DonorInfoSection = ({ isEditable, isSearchEnabled, isDeleting = false }: DonorInfoSectionProps) => {
  const { selectedDonor, handleDonorSelect } = useBleedingForm();
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Auto-open search modal when edit or delete is selected
  useEffect(() => {
    if ((isSearchEnabled && !isEditable) || isDeleting) {
      setIsSearchModalOpen(true);
    }
  }, [isSearchEnabled, isEditable, isDeleting]);

  const onDonorSelect = (donor: any) => {
    handleDonorSelect(donor);
    toast({
      title: "Donor Selected",
      description: `Selected donor: ${donor.name}`,
    });
  };

  return (
    <div className="grid grid-cols-3 gap-4 mb-4">
      <div>
        <Label htmlFor="donorId" className="mb-1 block">Donor No:</Label>
        <div className="flex items-center gap-2">
          <Input
            id="donorId"
            value={selectedDonor?.donor_id || ""}
            className="h-9 bg-gray-50"
            readOnly
            placeholder="Select donor via search"
          />
          <button 
            type="button"
            onClick={() => setIsSearchModalOpen(true)}
            className="bg-gray-200 p-1 rounded hover:bg-gray-300"
            disabled={!isEditable && !isSearchEnabled && !isDeleting}
          >
            <SearchIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div>
        <Label htmlFor="donorName" className="mb-1 block">Donor Name:</Label>
        <Input 
          id="donorName" 
          value={selectedDonor?.name || ""} 
          className="h-9 bg-gray-50" 
          readOnly 
        />
      </div>
      <div>
        <Label htmlFor="donorCategory" className="mb-1 block">Donor Category:</Label>
        <select 
          id="donorCategory" 
          className="h-9 bg-gray-50 w-full rounded-md border px-2"
          defaultValue="Self Donor"
        >
          <option value="Self Donor">Self Donor</option>
          <option value="Call Donor">Call Donor</option>
          <option value="EX/Patient">EX/Patient</option>
          <option value="EX/OPD">EX/OPD</option>
        </select>
      </div>

      {/* Donor Search Modal */}
      <DonorSearchModal 
        isOpen={isSearchModalOpen} 
        onClose={() => setIsSearchModalOpen(false)}
        onSelect={onDonorSelect}
      />
    </div>
  );
};

export default DonorInfoSection;
