import { forwardRef, useState, useEffect, useImperativeHandle } from "react";
import { PatientInvoiceFormProps, FormRefObject, InvoiceItem, Patient } from "./types";
import { mockPatients, mockTests, mockInvoices } from "./mock-data";
import { PatientSearchModal } from "./PatientSearchModal";
import { TestSearchModal } from "./TestSearchModal";
import { DocumentSearchModal } from "./DocumentSearchModal";
import { PatientDetailsSection } from "./PatientDetailsSection";
import { HospitalDetailsSection } from "./HospitalDetailsSection";
import { PatientInfoSection } from "./PatientInfoSection";
import { BloodDetailsSection } from "./BloodDetailsSection";
import { TestsSection } from "./TestsSection";
import { TotalSection } from "./TotalSection";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const PatientInvoiceForm = forwardRef<FormRefObject, PatientInvoiceFormProps>(
  ({ isSearchEnabled = false, isEditable = false }, ref) => {
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [isTestSearchModalOpen, setIsTestSearchModalOpen] = useState(false);
    const [isDocumentSearchModalOpen, setIsDocumentSearchModalOpen] = useState(false);
    const [patientType, setPatientType] = useState<string>("regular");
    const [documentNo, setDocumentNo] = useState<string>("");
    const [bloodGroup, setBloodGroup] = useState<string>("N/A");
    const [rhType, setRhType] = useState<string>("N/A");
    const [bloodCategory, setBloodCategory] = useState<string>("FWB");
    const [bottleRequired, setBottleRequired] = useState<number>(1);
    const [bottleUnitType, setBottleUnitType] = useState<string>("bag");
    const [items, setItems] = useState<InvoiceItem[]>([]);
    const [discount, setDiscount] = useState<number>(0);
    const [receivedAmount, setReceivedAmount] = useState<number>(0);
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
    const [currentTestIndex, setCurrentTestIndex] = useState<number | null>(null);
    const [selectedPatient, setSelectedPatient] = useState<any>(null);
    const [documentDate, setDocumentDate] = useState<string>(
      new Date().toISOString().split('T')[0]
    );
    const [loading, setLoading] = useState(false);
    const [patientName, setPatientName] = useState("");
    const [phoneNo, setPhoneNo] = useState("");
    const [age, setAge] = useState<number | null>(null);
    const [dob, setDob] = useState<string>("");
    const [references, setReferences] = useState("");
    const [hospital, setHospital] = useState("");
    const [gender, setGender] = useState("male");
    const [exDonor, setExDonor] = useState("");
    const [patientID, setPatientID] = useState("");

    useImperativeHandle(ref, () => ({
      handleAddItem: () => {
        handleAddItem();
      },
      handleDeleteItem: () => {
        handleDeleteItem();
      },
      handleSave: async () => {
        return await handleSave();
      }
    }));

    useEffect(() => {
      if (isEditable && isAdding) {
        generateDocumentNo();
      }
    }, [isEditable]);

    const isAdding = !documentNo;
    const shouldEnableEditing = isEditable && (patientType === "opd" || patientType === "regular");
    
    const generateDocumentNo = async () => {
      try {
        const { data, error } = await supabase.rpc('generate_invoice_number');
        if (error) throw error;
        setDocumentNo(data);
      } catch (error) {
        console.error('Error generating document number:', error);
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const sequence = "0001";
        setDocumentNo(`${year}${month}${sequence}`);
      }
    };

    const handlePatientTypeChange = (value: string) => {
      console.log("Patient type changed to:", value);
      setPatientType(value);
      
      // Clear all patient-related data when type changes
      setSelectedPatient(null);
      setPatientName("");
      setPhoneNo("");
      setAge(null);
      setDob("");
      setReferences("");
      setHospital("");
      setGender("male");
      setExDonor("");
      setPatientID("");
      setBloodGroup("N/A");
      setRhType("N/A");
      
      console.log("Patient data cleared for type change");
    };

    const handleAddItem = () => {
      const tempId = `temp-${items.length}`;
      const newItem: InvoiceItem = {
        id: tempId,
        testId: 0,
        testName: "",
        qty: 1,
        rate: 0,
        amount: 0
      };
      
      setItems([...items, newItem]);
      setSelectedItemIndex(items.length);
      setCurrentTestIndex(items.length);
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
      setTotalAmount(sum);
      
      // Calculate discount as net amount minus received amount
      const calculatedDiscount = sum - receivedAmount;
      setDiscount(calculatedDiscount >= 0 ? calculatedDiscount : 0);
    };

    const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Discount is now calculated automatically, so this function is disabled
      return;
    };

    const handleReceivedAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value) || 0;
      setReceivedAmount(value);
      
      // Calculate discount as net amount minus received amount
      const itemsSum = items.reduce((acc, item) => acc + item.amount, 0);
      const calculatedDiscount = itemsSum - value;
      setDiscount(calculatedDiscount >= 0 ? calculatedDiscount : 0);
    };

    const handleSelectRow = (index: number) => {
      setSelectedItemIndex(index);
    };

    const handleTestSelect = async (testId: number) => {
      try {
        const { data, error } = await supabase
          .from('test_information')
          .select('id, name, price')
          .eq('id', testId)
          .single();
        
        if (error) throw error;
        
        if (data && currentTestIndex !== null) {
          const updatedItems = [...items];
          updatedItems[currentTestIndex] = {
            ...updatedItems[currentTestIndex],
            testId: data.id,
            testName: data.name,
            rate: data.price,
            amount: data.price * updatedItems[currentTestIndex].qty
          };
          
          setItems(updatedItems);
          calculateTotal(updatedItems);
          setIsTestSearchModalOpen(false);
          setCurrentTestIndex(null);
        }
      } catch (error) {
        console.error("Error selecting test:", error);
        toast.error("Failed to select test");
      }
    };

    const handlePatientSelect = async (patientId: string) => {
      try {
        console.log("=== PATIENT SELECTION STARTED ===");
        console.log("Patient ID received:", patientId);
        console.log("Current patient type:", patientType);
        
        const { data: patient, error } = await supabase
          .from('patients')
          .select('*')
          .eq('id', patientId)
          .single();
        
        console.log("Database query result:", { patient, error });
        
        if (error) {
          console.error("Database error:", error);
          throw error;
        }
        
        if (patient) {
          console.log("Setting patient data:", patient);
          
          // Set the selected patient object
          setSelectedPatient(patient);
          
          // Update all form fields with patient data
          setPatientName(patient.name || "");
          setPhoneNo(patient.phone || "");
          setAge(patient.age || null);
          setHospital(patient.hospital || "");
          setGender(patient.gender || "male");
          setPatientID(patient.patient_id || "");
          
          // Handle date of birth
          if (patient.date_of_birth) {
            const dobString = patient.date_of_birth;
            console.log("Setting DOB:", dobString);
            setDob(dobString);
          } else {
            setDob("");
          }
          
          // Handle blood group parsing
          if (patient.blood_group) {
            const bloodGroupStr = patient.blood_group;
            console.log("Processing blood group:", bloodGroupStr);
            
            if (bloodGroupStr.includes('+')) {
              const group = bloodGroupStr.replace('+', '');
              setBloodGroup(group);
              setRhType('+ve');
              console.log("Set blood group:", group, "+ve");
            } else if (bloodGroupStr.includes('-')) {
              const group = bloodGroupStr.replace('-', '');
              setBloodGroup(group);
              setRhType('-ve');
              console.log("Set blood group:", group, "-ve");
            } else {
              setBloodGroup(bloodGroupStr);
              setRhType('N/A');
              console.log("Set blood group:", bloodGroupStr, "N/A");
            }
          } else {
            setBloodGroup("N/A");
            setRhType("N/A");
          }
          
          console.log("=== PATIENT DATA LOADED SUCCESSFULLY ===");
          console.log("Final form state:", {
            patientName: patient.name,
            phoneNo: patient.phone,
            age: patient.age,
            hospital: patient.hospital,
            gender: patient.gender,
            patientID: patient.patient_id,
            bloodGroup: patient.blood_group
          });
          
          toast.success(`Patient ${patient.name} loaded successfully`);
        } else {
          console.warn("No patient data returned from database");
          toast.error("No patient data found");
        }
        
        // Close the search modal
        setIsSearchModalOpen(false);
        
      } catch (error) {
        console.error("=== ERROR IN PATIENT SELECTION ===");
        console.error("Error details:", error);
        toast.error("Failed to load patient data");
        setIsSearchModalOpen(false);
      }
    };

    const handleDocumentSelect = (docNum: string) => {
      const invoice = mockInvoices.find(inv => inv.documentNo === docNum);
      if (invoice) {
        setDocumentNo(invoice.documentNo);
        const patient = mockPatients.find(p => p.id === invoice.patientId);
        setSelectedPatient(patient);
        
        if (patient) {
          setPatientName(patient.name);
          setPhoneNo(patient.phoneNo || "");
          setAge(patient.age);
          setHospital(patient.hospital || "");
          setGender(patient.gender || "male");
        }
      }
      setIsDocumentSearchModalOpen(false);
    };

    const handleSearchTest = (index: number) => {
      setCurrentTestIndex(index);
      setIsTestSearchModalOpen(true);
    };

    const handleSearchPatient = () => {
      console.log("Opening patient search modal");
      setIsSearchModalOpen(true);
    };

    const handleDobChange = (date: string) => {
      setDob(date);
      if (date) {
        const dobDate = new Date(date);
        const today = new Date();
        let age = today.getFullYear() - dobDate.getFullYear();
        const monthDiff = today.getMonth() - dobDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
          age--;
        }
        setAge(age);
      } else {
        setAge(null);
      }
    };

    const handleAgeChange = (ageValue: number | null) => {
      setAge(ageValue);
      if (ageValue !== null) {
        const today = new Date();
        const birthYear = today.getFullYear() - ageValue;
        const birthDate = new Date(birthYear, today.getMonth(), today.getDate());
        setDob(birthDate.toISOString().split('T')[0]);
      } else {
        setDob("");
      }
    };

    const handleQuantityChange = (index: number, value: number) => {
      const updatedItems = [...items];
      updatedItems[index].qty = value;
      updatedItems[index].amount = value * updatedItems[index].rate;
      setItems(updatedItems);
      calculateTotal(updatedItems);
    };
    
    const handleRateChange = (index: number, value: number) => {
      const updatedItems = [...items];
      updatedItems[index].rate = value;
      updatedItems[index].amount = value * updatedItems[index].qty;
      setItems(updatedItems);
      calculateTotal(updatedItems);
    };

    const handleSave = async () => {
      try {
        setLoading(true);
        
        let patientId: string;
        
        if (patientType === "opd") {
          const bloodGroupMap: { [key: string]: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-" } = {
            "A": "A+",
            "B": "B+", 
            "AB": "AB+",
            "O": "O+",
            "N/A": "O+"
          };
          
          const mappedBloodGroup = bloodGroupMap[bloodGroup] || "O+";
          const patientIdNumber = `P${Date.now()}`;
          
          const { data: patientData, error: patientError } = await supabase
            .from('patients')
            .insert({
              patient_id: patientIdNumber,
              name: patientName,
              phone: phoneNo,
              date_of_birth: dob || null,
              gender: gender,
              blood_group: mappedBloodGroup,
              hospital: hospital,
              age: age
            })
            .select('id')
            .single();
            
          if (patientError) throw patientError;
          patientId = patientData.id;
        } else {
          if (!selectedPatient?.id) {
            throw new Error("No patient selected");
          }
          patientId = selectedPatient.id;
        }
        
        const { data: invoiceData, error: invoiceError } = await supabase
          .from('patient_invoices')
          .insert({
            invoice_number: documentNo,
            invoice_date: documentDate,
            patient_id: patientId,
            total_amount: totalAmount,
            patient_type: patientType,
            blood_group_type: bloodGroup,
            rh_type: rhType,
            blood_category: bloodCategory,
            bottle_required: bottleRequired,
            bottle_unit_type: bottleUnitType,
            ex_donor: exDonor,
            patient_references: references,
            hospital_name: hospital,
            patient_age: age,
            patient_dob: dob || null,
            patient_phone: phoneNo,
            patient_gender: gender,
            discount_amount: discount,
            amount_received: receivedAmount,
            status: receivedAmount >= totalAmount ? "Paid" : "Pending"
          })
          .select('id')
          .single();
          
        if (invoiceError) throw invoiceError;
        
        const invoiceItems = items.map(item => ({
          invoice_id: invoiceData.id,
          item_id: item.testId.toString(),
          item_type: "test",
          quantity: item.qty,
          unit_price: item.rate,
          total_price: item.amount
        }));
        
        const { error: itemsError } = await supabase
          .from('invoice_items')
          .insert(invoiceItems);
          
        if (itemsError) throw itemsError;
        
        toast.success("Invoice saved successfully");
        return { success: true, invoiceId: invoiceData.id };
      } catch (error) {
        console.error("Error saving invoice:", error);
        toast.error("Failed to save invoice");
        return { success: false, error };
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="bg-white p-4 rounded-md">
        <PatientDetailsSection
          patientType={patientType}
          documentNo={documentNo}
          selectedPatient={selectedPatient}
          isEditable={isEditable}
          isAdding={isAdding}
          onPatientTypeChange={handlePatientTypeChange}
          onSearchPatientClick={handleSearchPatient}
          onSearchDocumentClick={() => setIsDocumentSearchModalOpen(true)}
          patientName={patientName}
          setPatientName={setPatientName}
          documentDate={documentDate}
          setDocumentDate={setDocumentDate}
          shouldEnableEditing={shouldEnableEditing}
          setDocumentNo={setDocumentNo}
          patientID={patientID}
          setPatientId={setPatientID}
        />

        <HospitalDetailsSection
          selectedPatient={selectedPatient}
          isEditable={isEditable}
          hospital={hospital}
          setHospital={setHospital}
          gender={gender}
          setGender={setGender}
          exDonor={exDonor}
          setExDonor={setExDonor}
          shouldEnableEditing={shouldEnableEditing}
        />

        <PatientInfoSection
          selectedPatient={selectedPatient}
          isEditable={isEditable}
          phoneNo={phoneNo}
          setPhoneNo={setPhoneNo}
          age={age}
          setAge={handleAgeChange}
          dob={dob}
          setDob={handleDobChange}
          references={references}
          setReferences={setReferences}
          shouldEnableEditing={shouldEnableEditing}
        />

        <BloodDetailsSection
          bloodGroup={bloodGroup}
          rhType={rhType}
          bloodCategory={bloodCategory}
          bottleRequired={bottleRequired}
          bottleUnitType={bottleUnitType}
          isEditable={isEditable}
          onBloodGroupChange={setBloodGroup}
          onRhTypeChange={setRhType}
          onBloodCategoryChange={setBloodCategory}
          onBottleRequiredChange={setBottleRequired}
          onBottleUnitTypeChange={setBottleUnitType}
        />

        <TestsSection
          items={items}
          selectedItemIndex={selectedItemIndex}
          isEditable={isEditable}
          onSelectRow={handleSelectRow}
          onSearchTest={handleSearchTest}
          onQuantityChange={handleQuantityChange}
          onRateChange={handleRateChange}
        />

        <TotalSection
          discount={discount}
          totalAmount={totalAmount}
          receivedAmount={receivedAmount}
          isEditable={isEditable}
          onDiscountChange={handleDiscountChange}
          onReceivedAmountChange={handleReceivedAmountChange}
        />

        <PatientSearchModal
          isOpen={isSearchModalOpen}
          onOpenChange={setIsSearchModalOpen}
          onPatientSelect={handlePatientSelect}
        />

        <TestSearchModal
          isOpen={isTestSearchModalOpen}
          onOpenChange={setIsTestSearchModalOpen}
          onTestSelect={handleTestSelect}
        />

        <DocumentSearchModal
          isOpen={isDocumentSearchModalOpen}
          onOpenChange={setIsDocumentSearchModalOpen}
          onDocumentSelect={handleDocumentSelect}
        />
      </div>
    );
  }
);

PatientInvoiceForm.displayName = "PatientInvoiceForm";

export default PatientInvoiceForm;
