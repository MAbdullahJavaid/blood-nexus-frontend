
import { useState } from "react";
import { mockPatients } from "../mock-data";

export function usePatientHandling() {
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [patientName, setPatientName] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [age, setAge] = useState<number | null>(null);
  const [dob, setDob] = useState<string>("");
  const [references, setReferences] = useState("");
  const [hospital, setHospital] = useState("");
  const [gender, setGender] = useState("male");
  const [exDonor, setExDonor] = useState("");

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

  const handlePatientSelect = (patientId: string) => {
    const patient = mockPatients.find(p => p.id === patientId);
    setSelectedPatient(patient);
    
    if (patient) {
      setPatientName(patient.name);
      setPhoneNo(patient.phoneNo || "");
      setAge(patient.age);
      setHospital(patient.hospital || "");
      setGender(patient.gender || "male");
    }
  };

  const resetPatientData = () => {
    setSelectedPatient(null);
    setPatientName("");
    setPhoneNo("");
    setAge(null);
    setDob("");
    setReferences("");
    setHospital("");
    setGender("male");
    setExDonor("");
  };

  return {
    selectedPatient,
    patientName,
    setPatientName,
    phoneNo,
    setPhoneNo,
    age,
    setAge: handleAgeChange,
    dob,
    setDob: handleDobChange,
    references,
    setReferences,
    hospital,
    setHospital,
    gender,
    setGender,
    exDonor,
    setExDonor,
    handlePatientSelect,
    resetPatientData
  };
}
