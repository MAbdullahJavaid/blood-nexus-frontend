
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface PatientInvoiceFormProps {
  isSearchEnabled?: boolean;
  isEditable?: boolean;
}

const PatientInvoiceForm = ({ isSearchEnabled = false, isEditable = false }: PatientInvoiceFormProps) => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  return (
    <div className="bg-white p-4 rounded-md">
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <Label htmlFor="invoiceNo" className="mb-1 block">Invoice No:</Label>
          <div className="flex items-center gap-2">
            <Input id="invoiceNo" className="h-9" disabled={!isEditable} />
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

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="patientId" className="mb-1 block">Patient ID:</Label>
          <Input id="patientId" className="h-9" disabled={!isEditable} />
        </div>
        <div>
          <Label htmlFor="name" className="mb-1 block">Patient Name:</Label>
          <Input id="name" className="h-9" disabled={!isEditable} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="hospital" className="mb-1 block">Hospital:</Label>
          <Input id="hospital" className="h-9" disabled={!isEditable} />
        </div>
        <div>
          <Label htmlFor="contact" className="mb-1 block">Contact No:</Label>
          <Input id="contact" className="h-9" disabled={!isEditable} />
        </div>
      </div>

      <div className="border rounded-md p-4 mb-4">
        <h3 className="font-semibold mb-3">Blood Components</h3>
        <div className="space-y-3">
          <div className="grid grid-cols-5 gap-4">
            <div className="col-span-2">
              <Label htmlFor="component" className="mb-1 block">Component</Label>
              <Select disabled={!isEditable}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="whole-blood">Whole Blood</SelectItem>
                  <SelectItem value="prbc">PRBC</SelectItem>
                  <SelectItem value="ffp">FFP</SelectItem>
                  <SelectItem value="platelets">Platelets</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="quantity" className="mb-1 block">Quantity</Label>
              <Input id="quantity" className="h-9" type="number" defaultValue="1" disabled={!isEditable} />
            </div>
            <div>
              <Label htmlFor="rate" className="mb-1 block">Rate</Label>
              <Input id="rate" className="h-9" type="number" disabled={!isEditable} />
            </div>
            <div>
              <Label htmlFor="amount" className="mb-1 block">Amount</Label>
              <Input id="amount" className="h-9" type="number" readOnly disabled={!isEditable} />
            </div>
          </div>
          
          <div className="h-32 border rounded-md overflow-auto p-2">
            {/* Table to display added items would go here */}
            <div className="text-center text-gray-500 pt-10">
              No items added yet
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="discount" className="mb-1 block">Discount:</Label>
          <Input id="discount" className="h-9" type="number" defaultValue="0" disabled={!isEditable} />
        </div>
        <div>
          <Label htmlFor="total" className="mb-1 block">Total Amount:</Label>
          <Input id="total" className="h-9" type="number" readOnly disabled={!isEditable} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-4">
        <div>
          <Label htmlFor="remarks" className="mb-1 block">Remarks:</Label>
          <Input id="remarks" className="h-9" disabled={!isEditable} />
        </div>
      </div>

      <Dialog open={isSearchModalOpen} onOpenChange={setIsSearchModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Search Invoice</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input placeholder="Enter invoice number or patient name" />
            <div className="h-64 border mt-4 overflow-y-auto">
              {/* Search results would go here */}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientInvoiceForm;
