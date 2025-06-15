
import React from "react";
import { toast } from "@/hooks/use-toast";
import { FileText, LogOut, Download } from "lucide-react";

interface Props {
  onExportPDF: () => void;
  onExportJPEG: () => void;
  onExit: () => void;
  isExportDisabled?: boolean;
}

export default function PatientRequestReportActions({
  onExportPDF, onExportJPEG, onExit, isExportDisabled,
}: Props) {
  return (
    <div className="flex gap-3 justify-end items-center mb-3 px-1">
      <button
        className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-300 rounded shadow hover:bg-red-100 transition group disabled:opacity-60"
        onClick={onExportPDF}
        disabled={isExportDisabled}
        title="Export PDF"
        type="button"
      >
        <Download className="text-red-500 group-hover:text-red-700" size={18} />
        <span className="text-sm font-semibold text-red-600">Export PDF</span>
      </button>
      <button
        className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-300 rounded shadow hover:bg-yellow-100 transition group disabled:opacity-60"
        onClick={onExportJPEG}
        disabled={isExportDisabled}
        title="Export JPEG"
        type="button"
      >
        <svg className="text-yellow-500 group-hover:text-yellow-700" width={18} height={18} viewBox="0 0 20 20" fill="none">
          <rect x="2" y="5" width="16" height="13" rx="2" stroke="currentColor" strokeWidth="1.7"/>
          <circle cx="6" cy="9" r="2" stroke="currentColor" strokeWidth="1.7"/>
          <path d="M2 18L8.8 10.55C9.51033 9.76504 10.4897 9.76504 11.2 10.55L18 18" stroke="currentColor" strokeWidth="1.7"/>
          <rect x="6" y="2" width="8" height="3" rx="1" stroke="currentColor" strokeWidth="1.7"/>
        </svg>
        <span className="text-sm font-semibold text-yellow-700">Export JPEG</span>
      </button>
      <button
        className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-300 rounded shadow hover:bg-red-100 transition"
        onClick={onExit}
        title="Exit"
        type="button"
      >
        <LogOut className="text-gray-700 group-hover:text-red-600" size={18} />
        <span className="text-sm font-semibold text-gray-700">Exit</span>
      </button>
    </div>
  );
}
