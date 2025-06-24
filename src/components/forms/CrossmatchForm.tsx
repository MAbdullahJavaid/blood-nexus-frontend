
import React, { forwardRef, useImperativeHandle } from "react";
import { useCrossmatchData } from "./crossmatch/hooks/useCrossmatchData";
import CrossmatchFormHeader from "./crossmatch/CrossmatchFormHeader";
import PatientInfoSection from "./crossmatch/PatientInfoSection";
import DonorInfoTable from "./crossmatch/DonorInfoTable";
import TestResultsSection from "./crossmatch/TestResultsSection";
import SearchModals from "./crossmatch/SearchModals";

interface CrossmatchFormProps {
  isSearchEnabled?: boolean;
  isEditable?: boolean;
}

interface CrossmatchFormRef {
  clearForm: () => void;
  handleSave?: () => Promise<{success: boolean, error?: any}>;
  getFormData?: () => any;
}

const CrossmatchForm = forwardRef<CrossmatchFormRef, CrossmatchFormProps>(
  ({ isSearchEnabled = false, isEditable = false }, ref) => {
    const {
      formData,
      setFormData,
      isPatientSearchOpen,
      setIsPatientSearchOpen,
      isDonorSearchOpen, 
      setIsDonorSearchOpen,
      isCrossmatchSearchOpen,
      setIsCrossmatchSearchOpen,
      handlePatientSelect,
      handleDonorSelect,
      handleCrossmatchSelect,
      handleSubmit,
      clearForm
    } = useCrossmatchData();

    useImperativeHandle(ref, () => ({
      clearForm,
      handleSave: async () => {
        try {
          await handleSubmit();
          return { success: true };
        } catch (error) {
          console.error("Error saving crossmatch record:", error);
          return { success: false, error };
        }
      },
      getFormData: () => {
        return {
          crossmatchNo: formData.crossmatchNo,
          patientName: formData.patientName,
          age: formData.age,
          bloodGroup: formData.bloodGroup,
          rh: formData.rh,
          hospital: formData.hospital,
          date: formData.date,
          quantity: formData.quantity,
          albumin: formData.albumin,
          saline: formData.saline,
          coomb: formData.coomb,
          result: formData.result,
          remarks: formData.remarks,
          expiryDate: formData.expiryDate,
          bagId: formData.bagId,
          donor: formData.donor ? {
            name: formData.donor.name,
            age: formData.donor.age,
            blood_group: formData.donor.blood_group,
            rh_factor: formData.donor.rh_factor,
            bleeding_date: formData.donor.bleeding_date,
            hbsag: formData.donor.hbsag,
            hcv: formData.donor.hcv,
            hiv: formData.donor.hiv,
            vdrl: formData.donor.vdrl,
            hb: formData.donor.hb
          } : null
        };
      }
    }));

    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <CrossmatchFormHeader 
          crossmatchNo={formData.crossmatchNo}
          setCrossmatchNo={(value) => setFormData(prev => ({ ...prev, crossmatchNo: value }))}
          isEditable={isEditable}
          onSearchClick={() => setIsCrossmatchSearchOpen(true)}
        />

        <PatientInfoSection
          formData={formData}
          setFormData={setFormData}
          isEditable={isEditable}
          onSearchClick={() => setIsPatientSearchOpen(true)}
        />

        <DonorInfoTable
          donor={formData.donor}
          bagId={formData.bagId}
          setBagId={(value) => setFormData(prev => ({ ...prev, bagId: value }))}
          isEditable={isEditable}
          onSearchClick={() => setIsDonorSearchOpen(true)}
        />

        <TestResultsSection
          formData={formData}
          setFormData={setFormData}
          isEditable={isEditable}
        />

        <SearchModals
          isPatientSearchOpen={isPatientSearchOpen}
          setIsPatientSearchOpen={setIsPatientSearchOpen}
          isDonorSearchOpen={isDonorSearchOpen}
          setIsDonorSearchOpen={setIsDonorSearchOpen}
          isCrossmatchSearchOpen={isCrossmatchSearchOpen}
          setIsCrossmatchSearchOpen={setIsCrossmatchSearchOpen}
          onPatientSelect={handlePatientSelect}
          onDonorSelect={handleDonorSelect}
          onCrossmatchSelect={handleCrossmatchSelect}
        />
      </div>
    );
  }
);

CrossmatchForm.displayName = "CrossmatchForm";

export default CrossmatchForm;
