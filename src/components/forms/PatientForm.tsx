
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PatientFormProps {
  isSearchEnabled?: boolean;
  isEditable?: boolean;
}

const PatientForm = ({ isSearchEnabled = false, isEditable = false }: PatientFormProps) => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [prefix, setPrefix] = useState("T");
  const [postfix, setPostfix] = useState("000");
  const [name, setName] = useState("");
  const [fName, setFName] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [rhType, setRhType] = useState("");
  const [bgCategory, setBgCategory] = useState("PC");
  const [weight, setWeight] = useState("0.00");
  const [hospital, setHospital] = useState("");
  const [bottleQuantity, setBottleQuantity] = useState("1");
  const [requiredUnit, setRequiredUnit] = useState("ml");
  const [dob, setDob] = useState("");
  
  // Set current date as default
  const currentDate = new Date().toISOString().split('T')[0];

  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Validate required fields
      if (!name.trim()) {
        toast.error("Patient name is required");
        return;
      }
      
      // Validate phone number length
      if (phone && phone.length > 11) {
        toast.error("Phone number cannot exceed 11 digits");
        return;
      }
      
      // Generate patient registration number
      const { data: regData, error: regError } = await supabase.rpc('generate_patient_reg_number', {
        prefix_type: prefix
      });
      
      if (regError) throw regError;
      
      // Map blood group to the format expected by the database
      const bloodGroupMap: { [key: string]: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-" } = {
        "A+": "A+", "A-": "A-", "B+": "B+", "B-": "B-", 
        "AB+": "AB+", "AB-": "AB-", "O+": "O+", "O-": "O-",
        "A": "A+", "B": "B+", "AB": "AB+", "O": "O+"
      };
      
      const mappedBloodGroup = bloodGroupMap[`${bloodGroup}${rhType}`] || bloodGroupMap[bloodGroup] || "O+";
      
      // Calculate age from DOB if provided
      let calculatedAge = null;
      if (dob) {
        const dobDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - dobDate.getFullYear();
        const monthDiff = today.getMonth() - dobDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
          age--;
        }
        calculatedAge = age;
      }
      
      // Save patient to database
      const { data, error } = await supabase
        .from('patients')
        .insert({
          patient_id: regData,
          name: name.trim(),
          phone: phone || null,
          gender: gender || null,
          address: address || null,
          blood_group: mappedBloodGroup,
          hospital: hospital || null,
          date_of_birth: dob || null,
          age: calculatedAge,
          bottle_quantity: parseInt(bottleQuantity) || 1,
          bottle_unit_type: requiredUnit
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // Update the form with the generated registration number
      setPostfix(regData.slice(1)); // Remove the prefix to show just the number part
      
      toast.success("Patient saved successfully!");
      console.log("Patient saved:", data);
      
    } catch (error) {
      console.error("Error saving patient:", error);
      toast.error("Failed to save patient");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setName("");
    setFName("");
    setGender("");
    setAddress("");
    setDiagnosis("");
    setAmount("");
    setPhone("");
    setBloodGroup("");
    setRhType("");
    setBgCategory("PC");
    setWeight("0.00");
    setHospital("");
    setBottleQuantity("1");
    setRequiredUnit("ml");
    setDob("");
    setPostfix("000");
  };

  // Display the current registration number or "Auto-generated on save" if new
  const displayRegNo = postfix === "000" ? "" : postfix;
  const regNoPlaceholder = postfix === "000" ? "Auto-generated on save" : "";

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
              <Input 
                id="regNo" 
                value={displayRegNo} 
                className="h-9 w-24 rounded-l-none bg-green-100" 
                readOnly 
                placeholder={regNoPlaceholder}
              />
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
          <Input id="date" className="h-9" type="date" value={currentDate} disabled={!isEditable} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <Label htmlFor="name" className="mb-1 block">Name:</Label>
          <Input 
            id="name" 
            className="h-9" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!isEditable} 
          />
        </div>
        <div>
          <Label htmlFor="fName" className="mb-1 block">F.Name:</Label>
          <Input 
            id="fName" 
            className="h-9" 
            value={fName}
            onChange={(e) => setFName(e.target.value)}
            disabled={!isEditable} 
          />
        </div>
        <div>
          <Label htmlFor="gender" className="mb-1 block">Gender:</Label>
          <Select value={gender} onValueChange={setGender} disabled={!isEditable}>
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
          <Input 
            id="address" 
            className="h-9" 
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            disabled={!isEditable} 
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <Label htmlFor="diagnosis" className="mb-1 block">Diagnosis:</Label>
          <Input 
            id="diagnosis" 
            className="h-9" 
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            disabled={!isEditable} 
          />
        </div>
        <div>
          <Label htmlFor="amount" className="mb-1 block">Amount:</Label>
          <Input 
            id="amount" 
            className="h-9" 
            type="number" 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={!isEditable} 
          />
        </div>
        <div></div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <Label htmlFor="phone" className="mb-1 block">Phone:</Label>
          <Input 
            id="phone" 
            className="h-9" 
            value={phone}
            onChange={(e) => {
              const value = e.target.value;
              if (value.length <= 11) {
                setPhone(value);
              }
            }}
            disabled={!isEditable} 
            maxLength={11}
          />
        </div>
        <div>
          <Label htmlFor="bloodGroup" className="mb-1 block">Blood Group:</Label>
          <div className="flex gap-2">
            <Select value={bloodGroup} onValueChange={setBloodGroup} disabled={!isEditable}>
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
            <Select value={rhType} onValueChange={setRhType} disabled={!isEditable}>
              <SelectTrigger className="h-9 flex-1">
                <SelectValue placeholder="Rh" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="+">+ve</SelectItem>
                <SelectItem value="-">-ve</SelectItem>
                <SelectItem value="--">--</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label htmlFor="bgCategory" className="mb-1 block">BG Category:</Label>
          <Select value={bgCategory} onValueChange={setBgCategory} disabled={!isEditable}>
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
          <Input 
            id="weight" 
            className="h-9" 
            type="number" 
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            disabled={!isEditable} 
          />
        </div>
        <div>
          <Label htmlFor="hospital" className="mb-1 block">Hospital Name:</Label>
          <Input 
            id="hospital" 
            className="h-9" 
            value={hospital}
            onChange={(e) => setHospital(e.target.value)}
            disabled={!isEditable} 
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="bottle" className="mb-1 block">Bottle:</Label>
            <Input 
              id="bottle" 
              className="h-9" 
              type="number" 
              value={bottleQuantity}
              onChange={(e) => setBottleQuantity(e.target.value)}
              disabled={!isEditable} 
            />
          </div>
          <div>
            <Label htmlFor="required" className="mb-1 block">Required:</Label>
            <Select value={requiredUnit} onValueChange={setRequiredUnit} disabled={!isEditable}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ml">ml</SelectItem>
                <SelectItem value="bag">bag</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="dob" className="mb-1 block">Date Of Birth:</Label>
          <Input 
            id="dob" 
            className="h-9" 
            type="date" 
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            disabled={!isEditable} 
          />
        </div>
        <div></div>
      </div>

      {isEditable && (
        <div className="flex gap-2 mt-6">
          <Button 
            onClick={handleSave} 
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? "Saving..." : "Save Patient"}
          </Button>
          <Button 
            onClick={handleClear} 
            variant="outline"
            disabled={loading}
          >
            Clear
          </Button>
        </div>
      )}

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
