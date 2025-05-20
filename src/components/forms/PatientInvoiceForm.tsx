
import { forwardRef, useState, useEffect, useImperativeHandle } from "react";
import { PatientInvoiceFormProps, FormRefObject, InvoiceItem } from "./patient-invoice/types";
import { mockPatients, mockTests, mockInvoices } from "./patient-invoice/mock-data";
import { PatientSearchModal } from "./patient-invoice/PatientSearchModal";
import { TestSearchModal } from "./patient-invoice/TestSearchModal";
import { DocumentSearchModal } from "./patient-invoice/DocumentSearchModal";
import { PatientDetailsSection } from "./patient-invoice/PatientDetailsSection";
import { HospitalDetailsSection } from "./patient-invoice/HospitalDetailsSection";
import { PatientInfoSection } from "./patient-invoice/PatientInfoSection";
import { BloodDetailsSection } from "./patient-invoice/BloodDetailsSection";
import { TestsSection } from "./patient-invoice/TestsSection";
import { TotalSection } from "./patient-invoice/TotalSection";

const PatientInvoiceForm = forwardRef<FormRefObject, PatientInvoiceFormProps>(
  ({ isSearchEnabled = false, isEditable = false }, ref) => {
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [isTestSearchModalOpen, setIsTestSearchModalOpen] = useState(false);
    const [isDocumentSearchModalOpen, setIsDocumentSearchModalOpen] = useState(false);
    const [patientType, setPatientType] = useState<string>("regular");
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

    // Expose methods to parent component via ref
    useImperativeHandle(ref, () => ({
      handleAddItem: () => {
        handleAddItem();
      },
      handleDeleteItem: () => {
        handleDeleteItem();
      }
    }));

    // Generate document number on component mount
    useEffect(() => {
      if (isEditable && isAdding) {
        generateDocumentNo();
      }
    }, [isEditable]);

    const isAdding = !documentNo;
    
    const generateDocumentNo = () => {
      const date = new Date();
      const year = date.getFullYear().toString().slice(-2);
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      // In a real application, you would fetch the latest sequence from backend
      const sequence = "0001"; // This would be dynamic based on existing invoices
      
      setDocumentNo(`${year}${month}${sequence}`);
    };

    const handlePatientTypeChange = (value: string) => {
      setPatientType(value);
      setSelectedPatient(null);
      // Reset patient data if type changes
    };

    const handleAddItem = () => {
      // Add an empty row with a unique temporary ID
      const tempId = `temp-${items.length}`;
      const newItem: InvoiceItem = {
        id: tempId,
        testId: "",
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

    const handleTestSelect = (testId: string) => {
      const test = mockTests.find(t => t.id === testId);
      
      if (test && currentTestIndex !== null) {
        const updatedItems = [...items];
        updatedItems[currentTestIndex] = {
          ...updatedItems[currentTestIndex],
          testId: test.id,
          testName: test.name,
          rate: test.rate,
          amount: test.rate * updatedItems[currentTestIndex].qty
        };
        
        setItems(updatedItems);
        calculateTotal(updatedItems);
        setIsTestSearchModalOpen(false);
        setCurrentTestIndex(null);
      }
    };

    const handlePatientSelect = (patientId: string) => {
      const patient = mockPatients.find(p => p.id === patientId);
      setSelectedPatient(patient);
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

    const handleSearchPatient = () => {
      setIsSearchModalOpen(true);
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
        />

        <HospitalDetailsSection
          selectedPatient={selectedPatient}
          isEditable={isEditable}
        />

        <PatientInfoSection
          selectedPatient={selectedPatient}
          isEditable={isEditable}
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
