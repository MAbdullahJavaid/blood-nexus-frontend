
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SearchIcon } from "lucide-react";
import { useDonorForm } from "./DonorFormContext";
import { useEffect } from "react";

interface PersonalInfoSectionProps {
  isEditable: boolean;
  isSearchEnabled: boolean;
  isDeleting?: boolean;
}

const PersonalInfoSection = ({ isEditable, isSearchEnabled, isDeleting = false }: PersonalInfoSectionProps) => {
  const { donorData, handleInputChange, setIsSearchModalOpen } = useDonorForm();
  
  // Auto-open search modal when edit or delete is selected
  useEffect(() => {
    if ((isSearchEnabled && !isEditable) || isDeleting) {
      setIsSearchModalOpen(true);
    }
  }, [isSearchEnabled, isEditable, isDeleting, setIsSearchModalOpen]);
  
  return (
    <div className="grid grid-cols-3 gap-4 mb-4">
      <div>
        <Label htmlFor="regNo" className="mb-1 block">Reg No</Label>
        <div className="flex items-center gap-2">
          <Input 
            id="regNo" 
            value={donorData.regNo}
            onChange={(e) => handleInputChange("regNo", e.target.value)}
            className="h-9" 
            maxLength={11} 
            disabled={!isEditable && !isDeleting}
          />
          {(isSearchEnabled || isDeleting) && (
            <button 
              type="button"
              onClick={() => setIsSearchModalOpen(true)}
              className="bg-gray-200 p-1 rounded hover:bg-gray-300"
            >
              <SearchIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      <div className="col-span-1">
        <Label htmlFor="name" className="mb-1 block">Name</Label>
        <Input 
          id="name" 
          value={donorData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          className="h-9" 
          disabled={!isEditable && !isDeleting}
        />
      </div>
      <div>
        <Label htmlFor="date" className="mb-1 block">Date</Label>
        <Input 
          id="date" 
          type="date" 
          value={donorData.date}
          onChange={(e) => handleInputChange("date", e.target.value)}
          className="h-9" 
          disabled={!isEditable && !isDeleting}
        />
      </div>
    </div>
  );
};

export default PersonalInfoSection;
