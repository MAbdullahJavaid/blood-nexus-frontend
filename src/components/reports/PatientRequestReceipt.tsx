
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

// Types as before
interface InvoiceItem {
  test_id?: number;
  test_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}
interface PatientInvoiceData {
  id: string;
  document_no: string;
  patient_id: string;
  patient_name: string;
  age: number | null;
  gender: string | null;
  phone_no: string | null;
  hospital_name: string | null;
  blood_group_separate: string | null;
  rh_factor: string | null;
  reference_notes: string | null;
  document_date: string;
  total_amount: number;
  amount_received: number;
  discount_amount: number;
  created_at: string;
  ex_donor: string | null;
  bottle_quantity: number | null;
  document_date_fmt?: string;
  invoice_items: InvoiceItem[];
}

export default function PatientRequestReceipt() {
  const [searchParams] = useSearchParams();
  const documentNo = searchParams.get("docNo") || "";
  const [invoice, setInvoice] = useState<PatientInvoiceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!documentNo) return;
    setLoading(true);
    supabase.from("patient_invoices")
      .select(`
        *,
        invoice_items (
          test_id,
          test_name,
          quantity,
          unit_price,
          total_price
        )
      `)
      .eq("document_no", documentNo)
      .maybeSingle()
      .then(({ data }) => {
        setInvoice(data as PatientInvoiceData);
        setLoading(false);
      });
  }, [documentNo]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-14 text-muted-foreground">
        Loading receipt...
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex justify-center items-center py-14 text-destructive">
        No data found for Document No: <b className="ml-1">{documentNo}</b>
      </div>
    );
  }

  const bloodGroup = invoice.blood_group_separate
    ? invoice.blood_group_separate +
      (invoice.rh_factor === "+ve" ? "+" : invoice.rh_factor === "-ve" ? "-" : "")
    : "";

  // Styles to mimic the screenshot appearance - fixed width, border, minimal padding, system font.
  return (
    <div className="w-full min-h-screen flex justify-center items-start bg-[#e5ecfa] p-4 print:p-0" style={{ fontFamily: "Segoe UI, Arial, sans-serif" }}>
      <div 
        className="bg-white border border-[#264f9b] mx-auto mt-6"
        style={{
          minWidth: 784,
          maxWidth: 800,
          minHeight: 950,
          pageBreakAfter: "always",
        }}
      >
        <div className="p-0" style={{ minHeight: "930px" }}>
          {/* Header: Title */}
          <div className="flex flex-col items-center mt-6 mb-4">
            <div className="font-bold text-xl tracking-wide mb-1" style={{letterSpacing:1}}>
              SUNDAS FOUNDATION
            </div>
            <div className="text-base font-normal italic underline">PATIENT RECEIPT</div>
          </div>
          {/* Print Date and Page 1 of 1 */}
          <div className="flex flex-row justify-between px-7 mb-3 text-sm">
            <div>
              Print Date:{" "}
              {format(new Date(), "dd-MMM-yyyy hh:mm:ss aa")}
            </div>
            <div>
              Page 1 of 1
            </div>
          </div>
          {/* Patient # and Document No */}
          <div className="flex flex-row justify-between items-center px-7 mb-2">
            <div className="font-semibold text-base">
              Patient #: <span className="font-bold">{invoice.patient_id}</span>
            </div>
            <div className="font-semibold text-base">
              Document No: <span className="font-bold">{invoice.document_no}</span>
            </div>
          </div>
          {/* Main Info: Left and Right grid */}
          <div className="grid grid-cols-2 gap-x-10 px-7 mb-1 text-[15px]">
            {/* Left */}
            <div>
              <div>
                <span className="font-semibold">Patient Name:</span>{" "}
                <span>{invoice.patient_name || ""}</span>
              </div>
              <div>
                <span className="font-semibold">Age/Sex:</span>{" "}
                {invoice.age !== null ? `${invoice.age} Year(s)` : ""}
                {invoice.gender ? "/" + invoice.gender.charAt(0).toUpperCase() : ""}
              </div>
              <div>
                <span className="font-semibold">Phone:</span>{" "}
                {invoice.phone_no || ""}
              </div>
              <div>
                <span className="font-semibold">Hospital Name:</span>{" "}
                {invoice.hospital_name || ""}
              </div>
              <div>
                <span className="font-semibold">Blood Group:</span>{" "}
                {bloodGroup || ""}
              </div>
            </div>
            {/* Right */}
            <div>
              <div>
                <span className="font-semibold">Registration Date:</span>{" "}
                {invoice.document_date
                  ? format(new Date(invoice.document_date), "dd/MM/yyyy")
                  : ""}
              </div>
              <div>
                <span className="font-semibold">EX Donor:</span>{" "}
                {invoice.ex_donor || ""}
              </div>
              <div>
                <span className="font-semibold">Registration Loc:</span>{" "}
                SUNDAS FOUNDATION
              </div>
              <div>
                <span className="font-semibold">Reference:</span>{" "}
                {invoice.reference_notes || ""}
              </div>
              <div>
                <span className="font-semibold">Product Category:</span>{" "}
                {invoice.bottle_quantity || 0}
              </div>
            </div>
          </div>
          {/* Table of tests */}
          <div className="w-full px-7 mt-3">
            <table className="w-full border border-black border-collapse text-[15px]">
              <thead>
                <tr>
                  <th className="border border-black px-2 py-1 w-12 font-normal">Test(s)</th>
                  <th className="border border-black px-2 py-1 w-16 font-normal">Quantity</th>
                  <th className="border border-black px-2 py-1 w-20 font-normal">Rate</th>
                </tr>
              </thead>
              <tbody>
                {invoice.invoice_items && invoice.invoice_items.length > 0 ? (
                  invoice.invoice_items.map((item, idx) => (
                    <tr key={idx} className="h-7">
                      <td className="border border-black px-2 py-1 text-left">
                        {item.test_id ? <span className="font-bold mr-1">{item.test_id}</span> : ""}
                        {item.test_name}
                      </td>
                      <td className="border border-black px-2 py-1 text-center">{item.quantity}</td>
                      <td className="border border-black px-2 py-1 text-right">{item.unit_price.toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="border border-black px-2 py-2 text-center">
                      No tests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Total Section */}
          <div className="w-96 ml-auto mr-8 mt-4 text-[15px]">
            <div className="flex justify-between py-0.5">
              <span>Total Amount :</span>
              <span>
                {invoice.total_amount ? invoice.total_amount.toLocaleString() : 0}
              </span>
            </div>
            <div className="flex justify-between py-0.5">
              <span>Amount Less :</span>
              <span>
                {invoice.discount_amount ? invoice.discount_amount.toLocaleString() : 0}
              </span>
            </div>
            <div className="flex justify-between py-0.5 font-bold">
              <span>To Be Paid :</span>
              <span>
                {(invoice.total_amount - invoice.discount_amount).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between py-0.5">
              <span>Paid :</span>
              <span>
                {invoice.amount_received ? invoice.amount_received.toLocaleString() : ""}
              </span>
            </div>
            {/* Paid underline */}
            <div className="flex justify-between items-center py-2">
              <span>&nbsp;</span>
              <span style={{ borderBottom: '1px solid #333', minWidth: 140, height: 10, display: 'inline-block', marginLeft: 4 }}></span>
            </div>
          </div>
          {/* Footer Registered By */}
          <div className="mt-10 flex flex-row justify-end pr-8 text-[15px]">
            <div className="flex flex-row items-center gap-2">
              <span>Registered By :</span>
              <span style={{ borderBottom: '1px solid #333', minWidth: 160, height: 10, display: 'inline-block', marginLeft: 2 }}></span>
              <span className="font-bold ml-2">SUNDAS FOUNDATION</span>
            </div>
          </div>
        </div>
        {/* Print rules */}
        <style>{`
          @media print {
            html, body, #root, .print\\:p-0 {
              background: white !important;
              margin: 0 !important;
            }
            .border {
              box-shadow: none !important;
            }
            .page-break { page-break-after: always; }
          }
        `}</style>
      </div>
    </div>
  );
}
