import { useState, forwardRef, useImperativeHandle } from "react";
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
  isDeleting?: boolean;
}

interface PatientFormRef {
  clearForm: () => void;
}

const PatientForm = forwardRef<PatientFormRef, PatientFormProps>(
  ({ isSearchEnabled = false, isEditable = false, isDeleting = false }, ref) => {
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<any>(null);
    
    // Form state
    const [prefix, setPrefix] = useState("T");
    const [postfix, setPostfix] = useState("000");
    const [name, setName] = useState("");
    const [fName, setFName] = useState("");
    const [gender, setGender] = useState("Male");
    const [address, setAddress] = useState("");
    const [diagnosis, setDiagnosis] = useState("");
    const [amount, setAmount] = useState("");
    const [phone, setPhone] = useState("");
    const [bloodGroup, setBloodGroup] = useState("B");
    const [rhType, setRhType] = useState("+ve");
    const [bgCategory, setBgCategory] = useState("PC");
    const [weight, setWeight] = useState("15.2");
    const [hospital, setHospital] = useState("Sundas Foundation");
    const [bottleQuantity, setBottleQuantity] = useState("1");
    const [requiredUnit, setRequiredUnit] = useState("bag");
    const [dob, setDob] = useState("");
    
    // Set current date as default
    const currentDate = new Date().toISOString().split('T')[0];

    const clearForm = () => {
      setName("");
      setFName("");
      setGender("Male");
      setAddress("");
      setDiagnosis("");
      setAmount("");
      setPhone("");
      setBloodGroup("B");
      setRhType("+ve");
      setBgCategory("PC");
      setWeight("15.2");
      setHospital("Sundas Foundation");
      setBottleQuantity("1");
      setRequiredUnit("bag");
      setDob("");
      setPostfix("000");
      setSelectedPatient(null);
    };

    useImperativeHandle(ref, () => ({
      clearForm
    }));

    const handleSearch = async () => {
      if (!searchQuery.trim()) {
        toast.error("Please enter a search term");
        return;
      }

      try {
        setLoading(true);
        console.log("Searching for:", searchQuery);
        
        const { data, error } = await supabase
          .from('patients')
          .select('*')
          .or(`name.ilike.%${searchQuery}%,patient_id.ilike.%${searchQuery}%,phone.ilike.%${searchQuery}%`)
          .limit(10);

        console.log("Search results:", data);
        console.log("Search error:", error);

        if (error) throw error;
        setSearchResults(data || []);
        
        if (data && data.length === 0) {
          toast.info("No patients found matching your search");
        }
      } catch (error) {
        console.error("Error searching patients:", error);
        toast.error("Failed to search patients");
      } finally {
        setLoading(false);
      }
    };

    const handleSelectPatient = (patient: any) => {
      console.log("Selected patient:", patient);
      setSelectedPatient(patient);
      setName(patient.name || "");
      setFName(""); // F.Name not stored in database
      setGender(patient.gender || "Male");
      setAddress(patient.address || "");
      setPhone(patient.phone || "");
      setHospital(patient.hospital || "Sundas Foundation");
      setDob(patient.date_of_birth || "");
      setBottleQuantity(patient.bottle_quantity?.toString() || "1");
      setRequiredUnit(patient.bottle_unit_type || "bag");
      
      // Parse blood group
      if (patient.blood_group) {
        const bloodGroupStr = patient.blood_group;
        if (bloodGroupStr.includes('+')) {
          setBloodGroup(bloodGroupStr.replace('+', ''));
          setRhType('+ve');
        } else if (bloodGroupStr.includes('-')) {
          setBloodGroup(bloodGroupStr.replace('-', ''));
          setRhType('-ve');
        } else {
          setBloodGroup(bloodGroupStr);
          setRhType('+ve');
        }
      }
      
      // Set registration number
      if (patient.patient_id) {
        setPrefix(patient.patient_id.charAt(0));
        setPostfix(patient.patient_id.slice(1));
      }
      
      setIsSearchModalOpen(false);
      toast.success("Patient data loaded");
    };

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

        const patientData = {
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
        };
        
        if (selectedPatient) {
          // Update existing patient
          const { error } = await supabase
            .from('patients')
            .update(patientData)
            .eq('id', selectedPatient.id);
            
          if (error) throw error;
          toast.success("Patient updated successfully!");
        } else {
          // Generate registration number for new patient
          const { data: regData, error: regError } = await supabase.rpc('generate_patient_reg_number', {
            prefix_type: prefix
          });
          
          if (regError) throw regError;
          
          // Create new patient
          const { data, error } = await supabase
            .from('patients')
            .insert({
              patient_id: regData,
              ...patientData
            })
            .select()
            .single();
            
          if (error) throw error;
          
          // Update the form with the generated registration number
          setPostfix(regData.slice(1)); // Remove the prefix to show just the number part
          setSelectedPatient(data);
          toast.success("Patient saved successfully!");
        }
        
      } catch (error) {
        console.error("Error saving patient:", error);
        toast.error("Failed to save patient");
      } finally {
        setLoading(false);
      }
    };

    const handleDelete = async () => {
      if (!selectedPatient) {
        toast.error("No patient selected for deletion");
        return;
      }

      try {
        setLoading(true);
        
        const { error } = await supabase
          .from('patients')
          .delete()
          .eq('id', selectedPatient.id);
        
        if (error) throw error;
        
        toast.success("Patient deleted successfully!");
        clearForm();
      } catch (error) {
        console.error("Error deleting patient:", error);
        toast.error("Failed to delete patient");
      } finally {
        setLoading(false);
      }
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
                <Select value={prefix} onValueChange={setPrefix} disabled={!isEditable || selectedPatient}>
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
                  <SelectItem value="+ve">+ve</SelectItem>
                  <SelectItem value="-ve">-ve</SelectItem>
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
              {loading ? "Saving..." : selectedPatient ? "Update Patient" : "Save Patient"}
            </Button>
            <Button 
              onClick={clearForm} 
              variant="outline"
              disabled={loading}
            >
              Clear
            </Button>
          </div>
        )}

        {isDeleting && selectedPatient && (
          <div className="flex gap-2 mt-6">
            <Button 
              onClick={handleDelete} 
              disabled={loading}
              variant="destructive"
            >
              {loading ? "Deleting..." : "Delete Patient"}
            </Button>
          </div>
        )}

        <Dialog open={isSearchModalOpen} onOpenChange={setIsSearchModalOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Search Patient</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <div className="flex gap-2 mb-4">
                <Input 
                  placeholder="Enter registration number, name, or phone" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch} disabled={loading}>
                  {loading ? "Searching..." : "Search"}
                </Button>
              </div>
              <div className="border rounded-lg max-h-96 overflow-y-auto">
                {searchResults.length > 0 ? (
                  <div className="divide-y">
                    {searchResults.map((patient) => (
                      <div
                        key={patient.id}
                        className="p-3 hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleSelectPatient(patient)}
                      >
                        <div className="font-medium">{patient.name}</div>
                        <div className="text-sm text-gray-600">
                          ID: {patient.patient_id} | Phone: {patient.phone || 'N/A'} | 
                          Blood Group: {patient.blood_group} | Hospital: {patient.hospital || 'N/A'}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    {searchQuery ? "No patients found" : "Enter search terms and click Search"}
                  </div>
                )}
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
