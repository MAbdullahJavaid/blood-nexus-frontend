
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { SearchIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface BleedingFormProps {
  isSearchEnabled?: boolean;
  isEditable?: boolean;
}

const BleedingForm = ({ isSearchEnabled = false, isEditable = false }: BleedingFormProps) => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  return (
    <div className="bg-white p-4 rounded-md">
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <Label htmlFor="bagNo" className="mb-1 block">Bag No:</Label>
          <div className="flex items-center gap-2">
            <Input id="bagNo" className="h-9" disabled={!isEditable} />
            {isSearchEnabled && (
              <button 
                onClick={() => setIsSearchModalOpen(true)}
                className="bg-gray-200 p-1 rounded hover:bg-gray-300"
              >
                <SearchIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        <div>
          <Label htmlFor="date" className="mb-1 block">Date:</Label>
          <Input id="date" className="h-9" type="date" disabled={!isEditable} />
        </div>
        <div></div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <Label htmlFor="donorId" className="mb-1 block">Donor ID:</Label>
          <Input id="donorId" className="h-9" disabled={!isEditable} />
        </div>
        <div>
          <Label htmlFor="name" className="mb-1 block">Name:</Label>
          <Input id="name" className="h-9" disabled={!isEditable} />
        </div>
        <div>
          <Label htmlFor="age" className="mb-1 block">Age:</Label>
          <Input id="age" className="h-9" type="number" disabled={!isEditable} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="bloodGroup" className="mb-1 block">Blood Group:</Label>
          <div className="flex gap-2">
            <Select disabled={!isEditable}>
              <SelectTrigger className="h-9 flex-1">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A">A</SelectItem>
                <SelectItem value="B">B</SelectItem>
                <SelectItem value="O">O</SelectItem>
                <SelectItem value="AB">AB</SelectItem>
                <SelectItem value="--">--</SelectItem>
              </SelectContent>
            </Select>
            <Select disabled={!isEditable}>
              <SelectTrigger className="h-9 flex-1">
                <SelectValue placeholder="Rh" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="+ve">+ve</SelectItem>
                <SelectItem value="-ve">-ve</SelectItem>
                <SelectItem value="--">--</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label htmlFor="bagType" className="mb-1 block">Bag Type:</Label>
          <Select disabled={!isEditable}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single">Single</SelectItem>
              <SelectItem value="double">Double</SelectItem>
              <SelectItem value="triple">Triple</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="volume" className="mb-1 block">Volume:</Label>
          <div className="flex items-center">
            <Input id="volume" className="h-9 rounded-r-none" type="number" defaultValue="450" disabled={!isEditable} />
            <span className="bg-gray-100 h-9 px-2 flex items-center border-y border-r rounded-r-md text-sm border-input">
              ml
            </span>
          </div>
        </div>
        <div>
          <Label htmlFor="expiryDate" className="mb-1 block">Expiry Date:</Label>
          <Input id="expiryDate" className="h-9" type="date" disabled={!isEditable} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="hb" className="mb-1 block">Hb:</Label>
          <Input id="hb" className="h-9" type="text" disabled={!isEditable} />
        </div>
        <div>
          <Label htmlFor="weight" className="mb-1 block">Weight:</Label>
          <Input id="weight" className="h-9" type="number" disabled={!isEditable} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-4">
        <div>
          <Label htmlFor="remarks" className="mb-1 block">Remarks:</Label>
          <Input id="remarks" className="h-9" disabled={!isEditable} />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <div className="flex items-center gap-2">
          <Checkbox id="tested" disabled={!isEditable} />
          <Label htmlFor="tested" className="mb-0">Tested</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="issued" disabled={!isEditable} />
          <Label htmlFor="issued" className="mb-0">Issued</Label>
        </div>
      </div>

      <Dialog open={isSearchModalOpen} onOpenChange={setIsSearchModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Search Bleeding Record</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input placeholder="Enter bag number or donor ID" />
            <div className="h-64 border mt-4 overflow-y-auto">
              {/* Search results would go here */}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BleedingForm;
