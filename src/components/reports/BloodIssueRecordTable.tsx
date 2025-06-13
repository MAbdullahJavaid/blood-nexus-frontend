
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface BloodIssueRecordTableProps {
  category?: string;
  fromDate?: string;
  toDate?: string;
}

interface BloodIssueRecord {
  req_no: string;
  patient_info: string;
  blood_group: string;
  hospital: string;
  quantity_required: string;
  blood_product_issue: string;
  blood_issue_date: string;
  blood_issue_time: string;
  donor_info: string;
  is_pre_crossmatch: boolean;
}

const BloodIssueRecordTable = ({ category, fromDate, toDate }: BloodIssueRecordTableProps) => {
  const [data, setData] = useState<BloodIssueRecord[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (fromDate && toDate) {
      fetchBloodIssueRecords();
    }
  }, [category, fromDate, toDate]);

  const fetchBloodIssueRecords = async () => {
    if (!fromDate || !toDate) return;

    setLoading(true);
    console.log("Fetching blood issue records for date range:", fromDate, "to", toDate);

    try {
      const records: BloodIssueRecord[] = [];

      // Fetch pre-crossmatch records
      let preCrossmatchQuery = supabase
        .from('pre_crossmatch')
        .select(`
          document_no,
          patient_name,
          age,
          blood_group,
          rh,
          hospital,
          created_at
        `)
        .gte('created_at', fromDate)
        .lte('created_at', toDate);

      const { data: preCrossmatchData, error: preCrossmatchError } = await preCrossmatchQuery;

      if (preCrossmatchError) {
        console.error("Error fetching pre-crossmatch records:", preCrossmatchError);
      } else if (preCrossmatchData) {
        console.log("Pre-crossmatch data:", preCrossmatchData);

        for (const record of preCrossmatchData) {
          // Get patient invoice info for additional details
          const { data: invoiceData } = await supabase
            .from('patient_invoices')
            .select('patient_id, bottle_quantity, bottle_unit, blood_category, document_date, created_at')
            .eq('document_no', record.document_no)
            .single();

          const bloodGroup = record.blood_group && record.rh 
            ? `${record.blood_group} ${record.rh}`
            : record.blood_group || '';

          const patientInfo = invoiceData?.patient_id 
            ? `${invoiceData.patient_id} ${record.patient_name}`
            : record.patient_name;

          const quantity = invoiceData?.bottle_quantity && invoiceData?.bottle_unit
            ? `${invoiceData.bottle_quantity} ${invoiceData.bottle_unit}`
            : '1 Bag';

          const issueDate = invoiceData?.document_date 
            ? format(new Date(invoiceData.document_date), 'dd/MM/yyyy')
            : format(new Date(record.created_at), 'dd/MM/yyyy');

          const issueTime = invoiceData?.created_at
            ? format(new Date(invoiceData.created_at), 'HH:mm:ss aa')
            : format(new Date(record.created_at), 'HH:mm:ss aa');

          records.push({
            req_no: record.document_no,
            patient_info: patientInfo,
            blood_group: bloodGroup,
            hospital: record.hospital || '',
            quantity_required: quantity,
            blood_product_issue: invoiceData?.blood_category || 'P.C',
            blood_issue_date: issueDate,
            blood_issue_time: issueTime,
            donor_info: '',
            is_pre_crossmatch: true
          });
        }
      }

      // Fetch crossmatch records
      let crossmatchQuery = supabase
        .from('crossmatch_records')
        .select(`
          crossmatch_no,
          patient_name,
          age,
          blood_group,
          rh,
          hospital,
          quantity,
          blood_category,
          date,
          created_at,
          product_id
        `)
        .gte('date', fromDate.split('T')[0])
        .lte('date', toDate.split('T')[0]);

      const { data: crossmatchData, error: crossmatchError } = await crossmatchQuery;

      if (crossmatchError) {
        console.error("Error fetching crossmatch records:", crossmatchError);
      } else if (crossmatchData) {
        console.log("Crossmatch data:", crossmatchData);

        for (const record of crossmatchData) {
          // Get donor info if product_id exists
          let donorName = '';
          if (record.product_id) {
            const { data: productData } = await supabase
              .from('products')
              .select('donor_name')
              .eq('bag_no', record.product_id)
              .single();

            if (productData) {
              donorName = productData.donor_name;
            } else {
              // Try to get donor info from bleeding_records
              const { data: bleedingData } = await supabase
                .from('bleeding_records')
                .select(`
                  donors (
                    name
                  )
                `)
                .eq('bag_id', record.product_id)
                .single();

              if (bleedingData?.donors) {
                donorName = bleedingData.donors.name;
              }
            }
          }

          // Get patient ID from patient_invoices
          const { data: invoiceData } = await supabase
            .from('patient_invoices')
            .select('patient_id')
            .eq('document_no', record.crossmatch_no)
            .single();

          const bloodGroup = record.blood_group && record.rh 
            ? `${record.blood_group} ${record.rh}`
            : record.blood_group || '';

          const patientInfo = invoiceData?.patient_id 
            ? `${invoiceData.patient_id} ${record.patient_name}`
            : record.patient_name;

          const issueTime = format(new Date(record.created_at), 'HH:mm:ss aa');

          records.push({
            req_no: record.crossmatch_no,
            patient_info: patientInfo,
            blood_group: bloodGroup,
            hospital: record.hospital || '',
            quantity_required: `${record.quantity} Bag`,
            blood_product_issue: record.blood_category || 'P.C',
            blood_issue_date: format(new Date(record.date), 'dd/MM/yyyy'),
            blood_issue_time: issueTime,
            donor_info: donorName,
            is_pre_crossmatch: false
          });
        }
      }

      // Filter by category if specified
      let filteredRecords = records;
      if (category && category !== "All") {
        filteredRecords = records.filter(record => 
          record.blood_product_issue === category
        );
      }

      // Sort by document number in ascending order
      filteredRecords.sort((a, b) => a.req_no.localeCompare(b.req_no));

      setData(filteredRecords);
    } catch (error) {
      console.error("Error in fetchBloodIssueRecords:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    console.log("Exporting blood issue records...");
    
    // Create CSV content
    const headers = [
      "Req.No.",
      "Patients Info",
      "Blood Group",
      "Hospital",
      "Quantity Required",
      "Blood Product Issue",
      "Blood Issue Date",
      "Blood Issue Time",
      "Donor Info"
    ];

    const csvContent = [
      headers.join(","),
      ...data.map(record => [
        record.req_no,
        `"${record.patient_info}"`,
        record.blood_group,
        `"${record.hospital}"`,
        record.quantity_required,
        record.blood_product_issue,
        record.blood_issue_date,
        record.blood_issue_time,
        `"${record.donor_info}"`
      ].join(","))
    ].join("\n");

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `blood_issue_record_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Fetching blood issue records...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-lg font-bold">BLOOD CARE FOUNDATION</CardTitle>
        <p className="text-sm font-medium">Blood Issuing Record</p>
        <div className="flex justify-end">
          <Button onClick={handleExport} className="flex items-center gap-2" size="sm">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border border-gray-400">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-400">
                <TableHead className="border-r border-gray-400 text-center font-bold bg-gray-50 text-xs p-2">
                  Req.No.
                </TableHead>
                <TableHead className="border-r border-gray-400 text-center font-bold bg-gray-50 text-xs p-2">
                  Patients Info
                </TableHead>
                <TableHead className="border-r border-gray-400 text-center font-bold bg-gray-50 text-xs p-2">
                  Blood Group
                </TableHead>
                <TableHead className="border-r border-gray-400 text-center font-bold bg-gray-50 text-xs p-2">
                  Hospital
                </TableHead>
                <TableHead className="border-r border-gray-400 text-center font-bold bg-gray-50 text-xs p-2">
                  Quantity Required
                </TableHead>
                <TableHead className="border-r border-gray-400 text-center font-bold bg-gray-50 text-xs p-2">
                  Blood Product Issue
                </TableHead>
                <TableHead className="border-r border-gray-400 text-center font-bold bg-gray-50 text-xs p-2">
                  Blood Issue Date
                </TableHead>
                <TableHead className="border-r border-gray-400 text-center font-bold bg-gray-50 text-xs p-2">
                  Blood Issue Time
                </TableHead>
                <TableHead className="text-center font-bold bg-gray-50 text-xs p-2">
                  Donor Info
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((record, index) => (
                <TableRow 
                  key={index} 
                  className={`border-b border-gray-400 ${record.is_pre_crossmatch ? 'text-red-600' : ''}`}
                >
                  <TableCell className="border-r border-gray-400 text-center text-xs p-1">
                    {record.req_no}
                  </TableCell>
                  <TableCell className="border-r border-gray-400 text-center text-xs p-1">
                    {record.patient_info}
                  </TableCell>
                  <TableCell className="border-r border-gray-400 text-center text-xs p-1">
                    {record.blood_group}
                  </TableCell>
                  <TableCell className="border-r border-gray-400 text-center text-xs p-1">
                    {record.hospital}
                  </TableCell>
                  <TableCell className="border-r border-gray-400 text-center text-xs p-1">
                    {record.quantity_required}
                  </TableCell>
                  <TableCell className="border-r border-gray-400 text-center text-xs p-1">
                    {record.blood_product_issue}
                  </TableCell>
                  <TableCell className="border-r border-gray-400 text-center text-xs p-1">
                    {record.blood_issue_date}
                  </TableCell>
                  <TableCell className="border-r border-gray-400 text-center text-xs p-1">
                    {record.blood_issue_time}
                  </TableCell>
                  <TableCell className="text-center text-xs p-1">
                    {record.donor_info}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {data.length === 0 && !loading && (
          <div className="text-center py-8 text-muted-foreground">
            No blood issue records found for the selected criteria.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BloodIssueRecordTable;
