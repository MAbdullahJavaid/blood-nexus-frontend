
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface PatientFormProps {
  isSearchEnabled?: boolean;
  isEditable?: boolean;
}

const PatientForm = ({ isSearchEnabled = false, isEditable = false }: PatientFormProps) => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [prefix, setPrefix] = useState("T");
  const [postfix, setPostfix] = useState("000");
  const [bottleUnit, setBottleUnit] = useState("ml");

  return (
    <div className="bg-white p-4 rounded-md">
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <Label htmlFor="regNo" className="mb-1 block">Reg No:</Label>
          <div className="flex items-center gap-2">
            <div className="flex">
              <Select value={prefix} onValueChange={setPrefix} disabled={!isEditable}>
                <SelectTrigger className="w-16 h-9 rounded-r-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="T">T</SelectItem>
                  <SelectItem value="H">H</SelectItem>
                  <SelectItem value="S">S</SelectItem>
                </SelectContent>
              </Select>
              <Input id="regNo" value={postfix} className="h-9 w-24 rounded-l-none" readOnly />
            </div>
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
        <div></div>
        <div>
          <Label htmlFor="date" className="mb-1 block">Date:</Label>
          <Input id="date" className="h-9" type="date" disabled={!isEditable} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <Label htmlFor="name" className="mb-1 block">Name:</Label>
          <Input id="name" className="h-9" disabled={!isEditable} />
        </div>
        <div>
          <Label htmlFor="fName" className="mb-1 block">F.Name:</Label>
          <Input id="fName" className="h-9" disabled={!isEditable} />
        </div>
        <div>
          <Label htmlFor="gender" className="mb-1 block">Gender:</Label>
          <Select disabled={!isEditable}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-4">
        <div>
          <Label htmlFor="address" className="mb-1 block">Address:</Label>
          <Input id="address" className="h-9" disabled={!isEditable} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <Label htmlFor="diagnosis" className="mb-1 block">Diagnosis:</Label>
          <Input id="diagnosis" className="h-9" disabled={!isEditable} />
        </div>
        <div>
          <Label htmlFor="amount" className="mb-1 block">Amount:</Label>
          <Input id="amount" className="h-9" type="number" disabled={!isEditable} />
        </div>
        <div></div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <Label htmlFor="phone" className="mb-1 block">Phone:</Label>
          <Input id="phone" className="h-9" disabled={!isEditable} />
        </div>
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
          <Label htmlFor="bgCategory" className="mb-1 block">BG Category:</Label>
          <Select disabled={!isEditable}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="WB">WB</SelectItem>
              <SelectItem value="FWB">FWB</SelectItem>
              <SelectItem value="PLT">PLT</SelectItem>
              <SelectItem value="PC">PC</SelectItem>
              <SelectItem value="CP">CP</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <Label htmlFor="weight" className="mb-1 block">Weight:</Label>
          <Input id="weight" className="h-9" type="number" defaultValue="0.00" disabled={!isEditable} />
        </div>
        <div>
          <Label htmlFor="hospital" className="mb-1 block">Hospital Name:</Label>
          <Input id="hospital" className="h-9" disabled={!isEditable} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="bottle" className="mb-1 block">Bottle:</Label>
            <div className="flex items-center">
              <Input id="bottle" className="h-9 rounded-r-none" type="number" defaultValue="0" disabled={!isEditable} />
              <Select value={bottleUnit} onValueChange={setBottleUnit} disabled={!isEditable}>
                <SelectTrigger className="h-9 w-16 rounded-l-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ml">ml</SelectItem>
                  <SelectItem value="bag">bag</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="required" className="mb-1 block">Required:</Label>
            <Input id="required" className="h-9" disabled={!isEditable} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="dob" className="mb-1 block">Date Of Birth:</Label>
          <Input id="dob" className="h-9" type="date" disabled={!isEditable} />
        </div>
        <div>
          <Label htmlFor="expDate" className="mb-1 block">Exp Date:</Label>
          <Input id="expDate" className="h-9" type="date" disabled={!isEditable} />
        </div>
      </div>

      <Dialog open={isSearchModalOpen} onOpenChange={setIsSearchModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Search Patient</DialogTitle>
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

export default PatientForm;
