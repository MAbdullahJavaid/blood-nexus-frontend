
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface BagBleedSummaryTableProps {
  fromDate?: Date;
  toDate?: Date;
}

interface BagTypeCount {
  bag_type: string;
  total_bags: number;
}

const BagBleedSummaryTable = ({ fromDate, toDate }: BagBleedSummaryTableProps) => {
  const [data, setData] = useState<BagTypeCount[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalBags, setTotalBags] = useState(0);

  useEffect(() => {
    if (fromDate && toDate) {
      fetchBagBleedSummary();
    }
  }, [fromDate, toDate]);

  const fetchBagBleedSummary = async () => {
    if (!fromDate || !toDate) return;

    setLoading(true);
    console.log("Fetching bag bleed summary for date range:", fromDate, "to", toDate);

    try {
      let query = supabase
        .from('bleeding_records')
        .select('bag_type')
        .gte('bleeding_date', format(fromDate, 'yyyy-MM-dd'))
        .lte('bleeding_date', format(toDate, 'yyyy-MM-dd'))
        .not('bag_type', 'is', null);

      const { data: bleedingData, error } = await query;

      if (error) {
        console.error("Error fetching bleeding records:", error);
        return;
      }

      console.log("Raw bleeding data:", bleedingData);

      // Count bag types
      const bagTypeMap = new Map<string, number>();
      
      bleedingData?.forEach((record) => {
        const bagType = record.bag_type || 'Unknown';
        bagTypeMap.set(bagType, (bagTypeMap.get(bagType) || 0) + 1);
      });

      // Convert to array and sort
      const bagTypeData: BagTypeCount[] = Array.from(bagTypeMap.entries()).map(([bagType, count]) => ({
        bag_type: bagType,
        total_bags: count
      }));

      // Sort by bag type name for consistent display
      bagTypeData.sort((a, b) => a.bag_type.localeCompare(b.bag_type));

      console.log("Processed bag type data:", bagTypeData);

      const total = bagTypeData.reduce((sum, item) => sum + item.total_bags, 0);
      
      setData(bagTypeData);
      setTotalBags(total);
    } catch (error) {
      console.error("Error in fetchBagBleedSummary:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatBagTypeName = (bagType: string) => {
    // Format bag type names to match the report format
    switch (bagType.toLowerCase()) {
      case 'single':
        return 'Single';
      case 'double':
        return 'Double';
      case 'triple':
        return 'Triple';
      case 'megaunit':
        return 'Megaunit';
      default:
        return bagType;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Fetching bag bleed summary...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-lg font-bold">BLOOD CARE FOUNDATION</CardTitle>
        <p className="text-sm font-medium">Bag Bleeded Summary Report</p>
      </CardHeader>
      <CardContent>
        <div className="border border-gray-400">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-400">
                <TableHead className="border-r border-gray-400 text-center font-bold bg-gray-50">
                  Bag Type
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
                    {formatBagTypeName(item.bag_type)}
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

export default BagBleedSummaryTable;
