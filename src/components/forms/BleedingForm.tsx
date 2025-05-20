
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { 
  generateBagNumber, 
  generateRandomScreeningValue,
  generateRandomHBValue,
  calculateTestResult,
  getFormattedDate
} from "./bleeding/utils";
import { Donor } from "@/types/donor";
import { 
  BleedingFormProps, 
  DonorPatientValues, 
  TestResults, 
  ProductInfo 
} from "./bleeding/types";
import DonorSearchModal from "./bleeding/DonorSearchModal";
import BagSearchModal from "./bleeding/BagSearchModal";
import ScreeningResultsPanel from "./bleeding/ScreeningResultsPanel";
import HBAndDateSection from "./bleeding/HBAndDateSection";
import ProductInfoSection from "./bleeding/ProductInfoSection";

const BleedingForm = ({ isSearchEnabled = false, isEditable = false }: BleedingFormProps) => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isBagSearchModalOpen, setIsBagSearchModalOpen] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [bagNo, setBagNo] = useState(generateBagNumber());
  const [bagType, setBagType] = useState("double");
  const formattedDate = getFormattedDate();

  // Initialize with random values
  const [donorPatientValues, setDonorPatientValues] = useState<DonorPatientValues>({
    hepB: generateRandomScreeningValue(),
    hepC: generateRandomScreeningValue(),
    hiv: generateRandomScreeningValue(),
    vdrl: generateRandomScreeningValue(),
    hb: generateRandomHBValue(),
  });

  const [results, setResults] = useState<TestResults>({
    hepB: "",
    hepC: "",
    hiv: "",
    vdrl: "",
  });

  const [productInfo, setProductInfo] = useState<ProductInfo>({
    WB: false,
    PC: true,
    FFP: true,
    PLT: false,
    CP: false,
    CS: false,
  });

  // Calculate results based on donor/patient values
  useEffect(() => {
    setResults({
      hepB: calculateTestResult(donorPatientValues.hepB),
      hepC: calculateTestResult(donorPatientValues.hepC),
      hiv: calculateTestResult(donorPatientValues.hiv),
      vdrl: calculateTestResult(donorPatientValues.vdrl),
    });
  }, [donorPatientValues]);

  // Handle donor selection
  const handleDonorSelect = (donor: Donor) => {
    setSelectedDonor(donor);
  };

  const handleDonorPatientValueChange = (test: keyof DonorPatientValues, value: string) => {
    setDonorPatientValues(prev => ({
      ...prev,
      [test]: value
    }));
  };

  const handleProductInfoChange = (key: keyof ProductInfo, value: boolean) => {
    setProductInfo(prev => ({
      ...prev,
      [key]: value
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
              value={selectedDonor?.donor_id || ""}
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
            value={selectedDonor?.blood_group || ""}
            className="h-9 bg-gray-50"
            readOnly
          />
        </div>
        <div>
          <Label htmlFor="rh" className="mb-1 block">Rh:</Label>
          <Input 
            id="rh" 
            value={selectedDonor?.blood_group?.includes('+') ? '+ve' : selectedDonor?.blood_group?.includes('-') ? '-ve' : ""}
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
      
      <ScreeningResultsPanel 
        donorPatientValues={donorPatientValues}
        results={results}
        isEditable={isEditable}
        onValueChange={handleDonorPatientValueChange}
      />

      <HBAndDateSection 
        donorPatientValues={donorPatientValues}
        isEditable={isEditable}
        formattedDate={formattedDate}
        onValueChange={handleDonorPatientValueChange}
      />

      <ProductInfoSection 
        productInfo={productInfo}
        isEditable={isEditable}
        onProductInfoChange={handleProductInfoChange}
      />

      {/* Donor Search Modal */}
      <DonorSearchModal 
        isOpen={isSearchModalOpen} 
        onClose={() => setIsSearchModalOpen(false)}
        onSelect={handleDonorSelect}
      />

      {/* Bag Search Modal */}
      <BagSearchModal 
        isOpen={isBagSearchModalOpen} 
        onClose={() => setIsBagSearchModalOpen(false)}
        onSelect={(bagId) => setBagNo(bagId)}
      />
    </div>
  );
};

export default BleedingForm;
