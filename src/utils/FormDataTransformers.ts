
import { ReportType } from "@/components/reports/PrintReportModal";

// Transform bleeding form data to donor screening report format
export const transformBleedingFormToReport = (formData: any) => {
  return {
    donor_id: formData.donor?.donor_id || '',
    name: formData.donor?.name || '',
    blood_group: formData.donor?.blood_group || '',
    bleeding_date: formData.bleedingDate || new Date().toISOString().split('T')[0],
    hbsag: formData.hbsag || 0,
    hcv: formData.hcv || 0,
    hiv: formData.hiv || 0,
    vdrl: formData.vdrl || 0,
    hb: formData.hb || '',
    bag_id: formData.bagId || '',
    technician: formData.technician || '',
    remarks: formData.remarks || '',
  };
};

// Transform crossmatch form data to crossmatch report format
export const transformCrossmatchFormToReport = (formData: any) => {
  return {
    crossmatch_no: formData.crossmatchNo || '',
    patient_name: formData.patientName || '',
    age: formData.age || 0,
    blood_group: formData.bloodGroup || '',
    rh: formData.rh || '',
    hospital: formData.hospital || '',
    date: formData.date || new Date().toISOString().split('T')[0],
    quantity: formData.quantity || 1,
    albumin: formData.albumin || 'negative',
    saline: formData.saline || 'negative',
    coomb: formData.coomb || 'negative',
    result: formData.result || 'compatible',
    remarks: formData.remarks || 'Donor red cells are compatible with patient Serum/Plasma. Donor ELISA screening is negative and blood is ready for transfusion.',
    expiry_date: formData.expiryDate || '',
    // Add donor information if available
    donor_name: formData.donor?.name || '',
    donor_age: formData.donor?.age || 0,
    donor_blood_group: formData.donor?.blood_group || '',
    donor_rh: formData.donor?.rh_factor || '',
    bag_id: formData.bagId || '',
    bleeding_date: formData.donor?.bleeding_date || '',
    hbsag: formData.donor?.hbsag || 0,
    hcv: formData.donor?.hcv || 0,
    hiv: formData.donor?.hiv || 0,
    vdrl: formData.donor?.vdrl || 0,
    hb: formData.donor?.hb || 0,
  };
};

// Transform patient invoice form data to patient request summary format
export const transformPatientInvoiceFormToReport = (formData: any) => {
  return {
    document_no: formData.documentNo || '',
    document_date: formData.documentDate || new Date().toISOString().split('T')[0],
    patient_id: formData.patientId || null,
    patient_name: formData.patientName || '',
    total_amount: formData.totalAmount || 0,
    discount_amount: formData.discount || 0,
    net_amount: (formData.totalAmount || 0) - (formData.discount || 0),
  };
};

// Main transformer function
export const transformFormDataToReport = (formType: string, formData: any): any => {
  switch (formType) {
    case 'bleeding':
      return transformBleedingFormToReport(formData);
    case 'crossmatch':
      return transformCrossmatchFormToReport(formData);
    case 'patientInvoice':
      return transformPatientInvoiceFormToReport(formData);
    default:
      return formData;
  }
};

// Get report type from form type
export const getReportTypeFromForm = (formType: string): ReportType => {
  switch (formType) {
    case 'bleeding':
      return 'donorScreening';
    case 'crossmatch':
      return 'crossmatch';
    case 'patientInvoice':
      return 'patientInvoice';
    default:
      return 'crossmatch';
  }
};
