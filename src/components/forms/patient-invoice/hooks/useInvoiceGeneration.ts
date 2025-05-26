
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useInvoiceGeneration(isEditable: boolean) {
  const [documentNo, setDocumentNo] = useState<string>("");
  
  const isAdding = !documentNo;

  const generateDocumentNo = async () => {
    try {
      const { data, error } = await supabase.rpc('generate_invoice_number');
      if (error) throw error;
      setDocumentNo(data);
    } catch (error) {
      console.error('Error generating document number:', error);
      // Fallback to manual generation
      const date = new Date();
      const year = date.getFullYear().toString().slice(-2);
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const sequence = "0001";
      setDocumentNo(`${year}${month}${sequence}`);
    }
  };

  useEffect(() => {
    if (isEditable && isAdding) {
      generateDocumentNo();
    }
  }, [isEditable]);

  return {
    documentNo,
    setDocumentNo,
    isAdding,
    generateDocumentNo
  };
}
