
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface InvoiceData {
  document_no: string;
  document_date: string;
  patient_id: string | null;
  patient_name: string;
  total_amount: number;
  discount_amount: number;
  net_amount: number;
}

interface UsePatientRequestSummaryDataProps {
  invoiceFrom: string;
  invoiceTo: string;
  dateFrom: Date;
  dateTo: Date;
}

export function usePatientRequestSummaryData({
  invoiceFrom,
  invoiceTo,
  dateFrom,
  dateTo,
}: UsePatientRequestSummaryDataProps) {
  const [data, setData] = useState<InvoiceData[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; // Approximate items per page for report format

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log("Fetching patient invoice data...", { invoiceFrom, invoiceTo, dateFrom, dateTo });

      let query = supabase
        .from('patient_invoices')
        .select('document_no, document_date, patient_id, patient_name, total_amount, discount_amount')
        .gte('document_date', dateFrom.toISOString().split('T')[0])
        .lte('document_date', dateTo.toISOString().split('T')[0])
        .order('document_date', { ascending: true })
        .order('document_no', { ascending: true });

      // Add document number filters if specified
      if (invoiceFrom && invoiceTo) {
        query = query.gte('document_no', invoiceFrom).lte('document_no', invoiceTo);
      } else if (invoiceFrom) {
        query = query.gte('document_no', invoiceFrom);
      } else if (invoiceTo) {
        query = query.lte('document_no', invoiceTo);
      }

      const { data: invoices, error } = await query;

      if (error) {
        console.error("Error fetching invoices:", error);
        toast.error("Failed to fetch invoice data");
        return;
      }

      console.log("Fetched invoices:", invoices);

      // Calculate net amount for each invoice
      const processedData: InvoiceData[] = (invoices || []).map(invoice => ({
        document_no: invoice.document_no,
        document_date: invoice.document_date,
        patient_id: invoice.patient_id,
        patient_name: invoice.patient_name,
        total_amount: invoice.total_amount || 0,
        discount_amount: invoice.discount_amount || 0,
        net_amount: (invoice.total_amount || 0) - (invoice.discount_amount || 0),
      }));

      setData(processedData);
      setCurrentPage(1);

      if (processedData.length === 0) {
        toast.info("No data found for the selected criteria");
      }
    } catch (error) {
      console.error("Error in fetchData:", error);
      toast.error("An error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(data.length / itemsPerPage));
  const currentPageData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return {
    data: currentPageData,
    allData: data,
    loading,
    currentPage,
    totalPages,
    nextPage,
    previousPage,
    goToPage,
    fetchData,
  };
}
