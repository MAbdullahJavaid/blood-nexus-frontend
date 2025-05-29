
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DocumentSearchModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDocumentSelect: (documentNo: string) => void;
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
        invoice.invoice_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.patient_name?.toLowerCase().includes(searchTerm.toLowerCase())
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
        .select(`
          *,
          patients (
            name,
            patient_id
          )
        `)
        .order('created_at', { ascending: false });

      console.log("Invoices loaded:", data);
      console.log("Load error:", error);

      if (error) throw error;
      
      // Format the data to include patient name
      const formattedInvoices = (data || []).map(invoice => ({
        ...invoice,
        patient_name: invoice.patients?.name || invoice.patient_name || 'Unknown Patient'
      }));
      
      setAllInvoices(formattedInvoices);
      setFilteredInvoices(formattedInvoices);
      
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

  const handleDocumentSelect = (invoice: any) => {
    console.log("Selected invoice:", invoice);
    onDocumentSelect(invoice.invoice_number);
    setSearchTerm("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Search Document</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input 
            placeholder="Search by document number or patient name" 
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
                    onClick={() => handleDocumentSelect(invoice)}
                  >
                    <div className="font-medium">Document No: {invoice.invoice_number}</div>
                    <div className="text-sm text-gray-600">
                      Patient: {invoice.patient_name} | Date: {invoice.invoice_date} | 
                      Amount: ${invoice.total_amount} | Status: {invoice.status}
                    </div>
                    <div className="text-xs text-gray-500">
                      Type: {invoice.patient_type || 'Regular'}
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
