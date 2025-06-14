
import React from "react";
import { format } from "date-fns";

// Adapts the style to mimic your screenshot closely.
function padNumber(number: number, length = 0) {
  let str = "" + number;
  while (str.length < length) str = "0" + str;
  return str;
}

const labelStyle = { width: 110, display: "inline-block" };

export default function PatientRequestReceiptDisplay({ invoice }: { invoice: any }) {
  // Properly compute fields
  const bloodGroup = invoice.blood_group_separate
    ? invoice.blood_group_separate +
      (invoice.rh_factor === "+ve"
        ? "+"
        : invoice.rh_factor === "-ve"
        ? "-"
        : "")
    : "";

  return (
    <div
      className="bg-white border border-[#264f9b] p-0 mx-auto"
      style={{
        minWidth: 784,
        maxWidth: 800,
        minHeight: 950,
        fontFamily: "Segoe UI, Arial, sans-serif",
        boxShadow: "0px 2px 16px 0px #0002",
        margin: "0 auto"
      }}
    >
      <div style={{ minHeight: "930px", padding: "0 0 24px 0" }}>
        {/* Header */}
        <div className="flex flex-col items-center mt-6 mb-4">
          <div className="font-bold text-xl tracking-wide mb-1" style={{letterSpacing:1}}>
            BLOOD CARE FOUNDATION
          </div>
          <div className="text-base font-normal italic underline">PATIENT RECEIPT</div>
        </div>
        {/* Print Date & Page */}
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
        <div className="flex flex-row justify-between items-center px-7 mb-2 font-semibold text-base">
          <div>
            Patient #: <span className="font-bold">{invoice.patient_id || ""}</span>
          </div>
          <div>
            Document No: <span className="font-bold">{invoice.document_no || ""}</span>
          </div>
        </div>
        {/* Main Info: 2-column grid */}
        <div className="grid grid-cols-2 gap-x-10 px-7 mb-1 text-[15px]">
          {/* Left */}
          <div>
            <div>
              <span style={labelStyle} className="font-semibold">Patient Name:</span>
              <span>{invoice.patient_name || ""}</span>
            </div>
            <div>
              <span style={labelStyle} className="font-semibold">Age/Sex:</span>
              {invoice.age !== null ? `${invoice.age} Year(s)` : ""}
              {invoice.gender ? "/" + invoice.gender.charAt(0).toUpperCase() : ""}
            </div>
            <div>
              <span style={labelStyle} className="font-semibold">Phone:</span>
              <span>{invoice.phone_no || ""}</span>
            </div>
            <div>
              <span style={labelStyle} className="font-semibold">Hospital Name:</span>
              <span>{invoice.hospital_name || ""}</span>
            </div>
            <div>
              <span style={labelStyle} className="font-semibold">Blood Group:</span>
              <span>{bloodGroup || ""}</span>
            </div>
          </div>
          {/* Right */}
          <div>
            <div>
              <span style={labelStyle} className="font-semibold">Registration Date:</span>
              <span>
                {invoice.document_date ? format(new Date(invoice.document_date), "dd/MM/yyyy") : ""}
              </span>
            </div>
            <div>
              <span style={labelStyle} className="font-semibold">EX Donor:</span>
              <span>{invoice.ex_donor || ""}</span>
            </div>
            <div>
              <span style={labelStyle} className="font-semibold">Registration Loc:</span>
              BLOOD CARE FOUNDATION
            </div>
            <div>
              <span style={labelStyle} className="font-semibold">Reference:</span>
              <span>{invoice.reference_notes || ""}</span>
            </div>
            <div>
              <span style={labelStyle} className="font-semibold">Product Category:</span>
              <span>{invoice.bottle_quantity || 0}</span>
            </div>
          </div>
        </div>
        {/* Table of tests */}
        <div className="w-full px-7 mt-5">
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
                invoice.invoice_items.map((item: any, idx: number) => (
                  <tr key={idx} className="h-7">
                    <td className="border border-black px-2 py-1 text-left">
                      {item.test_id ? <span className="font-bold mr-1">{item.test_id}</span> : ""}
                      {item.test_name}
                    </td>
                    <td className="border border-black px-2 py-1 text-center">{item.quantity}</td>
                    <td className="border border-black px-2 py-1 text-right">
                      {Number(item.unit_price).toLocaleString()}
                    </td>
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
              {invoice.total_amount ? Number(invoice.total_amount).toLocaleString() : 0}
            </span>
          </div>
          <div className="flex justify-between py-0.5">
            <span>Amount Less :</span>
            <span>
              {invoice.discount_amount ? Number(invoice.discount_amount).toLocaleString() : 0}
            </span>
          </div>
          <div className="flex justify-between py-0.5 font-bold">
            <span>To Be Paid :</span>
            <span>
              {(Number(invoice.total_amount || 0) - Number(invoice.discount_amount || 0)).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between py-0.5">
            <span>Paid :</span>
            <span>
              {invoice.amount_received ? Number(invoice.amount_received).toLocaleString() : ""}
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
            
            <span className="font-bold ml-2">BLOOD CARE FOUNDATION</span>
          </div>
        </div>
      </div>
      {/* Print rules. */}
      <style>{`
        @media print {
          html, body, #root {
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
  );
}
