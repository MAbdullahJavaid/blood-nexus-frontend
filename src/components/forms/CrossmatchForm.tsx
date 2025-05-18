
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface CrossmatchFormProps {
  isSearchEnabled?: boolean;
}

const CrossmatchForm = ({ isSearchEnabled = false }: CrossmatchFormProps) => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  return (
    <div className="bg-white p-4 rounded-md">
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <Label htmlFor="caseNo" className="mb-1 block">Case No:</Label>
          <div className="flex items-center gap-2">
            <Input id="caseNo" className="h-9" />
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
          <Input id="date" className="h-9" type="date" />
        </div>
        <div></div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="patientName" className="mb-1 block">Patient Name:</Label>
          <Input id="patientName" className="h-9" />
        </div>
        <div>
          <Label htmlFor="patientBloodGroup" className="mb-1 block">Patient Blood Group:</Label>
          <div className="flex gap-2">
            <Select>
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
            <Select>
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
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="bagNo" className="mb-1 block">Bag No:</Label>
          <Input id="bagNo" className="h-9" />
        </div>
        <div>
          <Label htmlFor="donorBloodGroup" className="mb-1 block">Donor Blood Group:</Label>
          <div className="flex gap-2">
            <Select>
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
            <Select>
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
      </div>

      <div className="grid grid-cols-2 gap-8 mb-4">
        <div>
          <h3 className="font-semibold mb-2">Major</h3>
          <div className="space-y-3">
            <RadioGroup defaultValue="compatible" className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="compatible" id="major-compatible" />
                <Label htmlFor="major-compatible">Compatible</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="incompatible" id="major-incompatible" />
                <Label htmlFor="major-incompatible">Incompatible</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Minor</h3>
          <div className="space-y-3">
            <RadioGroup defaultValue="compatible" className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="compatible" id="minor-compatible" />
                <Label htmlFor="minor-compatible">Compatible</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="incompatible" id="minor-incompatible" />
                <Label htmlFor="minor-incompatible">Incompatible</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-4">
        <div>
          <Label htmlFor="remarks" className="mb-1 block">Remarks:</Label>
          <Input id="remarks" className="h-9" />
        </div>
      </div>

      <Dialog open={isSearchModalOpen} onOpenChange={setIsSearchModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Search Crossmatch</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input placeholder="Enter case number" />
            <div className="h-64 border mt-4 overflow-y-auto">
              {/* Search results would go here */}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CrossmatchForm;
