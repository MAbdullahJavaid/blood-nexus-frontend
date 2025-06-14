
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface LoadedTestResult {
  test_id: number;
  test_name: string;
  measuring_unit: string;
  low_value: string;
  high_value: string;
  user_value: string;
  category: string;
  is_category_header?: boolean;
}

export interface PreReport {
  document_no: string;
  patient_id: string | null;
  patient_name: string;
  type: string | null;
  registration_date: string;
  hospital_name: string | null;
  gender: string | null;
  dob: string | null;
  phone: string | null;
  age: number | null;
  reference: string | null;
  blood_group: string | null;
  rh: string | null;
  blood_category: string | null;
  bottle_required: number | null;
  tests_type?: string | null;
  category: string | null;
  created_at: string;
  updated_at: string;
}

export default function useReportLoader() {
  const [reports, setReports] = useState<PreReport[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("pre_report")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      toast.error("Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const loadTestsFromInvoiceItems = useCallback(async (documentNo: string): Promise<LoadedTestResult[]> => {
    try {
      const { data: invoiceData, error: invError } = await supabase
        .from("patient_invoices")
        .select("id")
        .eq("document_no", documentNo)
        .maybeSingle();

      if (invError) throw invError;
      if (!invoiceData?.id) {
        toast.error("No invoice found for this document");
        return [];
      }
      const { data: invoiceItems, error: itemsError } = await supabase
        .from("invoice_items")
        .select(`test_id, test_name, type, category, quantity, unit_price, id`)
        .eq("invoice_id", invoiceData.id);

      if (itemsError) throw itemsError;
      if (!invoiceItems || invoiceItems.length === 0) {
        toast.error("No tests found in invoice items for this document");
        return [];
      }
      const loadedTestsMap: { [key: string]: LoadedTestResult } = {};
      const fullCategoryTests = invoiceItems
        .filter((item: any) => (item.type || '').toLowerCase() === "full" && item.category)
        .map((item: any) => ({
          test_id: item.test_id,
          category: item.category
        }));

      const fullTestIdCategorySet = new Set(
        fullCategoryTests.map(t => `${t.test_id}___${t.category}`)
      );

      for (const { test_id: fullTestId, category: categoryName } of fullCategoryTests) {
        const { data: categoryRow, error: catError } = await supabase
          .from("test_categories")
          .select("id")
          .eq("name", categoryName)
          .maybeSingle();
        if (catError || !categoryRow?.id) continue;

        const { data: testInfoRows, error: testInfoError } = await supabase
          .from("test_information")
          .select("id, name, description, category_id")
          .eq("category_id", categoryRow.id);

        if (testInfoError || !testInfoRows) continue;

        for (const test of testInfoRows) {
          if (test.id === fullTestId) continue;
          let measuring_unit = "";
          let low_value = "";
          let high_value = "";
          if (test.description) {
            try {
              const desc = JSON.parse(test.description);
              measuring_unit = desc.measuring_unit || "";
              low_value = desc.low_value || "";
              high_value = desc.high_value || "";
            } catch {}
          }
          const compositeKey = `${test.id}___${categoryName}`;
          loadedTestsMap[compositeKey] = {
            test_id: test.id,
            test_name: test.name,
            category: categoryName,
            measuring_unit,
            low_value,
            high_value,
            user_value: "",
          };
        }
      }

      for (const item of invoiceItems) {
        const test_id = item.test_id;
        const category = item.category || "";
        const compositeKey = `${test_id}___${category}`;
        if (loadedTestsMap[compositeKey]) continue;
        if (fullTestIdCategorySet.has(compositeKey)) continue;
        let measuring_unit = "", low_value = "", high_value = "";
        let test_name = item.test_name || "";
        if (test_id != null) {
          const { data: testInfo, error: testInfoErr } = await supabase
            .from("test_information")
            .select("description, name")
            .eq("id", test_id)
            .maybeSingle();

          if (testInfo && testInfo.description) {
            try {
              const desc = JSON.parse(testInfo.description);
              measuring_unit = desc.measuring_unit || "";
              low_value = desc.low_value || "";
              high_value = desc.high_value || "";
            } catch {}
          }
          if (testInfo && testInfo.name) {
            test_name = testInfo.name;
          }
          loadedTestsMap[compositeKey] = {
            test_id,
            test_name,
            category,
            measuring_unit,
            low_value,
            high_value,
            user_value: "",
          };
        }
      }

      const testsWithHeaders: LoadedTestResult[] = [];
      const testsArray = Object.values(loadedTestsMap);
      const grouped: Record<string, LoadedTestResult[]> = {};

      for (const test of testsArray) {
        const cat = test.category || "Uncategorized";
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push(test);
      }
      Object.entries(grouped).forEach(([categoryName, testsList]) => {
        testsWithHeaders.push({
          test_id: -1,
          test_name: categoryName,
          category: categoryName,
          measuring_unit: "",
          low_value: "",
          high_value: "",
          user_value: "",
          is_category_header: true,
        });
        testsList.forEach(test => testsWithHeaders.push(test));
      });

      return testsWithHeaders;
    } catch (error: any) {
      toast.error("Failed to load test details from invoice");
      return [];
    }
  }, []);

  return { reports, loading, fetchReports, loadTestsFromInvoiceItems };
}
