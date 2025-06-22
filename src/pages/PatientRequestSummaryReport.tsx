
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Search, Printer } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const PatientRequestSummaryReport = () => {
  const navigate = useNavigate();
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [summaryData, setSummaryData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const handleOK = async () => {
    if (!dateFrom) {
      toast.error("Please select a start date");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('patient_invoices')
        .select(`
          *,
          invoice_items:invoice_items(test_name, quantity, total_price)
        `)
        .gte('document_date', dateFrom)
        .lte('document_date', dateTo || dateFrom)
        .order('document_date', { ascending: true });

      if (error) throw error;

      setSummaryData(data || []);
      setShowReport(true);
      toast.success("Summary report generated successfully");
    } catch (error) {
      console.error("Error fetching summary data:", error);
      toast.error("Failed to generate summary report");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setDateFrom("");
    setDateTo("");
    setSummaryData([]);
    setShowReport(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExit = () => {
    navigate("/dashboard");
  };

  const calculateTotals = () => {
    const totalAmount = summaryData.reduce((sum, invoice) => sum + (invoice.total_amount || 0), 0);
    const totalReceived = summaryData.reduce((sum, invoice) => sum + (invoice.amount_received || 0), 0);
    const totalDiscount = summaryData.reduce((sum, invoice) => sum + (invoice.discount_amount || 0), 0);
    
    return { totalAmount, totalReceived, totalDiscount };
  };

  const { totalAmount, totalReceived, totalDiscount } = calculateTotals();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <FileText className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Patient Request Summary Report</h1>
      </div>

      {!showReport ? (
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="bg-yellow-100 border-b">
            <CardTitle className="flex items-center gap-2 text-lg">
              <span>📊</span>
              Summary Report Filter
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2">
                <Search className="text-green-600 h-5 w-5" />
                <span className="font-medium">Date Range Filter</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium">From Date:</Label>
                  <Input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="font-medium">To Date:</Label>
                  <Input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="flex justify-center gap-4 pt-4">
                <Button onClick={handleOK} className="px-8 bg-red-600 hover:bg-red-700" disabled={isLoading}>
                  {isLoading ? "Loading..." : "OK"}
                </Button>
                <Button variant="outline" onClick={handleCancel} className="px-8">
                  Cancel
                </Button>
                <Button variant="outline" onClick={handleExit} className="px-8">
                  Exit
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-end gap-4 mb-4 no-print">
            <Button onClick={handlePrint} className="px-8 bg-blue-600 hover:bg-blue-700">
              <Printer className="h-4 w-4 mr-2" />
              Print Report
            </Button>
            <Button variant="outline" onClick={() => setShowReport(false)} className="px-8">
              Back to Filter
            </Button>
          </div>

          <Card className="print:shadow-none print:border-black">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold">Patient Request Summary Report</h1>
                <p className="text-gray-600">
                  From: {new Date(dateFrom).toLocaleDateString()} 
                  {dateTo && ` - To: ${new Date(dateTo).toLocaleDateString()}`}
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-2 text-left">Document No</th>
                      <th className="border border-gray-300 p-2 text-left">Date</th>
                      <th className="border border-gray-300 p-2 text-left">Patient Name</th>
                      <th className="border border-gray-300 p-2 text-left">Hospital</th>
                      <th className="border border-gray-300 p-2 text-right">Total Amount</th>
                      <th className="border border-gray-300 p-2 text-right">Amount Received</th>
                      <th className="border border-gray-300 p-2 text-right">Discount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summaryData.map((invoice) => (
                      <tr key={invoice.id}>
                        <td className="border border-gray-300 p-2">{invoice.document_no}</td>
                        <td className="border border-gray-300 p-2">
                          {new Date(invoice.document_date).toLocaleDateString()}
                        </td>
                        <td className="border border-gray-300 p-2">{invoice.patient_name}</td>
                        <td className="border border-gray-300 p-2">{invoice.hospital_name}</td>
                        <td className="border border-gray-300 p-2 text-right">
                          {invoice.total_amount?.toFixed(2) || '0.00'}
                        </td>
                        <td className="border border-gray-300 p-2 text-right">
                          {invoice.amount_received?.toFixed(2) || '0.00'}
                        </td>
                        <td className="border border-gray-300 p-2 text-right">
                          {invoice.discount_amount?.toFixed(2) || '0.00'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-100 font-bold">
                      <td colSpan={4} className="border border-gray-300 p-2 text-right">Totals:</td>
                      <td className="border border-gray-300 p-2 text-right">{totalAmount.toFixed(2)}</td>
                      <td className="border border-gray-300 p-2 text-right">{totalReceived.toFixed(2)}</td>
                      <td className="border border-gray-300 p-2 text-right">{totalDiscount.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="mt-6 text-sm text-gray-600">
                <p>Total Records: {summaryData.length}</p>
                <p>Report Generated: {new Date().toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PatientRequestSummaryReport;
