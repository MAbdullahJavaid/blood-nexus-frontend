
import { useState } from "react";
import { Patient, InvoiceItem } from "../types";

export const usePatientInvoiceState = () => {
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

  return {
    isSearchModalOpen,
    setIsSearchModalOpen,
    isTestSearchModalOpen,
    setIsTestSearchModalOpen,
    isDocumentSearchModalOpen,
    setIsDocumentSearchModalOpen,
    patientType,
    setPatientType,
    documentNo,
    setDocumentNo,
    bloodGroup,
    setBloodGroup,
    rhType,
    setRhType,
    bloodCategory,
    setBloodCategory,
    bottleRequired,
    setBottleRequired,
    bottleUnitType,
    setBottleUnitType,
    items,
    setItems,
    discount,
    setDiscount,
    receivedAmount,
    setReceivedAmount,
    totalAmount,
    setTotalAmount,
    selectedItemIndex,
    setSelectedItemIndex,
    currentTestIndex,
    setCurrentTestIndex,
    regularPatient,
    setRegularPatient,
    opdPatientData,
    setOpdPatientData,
    documentDate,
    setDocumentDate,
    loading,
    setLoading,
    references,
    setReferences,
    exDonor,
    setExDonor
  };
};
