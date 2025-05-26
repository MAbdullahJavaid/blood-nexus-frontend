
import { forwardRef, useImperativeHandle, useState } from "react";
import { PatientInvoiceFormProps, FormRefObject } from "./types";
import { PatientSearchModal } from "./PatientSearchModal";
import { TestSearchModal } from "./TestSearchModal";
import { DocumentSearchModal } from "./DocumentSearchModal";
import { PatientDetailsSection } from "./PatientDetailsSection";
import { HospitalDetailsSection } from "./HospitalDetailsSection";
import { PatientInfoSection } from "./PatientInfoSection";
import { BloodDetailsSection } from "./BloodDetailsSection";
import { TestsSection } from "./TestsSection";
import { TotalSection } from "./TotalSection";
import { usePatientInvoiceForm } from "./hooks/usePatientInvoiceForm";

const PatientInvoiceFormLogic = forwardRef<FormRefObject, PatientInvoiceFormProps>(
  ({ isSearchEnabled = false, isEditable = false }, ref) => {
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [isTestSearchModalOpen, setIsTestSearchModalOpen] = useState(false);
    const [isDocumentSearchModalOpen, setIsDocumentSearchModalOpen] = useState(false);

    const form = usePatientInvoiceForm(isEditable);

    // Expose methods to parent component via ref
    useImperativeHandle(ref, () => ({
      handleAddItem: form.handleAddItem,
      handleDeleteItem: form.handleDeleteItem,
      handleSave: form.handleSave
    }));

    return (
      <div className="bg-white p-4 rounded-md">
        <PatientDetailsSection
          patientType={form.patientType}
          documentNo={form.invoiceGeneration.documentNo}
          selectedPatient={form.patientHandling.selectedPatient}
          isEditable={isEditable}
          isAdding={form.invoiceGeneration.isAdding}
          onPatientTypeChange={form.handlePatientTypeChange}
          onSearchPatientClick={() => setIsSearchModalOpen(true)}
          onSearchDocumentClick={() => setIsDocumentSearchModalOpen(true)}
          patientName={form.patientHandling.patientName}
          setPatientName={form.patientHandling.setPatientName}
          documentDate={form.documentDate}
          setDocumentDate={form.setDocumentDate}
          shouldEnableEditing={form.shouldEnableEditing}
          patientID={form.patientID}
          patientPrefix={form.patientPrefix}
          setPatientPrefix={form.setPatientPrefix}
          setPatientId={form.setPatientID}
        />

        <HospitalDetailsSection
          selectedPatient={form.patientHandling.selectedPatient}
          isEditable={isEditable}
          hospital={form.patientHandling.hospital}
          setHospital={form.patientHandling.setHospital}
          gender={form.patientHandling.gender}
          setGender={form.patientHandling.setGender}
          exDonor={form.patientHandling.exDonor}
          setExDonor={form.patientHandling.setExDonor}
          shouldEnableEditing={form.shouldEnableEditing}
        />

        <PatientInfoSection
          selectedPatient={form.patientHandling.selectedPatient}
          isEditable={isEditable}
          phoneNo={form.patientHandling.phoneNo}
          setPhoneNo={form.patientHandling.setPhoneNo}
          age={form.patientHandling.age}
          setAge={form.patientHandling.setAge}
          dob={form.patientHandling.dob}
          setDob={form.patientHandling.setDob}
          references={form.patientHandling.references}
          setReferences={form.patientHandling.setReferences}
          shouldEnableEditing={form.shouldEnableEditing}
        />

        <BloodDetailsSection
          bloodGroup={form.bloodGroup}
          rhType={form.rhType}
          bloodCategory={form.bloodCategory}
          bottleRequired={form.bottleRequired}
          bottleUnitType={form.bottleUnitType}
          isEditable={isEditable}
          onBloodGroupChange={form.setBloodGroup}
          onRhTypeChange={form.setRhType}
          onBloodCategoryChange={form.setBloodCategory}
          onBottleRequiredChange={form.setBottleRequired}
          onBottleUnitTypeChange={form.setBottleUnitType}
        />

        <TestsSection
          items={form.testHandling.items}
          selectedItemIndex={form.testHandling.selectedItemIndex}
          isEditable={isEditable}
          onSelectRow={form.testHandling.setSelectedItemIndex}
          onSearchTest={(index) => {
            form.testHandling.setCurrentTestIndex(index);
            setIsTestSearchModalOpen(true);
          }}
          onQuantityChange={form.handleQuantityChange}
          onRateChange={form.handleRateChange}
        />

        <TotalSection
          discount={form.discount}
          totalAmount={form.totalAmount}
          receivedAmount={form.receivedAmount}
          isEditable={isEditable}
          onDiscountChange={form.handleDiscountChange}
          onReceivedAmountChange={form.handleReceivedAmountChange}
        />

        <PatientSearchModal
          isOpen={isSearchModalOpen}
          onOpenChange={setIsSearchModalOpen}
          onPatientSelect={(patientId) => {
            form.patientHandling.handlePatientSelect(patientId);
            setIsSearchModalOpen(false);
          }}
        />

        <TestSearchModal
          isOpen={isTestSearchModalOpen}
          onOpenChange={setIsTestSearchModalOpen}
          onTestSelect={(testId) => {
            form.handleTestSelect(testId);
            setIsTestSearchModalOpen(false);
          }}
        />

        <DocumentSearchModal
          isOpen={isDocumentSearchModalOpen}
          onOpenChange={setIsDocumentSearchModalOpen}
          onDocumentSelect={(docNum) => {
            form.handleDocumentSelect(docNum);
            setIsDocumentSearchModalOpen(false);
          }}
        />
      </div>
    );
  }
);

PatientInvoiceFormLogic.displayName = "PatientInvoiceFormLogic";

export default PatientInvoiceFormLogic;
