
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TestResult {
  test_id: number;
  test_name: string;
  quantity: number;
  type?: string;
  category?: string;
}

interface TestCategory {
  category: string;
  tests: TestResult[];
}

export const useTestResults = () => {
  const [testCategories, setTestCategories] = useState<TestCategory[]>([]);
  const [loading, setLoading] = useState(false);

  const loadTestsForDocument = async (testsJson: string) => {
    if (!testsJson) {
      setTestCategories([]);
      return;
    }

    try {
      setLoading(true);
      const invoiceTests = JSON.parse(testsJson) as TestResult[];
      
      if (!Array.isArray(invoiceTests) || invoiceTests.length === 0) {
        setTestCategories([]);
        return;
      }

      const categorizedTests: { [key: string]: TestResult[] } = {};

      // Process each test from the invoice
      for (const invoiceTest of invoiceTests) {
        if (!invoiceTest.test_id) continue;

        // Fetch test details from test_information table with proper join
        const { data: testInfo, error: testError } = await supabase
          .from('test_information')
          .select(`
            id,
            name,
            test_type,
            category_id,
            test_categories (
              name
            )
          `)
          .eq('id', invoiceTest.test_id)
          .single();

        if (testError) {
          console.error('Error fetching test info:', testError);
          continue;
        }

        const categoryName = testInfo.test_categories?.name || 'Uncategorized';

        if (testInfo.test_type === 'single') {
          // For single tests, just add the test itself
          if (!categorizedTests[categoryName]) {
            categorizedTests[categoryName] = [];
          }
          
          categorizedTests[categoryName].push({
            test_id: testInfo.id,
            test_name: testInfo.name,
            quantity: invoiceTest.quantity,
            type: testInfo.test_type,
            category: categoryName
          });
        } else if (testInfo.test_type === 'full') {
          // For full tests, load all tests in the same category
          const { data: categoryTests, error: categoryError } = await supabase
            .from('test_information')
            .select(`
              id,
              name,
              test_type,
              test_categories (
                name
              )
            `)
            .eq('category_id', testInfo.category_id);

          if (categoryError) {
            console.error('Error fetching category tests:', categoryError);
            continue;
          }

          if (!categorizedTests[categoryName]) {
            categorizedTests[categoryName] = [];
          }

          // Add all tests from the category
          categoryTests?.forEach(test => {
            categorizedTests[categoryName].push({
              test_id: test.id,
              test_name: test.name,
              quantity: invoiceTest.quantity,
              type: test.test_type,
              category: categoryName
            });
          });
        }
      }

      // Convert to array format with category headings
      const categoryArray: TestCategory[] = Object.entries(categorizedTests).map(
        ([category, tests]) => ({
          category,
          tests
        })
      );

      setTestCategories(categoryArray);
    } catch (error) {
      console.error('Error loading tests:', error);
      toast.error('Failed to load test information');
      setTestCategories([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    testCategories,
    loading,
    loadTestsForDocument
  };
};
