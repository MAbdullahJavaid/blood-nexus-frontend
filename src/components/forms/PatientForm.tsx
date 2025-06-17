import { useState, forwardRef, useImperativeHandle } from "react";
import { ValidatedInput } from "@/components/ui/validated-input";
import { ValidatedSelect } from "@/components/ui/validated-select";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ShadcnDatePicker } from "@/components/ui/ShadcnDatePicker";
import { useFormValidation } from "@/hooks/useFormValidation";
import { FieldValidationRules } from "@/lib/validation";

interface PatientFormProps {
  isSearchEnabled?: boolean;
  isEditable?: boolean;
  isDeleting?: boolean;
}

interface PatientFormRef {
  clearForm: () => void;
  handleSave: () => Promise<{ success: boolean }>;
  handleDelete: () => Promise<{ success: boolean }>;
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
    const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);

    // Validation states
    const [nameError, setNameError] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [addressError, setAddressError] = useState("");
    const [amountError, setAmountError] = useState("");
    const [weightError, setWeightError] = useState("");

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
      setFormDate(new Date().toISOString().split('T')[0]);
      // Clear validation errors
      setNameError("");
      setPhoneError("");
      setAddressError("");
      setAmountError("");
      setWeightError("");
    };

    useImperativeHandle(ref, () => ({
      clearForm,
      handleSave,
      handleDelete
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
      setFName("");
      setGender(patient.gender || "Male");
      setAddress(patient.address || "");
      setPhone(patient.phone || "");
      setHospital(patient.hospital || "Sundas Foundation");
      setDob(patient.date_of_birth || "");
      setBottleQuantity(patient.bottle_quantity?.toString() || "1");
      setRequiredUnit(patient.bottle_unit_type || "bag");
      
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
        
        if (!name.trim()) {
          toast.error("Patient name is required");
          return { success: false };
        }
        
        if (phone && phone.length > 11) {
          toast.error("Phone number cannot exceed 11 digits");
          return { success: false };
        }
        
        const bloodGroupMap: { [key: string]: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-" } = {
          "A+": "A+", "A-": "A-", "B+": "B+", "B-": "B-", 
          "AB+": "AB+", "AB-": "AB-", "O+": "O+", "O-": "O-",
          "A": "A+", "B": "B+", "AB": "AB+", "O": "O+"
        };
        
        const mappedBloodGroup = bloodGroupMap[`${bloodGroup}${rhType}`] || bloodGroupMap[bloodGroup] || "O+";
        
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
          const { error } = await supabase
            .from('patients')
            .update(patientData)
            .eq('id', selectedPatient.id);
            
          if (error) throw error;
          toast.success("Patient updated successfully!");
        } else {
          const { data: regData, error: regError } = await supabase.rpc('generate_patient_reg_number', {
            prefix_type: prefix
          });
          
          if (regError) throw regError;
          
          const { data, error } = await supabase
            .from('patients')
            .insert({
              patient_id: regData,
              ...patientData
            })
            .select()
            .single();
            
          if (error) throw error;
          
          setPostfix(regData.slice(1));
          setSelectedPatient(data);
          toast.success("Patient saved successfully!");
        }
        
        return { success: true };
      } catch (error) {
        console.error("Error saving patient:", error);
        toast.error("Failed to save patient");
        return { success: false };
      } finally {
        setLoading(false);
      }
    };

    const handleDelete = async () => {
      if (!selectedPatient) {
        toast.error("No patient selected for deletion");
        return { success: false };
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
        return { success: true };
      } catch (error) {
        console.error("Error deleting patient:", error);
        toast.error("Failed to delete patient");
        return { success: false };
      } finally {
        setLoading(false);
      }
    };

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
                <ValidatedInput 
                  id="regNo" 
                  value={displayRegNo} 
                  onChange={() => {}}
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
            <ValidatedInput 
              id="date" 
              className="h-9" 
              type="date" 
              value={formDate} 
              onChange={(value) => setFormDate(value)}
              disabled={!isEditable} 
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <Label htmlFor="name" className="mb-1 block">Name:</Label>
            <ValidatedInput 
              id="name" 
              className="h-9" 
              validationType="name"
              value={name}
              onChange={(value, isValid) => {
                setName(value);
                if (!isValid) {
                  setNameError("Please enter a valid name");
                } else {
                  setNameError("");
                }
              }}
              disabled={!isEditable}
              errorMessage={nameError}
            />
          </div>
          <div>
            <Label htmlFor="fName" className="mb-1 block">F.Name:</Label>
            <ValidatedInput 
              id="fName" 
              className="h-9" 
              validationType="name"
              value={fName}
              onChange={(value) => setFName(value)}
              disabled={!isEditable} 
            />
          </div>
          <div>
            <Label htmlFor="gender" className="mb-1 block">Gender:</Label>
            <ValidatedSelect 
              value={gender} 
              onValueChange={(value) => setGender(value)} 
              disabled={!isEditable}
              options={[
                { value: "male", label: "Male" },
                { value: "female", label: "Female" }
              ]}
              className="h-9"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 mb-4">
          <div>
            <Label htmlFor="address" className="mb-1 block">Address:</Label>
            <ValidatedInput 
              id="address" 
              className="h-9" 
              validationType="address"
              value={address}
              onChange={(value, isValid) => {
                setAddress(value);
                if (!isValid) {
                  setAddressError("Please enter a valid address");
                } else {
                  setAddressError("");
                }
              }}
              disabled={!isEditable}
              errorMessage={addressError}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <Label htmlFor="diagnosis" className="mb-1 block">Diagnosis:</Label>
            <ValidatedInput 
              id="diagnosis" 
              className="h-9" 
              value={diagnosis}
              onChange={(value) => setDiagnosis(value)}
              disabled={!isEditable} 
            />
          </div>
          <div>
            <Label htmlFor="amount" className="mb-1 block">Amount:</Label>
            <ValidatedInput 
              id="amount" 
              className="h-9" 
              type="number"
              validationType="amount"
              value={amount}
              onChange={(value, isValid) => {
                setAmount(value);
                if (!isValid) {
                  setAmountError("Please enter a valid amount");
                } else {
                  setAmountError("");
                }
              }}
              disabled={!isEditable}
              errorMessage={amountError}
            />
          </div>
          <div></div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <Label htmlFor="phone" className="mb-1 block">Phone:</Label>
            <ValidatedInput 
              id="phone" 
              className="h-9" 
              validationType="phone"
              value={phone}
              onChange={(value, isValid) => {
                if (value.length <= 11) {
                  setPhone(value);
                  if (!isValid) {
                    setPhoneError("Please enter a valid phone number");
                  } else {
                    setPhoneError("");
                  }
                }
              }}
              disabled={!isEditable} 
              maxLength={11}
              errorMessage={phoneError}
            />
          </div>
          <div>
            <Label htmlFor="bloodGroup" className="mb-1 block">Blood Group:</Label>
            <div className="flex gap-2">
              <ValidatedSelect 
                value={bloodGroup} 
                onValueChange={(value) => setBloodGroup(value)} 
                disabled={!isEditable}
                options={[
                  { value: "A", label: "A" },
                  { value: "B", label: "B" },
                  { value: "O", label: "O" },
                  { value: "AB", label: "AB" },
                  { value: "--", label: "--" }
                ]}
                className="h-9 flex-1"
              />
              <ValidatedSelect 
                value={rhType} 
                onValueChange={(value) => setRhType(value)} 
                disabled={!isEditable}
                options={[
                  { value: "+ve", label: "+ve" },
                  { value: "-ve", label: "-ve" },
                  { value: "--", label: "--" }
                ]}
                className="h-9 flex-1"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="bgCategory" className="mb-1 block">BG Category:</Label>
            <ValidatedSelect 
              value={bgCategory} 
              onValueChange={(value) => setBgCategory(value)} 
              disabled={!isEditable}
              options={[
                { value: "WB", label: "WB" },
                { value: "FWB", label: "FWB" },
                { value: "PLT", label: "PLT" },
                { value: "PC", label: "PC" },
                { value: "CP", label: "CP" }
              ]}
              className="h-9"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <Label htmlFor="weight" className="mb-1 block">Weight:</Label>
            <ValidatedInput 
              id="weight" 
              className="h-9" 
              type="number"
              validationType="weight"
              value={weight}
              onChange={(value, isValid) => {
                setWeight(value);
                if (!isValid) {
                  setWeightError("Please enter a valid weight");
                } else {
                  setWeightError("");
                }
              }}
              disabled={!isEditable}
              errorMessage={weightError}
            />
          </div>
          <div>
            <Label htmlFor="hospital" className="mb-1 block">Hospital Name:</Label>
            <ValidatedInput 
              id="hospital" 
              className="h-9" 
              value={hospital}
              onChange={(value) => setHospital(value)}
              disabled={!isEditable} 
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="bottle" className="mb-1 block">Bottle:</Label>
              <ValidatedInput 
                id="bottle" 
                className="h-9" 
                type="number"
                validationType="quantity"
                value={bottleQuantity}
                onChange={(value) => setBottleQuantity(value)}
                disabled={!isEditable} 
              />
            </div>
            <div>
              <Label htmlFor="required" className="mb-1 block">Required:</Label>
              <ValidatedSelect 
                value={requiredUnit} 
                onValueChange={(value) => setRequiredUnit(value)} 
                disabled={!isEditable}
                options={[
                  { value: "ml", label: "ml" },
                  { value: "bag", label: "bag" }
                ]}
                className="h-9"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="dob" className="mb-1 block">Date Of Birth:</Label>
            <ShadcnDatePicker
              value={dob}
              onChange={setDob}
              disabled={!isEditable}
              placeholder="YYYY-MM-DD"
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
                <ValidatedInput 
                  placeholder="Enter registration number, name, or phone" 
                  value={searchQuery}
                  onChange={(value) => setSearchQuery(value)}
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
