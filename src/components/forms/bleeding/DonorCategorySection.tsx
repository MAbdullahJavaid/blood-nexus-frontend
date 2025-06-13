
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBleedingForm } from "./BleedingFormContext";

const DonorCategorySection = () => {
  const { donorCategory, setDonorCategory } = useBleedingForm();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Donor Category</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="donor-category">Donor Category</Label>
          <Select value={donorCategory} onValueChange={setDonorCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select donor category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="voluntary">Voluntary</SelectItem>
              <SelectItem value="replacement">Replacement</SelectItem>
              <SelectItem value="autologous">Autologous</SelectItem>
              <SelectItem value="directed">Directed</SelectItem>
              <SelectItem value="apheresis">Apheresis</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default DonorCategorySection;
