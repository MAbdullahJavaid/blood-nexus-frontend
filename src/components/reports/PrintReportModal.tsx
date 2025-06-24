
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CrossmatchReportDisplay from "./CrossmatchReportDisplay";
import DonorScreeningReportFilter from "./DonorScreeningReportFilter";
import PatientRequestSummaryDisplay from "./PatientRequestSummaryDisplay";

export type ReportType = "crossmatch" | "donorScreening" | "patientInvoice";

interface PrintReportModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  reportType: ReportType;
  reportData: any;
  onPrint: () => void;
}

export default function PrintReportModal({
  isOpen,
  onOpenChange,
  reportType,
  reportData,
  onPrint,
}: PrintReportModalProps) {
  const handlePrint = () => {
    window.print();
    onPrint();
  };

  const renderReportContent = () => {
    switch (reportType) {
      case "crossmatch":
        return (
          <div id="print-report-content">
            <CrossmatchReportDisplay 
              data={reportData} 
              onPrint={handlePrint}
            />
          </div>
        );
      
      case "donorScreening":
        return (
          <div id="print-report-content" className="p-6">
            <div className="text-center mb-6">
              <h1 className="text-xl font-bold mb-2">SUNDAS FOUNDATION</h1>
              <h2 className="text-lg font-bold underline">DONOR SCREENING REPORT</h2>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><strong>Donor ID:</strong> {reportData.donor_id}</div>
                <div><strong>Name:</strong> {reportData.name}</div>
                <div><strong>Blood Group:</strong> {reportData.blood_group}</div>
                <div><strong>Date:</strong> {reportData.bleeding_date}</div>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-bold mb-3">Screening Results</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>HBsAg: {reportData.hbsag || 'N/A'}</div>
                  <div>HCV: {reportData.hcv || 'N/A'}</div>
                  <div>HIV: {reportData.hiv || 'N/A'}</div>
                  <div>VDRL: {reportData.vdrl || 'N/A'}</div>
                  <div>HB: {reportData.hb || 'N/A'}</div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case "patientInvoice":
        return (
          <div id="print-report-content">
            <PatientRequestSummaryDisplay
              data={[reportData]}
              dateFrom={new Date()}
              dateTo={new Date()}
              currentPage={1}
              totalPages={1}
            />
          </div>
        );
      
      default:
        return <div>Report type not supported</div>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Print Preview</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {renderReportContent()}
          
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700">
              Print
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
