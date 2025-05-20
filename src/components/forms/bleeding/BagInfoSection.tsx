
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchIcon } from "lucide-react";
import { useBleedingForm } from "./BleedingFormContext";
import { useState } from "react";
import BagSearchModal from "./BagSearchModal";

interface BagInfoSectionProps {
  isEditable: boolean;
  isSearchEnabled: boolean;
}

const BagInfoSection = ({ isEditable, isSearchEnabled }: BagInfoSectionProps) => {
  const { bagNo, setBagNo, bagType, setBagType, bleedingDate, setBleedingDate } = useBleedingForm();
  const [isBagSearchModalOpen, setIsBagSearchModalOpen] = useState(false);

  return (
    <div className="grid grid-cols-3 gap-4 mb-4">
      <div>
        <Label htmlFor="bagNo" className="mb-1 block">Bag No:</Label>
        <div className="flex items-center gap-2">
          <Input 
            id="bagNo"
            value={bagNo}
            onChange={(e) => setBagNo(e.target.value)}
            className="h-9 bg-gray-50"
            readOnly={!isEditable}
          />
          {isEditable && isSearchEnabled && (
            <button 
              type="button"
              onClick={() => setIsBagSearchModalOpen(true)}
              className="bg-gray-200 p-1 rounded hover:bg-gray-300"
            >
              <SearchIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      <div>
        <Label htmlFor="date" className="mb-1 block">Date:</Label>
        <Input 
          id="date"
          className="h-9 bg-gray-50"
          type="text"
          value={bleedingDate}
          onChange={(e) => setBleedingDate(e.target.value)}
          readOnly={!isEditable}
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
        onSelect={(bagId) => setBagNo(bagId)}
      />
    </div>
  );
};

export default BagInfoSection;
