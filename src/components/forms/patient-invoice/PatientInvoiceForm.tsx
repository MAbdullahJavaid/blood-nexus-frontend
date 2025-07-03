
import { forwardRef, useEffect, useImperativeHandle } from "react";
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
import { usePatientInvoiceState } from "./hooks/usePatientInvoiceState";
import { usePatientHandlers } from "./hooks/usePatientHandlers";
import { useInvoiceHandlers } from "./hooks/useInvoiceHandlers";
import { useDocumentHandlers } from "./hooks/useDocumentHandlers";
import { useSaveInvoice } from "./hooks/useSaveInvoice";
import { supabase } from "@/integrations/supabase/client";

const PatientInvoiceForm = forwardRef<FormRefObject, PatientInvoiceFormProps>(
  ({ isSearchEnabled = false, isEditable = false }, ref) => {
    const state = usePatientInvoiceState();
    const {
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
    } = state;

    const patientHandlers = usePatientHandlers(
      patientType,
      setRegularPatient,
      setBloodGroup,
      setRhType,
      setIsSearchModalOpen,
      opdPatientData,
      setOpdPatientData
    );

    const invoiceHandlers = useInvoiceHandlers(
      items,
      setItems,
      setTotalAmount,
      setDiscount,
      receivedAmount,
      setSelectedItemIndex,
      selectedItemIndex,
      setCurrentTestIndex,
      setIsTestSearchModalOpen
    );

    const documentHandlers = useDocumentHandlers(
      setDocumentNo,
      setDocumentDate,
      setTotalAmount,
      setDiscount,
      setReceivedAmount,
      setReferences,
      setExDonor,
      setPatientType,
      setBloodGroup,
      setRhType,
      setBloodCategory,
      setBottleRequired,
      setBottleUnitType,
      setRegularPatient,
      setOpdPatientData,
      setItems,
      setIsDocumentSearchModalOpen
    );

    const { handleSave: saveInvoice } = useSaveInvoice();

    // Determine the states for adding vs editing
    const isAdding = isEditable && !documentNo;
    const isEditing = isEditable && !!documentNo;

    useImperativeHandle(ref, () => ({
      handleAddItem: () => {
        invoiceHandlers.handleAddItem();
      },
      handleDeleteItem: () => {
        invoiceHandlers.handleDeleteItem();
      },
      handleSave: async () => {
        return await saveInvoice(
          patientType,
          regularPatient,
          opdPatientData,
          documentNo,
          documentDate,
          totalAmount,
          bloodGroup,
          rhType,
          bloodCategory,
          bottleRequired,
          bottleUnitType,
          exDonor,
          references,
          discount,
          receivedAmount,
          items,
          setLoading
        );
      },
      handleDelete: async () => {
        if (!documentNo) {
          return { success: false, error: "No document to delete" };
        }
        
        try {
          setLoading(true);
          
          // Delete invoice items first
          const { error: itemsError } = await supabase
            .from('invoice_items')
            .delete()
            .eq('invoice_id', documentNo);
          
          if (itemsError) {
            console.error("Error deleting invoice items:", itemsError);
            return { success: false, error: itemsError.message };
          }
          
          // Delete the invoice
          const { error: invoiceError } = await supabase
            .from('patient_invoices')
            .delete()
            .eq('document_no', documentNo);
          
          if (invoiceError) {
            console.error("Error deleting invoice:", invoiceError);
            return { success: false, error: invoiceError.message };
          }
          
          return { success: true };
        } catch (error) {
          console.error("Error deleting invoice:", error);
          return { success: false, error: (error as any)?.message || "Unknown error" };
        } finally {
          setLoading(false);
        }
      },
      clearForm: () => {
        // Clear all form data
        setPatientType("regular");
        setDocumentNo("");
        setBloodGroup("N/A");
        setRhType("N/A");
        setBloodCategory("N/A");
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
      if (isAdding) {
        documentHandlers.generateDocumentNo();
      }
    }, [isAdding]);

    // Auto-open document search modal when in editing mode
    useEffect(() => {
      if (isEditing) {
        setIsDocumentSearchModalOpen(true);
      }
    }, [isEditing]);
    
    const shouldEnableEditing = isEditable && (patientType === "opd" || patientType === "regular");
    
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

    const handleReceivedAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value) || 0;
      setReceivedAmount(value);
    };

    const handleDiscountChange = (newDiscount: number) => {
      setDiscount(newDiscount);
    };

    const handleSelectRow = (index: number) => {
      setSelectedItemIndex(index);
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
      if (patientType === "opd") {
        patientHandlers.handleOpdPatientChange('dob', date);
        if (date) {
          const dobDate = new Date(date);
          const today = new Date();
          let age = today.getFullYear() - dobDate.getFullYear();
          const monthDiff = today.getMonth() - dobDate.getMonth();
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
            age--;
          }
          patientHandlers.handleOpdPatientChange('age', age);
        } else {
          patientHandlers.handleOpdPatientChange('age', null);
        }
      }
    };

    const handleAgeChange = (ageValue: number | null) => {
      if (patientType === "opd") {
        patientHandlers.handleOpdPatientChange('age', ageValue);
        if (ageValue !== null) {
          const today = new Date();
          const birthYear = today.getFullYear() - ageValue;
          const birthDate = new Date(birthYear, today.getMonth(), today.getDate());
          patientHandlers.handleOpdPatientChange('dob', birthDate.toISOString().split('T')[0]);
        } else {
          patientHandlers.handleOpdPatientChange('dob', "");
        }
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
          isEditing={isEditing}
          onPatientTypeChange={patientHandlers.handlePatientTypeChange}
          onSearchPatientClick={handleSearchPatient}
          onSearchDocumentClick={() => setIsDocumentSearchModalOpen(true)}
          patientName={currentPatientData.name}
          setPatientName={(value) => {
            if (patientType === "opd") {
              patientHandlers.handleOpdPatientChange('name', value);
            }
          }}
          documentDate={documentDate}
          setDocumentDate={setDocumentDate}
          shouldEnableEditing={shouldEnableEditing}
          setDocumentNo={setDocumentNo}
          patientID={currentPatientData.patientId}
          setPatientId={(value) => {
            if (patientType === "opd") {
              patientHandlers.handleOpdPatientChange('patientId', value);
            }
          }}
        />

        <HospitalDetailsSection
          selectedPatient={regularPatient}
          isEditable={isEditable}
          hospital={currentPatientData.hospital}
          setHospital={(value) => {
            if (patientType === "opd") {
              patientHandlers.handleOpdPatientChange('hospital', value);
            }
          }}
          gender={currentPatientData.gender}
          setGender={(value) => {
            if (patientType === "opd") {
              patientHandlers.handleOpdPatientChange('gender', value);
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
              patientHandlers.handleOpdPatientChange('phone', value);
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
              patientHandlers.handleOpdPatientChange('bloodGroup', value);
            }
          }}
          onRhTypeChange={(value) => {
            setRhType(value);
            if (patientType === "opd") {
              patientHandlers.handleOpdPatientChange('rhType', value);
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
          onQuantityChange={invoiceHandlers.handleQuantityChange}
          onRateChange={invoiceHandlers.handleRateChange}
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
            onPatientSelect={patientHandlers.handlePatientSelect}
          />
        )}

        <TestSearchModal
          isOpen={isTestSearchModalOpen}
          onOpenChange={setIsTestSearchModalOpen}
          onTestSelect={invoiceHandlers.handleTestSelect}
        />

        <DocumentSearchModal
          isOpen={isDocumentSearchModalOpen}
          onOpenChange={setIsDocumentSearchModalOpen}
          onDocumentSelect={documentHandlers.handleDocumentSelect}
        />
      </div>
    );
  }
);

PatientInvoiceForm.displayName = "PatientInvoiceForm";

export default PatientInvoiceForm;
