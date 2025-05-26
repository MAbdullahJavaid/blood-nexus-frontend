
import { useState } from "react";
import { mockInvoices, mockPatients } from "../mock-data";
import { useInvoiceGeneration } from "./useInvoiceGeneration";
import { usePatientHandling } from "./usePatientHandling";
import { useTestHandling } from "./useTestHandling";
import { useInvoiceSave } from "./useInvoiceSave";

export function usePatientInvoiceForm(isEditable: boolean) {
  const [patientType, setPatientType] = useState<string>("regular");
  const [bloodGroup, setBloodGroup] = useState<string>("N/A");
  const [rhType, setRhType] = useState<string>("N/A");
  const [bloodCategory, setBloodCategory] = useState<string>("FWB");
  const [bottleRequired, setBottleRequired] = useState<number>(1);
  const [bottleUnitType, setBottleUnitType] = useState<string>("bag");
  const [discount, setDiscount] = useState<number>(0);
  const [receivedAmount, setReceivedAmount] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [documentDate, setDocumentDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [patientID, setPatientID] = useState<string>("");

  const invoiceGeneration = useInvoiceGeneration(isEditable);
  const patientHandling = usePatientHandling();
  const testHandling = useTestHandling();
  const invoiceSave = useInvoiceSave();

  const shouldEnableEditing = isEditable && (patientType === "opd" || patientType === "regular");

  const calculateTotal = (itemsArray: any[]) => {
    const sum = itemsArray.reduce((acc, item) => acc + item.amount, 0);
    setTotalAmount(sum - discount);
  };

  const handlePatientTypeChange = (value: string) => {
    setPatientType(value);
    patientHandling.resetPatientData();
    setPatientID("");
  };

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setDiscount(value);
    setTotalAmount(testHandling.items.reduce((acc, item) => acc + item.amount, 0) - value);
  };

  const handleReceivedAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setReceivedAmount(value);
  };

  const handleDocumentSelect = (docNum: string) => {
    const invoice = mockInvoices.find(inv => inv.documentNo === docNum);
    if (invoice) {
      invoiceGeneration.setDocumentNo(invoice.documentNo);
      const patient = mockPatients.find(p => p.id === invoice.patientId);
      
      if (patient) {
        patientHandling.handlePatientSelect(patient.id);
      }
    }
  };

  const handleAddItem = () => {
    testHandling.handleAddItem();
  };

  const handleDeleteItem = () => {
    const newItems = testHandling.handleDeleteItem();
    calculateTotal(newItems);
  };

  const handleQuantityChange = (index: number, value: number) => {
    const updatedItems = testHandling.handleQuantityChange(index, value);
    calculateTotal(updatedItems);
  };
  
  const handleRateChange = (index: number, value: number) => {
    const updatedItems = testHandling.handleRateChange(index, value);
    calculateTotal(updatedItems);
  };

  const handleTestSelect = async (testId: number) => {
    const updatedItems = await testHandling.handleTestSelect(testId);
    calculateTotal(updatedItems);
  };

  const handleSave = async () => {
    return await invoiceSave.handleSave({
      documentNo: invoiceGeneration.documentNo,
      documentDate,
      patientType,
      patientName: patientHandling.patientName,
      phoneNo: patientHandling.phoneNo,
      dob: patientHandling.dob,
      gender: patientHandling.gender,
      bloodGroup,
      hospital: patientHandling.hospital,
      age: patientHandling.age,
      selectedPatient: patientHandling.selectedPatient,
      totalAmount,
      rhType,
      bloodCategory,
      bottleRequired,
      bottleUnitType,
      exDonor: patientHandling.exDonor,
      references: patientHandling.references,
      discount,
      receivedAmount,
      items: testHandling.items,
      patientID
    });
  };

  return {
    // States
    patientType,
    bloodGroup,
    rhType,
    bloodCategory,
    bottleRequired,
    bottleUnitType,
    discount,
    receivedAmount,
    totalAmount,
    documentDate,
    shouldEnableEditing,
    patientID,
    
    // Handlers
    setBloodGroup,
    setRhType,
    setBloodCategory,
    setBottleRequired,
    setBottleUnitType,
    setDocumentDate,
    setPatientID,
    handlePatientTypeChange,
    handleDiscountChange,
    handleReceivedAmountChange,
    handleDocumentSelect,
    handleAddItem,
    handleDeleteItem,
    handleQuantityChange,
    handleRateChange,
    handleTestSelect,
    handleSave,
    
    // Sub-hooks
    invoiceGeneration,
    patientHandling,
    testHandling,
    invoiceSave
  };
}
