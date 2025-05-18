
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { SearchIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface DonorFormProps {
  isSearchEnabled?: boolean;
}

const DonorForm = ({ isSearchEnabled = false }: DonorFormProps) => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  return (
    <div className="bg-white p-4 rounded-md">
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <Label htmlFor="regNo" className="mb-1 block">Reg No</Label>
          <div className="flex items-center gap-2">
            <Input id="regNo" className="h-9" maxLength={11} />
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
        <div className="col-span-1">
          <Label htmlFor="name" className="mb-1 block">Name</Label>
          <Input id="name" className="h-9" />
        </div>
        <div>
          <Label htmlFor="date" className="mb-1 block">Date</Label>
          <Input id="date" className="h-9" type="date" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-4">
        <div>
          <Label htmlFor="address" className="mb-1 block">Address</Label>
          <Input id="address" className="h-9" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <Label htmlFor="age" className="mb-1 block">Age</Label>
          <Input id="age" className="h-9" type="number" />
        </div>
        <div>
          <Label htmlFor="sex" className="mb-1 block">Sex</Label>
          <Select>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div></div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-4">
        <div>
          <Label htmlFor="group" className="mb-1 block">Group</Label>
          <Select>
            <SelectTrigger className="h-9">
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
        </div>
        <div>
          <Label htmlFor="rh" className="mb-1 block">Rh</Label>
          <Select>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="+ve">+ve</SelectItem>
              <SelectItem value="-ve">-ve</SelectItem>
              <SelectItem value="--">--</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="phoneRes" className="mb-1 block">Phone Res</Label>
          <Input id="phoneRes" className="h-9" />
        </div>
        <div>
          <Label htmlFor="phoneOffice" className="mb-1 block">Phone Office</Label>
          <Input id="phoneOffice" className="h-9" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-4">
        <div>
          <Label htmlFor="remarks" className="mb-1 block">Remarks</Label>
          <Textarea id="remarks" className="min-h-[100px]" />
        </div>
      </div>

      <div className="flex justify-end">
        <div className="flex items-center gap-2">
          <Label htmlFor="status" className="mb-0">Status</Label>
          <Checkbox id="status" />
        </div>
      </div>

      <Dialog open={isSearchModalOpen} onOpenChange={setIsSearchModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Search Donor</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input placeholder="Enter registration number or name" />
            <div className="h-64 border mt-4 overflow-y-auto">
              {/* Search results would go here */}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DonorForm;
