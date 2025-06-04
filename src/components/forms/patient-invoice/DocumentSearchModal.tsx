
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DocumentSearchModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDocumentSelect: (docNum: string) => void;
}

export function DocumentSearchModal({ isOpen, onOpenChange, onDocumentSelect }: DocumentSearchModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [allInvoices, setAllInvoices] = useState<any[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Load all invoices when modal opens
  useEffect(() => {
    if (isOpen) {
      loadAllInvoices();
    }
  }, [isOpen]);

  // Filter invoices based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredInvoices(allInvoices);
    } else {
      const filtered = allInvoices.filter(invoice => 
        invoice.document_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.phone_no?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredInvoices(filtered);
    }
  }, [searchTerm, allInvoices]);

  const loadAllInvoices = async () => {
    try {
      setLoading(true);
      console.log("Loading all invoices...");
      
      const { data, error } = await supabase
        .from('patient_invoices')
        .select('*')
        .order('created_at', { ascending: false });

      console.log("Invoices loaded:", data);
      console.log("Load error:", error);

      if (error) throw error;
      
      setAllInvoices(data || []);
      setFilteredInvoices(data || []);
      
      if (!data || data.length === 0) {
        toast.info("No invoices found in database");
      }
    } catch (error) {
      console.error("Error loading invoices:", error);
      toast.error("Failed to load invoices");
      setAllInvoices([]);
      setFilteredInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInvoiceSelect = (invoice: any) => {
    console.log("Selected invoice:", invoice);
    onDocumentSelect(invoice.document_no);
    setSearchTerm("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Search Invoice</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input 
            placeholder="Search by document number, patient name, or phone" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />
          <div className="h-96 border rounded-lg overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading invoices...</div>
            ) : filteredInvoices.length > 0 ? (
              <div className="divide-y">
                {filteredInvoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="p-3 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleInvoiceSelect(invoice)}
                  >
                    <div className="font-medium">Doc #: {invoice.document_no}</div>
                    <div className="text-sm text-gray-600">
                      Patient: {invoice.patient_name || 'N/A'} | 
                      Amount: ${invoice.total_amount?.toFixed(2) || '0.00'} | 
                      Type: {invoice.patient_type || 'N/A'}
                    </div>
                    <div className="text-xs text-gray-500">
                      Date: {invoice.document_date} | 
                      Phone: {invoice.phone_no || 'N/A'} | 
                      Hospital: {invoice.hospital_name || 'N/A'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                {searchTerm ? "No invoices found matching your search" : "No invoices available"}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
