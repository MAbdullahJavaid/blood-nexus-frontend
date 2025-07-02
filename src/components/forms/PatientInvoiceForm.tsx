
import { forwardRef, useState, useEffect, useImperativeHandle } from "react";
import { PatientInvoiceFormProps, FormRefObject, InvoiceItem } from "./patient-invoice/types";
import { PatientSearchModal } from "./patient-invoice/PatientSearchModal";
import { TestSearchModal } from "./patient-invoice/TestSearchModal";
import { DocumentSearchModal } from "./patient-invoice/DocumentSearchModal";
import { PatientDetailsSection } from "./patient-invoice/PatientDetailsSection";
import { HospitalDetailsSection } from "./patient-invoice/HospitalDetailsSection";
import { PatientInfoSection } from "./patient-invoice/PatientInfoSection";
import { BloodDetailsSection } from "./patient-invoice/BloodDetailsSection";
import { TestsSection } from "./patient-invoice/TestsSection";
import { TotalSection } from "./patient-invoice/TotalSection";
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
    const [bloodCategory, setBloodCategory] = useState<string>("N/A");
    const [bottleRequired, setBottleRequired] = useState<number>(0);
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
    
    // Form fields for patient data
    const [patientID, setPatientID] = useState("");
    const [patientName, setPatientName] = useState("");
    const [phoneNo, setPhoneNo] = useState("");
    const [age, setAge] = useState<number | null>(null);
    const [dob, setDob] = useState<string>("");
    const [references, setReferences] = useState("");
    const [hospital, setHospital] = useState("");
    const [gender, setGender] = useState("male");
    const [exDonor, setExDonor] = useState("");

    const clearForm = () => {
      setPatientType("regular");
      setDocumentNo("");
      setBloodGroup("N/A");
      setRhType("N/A");
      setBloodCategory("N/A");
      setBottleRequired(0);
      setBottleUnitType("bag");
      setItems([]);
      setDiscount(0);
      setReceivedAmount(0);
      setTotalAmount(0);
      setSelectedItemIndex(null);
      setCurrentTestIndex(null);
      setSelectedPatient(null);
      setDocumentDate(new Date().toISOString().split('T')[0]);
      setPatientID("");
      setPatientName("");
      setPhoneNo("");
      setAge(null);
      setDob("");
      setReferences("");
      setHospital("");
      setGender("male");
      setExDonor("");
    };

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
      clearForm: clearForm
    }));

    // Add empty row when entering edit mode
    useEffect(() => {
      if (isEditable && items.length === 0) {
        const tempId = `temp-${Date.now()}`;
        const newItem: InvoiceItem = {
          id: tempId,
          testId: 0,
          testName: "",
          qty: 1,
          rate: 0,
          amount: 0
        };
        setItems([newItem]);
      }
    }, [isEditable]);

    // Auto-open document search modal when in edit mode - FIXED LOGIC
    useEffect(() => {
      if (isEditable && !!documentNo) {
        setIsDocumentSearchModalOpen(true);
      }
    }, [isEditable, documentNo]);

    const isAdding = !documentNo && isEditable;
    const isEditing = isEditable && !!documentNo;
    const shouldEnableEditing = isEditable && (patientType === "opd" || patientType === "regular");

    const handlePatientTypeChange = (value: string) => {
      setPatientType(value);
      setSelectedPatient(null);
      
      // Clear all patient data when type changes
      setPatientID("");
      setPatientName("");
      setPhoneNo("");
      setAge(null);
      setDob("");
      setReferences("");
      setHospital("");
      setGender("male");
      setExDonor("");
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

    const handleDeleteRow = (index: number) => {
      const newItems = [...items];
      newItems.splice(index, 1);
      setItems(newItems);
      if (selectedItemIndex === index) {
        setSelectedItemIndex(null);
      }
      calculateTotal(newItems);
    };

    const calculateTotal = (itemsArray: InvoiceItem[]) => {
      const sum = itemsArray.reduce((acc, item) => acc + item.amount, 0);
      setTotalAmount(sum - discount);
    };

    const handleDiscountChange = (newDiscount: number) => {
      setDiscount(newDiscount);
    };

    const discountCalc = totalAmount - receivedAmount >= 0 ? totalAmount - receivedAmount : 0;

    const handleReceivedAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value) || 0;
      setReceivedAmount(value);
    };

    const handleSelectRow = (index: number) => {
      setSelectedItemIndex(index);
    };

    const handleTestSelect = async (testId: number) => {
      try {
        const { data, error } = await supabase
          .from('test_information')
          .select(`
            id, 
            name, 
            price, 
            test_type,
            test_categories!inner(name)
          `)
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
            amount: data.price * updatedItems[currentTestIndex].qty,
            type: data.test_type,
            category: data.test_categories?.name
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

    const handlePatientSelect = async (patientDbId: string) => {
      try {
        const { data: patient, error } = await supabase
          .from('patients')
          .select('*')
          .eq('id', patientDbId)
          .single();
        
        if (error) throw error;
        
        if (patient) {
          setSelectedPatient(patient);
          setPatientID(patient.patient_id);
          setPatientName(patient.name);
          setPhoneNo(patient.phone || "");
          setAge(patient.age);
          setHospital(patient.hospital || "");
          setGender(patient.gender || "male");
          
          // Handle blood group parsing
          if (patient.blood_group) {
            const bloodGroupStr = patient.blood_group;
            if (bloodGroupStr.includes('+')) {
              const group = bloodGroupStr.replace('+', '');
              setBloodGroup(group);
              setRhType('+ve');
            } else if (bloodGroupStr.includes('-')) {
              const group = bloodGroupStr.replace('-', '');
              setBloodGroup(group);
              setRhType('-ve');
            } else {
              setBloodGroup(bloodGroupStr);
              setRhType('N/A');
            }
          }
          
          toast.success(`Patient ${patient.name} loaded successfully`);
        }
        
        setIsSearchModalOpen(false);
      } catch (error) {
        console.error("Error loading patient:", error);
        toast.error("Failed to load patient data");
      }
    };

    const handleDocumentSelect = async (docNum: string) => {
      try {
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
          
          // Set patient data from invoice
          setPatientID(invoiceData.patient_id || "");
          setPatientName(invoiceData.patient_name || "");
          setPhoneNo(invoiceData.phone_no || "");
          setAge(invoiceData.age || null);
          setDob(invoiceData.dob || "");
          setHospital(invoiceData.hospital_name || "");
          setGender(invoiceData.gender || "male");
          
          // Set blood details
          setBloodGroup(invoiceData.blood_group_separate || "N/A");
          setRhType(invoiceData.rh_factor || "N/A");
          setBloodCategory(invoiceData.blood_category || "N/A");
          setBottleRequired(invoiceData.bottle_quantity || 0);
          setBottleUnitType(invoiceData.bottle_unit || "bag");

          // Load invoice items with type and category
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
              amount: item.total_price,
              type: item.type,
              category: item.category
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
        
        // Validation: Check required fields
        if (!patientID.trim()) {
          toast.error("Patient ID is required");
          return { success: false, error: "Patient ID is required" };
        }
        
        if (!patientName.trim()) {
          toast.error("Patient name is required");
          return { success: false, error: "Patient name is required" };
        }
        
        if (items.length === 0) {
          toast.error("At least one test must be selected");
          return { success: false, error: "At least one test must be selected" };
        }

        // Generate document number only at the time of saving if it's a new document
        let finalDocumentNo = documentNo;
        if (!documentNo) {
          try {
            const { data, error } = await supabase.rpc('generate_invoice_number');
            if (error) throw error;
            finalDocumentNo = data;
            setDocumentNo(data);
          } catch (error) {
            console.error('Error generating document number:', error);
            const date = new Date();
            const year = date.getFullYear().toString().slice(-2);
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const sequence = "0001";
            finalDocumentNo = `${year}${month}${sequence}`;
            setDocumentNo(finalDocumentNo);
          }
        }

        // Simplified patient ID logic
        let finalPatientId = patientID; // Simply use the entered patient ID for both OPD and regular

        // Ensure numeric values are properly bounded for database
        const safeTotalAmount = Math.min(Math.max(totalAmount || 0, 0), 2147483647);
        const safeDiscount = Math.min(Math.max(discount || 0, 0), 2147483647);
        const safeReceivedAmount = Math.min(Math.max(receivedAmount || 0, 0), 2147483647);
        const safeBottleRequired = Math.min(Math.max(bottleRequired || 0, 0), 32767);
        const safeAge = age ? Math.min(Math.max(age, 0), 32767) : null;

        // Create invoice with safe numeric values
        let invoiceData, invoiceError;
        try {
          const resp = await supabase
            .from('patient_invoices')
            .insert({
              document_no: finalDocumentNo,
              document_date: documentDate,
              patient_id: finalPatientId, // Simply use the patient ID directly
              patient_type: patientType,
              patient_name: patientName,
              phone_no: phoneNo,
              age: safeAge,
              dob: dob || null,
              gender: gender,
              hospital_name: hospital,
              blood_group_separate: bloodGroup,
              rh_factor: rhType,
              blood_category: bloodCategory,
              bottle_quantity: safeBottleRequired,
              bottle_unit: bottleUnitType,
              ex_donor: exDonor,
              reference_notes: references,
              total_amount: safeTotalAmount,
              discount_amount: safeDiscount,
              amount_received: safeReceivedAmount
            })
            .select('id')
            .maybeSingle();
          invoiceData = resp.data;
          invoiceError = resp.error;
        } catch (err) {
          invoiceError = err;
        }

        if (invoiceError) {
          console.error("Error inserting invoice:", invoiceError);
          if (invoiceError.code === '23505') {
            toast.error("Duplicate document number, please refresh and try again.");
          } else {
            toast.error(`Failed to save invoice: ${invoiceError.message || invoiceError.toString()}`);
          }
          return { success: false, error: invoiceError };
        }

        // Create invoice items with safe numeric values
        if (items.length > 0 && invoiceData?.id) {
          const invoiceItems = items.map(item => ({
            invoice_id: invoiceData.id,
            test_id: item.testId || null,
            test_name: item.testName,
            quantity: Math.min(Math.max(item.qty || 1, 1), 32767),
            unit_price: Math.min(Math.max(item.rate || 0, 0), 999999.99),
            total_price: Math.min(Math.max(item.amount || 0, 0), 999999.99),
            type: item.type ?? null,
            category: item.category ?? null
          }));

          const { error: itemsError } = await supabase
            .from('invoice_items')
            .insert(invoiceItems);

          if (itemsError) {
            console.error("Error saving invoice items:", itemsError);
            toast.error("Failed to save invoice items. " + (itemsError.message || itemsError.toString()));
            return { success: false, error: itemsError };
          }
        }

        toast.success("Invoice saved successfully");
        return { success: true, invoiceId: invoiceData?.id };
      } catch (error) {
        console.error("Error saving invoice (catch):", error);
        toast.error("Failed to save invoice: " + (error as any)?.message);
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
          isEditing={isEditing}
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
          onDeleteRow={isEditable ? handleDeleteRow : undefined}
        />

        <TotalSection
          totalAmount={totalAmount}
          receivedAmount={receivedAmount}
          isEditable={isEditable}
          onReceivedAmountChange={handleReceivedAmountChange}
          onDiscountChange={handleDiscountChange}
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
