
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface PatientInvoiceFormProps {
  isSearchEnabled?: boolean;
  isEditable?: boolean;
}

interface InvoiceItem {
  id: string;
  testId: string;
  testName: string;
  qty: number;
  rate: number;
  amount: number;
}

const PatientInvoiceForm = ({ isSearchEnabled = false, isEditable = false }: PatientInvoiceFormProps) => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [patientType, setPatientType] = useState<string>("regular");
  const [documentNo, setDocumentNo] = useState<string>("");
  const [bloodCategory, setBloodCategory] = useState<string>("FWB");
  const [bottleUnitType, setBottleUnitType] = useState<string>("bag");
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [discount, setDiscount] = useState<number>(0);
  const [receivedAmount, setReceivedAmount] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);

  // Generate document number on component mount
  useEffect(() => {
    if (isEditable) {
      generateDocumentNo();
    }
  }, [isEditable]);

  const generateDocumentNo = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    // In a real application, you would fetch the latest sequence from backend
    const sequence = "0001"; // This would be dynamic based on existing invoices
    
    setDocumentNo(`${year}${month}${sequence}`);
  };

  const handlePatientTypeChange = (value: string) => {
    setPatientType(value);
    // Reset patient data if type changes
  };

  const handleAddItem = () => {
    // In a real application, this would open a dialog to select a test
    // For this example, we'll just add a dummy item
    const newItem: InvoiceItem = {
      id: `item-${items.length + 1}`,
      testId: `T${items.length + 1}`,
      testName: `Test Item ${items.length + 1}`,
      qty: 1,
      rate: 100,
      amount: 100
    };
    
    setItems([...items, newItem]);
    calculateTotal([...items, newItem]);
  };

  const handleDeleteItem = () => {
    if (selectedItemIndex !== null) {
      const newItems = [...items];
      newItems.splice(selectedItemIndex, 1);
      setItems(newItems);
      setSelectedItemIndex(null);
      calculateTotal(newItems);
    }
  };

  const calculateTotal = (itemsArray: InvoiceItem[]) => {
    const sum = itemsArray.reduce((acc, item) => acc + item.amount, 0);
    setTotalAmount(sum - discount);
  };

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setDiscount(value);
    setTotalAmount(items.reduce((acc, item) => acc + item.amount, 0) - value);
  };

  const handleReceivedAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setReceivedAmount(value);
  };

  const handleSelectRow = (index: number) => {
    setSelectedItemIndex(index);
  };

  return (
    <div className="bg-white p-4 rounded-md">
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <Label htmlFor="type" className="mb-1 block">Type:</Label>
          <Select 
            value={patientType} 
            onValueChange={handlePatientTypeChange}
            disabled={!isEditable}
          >
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="regular">Regular</SelectItem>
              <SelectItem value="opd">OPD</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="patientId" className="mb-1 block">Patient ID:</Label>
          <div className="flex items-center gap-2">
            <Input 
              id="patientId" 
              className="h-9" 
              maxLength={patientType === "opd" ? 11 : undefined} 
              disabled={!isEditable} 
            />
            {isSearchEnabled && patientType === "regular" && (
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
          <Label htmlFor="documentNo" className="mb-1 block">Document No:</Label>
          <Input id="documentNo" className="h-9" value={documentNo} disabled={true} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="name" className="mb-1 block">Patient Name:</Label>
          <Input id="name" className="h-9" disabled={!isEditable} />
        </div>
        <div>
          <Label htmlFor="documentDate" className="mb-1 block">Document Date:</Label>
          <Input id="documentDate" className="h-9" type="date" defaultValue={new Date().toISOString().split('T')[0]} disabled={!isEditable} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <Label htmlFor="hospital" className="mb-1 block">Hospital Name:</Label>
          <Input id="hospital" className="h-9" disabled={!isEditable} />
        </div>
        <div>
          <Label htmlFor="gender" className="mb-1 block">Gender:</Label>
          <Select defaultValue="male" disabled={!isEditable}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="exDonor" className="mb-1 block">EX / Donor:</Label>
          <Input id="exDonor" className="h-9" disabled={!isEditable} />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-4">
        <div>
          <Label htmlFor="phoneNo" className="mb-1 block">Phone No:</Label>
          <Input id="phoneNo" className="h-9" disabled={!isEditable} />
        </div>
        <div>
          <Label htmlFor="age" className="mb-1 block">Age:</Label>
          <Input id="age" className="h-9" type="number" disabled={!isEditable} />
        </div>
        <div>
          <Label htmlFor="dob" className="mb-1 block">DOB:</Label>
          <Input id="dob" className="h-9" type="date" disabled={!isEditable} />
        </div>
        <div>
          <Label htmlFor="references" className="mb-1 block">References:</Label>
          <Input id="references" className="h-9" disabled={!isEditable} />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-4">
        <div>
          <Label htmlFor="bloodGroup" className="mb-1 block">Blood Group:</Label>
          <Select defaultValue="A" disabled={!isEditable}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A">A</SelectItem>
              <SelectItem value="B">B</SelectItem>
              <SelectItem value="AB">AB</SelectItem>
              <SelectItem value="O">O</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="rh" className="mb-1 block">RH:</Label>
          <Select defaultValue="+ve" disabled={!isEditable}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="+ve">+ve</SelectItem>
              <SelectItem value="-ve">-ve</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="bloodCategory" className="mb-1 block">Blood Category:</Label>
          <Select value={bloodCategory} onValueChange={setBloodCategory} disabled={!isEditable}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="FWB">FWB</SelectItem>
              <SelectItem value="PC">PC</SelectItem>
              <SelectItem value="FFP">FFP</SelectItem>
              <SelectItem value="CP">CP</SelectItem>
              <SelectItem value="WB">WB</SelectItem>
              <SelectItem value="Mega Unit">Mega Unit</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="bottleRequired" className="mb-1 block">Bottle Required:</Label>
          <div className="flex items-center gap-2">
            <Input id="bottleRequired" className="h-9" type="number" defaultValue="1" disabled={!isEditable} />
            <Select value={bottleUnitType} onValueChange={setBottleUnitType} disabled={!isEditable}>
              <SelectTrigger className="h-9 w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bag">bag</SelectItem>
                <SelectItem value="ml">ml</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="border rounded-md p-4 mb-4">
        <h3 className="font-semibold mb-3">Tests</h3>
        <div className="mb-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Test ID</TableHead>
                <TableHead>Test Name</TableHead>
                <TableHead className="w-[80px]">Qty</TableHead>
                <TableHead className="w-[100px]">Test Rate</TableHead>
                <TableHead className="w-[100px]">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length > 0 ? (
                items.map((item, index) => (
                  <TableRow 
                    key={item.id}
                    className={selectedItemIndex === index ? "bg-muted" : ""}
                    onClick={() => handleSelectRow(index)}
                  >
                    <TableCell>{item.testId}</TableCell>
                    <TableCell>{item.testName}</TableCell>
                    <TableCell>{item.qty}</TableCell>
                    <TableCell>{item.rate.toFixed(2)}</TableCell>
                    <TableCell>{item.amount.toFixed(2)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500 h-24">
                    No items added yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div></div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label htmlFor="discount" className="mb-0">Discount Amount:</Label>
            <Input 
              id="discount" 
              className="h-9 w-32 text-right" 
              type="number" 
              value={discount} 
              onChange={handleDiscountChange}
              disabled={!isEditable} 
            />
          </div>
          <div className="flex justify-between items-center">
            <Label htmlFor="total" className="mb-0">Total Amount:</Label>
            <Input 
              id="total" 
              className="h-9 w-32 text-right" 
              type="number" 
              value={totalAmount} 
              readOnly 
              disabled={!isEditable} 
            />
          </div>
          <div className="flex justify-between items-center">
            <Label htmlFor="received" className="mb-0">Amount Received:</Label>
            <Input 
              id="received" 
              className="h-9 w-32 text-right" 
              type="number" 
              value={receivedAmount} 
              onChange={handleReceivedAmountChange}
              disabled={!isEditable} 
            />
          </div>
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
            <DialogTitle>Search Patient</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input placeholder="Enter patient ID or name" />
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
