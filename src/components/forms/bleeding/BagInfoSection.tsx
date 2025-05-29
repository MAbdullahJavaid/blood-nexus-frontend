
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchIcon } from "lucide-react";
import { useBleedingForm } from "./BleedingFormContext";
import { useState, useEffect } from "react";
import BagSearchModal from "./BagSearchModal";

interface BagInfoSectionProps {
  isEditable: boolean;
  isSearchEnabled: boolean;
  isDeleting?: boolean;
}

const BagInfoSection = ({ isEditable, isSearchEnabled, isDeleting = false }: BagInfoSectionProps) => {
  const { 
    bagNo, 
    setBagNo, 
    bagType, 
    setBagType, 
    bleedingDate, 
    setBleedingDate,
    selectedDonor,
    loadBleedingRecord
  } = useBleedingForm();
  const [isBagSearchModalOpen, setIsBagSearchModalOpen] = useState(false);

  // Show the actual bag number if it's been generated, otherwise show placeholder
  const displayBagNo = bagNo === "Auto-generated on save" ? "" : bagNo;
  const placeholderText = bagNo === "Auto-generated on save" ? "Auto-generated on save" : "";

  // For edit/delete mode, bag selection is mandatory
  const shouldShowBagSearch = (isSearchEnabled && !isEditable) || isDeleting;

  const handleBagSelect = async (bagId: string) => {
    setBagNo(bagId);
    await loadBleedingRecord(bagId);
    setIsBagSearchModalOpen(false);
  };

  return (
    <div className="grid grid-cols-3 gap-4 mb-4">
      <div>
        <Label htmlFor="bagNo" className="mb-1 block">
          Bag No: {shouldShowBagSearch && <span className="text-red-500">*</span>}
        </Label>
        <div className="flex items-center gap-2">
          <Input 
            id="bagNo"
            value={displayBagNo}
            className="h-9 bg-green-100 text-gray-800 font-medium"
            readOnly={true}
            placeholder={placeholderText}
          />
          {(isEditable && isSearchEnabled) || shouldShowBagSearch ? (
            <button 
              type="button"
              onClick={() => setIsBagSearchModalOpen(true)}
              className="bg-gray-200 p-1 rounded hover:bg-gray-300"
              title="Search bags"
            >
              <SearchIcon className="h-4 w-4" />
            </button>
          ) : null}
        </div>
        {shouldShowBagSearch && !bagNo && (
          <p className="text-red-500 text-xs mt-1">Bag selection is mandatory for edit/delete</p>
        )}
      </div>
      <div>
        <Label htmlFor="date" className="mb-1 block">Date:</Label>
        <Input 
          id="date"
          className="h-9 bg-green-100"
          type="text"
          value={bleedingDate}
          onChange={(e) => setBleedingDate(e.target.value)}
          readOnly={true}
        />
      </div>
      <div>
        <Label htmlFor="bagType" className="mb-1 block">Bag Type:</Label>
        <Select
          value={bagType}
          onValueChange={setBagType}
          disabled={!isEditable}
        >
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="single">Single Bag</SelectItem>
            <SelectItem value="double">Double Bag</SelectItem>
            <SelectItem value="triple">Triple Bag</SelectItem>
            <SelectItem value="nonbled">Non Bled</SelectItem>
            <SelectItem value="megaunit">Mega Unit</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bag Search Modal */}
      <BagSearchModal 
        isOpen={isBagSearchModalOpen} 
        onClose={() => setIsBagSearchModalOpen(false)}
        onSelect={handleBagSelect}
      />
    </div>
  );
};

export default BagInfoSection;
