
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import React from "react";

type PreReport = {
  document_no: string;
  patient_id: string | null;
  patient_name: string;
  type: string | null;
  registration_date: string;
  hospital_name: string | null;
  gender: string | null;
  dob: string | null;
  phone: string | null;
  age: number | null;
  reference: string | null;
  blood_group: string | null;
  rh: string | null;
  blood_category: string | null;
  bottle_required: number | null;
  tests_type?: string | null;
  category: string | null;
  created_at: string;
  updated_at: string;
};

type SearchModalProps = {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  filteredReports: PreReport[];
  loading: boolean;
  onReportSelect: (r: PreReport) => void;
  formatDate: (d: string | null) => string;
};

const SearchModal = ({
  open,
  onOpenChange,
  searchTerm,
  setSearchTerm,
  filteredReports,
  loading,
  onReportSelect,
  formatDate,
}: SearchModalProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Select Document</DialogTitle>
      </DialogHeader>
      <div className="py-4">
        <Input
          placeholder="Search by document number or patient name"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <div className="h-64 border mt-4 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Loading reports...</div>
          ) : filteredReports.length > 0 ? (
            filteredReports.map(report => (
              <div
                key={report.document_no}
                className="p-2 border-b hover:bg-gray-100 cursor-pointer"
                onClick={() => onReportSelect(report)}
              >
                <div className="font-medium">Doc #: {report.document_no}</div>
                <div className="text-sm text-gray-600">
                  Patient: {report.patient_name}, {report.gender}, {report.age} yrs
                </div>
                <div className="text-sm text-gray-600">
                  Hospital: {report.hospital_name}
                </div>
                <div className="text-sm text-gray-600">
                  Date: {formatDate(report.created_at)}
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">No reports found</div>
          )}
        </div>
      </div>
    </DialogContent>
  </Dialog>
);

export default SearchModal;
