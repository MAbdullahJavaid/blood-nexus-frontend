
import React from "react";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface InvoiceData {
  document_no: string;
  document_date: string;
  patient_id: string | null;
  patient_name: string;
  total_amount: number;
  discount_amount: number;
  net_amount: number;
}

interface PatientRequestSummaryDisplayProps {
  data: InvoiceData[];
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
  totalPages,
}: PatientRequestSummaryDisplayProps) {
  const formatCurrency = (amount: number) => {
    return amount.toFixed(2);
  };

  const totalAmount = data.reduce((sum, item) => sum + item.total_amount, 0);
  const totalDiscount = data.reduce((sum, item) => sum + item.discount_amount, 0);
  const totalNet = data.reduce((sum, item) => sum + item.net_amount, 0);

  const printDate = format(new Date(), "dd-MMM-yyyy HH:mm:ss");

  return (
    <div className="bg-white p-6 min-h-screen">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold mb-2">BLOOD CARE FOUNDATION</h1>
        <h2 className="text-lg font-bold underline">PATIENT INVOICE SUMMARY</h2>
      </div>

      {/* Print info */}
      <div className="flex justify-between items-center mb-4 text-sm">
        <div>Print Date: {printDate}</div>
        <div>Page {currentPage} of {totalPages}</div>
      </div>

      {/* Table */}
      <div className="border border-black">
        <Table>
          <TableHeader>
            <TableRow className="border-black">
              <TableHead className="border-r border-black bg-gray-100 text-black font-bold text-center p-2">
                Document No
              </TableHead>
              <TableHead className="border-r border-black bg-gray-100 text-black font-bold text-center p-2">
                Document Date
              </TableHead>
              <TableHead className="border-r border-black bg-gray-100 text-black font-bold text-center p-2">
                Patient Info
              </TableHead>
              <TableHead className="border-r border-black bg-gray-100 text-black font-bold text-center p-2">
                Amount
              </TableHead>
              <TableHead className="border-r border-black bg-gray-100 text-black font-bold text-center p-2">
                Discount
              </TableHead>
              <TableHead className="border-black bg-gray-100 text-black font-bold text-center p-2">
                Net Amount
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index} className="border-black">
                <TableCell className="border-r border-black p-2 text-center">
                  {item.document_no}
                </TableCell>
                <TableCell className="border-r border-black p-2 text-center">
                  {format(new Date(item.document_date), "dd/MM/yyyy")}
                </TableCell>
                <TableCell className="border-r border-black p-2 text-center">
                  {item.patient_id ? `${item.patient_id} ${item.patient_name}` : item.patient_name}
                </TableCell>
                <TableCell className="border-r border-black p-2 text-right">
                  {formatCurrency(item.total_amount)}
                </TableCell>
                <TableCell className="border-r border-black p-2 text-right">
                  {formatCurrency(item.discount_amount)}
                </TableCell>
                <TableCell className="border-black p-2 text-right">
                  {formatCurrency(item.net_amount)}
                </TableCell>
              </TableRow>
            ))}
            
            {/* Total row - only show on last page */}
            {currentPage === totalPages && (
              <TableRow className="border-black bg-gray-50 font-bold">
                <TableCell className="border-r border-black p-2 text-center" colSpan={3}>
                  TOTAL
                </TableCell>
                <TableCell className="border-r border-black p-2 text-right text-blue-600">
                  {formatCurrency(totalAmount)}
                </TableCell>
                <TableCell className="border-r border-black p-2 text-right text-red-600">
                  {formatCurrency(totalDiscount)}
                </TableCell>
                <TableCell className="border-black p-2 text-right text-green-600">
                  {formatCurrency(totalNet)}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
