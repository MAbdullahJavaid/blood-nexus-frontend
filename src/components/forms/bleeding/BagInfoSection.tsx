
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { useBleedingForm } from "./BleedingFormContext";
import BagSearchModal from "./BagSearchModal";

interface BagInfoSectionProps {
  isEditable: boolean;
  isSearchEnabled: boolean;
  isDeleting?: boolean;
}

const BagInfoSection = ({ isEditable, isSearchEnabled, isDeleting = false }: BagInfoSectionProps) => {
  const { bagNo, setBagNo, bagType, setBagType, loadBleedingRecord } = useBleedingForm();
  const [isBagSearchOpen, setIsBagSearchOpen] = React.useState(false);

  const handleBagSelect = async (selectedBagId: string) => {
    setBagNo(selectedBagId);
    await loadBleedingRecord(selectedBagId);
    setIsBagSearchOpen(false);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Bag Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="bag-no">Bag No.</Label>
          <div className="flex space-x-2">
            <Input
              id="bag-no"
              type="text"
              value={bagNo}
              onChange={(e) => setBagNo(e.target.value)}
              readOnly={!isEditable || bagNo === "Auto-generated on save"}
              className={bagNo === "Auto-generated on save" ? "bg-gray-100" : ""}
            />
            {isSearchEnabled && (isEditable || isDeleting) && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setIsBagSearchOpen(true)}
              >
                <Search className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bag-type">Bag Type</Label>
          <Select value={bagType} onValueChange={setBagType} disabled={!isEditable}>
            <SelectTrigger>
              <SelectValue placeholder="Select bag type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single">Single</SelectItem>
              <SelectItem value="double">Double</SelectItem>
              <SelectItem value="triple">Triple</SelectItem>
              <SelectItem value="quadruple">Quadruple</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <BagSearchModal
        isOpen={isBagSearchOpen}
        onClose={() => setIsBagSearchOpen(false)}
        onSelect={handleBagSelect}
      />
    </div>
  );
};

export default BagInfoSection;
