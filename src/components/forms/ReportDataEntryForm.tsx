
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search } from "lucide-react";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";

// TypeScript types for invoice, invoice item, and patient data
type InvoiceItem = {
  id: string;
  test_id: number | null;
  test_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  type?: string | null;
  category?: string | null;
};

type Invoice = {
  id: string;
  document_no: string;
  patient_name: string;
  patient_id: string;
  dob: string | null;
  gender: string | null;
  age: number | null;
  hospital_name: string | null;
  phone_no: string | null;
  reference_notes: string | null;
  blood_group_separate: string | null;
  rh_factor: string | null;
  blood_category: string | null;
  bottle_quantity: number | null;
  bottle_unit: string | null;
};

const ReportDataEntryForm: React.FC<{ isSearchEnabled?: boolean; isEditable?: boolean }> = ({
  isSearchEnabled = false,
  isEditable = false,
}) => {
  const [searchDocNo, setSearchDocNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [tests, setTests] = useState<InvoiceItem[]>([]);

  // Search for invoice and load tests
  const handleSearch = async () => {
    if (!searchDocNo.trim()) {
      toast({
        title: "Missing Document No.",
        description: "Please enter a document number.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    setInvoice(null);
    setTests([]);
    // 1. Fetch invoice by document_no
    const { data: inv, error: invErr } = await supabase
      .from("patient_invoices")
      .select("*")
      .eq("document_no", searchDocNo.trim())
      .maybeSingle();

    if (invErr || !inv) {
      setLoading(false);
      toast({
        title: "Invoice Not Found",
        description: "No patient invoice found with this document number.",
        variant: "destructive",
      });
      return;
    }
    // 2. Fetch each test item (invoice_items)
    const { data: items, error: itemErr } = await supabase
      .from("invoice_items")
      .select("*")
      .eq("invoice_id", inv.id);

    setLoading(false);

    if (itemErr) {
      toast({
        title: "Error fetching tests",
        description: itemErr.message,
        variant: "destructive",
      });
      return;
    }

    setInvoice(inv as Invoice);
    setTests((items as InvoiceItem[]) || []);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="font-bold text-xl mb-4">Report Data Entry (by Patient Invoice)</h2>
      {/* Search by Invoice Document No */}
      <div className="flex gap-2 mb-6">
        <Input
          value={searchDocNo}
          onChange={(e) => setSearchDocNo(e.target.value)}
          placeholder="Enter invoice document number..."
          className="max-w-xs"
        />
        <Button variant="default" onClick={handleSearch} disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          <span className="ml-2">Search</span>
        </Button>
      </div>
      {/* Show Invoice Details */}
      {invoice && (
        <div className="bg-gray-100 rounded p-4 mb-4">
          <div className="flex flex-col sm:flex-row sm:gap-10 text-sm">
            <div>
              <b>Patient:</b> {invoice.patient_name} {invoice.gender ? `(${invoice.gender})` : ""}
              <br />
              <b>Age:</b> {invoice.age ?? "-"}
              <br />
              <b>Patient ID:</b> {invoice.patient_id}
            </div>
            <div>
              <b>Hospital:</b> {invoice.hospital_name || "-"}
              <br />
              <b>Phone:</b> {invoice.phone_no || "-"}
              <br />
              <b>Blood Group:</b> {invoice.blood_group_separate || "-"}{" "}
              {invoice.rh_factor ? invoice.rh_factor.replace("ve", "") : ""}
            </div>
            <div>
              <b>Doc #:</b> {invoice.document_no}
              <br />
              <b>DOB:</b> {invoice.dob || "-"}
              <br />
              <b>References:</b> {invoice.reference_notes || "-"}
            </div>
          </div>
        </div>
      )}
      {/* Tests Table */}
      {tests.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Test ID</TableHead>
              <TableHead>Test Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>Unit Price</TableHead>
              <TableHead>Total Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tests.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.test_id}</TableCell>
                <TableCell>{item.test_name}</TableCell>
                <TableCell>{item.category || "-"}</TableCell>
                <TableCell>{item.type || "-"}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.unit_price.toFixed(2)}</TableCell>
                <TableCell>{item.total_price.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      {/* No data message */}
      {invoice && tests.length === 0 && (
        <div className="text-gray-500 mt-4 text-center">No tests found for this invoice.</div>
      )}
    </div>
  );
};

export default ReportDataEntryForm;
