import { useState, forwardRef, useImperativeHandle } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface PatientFormProps {
  isSearchEnabled?: boolean;
  isEditable?: boolean;
}

// Mock patient data for searching
const mockPatients = [
  { id: "T0001", name: "John Smith", fName: "William Smith", gender: "male", bloodGroup: "A", rh: "+ve" },
  { id: "T0002", name: "Sarah Johnson", fName: "Robert Johnson", gender: "female", bloodGroup: "B", rh: "-ve" },
  { id: "T0003", name: "Michael Brown", fName: "Richard Brown", gender: "male", bloodGroup: "O", rh: "+ve" },
  { id: "T0004", name: "Emily Davis", fName: "Thomas Davis", gender: "female", bloodGroup: "AB", rh: "+ve" },
];

// Mock test data
const mockTests = [
  { id: 1, name: "Complete Blood Count", rate: 1200 },
  { id: 2, name: "Blood Glucose Test", rate: 600 },
  { id: 3, name: "Liver Function Test", rate: 1800 },
  { id: 4, name: "Kidney Function Test", rate: 2000 },
  { id: 5, name: "Lipid Profile", rate: 1500 },
];

interface TestItem {
  id: number;
  name: string;
  rate: number;
  quantity: number;
}

// Define the ref interface
export interface PatientFormRef {
  handleAddItem: () => void;
  handleDeleteItem: () => void;
}

const PatientForm = forwardRef<PatientFormRef, PatientFormProps>(
  ({ isSearchEnabled = false, isEditable = false }, ref) => {
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [isTestSearchModalOpen, setIsTestSearchModalOpen] = useState(false);
    const [prefix, setPrefix] = useState("T");
    const [postfix, setPostfix] = useState("000");
    const [bottleUnit, setBottleUnit] = useState("ml");
    
    // State for managing the selected patient
    const [selectedPatient, setSelectedPatient] = useState<any>(null);
    
    // State for tests being added to the patient form
    const [testItems, setTestItems] = useState<TestItem[]>([]);
    const [editingTestIndex, setEditingTestIndex] = useState<number | null>(null);
    
    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      handleAddItem: () => {
        const newItems = [...testItems, { id: 0, name: "", rate: 0, quantity: 1 }];
        setTestItems(newItems);
        setEditingTestIndex(newItems.length - 1);
      },
      handleDeleteItem: () => {
        if (testItems.length > 0) {
          setTestItems(testItems.filter((_, index) => index !== (editingTestIndex ?? testItems.length - 1)));
          setEditingTestIndex(null);
        }
      }
    }));
    
    const handlePatientSelect = (patientId: string) => {
      const patient = mockPatients.find(p => p.id === patientId);
      setSelectedPatient(patient);
      if (patient) {
        const [prefixPart, postfixPart] = patient.id.match(/([A-Z]+)(\d+)/) || ["", prefix, postfix];
        setPrefix(prefixPart);
        setPostfix(postfixPart);
      }
      setIsSearchModalOpen(false);
    };
    
    const handleTestSelect = (testId: number) => {
      const test = mockTests.find(t => t.id === testId);
      if (test && editingTestIndex !== null) {
        const updatedItems = [...testItems];
        updatedItems[editingTestIndex] = {
          id: test.id,
          name: test.name,
          rate: test.rate,
          quantity: 1
        };
        setTestItems(updatedItems);
        setEditingTestIndex(null);
      }
      setIsTestSearchModalOpen(false);
    };
    
    const handleQuantityChange = (index: number, quantity: number) => {
      const updatedItems = [...testItems];
      updatedItems[index].quantity = quantity;
      setTestItems(updatedItems);
    };
    
    // Calculate total
    const totalAmount = testItems.reduce((sum, item) => sum + item.rate * item.quantity, 0);
    
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
            <Input 
              id="name" 
              className="h-9" 
              disabled={!isEditable}
              value={selectedPatient?.name || ""}
              onChange={(e) => setSelectedPatient(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="fName" className="mb-1 block">F.Name:</Label>
            <Input 
              id="fName" 
              className="h-9" 
              disabled={!isEditable}
              value={selectedPatient?.fName || ""}
              onChange={(e) => setSelectedPatient(prev => ({ ...prev, fName: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="gender" className="mb-1 block">Gender:</Label>
            <Select 
              disabled={!isEditable}
              value={selectedPatient?.gender || ""}
              onValueChange={(value) => setSelectedPatient(prev => ({ ...prev, gender: value }))}
            >
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
            <Input id="amount" className="h-9" type="number" value={totalAmount} readOnly disabled={!isEditable} />
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
              <Select 
                disabled={!isEditable}
                value={selectedPatient?.bloodGroup || ""}
                onValueChange={(value) => setSelectedPatient(prev => ({ ...prev, bloodGroup: value }))}
              >
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
              <Select 
                disabled={!isEditable}
                value={selectedPatient?.rh || ""}
                onValueChange={(value) => setSelectedPatient(prev => ({ ...prev, rh: value }))}
              >
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

        {/* Test Items Table */}
        <div className="mt-6 mb-4">
          <h3 className="text-lg font-medium">Tests</h3>
          <Table className="mt-2 border">
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/6">Test ID</TableHead>
                <TableHead className="w-3/6">Test Name</TableHead>
                <TableHead className="w-1/6">Rate</TableHead>
                <TableHead className="w-1/6">Quantity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {testItems.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Input 
                        value={item.id || ""} 
                        className="h-8 bg-gray-50" 
                        readOnly 
                      />
                      {index === editingTestIndex && (
                        <button
                          onClick={() => setIsTestSearchModalOpen(true)}
                          className="bg-gray-200 p-1 rounded hover:bg-gray-300"
                        >
                          <SearchIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Input 
                      value={item.name} 
                      className="h-8" 
                      readOnly 
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      value={item.rate} 
                      className="h-8" 
                      readOnly 
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      value={item.quantity} 
                      type="number" 
                      min="1"
                      className="h-8" 
                      onChange={(e) => handleQuantityChange(index, parseInt(e.target.value) || 1)}
                      disabled={!isEditable} 
                    />
                  </TableCell>
                </TableRow>
              ))}
              {isEditable && testItems.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                    No tests added. Click "Add Item" to add tests.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Patient Search Modal */}
        <Dialog open={isSearchModalOpen} onOpenChange={setIsSearchModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Search Patient</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Input placeholder="Enter registration number or name" />
              <div className="h-64 border mt-4 overflow-y-auto">
                {mockPatients.map(patient => (
                  <div 
                    key={patient.id} 
                    className="p-2 border-b hover:bg-gray-100 cursor-pointer"
                    onClick={() => handlePatientSelect(patient.id)}
                  >
                    <div className="font-medium">{patient.name}</div>
                    <div className="text-sm text-gray-600">ID: {patient.id}, Blood Group: {patient.bloodGroup} {patient.rh}</div>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Test Search Modal */}
        <Dialog open={isTestSearchModalOpen} onOpenChange={setIsTestSearchModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Search Test</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Input placeholder="Enter test name" />
              <div className="h-64 border mt-4 overflow-y-auto">
                {mockTests.map(test => (
                  <div 
                    key={test.id} 
                    className="p-2 border-b hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleTestSelect(test.id)}
                  >
                    <div className="font-medium">{test.name}</div>
                    <div className="text-sm text-gray-600">Rate: ${test.rate}</div>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
);

PatientForm.displayName = "PatientForm";

export default PatientForm;
