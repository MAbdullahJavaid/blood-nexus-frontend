
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";
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
  ProductInfo,
  BagData
} from "./bleeding/types";
import { supabase } from "@/integrations/supabase/client";
import DonorSearchModal from "./bleeding/DonorSearchModal";
import BagSearchModal from "./bleeding/BagSearchModal";
import ScreeningResultsPanel from "./bleeding/ScreeningResultsPanel";
import HBAndDateSection from "./bleeding/HBAndDateSection";
import ProductInfoSection from "./bleeding/ProductInfoSection";

const BleedingForm = ({ isSearchEnabled = true, isEditable = true }: BleedingFormProps) => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isBagSearchModalOpen, setIsBagSearchModalOpen] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [bagNo, setBagNo] = useState(generateBagNumber());
  const [bagType, setBagType] = useState("double");
  const [isLoading, setIsLoading] = useState(false);
  const [bleedingDate, setBleedingDate] = useState(getFormattedDate());
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    toast({
      title: "Donor Selected",
      description: `Selected donor: ${donor.name}`,
    });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDonor) {
      toast({
        title: "Error",
        description: "Please select a donor first",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Format the date for database storage (YYYY-MM-DD)
      const dateArr = bleedingDate.split('/');
      const formattedBleedingDate = `${dateArr[2]}-${dateArr[1]}-${dateArr[0]}`;
      
      // Save to bleeding_records table
      const { data, error } = await supabase
        .from('bleeding_records')
        .insert({
          bag_id: bagNo,
          donor_id: selectedDonor.id,
          bleeding_date: formattedBleedingDate,
          technician: "Current User", // You might want to get this from user context
          remarks: `HB: ${donorPatientValues.hb}, HepB: ${results.hepB}, HepC: ${results.hepC}, HIV: ${results.hiv}, VDRL: ${results.vdrl}`
        });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Bleeding record saved successfully",
      });
      
      // Reset form or redirect user as needed
      setBagNo(generateBagNumber());
    } catch (error) {
      console.error("Error saving bleeding record:", error);
      toast({
        title: "Error",
        description: "Failed to save bleeding record. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-md">
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
              type="button"
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
              onChange={(e) => setBagNo(e.target.value)}
              className="h-9 bg-gray-50"
              readOnly={!isEditable}
            />
            {isEditable && isSearchEnabled && (
              <button 
                type="button"
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
            value={bleedingDate}
            onChange={(e) => setBleedingDate(e.target.value)}
            readOnly={!isEditable}
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

      {isEditable && (
        <div className="mt-6 flex justify-end">
          <Button 
            type="submit" 
            className="bg-red-600 hover:bg-red-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>
      )}

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
    </form>
  );
};

export default BleedingForm;
