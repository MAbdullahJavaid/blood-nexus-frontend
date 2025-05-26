import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { PatientInvoiceFormProps, FormRefObject, InvoiceItem } from "./types";
import { mockPatients, mockInvoices } from "./mock-data";
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
    const [patientID,setPatientId]=useState<any>('')
    const [documentNo, setDocumentNo] = useState<string>("");
    const [bloodCategory, setBloodCategory] = useState<string>("FWB");
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

    // Expose methods to parent component via ref
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

    // Generate document number on component mount
    useEffect(() => {
      if (isEditable && isAdding) {
        generateDocumentNo();
      }
    }, [isEditable]);

    const isAdding = !documentNo;

    // Enable editing based on patient type
    const shouldEnableEditing = isEditable && (patientType === "opd" || patientType === "regular");
    
    const generateDocumentNo = () => {
      const date = new Date();
      const year = date.getFullYear().toString().slice(-2);
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      // In a real application, you would fetch the latest sequence from backend
      const sequence = "0001"; // This would be dynamic based on existing invoices
      
      setDocumentNo(`${year}${month}${sequence}`);
    };

    // Handle date of birth change and calculate age
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

    // Handle age change and calculate DOB
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

    const handlePatientTypeChange = (value: string) => {
      setPatientType(value);
      setSelectedPatient(null);
      
      // Reset patient data fields when type changes
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
      // Add an empty row with a unique temporary ID
      const tempId = `temp-${items.length}`;
      const newItem: InvoiceItem = {
        id: tempId,
        testId: 0, // Use numeric ID
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
      setTotalAmount(sum - discount);
    };

    const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value) || 0;
      setDiscount(value);
      setTotalAmount(items.reduce((acc, item) => acc + item.amount, 0) - value);
    };

    const handleReceivedAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value) || 0;
      setReceivedAmount(value);
    };

    const handleSelectRow = (index: number) => {
      setSelectedItemIndex(index);
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

    const handlePatientSelect = (patientId: string) => {
      const patient = mockPatients.find(p => p.id === patientId);
      setSelectedPatient(patient);
      
      // Update form fields with patient data
      if (patient) {
        setPatientName(patient.name);
        setPhoneNo(patient.phoneNo || "");
        setAge(patient.age);
        setHospital(patient.hospital || "");
        setGender(patient.gender || "male");
      }
      
      setIsSearchModalOpen(false);
    };

    const handleDocumentSelect = (docNum: string) => {
      const invoice = mockInvoices.find(inv => inv.documentNo === docNum);
      if (invoice) {
        setDocumentNo(invoice.documentNo);
        // In a real application, you would load the full invoice data here
        const patient = mockPatients.find(p => p.id === invoice.patientId);
        setSelectedPatient(patient);
      }
      setIsDocumentSearchModalOpen(false);
    };

    const handleSearchTest = (index: number) => {
      setCurrentTestIndex(index);
      setIsTestSearchModalOpen(true);
    };

    const handleSave = async () => {
      try {
        setLoading(true);
        
        // Create patient if OPD type or use selected patient for regular
        let patientId: string;
        
        if (patientType === "opd") {
          // Create a new patient for OPD
          const { data: patientData, error: patientError } = await supabase
            .from('patients')
            .insert({
              patient_id: documentNo, // Using document number as patient ID for OPD
              name: patientName,
              phone: phoneNo,
              date_of_birth: dob || null,
              gender: gender,
              blood_group: "O+" // Default blood group for OPD patients
            })
            .select('id')
            .single();
            
          if (patientError) throw patientError;
          patientId = patientData.id;
        } else {
          // Use selected patient ID for regular patients
          if (!selectedPatient?.id) {
            throw new Error("No patient selected");
          }
          patientId = selectedPatient.id;
        }
        
        // Create invoice
        const { data: invoiceData, error: invoiceError } = await supabase
          .from('patient_invoices')
          .insert({
            invoice_number: documentNo,
            invoice_date: documentDate,
            patient_id: patientId,
            total_amount: totalAmount,
            remarks: bloodCategory + " - " + bottleUnitType + " - " + references, // Storing additional info in remarks
            status: receivedAmount >= totalAmount ? "Paid" : "Pending"
          })
          .select('id')
          .single();
          
        if (invoiceError) throw invoiceError;
        
        // Create invoice items - convert testId to string for storage
        const invoiceItems = items.map(item => ({
          invoice_id: invoiceData.id,
          item_id: item.testId.toString(), // Convert to string as item_id is text in the database
          item_type: "test",
          quantity: item.qty,
          unit_price: item.rate,
          total_price: item.amount
        }));
        
        // Insert all invoice items
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
          onSearchPatientClick={() => setIsSearchModalOpen(true)}
          onSearchDocumentClick={() => setIsDocumentSearchModalOpen(true)}
          patientName={patientName}
          setPatientName={setPatientName}
          documentDate={documentDate}
          setDocumentDate={setDocumentDate}
          shouldEnableEditing={shouldEnableEditing}
          patientID={patientID}
          setPatientId={setPatientId}
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
          bloodCategory={bloodCategory}
          bottleUnitType={bottleUnitType}
          isEditable={isEditable}
          onBloodCategoryChange={setBloodCategory}
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
