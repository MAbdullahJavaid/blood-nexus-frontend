
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import { format } from "date-fns";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface RecordGroupWiseTableProps {
  fromDate?: Date;
  toDate?: Date;
}

interface BloodGroupSummary {
  blood_group: string;
  count: number;
}

const RecordGroupWiseTable = ({ fromDate, toDate }: RecordGroupWiseTableProps) => {
  const { data: bloodGroupData, isLoading, error } = useQuery({
    queryKey: ['record-group-wise', fromDate, toDate],
    queryFn: async () => {
      let query = supabase
        .from('bleeding_records')
        .select(`
          donors!inner (
            blood_group_separate,
            rh_factor
          )
        `);

      if (fromDate) {
        query = query.gte('bleeding_date', format(fromDate, 'yyyy-MM-dd'));
      }
      if (toDate) {
        query = query.lte('bleeding_date', format(toDate, 'yyyy-MM-dd'));
      }

      const { data, error } = await query;
      if (error) {
        console.error('Error fetching bleeding records:', error);
        throw error;
      }

      // Group by blood group
      const bloodGroupCounts: { [key: string]: number } = {};
      
      data?.forEach(record => {
        if (record.donors) {
          const bloodGroup = record.donors.blood_group_separate || '';
          const rhFactor = record.donors.rh_factor || '';
          const combinedGroup = bloodGroup + (rhFactor === '+ve' ? '+ve' : rhFactor === '-ve' ? '-ve' : rhFactor);
          
          if (combinedGroup) {
            bloodGroupCounts[combinedGroup] = (bloodGroupCounts[combinedGroup] || 0) + 1;
          }
        }
      });

      // Convert to array and sort by blood group
      const bloodGroupOrder = ['A+ve', 'B+ve', 'O+ve', 'AB+ve', 'A-ve', 'B-ve', 'O-ve', 'AB-ve', 'A--', 'B--', 'O--', 'AB--'];
      
      return bloodGroupOrder
        .map(group => ({
          blood_group: group,
          count: bloodGroupCounts[group] || 0
        }))
        .filter(item => item.count > 0);
    }
  });

  const totalCount = bloodGroupData?.reduce((sum, item) => sum + item.count, 0) || 0;

  const exportToPDF = async () => {
    const element = document.getElementById('record-group-wise-table');
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    
    let position = 0;
    
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    const dateRange = fromDate && toDate 
      ? `${format(fromDate, 'dd-MM-yyyy')}_to_${format(toDate, 'dd-MM-yyyy')}`
      : 'all_dates';
    
    pdf.save(`Record_Group_Wise_${dateRange}.pdf`);
  };

  const exportToJPEG = async () => {
    const element = document.getElementById('record-group-wise-table');
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true
    });
    
    const link = document.createElement('a');
    link.download = `Record_Group_Wise_${fromDate && toDate 
      ? `${format(fromDate, 'dd-MM-yyyy')}_to_${format(toDate, 'dd-MM-yyyy')}`
      : 'all_dates'}.jpeg`;
    link.href = canvas.toDataURL('image/jpeg', 0.9);
    link.click();
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading blood group summary...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">Error loading blood group summary</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="space-y-4">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Record Group Wise Report
          </CardTitle>
          <div className="flex gap-2">
            <Button onClick={exportToPDF} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
            <Button onClick={exportToJPEG} variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export JPEG
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div id="record-group-wise-table" className="bg-white p-8">
          {/* Report Header */}
          <div className="text-center mb-8 space-y-2">
            <h1 className="text-xl font-bold">BLOOD CARE FOUNDATION</h1>
            <h2 className="text-lg font-semibold">Blood Donor Register Group Wise</h2>
            <div className="text-sm">
              For the Period from {fromDate ? format(fromDate, 'MMM, dd yyyy') : 'Start'} to {toDate ? format(toDate, 'MMM, dd yyyy') : 'End'}
            </div>
            <div className="text-xs text-gray-600">
              Print Date: {format(new Date(), 'dd-MMM-yyyy HH:mm:ss')} pm
            </div>
          </div>

          {/* Blood Group Summary Table */}
          <div className="max-w-md mx-auto">
            <Table className="border border-gray-800">
              <TableHeader>
                <TableRow>
                  <TableHead className="border border-gray-800 text-center font-bold text-black bg-gray-100">
                    Blood Group
                  </TableHead>
                  <TableHead className="border border-gray-800 text-center font-bold text-black bg-gray-100">
                    Total:
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bloodGroupData?.map((item) => (
                  <TableRow key={item.blood_group}>
                    <TableCell className="border border-gray-800 text-center font-medium">
                      {item.blood_group}
                    </TableCell>
                    <TableCell className="border border-gray-800 text-center">
                      {item.count}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell className="border border-gray-800 text-center font-bold bg-gray-100">
                    Grand Total:
                  </TableCell>
                  <TableCell className="border border-gray-800 text-center font-bold bg-gray-100">
                    {totalCount}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {bloodGroupData?.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No bleeding records found for the selected criteria.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecordGroupWiseTable;
