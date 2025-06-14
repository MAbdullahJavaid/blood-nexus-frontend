
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

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

  // Build full blood group if possible
  const bloodGroup = invoice.blood_group_separate
    ? invoice.blood_group_separate +
      (invoice.rh_factor === "+ve" ? "+" : invoice.rh_factor === "-ve" ? "-" : "")
    : "";

  return (
    <div className="w-full h-full flex justify-center p-4 print:p-0 bg-gray-100">
      <div
        className="bg-white border shadow print:shadow-none p-6 mx-auto w-full max-w-3xl"
        style={{
          boxSizing: "border-box",
          minHeight: "1100px",
          pageBreakAfter: "always",
        }}
      >
        {/* Header */}
        <div className="border border-black p-6" style={{ minHeight: "1000px" }}>
          <div className="text-center mb-2">
            <div className="font-bold text-lg tracking-wide">BLOOD CARE FOUNDATION</div>
            <div className="text-base" style={{ fontStyle: "italic", textDecoration: "underline" }}>
              PATIENT RECEIPT
            </div>
          </div>
          <div className="flex justify-between text-xs mb-1">
            <div>
              Print Date:{" "}
              {format(new Date(), "dd-MMM-yyyy hh:mm:ss aa")}
            </div>
            <div>
              Page 1 of 1
            </div>
          </div>

          {/* Main Info */}
          <div className="flex justify-between mt-2 mb-4">
            <div>
              <div>
                <span className="font-semibold">Patient #:</span>{" "}
                {invoice.patient_id || "-"}
              </div>
            </div>
            <div>
              <span className="font-semibold">Document No:</span>{" "}
              {invoice.document_no}
            </div>
          </div>

          {/* Patient and Additional Info */}
          <div className="grid grid-cols-2 gap-4 text-xs mb-2">
            {/* Left */}
            <div>
              <div>
                <span className="font-semibold">Patient Name:</span>{" "}
                {invoice.patient_name}
              </div>
              <div>
                <span className="font-semibold">Age/Sex:</span>{" "}
                {invoice.age !== null ? `${invoice.age} Year(s)` : ""}{invoice.gender ? "/" + invoice.gender.charAt(0).toUpperCase() : ""}
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
                BLOOD CARE FOUNDATION
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
          {/* Test table */}
          <div className="mt-2 text-xs">
            <table className="w-full border border-black">
              <thead>
                <tr>
                  <th className="border border-black py-1 px-2 font-bold w-12">#</th>
                  <th className="border border-black py-1 px-2 font-bold">Test(s)</th>
                  <th className="border border-black py-1 px-2 font-bold w-16">Quantity</th>
                  <th className="border border-black py-1 px-2 font-bold w-20">Rate</th>
                </tr>
              </thead>
              <tbody>
                {invoice.invoice_items && invoice.invoice_items.length > 0 ? (
                  invoice.invoice_items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="border border-black px-2 py-1 text-center">
                        {item.test_id || ""}
                      </td>
                      <td className="border border-black px-2 py-1">{item.test_name}</td>
                      <td className="border border-black px-2 py-1 text-center">{item.quantity}</td>
                      <td className="border border-black px-2 py-1 text-right">{item.unit_price.toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="border border-black px-2 py-2 text-center" colSpan={4}>
                      No tests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Total Section */}
          <div className="mt-3 w-1/2 ml-auto text-xs">
            <div className="flex justify-between mb-1">
              <span>Total Amount :</span>
              <span>
                {invoice.total_amount ? invoice.total_amount.toLocaleString() : 0}
              </span>
            </div>
            <div className="flex justify-between mb-1">
              <span>Amount Less :</span>
              <span>
                {invoice.discount_amount ? invoice.discount_amount.toLocaleString() : 0}
              </span>
            </div>
            <div className="flex justify-between mb-1 font-bold">
              <span>To Be Paid :</span>
              <span>
                {(invoice.total_amount - invoice.discount_amount).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between mb-1">
              <span>Paid :</span>
              <span>
                {invoice.amount_received ? invoice.amount_received.toLocaleString() : ""}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span>&nbsp;</span>
              <span>
                {/* Empty for spacing */}
              </span>
            </div>
          </div>
          {/* Footer */}
          <div className="flex mt-10 justify-between text-xs">
            <div>
              Registered By : <b>BLOOD CARE FOUNDATION</b>
            </div>
            <div>
              {/* Empty block for signature, etc */}
            </div>
          </div>
        </div>
        {/* Print rules */}
        <style>{`
          @media print {
            html, body, #root, .print\:p-0, .print\:shadow-none {
              background: white !important;
              box-shadow: none !important;
              margin: 0 !important;
            }
            .print\:p-0 { padding: 0 !important; }
            .print\:shadow-none { box-shadow: none !important; }
            .page-break { page-break-after: always; }
          }
        `}</style>
      </div>
    </div>
  );
}
