
import React from "react";
import { Label } from "@/components/ui/label";
import { ValidatedInput } from "@/components/ui/validated-input";
import { SearchIcon } from "lucide-react";
import { useDonorForm } from "./DonorFormContext";

interface PersonalInfoSectionProps {
  isEditable: boolean;
  isSearchEnabled: boolean;
  isDeleting: boolean;
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  isEditable,
  isSearchEnabled,
  isDeleting,
}) => {
  const { 
    donorData, 
    handleInputChange, 
    setIsSearchModalOpen, 
    validationErrors 
  } = useDonorForm();

  return (
    <div className="grid grid-cols-3 gap-4 mb-4">
      <div>
        <Label htmlFor="regNo" className="mb-1 block">
          Reg No:
        </Label>
        <div className="flex items-center gap-2">
          <ValidatedInput
            id="regNo"
            validationType="regNo"
            value={donorData.regNo}
            onChange={(value, isValid) => handleInputChange("regNo", value)}
            disabled={!isEditable}
            className="h-9"
            errorMessage={validationErrors.regNo}
          />
          {isSearchEnabled && (
            <button
              onClick={() => setIsSearchModalOpen(true)}
              className="bg-gray-200 p-1 rounded hover:bg-gray-300"
              type="button"
            >
              <SearchIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      
      <div>
        <Label htmlFor="name" className="mb-1 block">
          Name:
        </Label>
        <ValidatedInput
          id="name"
          validationType="name"
          value={donorData.name}
          onChange={(value, isValid) => handleInputChange("name", value)}
          disabled={!isEditable}
          className="h-9"
          errorMessage={validationErrors.name}
        />
      </div>
      
      <div>
        <Label htmlFor="date" className="mb-1 block">
          Date:
        </Label>
        <ValidatedInput
          id="date"
          type="date"
          value={donorData.date}
          onChange={(value, isValid) => handleInputChange("date", value)}
          disabled={!isEditable}
          className="h-9"
        />
      </div>
    </div>
  );
};
