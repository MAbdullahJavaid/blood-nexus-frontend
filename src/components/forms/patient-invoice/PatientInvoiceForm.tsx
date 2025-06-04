
import { forwardRef, useState, useEffect, useImperativeHandle } from "react";
import { PatientInvoiceFormProps, FormRefObject, InvoiceItem, Patient } from "./types";
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
    
    // Separate states for regular and OPD patients
    const [regularPatient, setRegularPatient] = useState<Patient | null>(null);
    const [opdPatientData, setOpdPatientData] = useState({
      patientId: "",
      name: "",
      phone: "",
      age: null as number | null,
      dob: "",
      hospital: "",
      gender: "male",
      bloodGroup: "N/A",
      rhType: "N/A"
    });
    
    const [documentDate, setDocumentDate] = useState<string>(
      new Date().toISOString().split('T')[0]
    );
    const [loading, setLoading] = useState(false);
    const [references, setReferences] = useState("");
    const [exDonor, setExDonor] = useState("");

    useImperativeHandle(ref, () => ({
      handleAddItem: () => {
        handleAddItem();
      },
      handleDeleteItem: () => {
        handleDeleteItem();
      },
      handleSave: async () => {
        return await handleSave();
      },
      clearForm: () => {
        // Clear all form data
        setPatientType("regular");
        setDocumentNo("");
        setBloodGroup("N/A");
        setRhType("N/A");
        setBloodCategory("FWB");
        setBottleRequired(1);
        setBottleUnitType("bag");
        setItems([]);
        setDiscount(0);
        setReceivedAmount(0);
        setTotalAmount(0);
        setSelectedItemIndex(null);
        setCurrentTestIndex(null);
        setRegularPatient(null);
        setOpdPatientData({
          patientId: "",
          name: "",
          phone: "",
          age: null,
          dob: "",
          hospital: "",
          gender: "male",
          bloodGroup: "N/A",
          rhType: "N/A"
        });
        setDocumentDate(new Date().toISOString().split('T')[0]);
        setReferences("");
        setExDonor("");
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
      
      // Clear both patient states when type changes
      setRegularPatient(null);
      setOpdPatientData({
        patientId: "",
        name: "",
        phone: "",
        age: null,
        dob: "",
        hospital: "",
        gender: "male",
        bloodGroup: "N/A",
        rhType: "N/A"
      });
      
      setReferences("");
      setExDonor("");
      setBloodGroup("N/A");
      setRhType("N/A");
      
      console.log("Patient data cleared for type change");
    };

    // Get current patient data based on type
    const getCurrentPatientData = () => {
      if (patientType === "regular" && regularPatient) {
        return {
          patientId: regularPatient.patient_id || regularPatient.id,
          name: regularPatient.name,
          phone: regularPatient.phone || "",
          age: regularPatient.age,
          dob: regularPatient.date_of_birth || "",
          hospital: regularPatient.hospital || "",
          gender: regularPatient.gender || "male"
        };
      } else if (patientType === "opd") {
        return opdPatientData;
      }
      return {
        patientId: "",
        name: "",
        phone: "",
        age: null,
        dob: "",
        hospital: "",
        gender: "male"
      };
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
      
      const calculatedDiscount = sum - receivedAmount;
      setDiscount(calculatedDiscount >= 0 ? calculatedDiscount : 0);
    };

    const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      return;
    };

    const handleReceivedAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value) || 0;
      setReceivedAmount(value);
      
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
        
        const { data: dbPatient, error } = await supabase
          .from('patients')
          .select('*')
          .eq('id', patientId)
          .single();
        
        console.log("Database query result:", { dbPatient, error });
        
        if (error) {
          console.error("Database error:", error);
          throw error;
        }
        
        if (dbPatient) {
          console.log("Setting regular patient data:", dbPatient);
          
          // Map database patient to Patient interface format
          const patient: Patient = {
            id: dbPatient.id,
            patient_id: dbPatient.patient_id,
            name: dbPatient.name,
            hospital: dbPatient.hospital || "",
            gender: dbPatient.gender || "male",
            phoneNo: dbPatient.phone || "", // Map phone to phoneNo
            phone: dbPatient.phone || "", // Keep both for compatibility
            age: dbPatient.age || 0,
            date_of_birth: dbPatient.date_of_birth || "",
            blood_group: dbPatient.blood_group || "O+"
          };
          
          // Set the regular patient object
          setRegularPatient(patient);
          
          // Handle blood group parsing for regular patients
          if (dbPatient.blood_group) {
            const bloodGroupStr = dbPatient.blood_group;
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
          
          console.log("=== REGULAR PATIENT DATA LOADED SUCCESSFULLY ===");
          toast.success(`Patient ${patient.name} loaded successfully`);
        } else {
          console.warn("No patient data returned from database");
          toast.error("No patient data found");
        }
        
        setIsSearchModalOpen(false);
        
      } catch (error) {
        console.error("=== ERROR IN PATIENT SELECTION ===");
        console.error("Error details:", error);
        toast.error("Failed to load patient data");
        setIsSearchModalOpen(false);
      }
    };

    const handleDocumentSelect = async (docNum: string) => {
      try {
        // Load invoice data from patient_invoices table
        const { data: invoiceData, error: invoiceError } = await supabase
          .from('patient_invoices')
          .select('*')
          .eq('document_no', docNum)
          .single();

        if (invoiceError) throw invoiceError;

        if (invoiceData) {
          setDocumentNo(invoiceData.document_no);
          setDocumentDate(invoiceData.document_date);
          setTotalAmount(invoiceData.total_amount || 0);
          setDiscount(invoiceData.discount_amount || 0);
          setReceivedAmount(invoiceData.amount_received || 0);
          setReferences(invoiceData.reference_notes || "");
          setExDonor(invoiceData.ex_donor || "");
          setPatientType(invoiceData.patient_type || "regular");
          
          // Set blood details
          setBloodGroup(invoiceData.blood_group_separate || "N/A");
          setRhType(invoiceData.rh_factor || "N/A");
          setBloodCategory(invoiceData.blood_category || "FWB");
          setBottleRequired(invoiceData.bottle_quantity || 1);
          setBottleUnitType(invoiceData.bottle_unit || "bag");

          // Load patient data based on type
          if (invoiceData.patient_type === "regular" && invoiceData.patient_id) {
            const { data: patientData, error: patientError } = await supabase
              .from('patients')
              .select('*')
              .eq('id', invoiceData.patient_id)
              .single();

            if (!patientError && patientData) {
              const patient: Patient = {
                id: patientData.id,
                patient_id: patientData.patient_id,
                name: patientData.name,
                hospital: patientData.hospital || "",
                gender: patientData.gender || "male",
                phoneNo: patientData.phone || "",
                phone: patientData.phone || "",
                age: patientData.age || 0,
                date_of_birth: patientData.date_of_birth || "",
                blood_group: patientData.blood_group || "O+"
              };
              setRegularPatient(patient);
            }
          } else if (invoiceData.patient_type === "opd") {
            // For OPD, use invoice data directly
            setOpdPatientData({
              patientId: invoiceData.patient_id || "",
              name: invoiceData.patient_name || "",
              phone: invoiceData.phone_no || "",
              age: invoiceData.age || null,
              dob: invoiceData.dob || "",
              hospital: invoiceData.hospital_name || "",
              gender: invoiceData.gender || "male",
              bloodGroup: invoiceData.blood_group_separate || "N/A",
              rhType: invoiceData.rh_factor || "N/A"
            });
          }

          // Load invoice items - fixed to use correct database fields
          const { data: itemsData, error: itemsError } = await supabase
            .from('invoice_items')
            .select('*')
            .eq('invoice_id', invoiceData.id);

          if (!itemsError && itemsData) {
            const invoiceItems: InvoiceItem[] = itemsData.map((item) => ({
              id: item.id,
              testId: item.test_id || 0,
              testName: item.test_name,
              qty: item.quantity,
              rate: item.unit_price,
              amount: item.total_price
            }));
            setItems(invoiceItems);
          }

          toast.success("Invoice loaded successfully");
        }
      } catch (error) {
        console.error("Error loading invoice:", error);
        toast.error("Failed to load invoice");
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

    // OPD patient data handlers
    const handleOpdPatientChange = (field: string, value: any) => {
      setOpdPatientData(prev => ({
        ...prev,
        [field]: value
      }));
      
      // Update blood group states if blood group fields change
      if (field === 'bloodGroup') {
        setBloodGroup(value);
      } else if (field === 'rhType') {
        setRhType(value);
      }
    };

    const handleDobChange = (date: string) => {
      if (patientType === "opd") {
        handleOpdPatientChange('dob', date);
        if (date) {
          const dobDate = new Date(date);
          const today = new Date();
          let age = today.getFullYear() - dobDate.getFullYear();
          const monthDiff = today.getMonth() - dobDate.getMonth();
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
            age--;
          }
          handleOpdPatientChange('age', age);
        } else {
          handleOpdPatientChange('age', null);
        }
      }
    };

    const handleAgeChange = (ageValue: number | null) => {
      if (patientType === "opd") {
        handleOpdPatientChange('age', ageValue);
        if (ageValue !== null) {
          const today = new Date();
          const birthYear = today.getFullYear() - ageValue;
          const birthDate = new Date(birthYear, today.getMonth(), today.getDate());
          handleOpdPatientChange('dob', birthDate.toISOString().split('T')[0]);
        } else {
          handleOpdPatientChange('dob', "");
        }
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
        const currentData = getCurrentPatientData();
        
        if (patientType === "opd") {
          const bloodGroupMap: { [key: string]: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-" } = {
            "A": "A+",
            "B": "B+", 
            "AB": "AB+",
            "O": "O+",
            "N/A": "O+"
          };
          
          const mappedBloodGroup = bloodGroupMap[opdPatientData.bloodGroup] || "O+";
          
          const { data: patientData, error: patientError } = await supabase
            .from('patients')
            .insert({
              patient_id: opdPatientData.patientId,
              name: opdPatientData.name,
              phone: opdPatientData.phone,
              date_of_birth: opdPatientData.dob || null,
              gender: opdPatientData.gender,
              blood_group: mappedBloodGroup,
              hospital: opdPatientData.hospital,
              age: opdPatientData.age
            })
            .select('id')
            .single();
            
          if (patientError) throw patientError;
          patientId = patientData.id;
        } else {
          if (!regularPatient?.id) {
            throw new Error("No patient selected");
          }
          patientId = regularPatient.id;
        }
        
        const { data: invoiceData, error: invoiceError } = await supabase
          .from('patient_invoices')
          .insert({
            document_no: documentNo,
            document_date: documentDate,
            patient_id: patientId,
            total_amount: totalAmount,
            patient_type: patientType,
            blood_group_separate: bloodGroup,
            rh_factor: rhType,
            blood_category: bloodCategory,
            bottle_quantity: bottleRequired,
            bottle_unit: bottleUnitType,
            ex_donor: exDonor,
            reference_notes: references,
            hospital_name: currentData.hospital,
            age: currentData.age,
            dob: currentData.dob || null,
            phone_no: currentData.phone,
            gender: currentData.gender,
            discount_amount: discount,
            amount_received: receivedAmount,
            patient_name: currentData.name
          })
          .select('id')
          .single();
          
        if (invoiceError) throw invoiceError;
        
        // Create invoice items with correct field mapping
        if (items.length > 0) {
          const invoiceItems = items.map(item => ({
            invoice_id: invoiceData.id,
            test_id: item.testId || null,
            test_name: item.testName,
            quantity: item.qty,
            unit_price: item.rate,
            total_price: item.amount
          }));
          
          const { error: itemsError } = await supabase
            .from('invoice_items')
            .insert(invoiceItems);
            
          if (itemsError) throw itemsError;
        }
        
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

    const currentPatientData = getCurrentPatientData();

    return (
      <div className="bg-white p-4 rounded-md">
        <PatientDetailsSection
          patientType={patientType}
          documentNo={documentNo}
          selectedPatient={regularPatient}
          isEditable={isEditable}
          isAdding={isAdding}
          onPatientTypeChange={handlePatientTypeChange}
          onSearchPatientClick={handleSearchPatient}
          onSearchDocumentClick={() => setIsDocumentSearchModalOpen(true)}
          patientName={currentPatientData.name}
          setPatientName={(value) => {
            if (patientType === "opd") {
              handleOpdPatientChange('name', value);
            }
          }}
          documentDate={documentDate}
          setDocumentDate={setDocumentDate}
          shouldEnableEditing={shouldEnableEditing}
          setDocumentNo={setDocumentNo}
          patientID={currentPatientData.patientId}
          setPatientId={(value) => {
            if (patientType === "opd") {
              handleOpdPatientChange('patientId', value);
            }
          }}
        />

        <HospitalDetailsSection
          selectedPatient={regularPatient}
          isEditable={isEditable}
          hospital={currentPatientData.hospital}
          setHospital={(value) => {
            if (patientType === "opd") {
              handleOpdPatientChange('hospital', value);
            }
          }}
          gender={currentPatientData.gender}
          setGender={(value) => {
            if (patientType === "opd") {
              handleOpdPatientChange('gender', value);
            }
          }}
          exDonor={exDonor}
          setExDonor={setExDonor}
          shouldEnableEditing={shouldEnableEditing}
        />

        <PatientInfoSection
          selectedPatient={regularPatient}
          isEditable={isEditable}
          phoneNo={currentPatientData.phone}
          setPhoneNo={(value) => {
            if (patientType === "opd") {
              handleOpdPatientChange('phone', value);
            }
          }}
          age={currentPatientData.age}
          setAge={handleAgeChange}
          dob={currentPatientData.dob}
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
          onBloodGroupChange={(value) => {
            setBloodGroup(value);
            if (patientType === "opd") {
              handleOpdPatientChange('bloodGroup', value);
            }
          }}
          onRhTypeChange={(value) => {
            setRhType(value);
            if (patientType === "opd") {
              handleOpdPatientChange('rhType', value);
            }
          }}
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

        {patientType === "regular" && (
          <PatientSearchModal
            isOpen={isSearchModalOpen}
            onOpenChange={setIsSearchModalOpen}
            onPatientSelect={handlePatientSelect}
          />
        )}

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
