
import React from "react";
import { format } from "date-fns";

interface PatientRequestSummaryData {
  document_no: string;
  document_date: string;
  patient_id: number | null;
  patient_name: string;
  total_amount: number;
  discount_amount: number;
  net_amount: number;
}

interface Props {
  data: PatientRequestSummaryData[];
  dateFrom: Date;
  dateTo: Date;
  currentPage: number;
  totalPages: number;
}

export default function PatientRequestSummaryDisplay({ 
  data, 
  dateFrom, 
  dateTo, 
  currentPage, 
  totalPages 
}: Props) {
  const totalAmount = data.reduce((sum, item) => sum + item.total_amount, 0);
  const totalDiscount = data.reduce((sum, item) => sum + item.discount_amount, 0);
  const totalNet = data.reduce((sum, item) => sum + item.net_amount, 0);

  return (
    <div className="bg-white p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">BLOOD CARE FOUNDATION</h1>
        <h2 className="text-xl font-semibold mb-1">Patient Request Summary Report</h2>
        <p className="text-sm text-gray-600">
          From: {format(dateFrom, "dd/MM/yyyy")} To: {format(dateTo, "dd/MM/yyyy")}
        </p>
        <p className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </p>
      </div>

      {/* Table */}
      <div className="border border-black">
        {/* Table Header */}
        <div className="grid grid-cols-6 bg-gray-100 border-b border-black">
          <div className="p-2 border-r border-black font-bold text-center">Sr#</div>
          <div className="p-2 border-r border-black font-bold text-center">Document No</div>
          <div className="p-2 border-r border-black font-bold text-center">Date</div>
          <div className="p-2 border-r border-black font-bold text-center">Patient Name</div>
          <div className="p-2 border-r border-black font-bold text-center">Total Amount</div>
          <div className="p-2 font-bold text-center">Net Amount</div>
        </div>
        
        {/* Table Body */}
        {data.map((item, index) => (
          <div key={index} className="grid grid-cols-6 border-b border-black last:border-b-0">
            <div className="p-2 border-r border-black text-center">{index + 1}</div>
            <div className="p-2 border-r border-black text-center">{item.document_no}</div>
            <div className="p-2 border-r border-black text-center">
              {format(new Date(item.document_date), "dd/MM/yyyy")}
            </div>
            <div className="p-2 border-r border-black">{item.patient_name}</div>
            <div className="p-2 border-r border-black text-right">
              {item.total_amount.toLocaleString()}
            </div>
            <div className="p-2 text-right">
              {item.net_amount.toLocaleString()}
            </div>
          </div>
        ))}
        
        {/* Totals Row */}
        <div className="grid grid-cols-6 bg-gray-100 font-bold">
          <div className="p-2 border-r border-black text-center" colSpan={4}>Total:</div>
          <div className="p-2 border-r border-black"></div>
          <div className="p-2 border-r border-black"></div>
          <div className="p-2 border-r border-black text-right">
            {totalAmount.toLocaleString()}
          </div>
          <div className="p-2 text-right">
            {totalNet.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="font-semibold">Total Records: {data.length}</p>
        </div>
        <div className="text-center">
          <p className="font-semibold">Total Amount: {totalAmount.toLocaleString()}</p>
        </div>
        <div className="text-center">
          <p className="font-semibold">Net Amount: {totalNet.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
