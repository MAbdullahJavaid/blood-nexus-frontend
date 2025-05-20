
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { SearchIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface BleedingFormProps {
  isSearchEnabled?: boolean;
  isEditable?: boolean;
}

// Mock donor data for demonstration
const mockDonors = [
  { id: "D00001", name: "John Doe", group: "A", rh: "+ve", address: "123 Main St, City" },
  { id: "D00002", name: "Jane Smith", group: "B", rh: "-ve", address: "456 Oak St, Town" },
  { id: "D00003", name: "Robert Brown", group: "O", rh: "+ve", address: "789 Pine St, Village" },
  { id: "D00004", name: "Emily Johnson", group: "AB", rh: "-ve", address: "101 Maple Ave, County" },
];

// Generate a random bag number
const generateBagNumber = () => {
  const prefix = "B";
  const randomDigits = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}${randomDigits}`;
};

// Generate random screening value between 0.01 and 0.44
const generateRandomScreeningValue = () => {
  return (Math.random() * 0.43 + 0.01).toFixed(2);
};

// Generate random HB value between 13.5 and 15.9
const generateRandomHBValue = () => {
  return (Math.random() * 2.4 + 13.5).toFixed(1);
};

const BleedingForm = ({ isSearchEnabled = false, isEditable = false }: BleedingFormProps) => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isBagSearchModalOpen, setIsBagSearchModalOpen] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState<any>(null);
  const [bagNo, setBagNo] = useState(generateBagNumber());
  const [bagType, setBagType] = useState("double");

  // Initialize with random values
  const [donorPatientValues, setDonorPatientValues] = useState({
    hepB: generateRandomScreeningValue(),
    hepC: generateRandomScreeningValue(),
    hiv: generateRandomScreeningValue(),
    vdrl: generateRandomScreeningValue(),
    hb: generateRandomHBValue(),
  });

  const [results, setResults] = useState({
    hepB: "",
    hepC: "",
    hiv: "",
    vdrl: "",
  });

  // Calculate results based on donor/patient values
  useEffect(() => {
    const calculateResult = (value: string) => {
      const numValue = parseFloat(value);
      if (isNaN(numValue)) return "";
      if (numValue >= 1.0) return "Positive";
      if (numValue >= 0.5) return "Border Line Positive";
      return "Negative";
    };

    setResults({
      hepB: calculateResult(donorPatientValues.hepB),
      hepC: calculateResult(donorPatientValues.hepC),
      hiv: calculateResult(donorPatientValues.hiv),
      vdrl: calculateResult(donorPatientValues.vdrl),
    });
  }, [donorPatientValues]);

  const [productInfo, setProductInfo] = useState({
    WB: false,
    PC: true,
    FFP: true,
    PLT: false,
    CP: false,
    CS: false,
  });

  // Get current date in DD/MM/YYYY format
  const today = new Date();
  const formattedDate = `${today.getDate().toString().padStart(2, '0')}/${
    (today.getMonth() + 1).toString().padStart(2, '0')}/${
    today.getFullYear()}`;

  // Handle donor selection
  const handleDonorSelect = (donorId: string) => {
    const donor = mockDonors.find(d => d.id === donorId);
    setSelectedDonor(donor);
    setIsSearchModalOpen(false);
  };

  const handleDonorPatientValueChange = (test: keyof typeof donorPatientValues, value: string) => {
    setDonorPatientValues(prev => ({
      ...prev,
      [test]: value
    }));
  };

  return (
    <div className="bg-white p-4 rounded-md">
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <Label htmlFor="donorId" className="mb-1 block">Donor No:</Label>
          <div className="flex items-center gap-2">
            <Input
              id="donorId"
              value={selectedDonor?.id || ""}
              className="h-9 bg-gray-50"
              readOnly
              placeholder="Select donor via search"
            />
            <button 
              onClick={() => setIsSearchModalOpen(true)}
              className="bg-gray-200 p-1 rounded hover:bg-gray-300"
              disabled={!isEditable && !isSearchEnabled}
            >
              <SearchIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div>
          <Label htmlFor="donorName" className="mb-1 block">Donor Name:</Label>
          <Input 
            id="donorName" 
            value={selectedDonor?.name || ""} 
            className="h-9 bg-gray-50" 
            readOnly 
          />
        </div>
        <div>
          <Label htmlFor="donorCategory" className="mb-1 block">Donor Category:</Label>
          <Select disabled={!isEditable} defaultValue="self">
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="self">Self Donor</SelectItem>
              <SelectItem value="call">Call Donor</SelectItem>
              <SelectItem value="exopd">Ex/OPD</SelectItem>
              <SelectItem value="expatient">EX/Patient</SelectItem>
              <SelectItem value="bloodcamp">Blood Camp</SelectItem>
              <SelectItem value="othercenter">Other Center</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <Label htmlFor="bagNo" className="mb-1 block">Bag No:</Label>
          <div className="flex items-center gap-2">
            <Input 
              id="bagNo"
              value={bagNo}
              className="h-9 bg-gray-50"
              readOnly
            />
            {isEditable && isSearchEnabled && (
              <button 
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
            value={formattedDate}
            readOnly
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
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="group" className="mb-1 block">Group:</Label>
          <Input 
            id="group" 
            value={selectedDonor?.group || ""}
            className="h-9 bg-gray-50"
            readOnly
          />
        </div>
        <div>
          <Label htmlFor="rh" className="mb-1 block">Rh:</Label>
          <Input 
            id="rh" 
            value={selectedDonor?.rh || ""}
            className="h-9 bg-gray-50"
            readOnly
          />
        </div>
      </div>

      <div className="mb-4">
        <Label htmlFor="address" className="mb-1 block">Address:</Label>
        <Input 
          id="address" 
          value={selectedDonor?.address || ""}
          className="h-9 bg-gray-50"
          readOnly
        />
      </div>

      <div className="mt-6 mb-2">
        <h3 className="text-lg font-medium text-red-600">Screening Results</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* HBsAg (Hepatitis B) */}
        <div className="border p-3 rounded-md">
          <div className="text-red-600 font-medium mb-2">HBsAg (Hepatitis B)</div>
          <div className="grid grid-cols-2 gap-2">
            <Label htmlFor="hepBValue" className="mb-1 block">Donor/Patient Value:</Label>
            <Input 
              id="hepBValue" 
              className="h-8"
              value={donorPatientValues.hepB}
              onChange={(e) => handleDonorPatientValueChange("hepB", e.target.value)}
              disabled={!isEditable} 
            />
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <Label className="mb-1 block">Cut Off Value:</Label>
            <Input value="1.00" className="h-8 bg-gray-50" readOnly />
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <Label className="mb-1 block">Result:</Label>
            <Input 
              value={results.hepB} 
              className={cn(
                "h-8 bg-gray-50",
                results.hepB === "Positive" ? "text-red-600 font-medium" : 
                results.hepB === "Border Line Positive" ? "text-orange-500 font-medium" : 
                "text-green-600 font-medium"
              )}
              readOnly 
            />
          </div>
        </div>

        {/* Anti - HCV (Hepatitis C) */}
        <div className="border p-3 rounded-md">
          <div className="text-red-600 font-medium mb-2">Anti - HCV (Hepatitis C)</div>
          <div className="grid grid-cols-2 gap-2">
            <Label htmlFor="hepCValue" className="mb-1 block">Donor/Patient Value:</Label>
            <Input 
              id="hepCValue" 
              className="h-8"
              value={donorPatientValues.hepC}
              onChange={(e) => handleDonorPatientValueChange("hepC", e.target.value)}
              disabled={!isEditable} 
            />
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <Label className="mb-1 block">Cut Off Value:</Label>
            <Input value="1.00" className="h-8 bg-gray-50" readOnly />
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <Label className="mb-1 block">Result:</Label>
            <Input 
              value={results.hepC} 
              className={cn(
                "h-8 bg-gray-50",
                results.hepC === "Positive" ? "text-red-600 font-medium" : 
                results.hepC === "Border Line Positive" ? "text-orange-500 font-medium" : 
                "text-green-600 font-medium"
              )}
              readOnly 
            />
          </div>
        </div>

        {/* Anti - HIV */}
        <div className="border p-3 rounded-md">
          <div className="text-red-600 font-medium mb-2">Anti - HIV</div>
          <div className="grid grid-cols-2 gap-2">
            <Label htmlFor="hivValue" className="mb-1 block">Donor/Patient Value:</Label>
            <Input 
              id="hivValue" 
              className="h-8"
              value={donorPatientValues.hiv}
              onChange={(e) => handleDonorPatientValueChange("hiv", e.target.value)}
              disabled={!isEditable} 
            />
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <Label className="mb-1 block">Cut Off Value:</Label>
            <Input value="1.00" className="h-8 bg-gray-50" readOnly />
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <Label className="mb-1 block">Result:</Label>
            <Input 
              value={results.hiv} 
              className={cn(
                "h-8 bg-gray-50",
                results.hiv === "Positive" ? "text-red-600 font-medium" : 
                results.hiv === "Border Line Positive" ? "text-orange-500 font-medium" : 
                "text-green-600 font-medium"
              )}
              readOnly 
            />
          </div>
        </div>

        {/* V.D.R.L (Syphilis) */}
        <div className="border p-3 rounded-md">
          <div className="text-red-600 font-medium mb-2">V.D.R.L (Syphilis)</div>
          <div className="grid grid-cols-2 gap-2">
            <Label htmlFor="vdrlValue" className="mb-1 block">Donor/Patient Value:</Label>
            <Input 
              id="vdrlValue" 
              className="h-8"
              value={donorPatientValues.vdrl}
              onChange={(e) => handleDonorPatientValueChange("vdrl", e.target.value)}
              disabled={!isEditable} 
            />
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <Label className="mb-1 block">Cut Off Value:</Label>
            <Input value="1.00" className="h-8 bg-gray-50" readOnly />
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <Label className="mb-1 block">Result:</Label>
            <Input 
              value={results.vdrl} 
              className={cn(
                "h-8 bg-gray-50",
                results.vdrl === "Positive" ? "text-red-600 font-medium" : 
                results.vdrl === "Border Line Positive" ? "text-orange-500 font-medium" : 
                "text-green-600 font-medium"
              )}
              readOnly 
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-4">
        {/* HB% */}
        <div className="border p-3 rounded-md">
          <div className="text-red-600 font-medium mb-2">HB%</div>
          <div className="grid grid-cols-2 gap-2">
            <Label htmlFor="hbValue" className="mb-1 block">Donor/Patient Value:</Label>
            <Input 
              id="hbValue" 
              className="h-8"
              value={donorPatientValues.hb}
              onChange={(e) => handleDonorPatientValueChange("hb", e.target.value)}
              disabled={!isEditable} 
            />
          </div>
        </div>

        {/* Preparation Date */}
        <div className="flex items-center gap-2">
          <Label htmlFor="prepDate" className="whitespace-nowrap">Preparation Date:</Label>
          <Input 
            id="prepDate" 
            type="text" 
            className="h-8 bg-gray-50" 
            value={formattedDate} 
            readOnly 
          />
        </div>
      </div>

      {/* Blood Product Information */}
      <div className="mt-4">
        <div className="border p-3 rounded-md">
          <div className="text-red-600 font-medium mb-2">Blood Product Information</div>
          <div className="grid grid-cols-6 gap-2 text-center">
            {Object.entries(productInfo).map(([key, checked]) => (
              <div key={key} className="flex flex-col items-center">
                <div className="bg-blue-600 text-white p-1 w-full">{key}</div>
                <Checkbox 
                  id={`product-${key}`}
                  checked={checked} 
                  onCheckedChange={(newValue) => 
                    setProductInfo(prev => ({...prev, [key]: !!newValue}))}
                  disabled={!isEditable}
                  className="mt-2 h-5 w-5"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Donor Search Modal */}
      <Dialog open={isSearchModalOpen} onOpenChange={setIsSearchModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Search Donor</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input placeholder="Enter donor ID or name" />
            <div className="h-64 border mt-4 overflow-y-auto">
              {mockDonors.map(donor => (
                <div 
                  key={donor.id} 
                  className="p-2 border-b hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleDonorSelect(donor.id)}
                >
                  <div className="font-medium">{donor.name}</div>
                  <div className="text-sm text-gray-600">ID: {donor.id}, Group: {donor.group} {donor.rh}</div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bag Search Modal */}
      <Dialog open={isBagSearchModalOpen} onOpenChange={setIsBagSearchModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Search Bag Number</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input placeholder="Enter bag number" />
            <div className="h-64 border mt-4 overflow-y-auto">
              {/* Example bag numbers - in a real app, this would be populated from backend */}
              {['B12345', 'B23456', 'B34567', 'B45678'].map(bagId => (
                <div 
                  key={bagId} 
                  className="p-2 border-b hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setBagNo(bagId);
                    setIsBagSearchModalOpen(false);
                  }}
                >
                  <div className="font-medium">Bag ID: {bagId}</div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BleedingForm;
