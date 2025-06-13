
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface DonorBleedSummaryTableProps {
  fromDate?: Date;
  toDate?: Date;
}

interface CategoryCount {
  donor_category: string;
  total_bags: number;
}

const DonorBleedSummaryTable = ({ fromDate, toDate }: DonorBleedSummaryTableProps) => {
  const [data, setData] = useState<CategoryCount[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalBags, setTotalBags] = useState(0);

  useEffect(() => {
    if (fromDate && toDate) {
      fetchDonorBleedSummary();
    }
  }, [fromDate, toDate]);

  const fetchDonorBleedSummary = async () => {
    if (!fromDate || !toDate) return;

    setLoading(true);
    console.log("Fetching donor bleed summary for date range:", fromDate, "to", toDate);

    try {
      let query = supabase
        .from('bleeding_records')
        .select('donor_category')
        .gte('bleeding_date', format(fromDate, 'yyyy-MM-dd'))
        .lte('bleeding_date', format(toDate, 'yyyy-MM-dd'))
        .not('donor_category', 'is', null);

      const { data: bleedingData, error } = await query;

      if (error) {
        console.error("Error fetching bleeding records:", error);
        return;
      }

      console.log("Raw bleeding data:", bleedingData);

      // Count categories
      const categoryMap = new Map<string, number>();
      
      bleedingData?.forEach((record) => {
        const category = record.donor_category || 'Unknown';
        categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
      });

      // Convert to array and sort
      const categoryData: CategoryCount[] = Array.from(categoryMap.entries()).map(([category, count]) => ({
        donor_category: category,
        total_bags: count
      }));

      // Sort by category name for consistent display
      categoryData.sort((a, b) => a.donor_category.localeCompare(b.donor_category));

      console.log("Processed category data:", categoryData);

      const total = categoryData.reduce((sum, item) => sum + item.total_bags, 0);
      
      setData(categoryData);
      setTotalBags(total);
    } catch (error) {
      console.error("Error in fetchDonorBleedSummary:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCategoryName = (category: string) => {
    // Format category names to match the report format
    switch (category.toLowerCase()) {
      case 'voluntary':
        return 'EX / OPD';
      case 'replacement':
        return 'EX / Patient';
      case 'directed':
        return 'Call Donor';
      case 'autologous':
        return 'Self Donor';
      case 'apheresis':
        return 'Apheresis';
      default:
        return category;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Fetching donor bleed summary...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-lg font-bold">BLOOD CARE FOUNDATION</CardTitle>
        <p className="text-sm font-medium">Donor Blood Category Report</p>
      </CardHeader>
      <CardContent>
        <div className="border border-gray-400">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-400">
                <TableHead className="border-r border-gray-400 text-center font-bold bg-gray-50">
                  Donor Category
                </TableHead>
                <TableHead className="text-center font-bold bg-gray-50">
                  Total Bags
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={index} className="border-b border-gray-400">
                  <TableCell className="border-r border-gray-400 text-center">
                    {formatCategoryName(item.donor_category)}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.total_bags}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="border-b-2 border-gray-400 bg-gray-50">
                <TableCell className="border-r border-gray-400 text-center font-bold">
                  Total
                </TableCell>
                <TableCell className="text-center font-bold">
                  {totalBags}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        
        {data.length === 0 && !loading && (
          <div className="text-center py-8 text-muted-foreground">
            No bleeding records found for the selected date range.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DonorBleedSummaryTable;
