import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Search, FileText, Calendar as CalendarIcon, Download, FileImage, FileType } from "lucide-react";
import { DocumentSearchModal } from "@/components/forms/patient-invoice/DocumentSearchModal";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PatientInvoiceData {
  id: string;
  document_no: string;
  patient_id: string;
  patient_name: string;
  age: number;
  gender: string;
  phone_no: string;
  hospital_name: string;
  blood_group_separate: string;
  reference_notes: string;
  document_date: string;
  total_amount: number;
  amount_received: number;
  created_at: string;
  invoice_items: Array<{
    test_name: string;
    quantity: number;
    unit_price: number;
    total_price: number;
  }>;
}

const PatientRequestReportFilter = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [invoiceNoFrom, setInvoiceNoFrom] = useState("");
  const [invoiceNoTo, setInvoiceNoTo] = useState("");
  const [fiscalYear, setFiscalYear] = useState("2024-25");
  const [datePreset, setDatePreset] = useState("");
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [isFromModalOpen, setIsFromModalOpen] = useState(false);
  const [isToModalOpen, setIsToModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const handleDocumentSelect = (docNum: string, isFromField: boolean) => {
    if (isFromField) {
      setInvoiceNoFrom(docNum);
      setIsFromModalOpen(false);
    } else {
      setInvoiceNoTo(docNum);
      setIsToModalOpen(false);
    }
  };

  const handleFiscalYearChange = (year: string) => {
    setFiscalYear(year);
    setDatePreset(""); // Clear preset when fiscal year changes
    // Auto-adjust dates based on fiscal year
    const startYear = parseInt(year.split('-')[0]);
    const endYear = startYear + 1;
    setFromDate(new Date(startYear, 3, 1)); // April 1st
    setToDate(new Date(endYear, 2, 31)); // March 31st
  };

  const handleDatePresetChange = (preset: string) => {
    setDatePreset(preset);
    const today = new Date();
    
    switch (preset) {
      case "today":
        setFromDate(today);
        setToDate(today);
        break;
      case "yesterday":
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        setFromDate(yesterday);
        setToDate(yesterday);
        break;
      case "this-week":
        const startOfWeek = new Date(today);
        const day = today.getDay();
        const diff = today.getDate() - day + (day === 0 ? -6 : 1); // adjust for Sunday
        startOfWeek.setDate(diff);
        setFromDate(startOfWeek);
        setToDate(today);
        break;
      case "this-month":
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        setFromDate(startOfMonth);
        setToDate(today);
        break;
    }
  };

  // Fetch patient invoices based on filters
  const { data: invoices, isLoading, refetch } = useQuery({
    queryKey: ['patient-invoices', invoiceNoFrom, invoiceNoTo, fromDate, toDate],
    queryFn: async () => {
      let query = supabase
        .from('patient_invoices')
        .select(`
          *,
          invoice_items (
            test_name,
            quantity,
            unit_price,
            total_price
          )
        `);

      // Apply filters
      if (invoiceNoFrom && invoiceNoTo) {
        query = query.gte('document_no', invoiceNoFrom).lte('document_no', invoiceNoTo);
      } else if (invoiceNoFrom) {
        query = query.gte('document_no', invoiceNoFrom);
      } else if (invoiceNoTo) {
        query = query.lte('document_no', invoiceNoTo);
      }

      if (fromDate) {
        query = query.gte('document_date', format(fromDate, 'yyyy-MM-dd'));
      }
      if (toDate) {
        query = query.lte('document_date', format(toDate, 'yyyy-MM-dd'));
      }

      const { data, error } = await query.order('document_date', { ascending: false });
      
      if (error) throw error;
      return data as PatientInvoiceData[];
    },
    enabled: false // Don't auto-fetch, only fetch when OK is clicked
  });

  const handleOK = () => {
    console.log("Applying filters:", {
      invoiceNoFrom,
      invoiceNoTo,
      fiscalYear,
      fromDate,
      toDate
    });
    setCurrentPage(0);
    refetch();
  };

  const handleCancel = () => {
    setInvoiceNoFrom("");
    setInvoiceNoTo("");
    setFiscalYear("2024-25");
    setDatePreset("");
    setFromDate(undefined);
    setToDate(undefined);
    setCurrentPage(0);
  };

  const handleExport = (format: 'pdf' | 'jpeg') => {
    if (!invoices || invoices.length === 0) {
      toast({
        title: "No Data",
        description: "Please generate a report first before exporting.",
        variant: "destructive"
      });
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const currentInvoice = invoices[currentPage];
    const reportContent = generateReportHTML(currentInvoice);
    
    printWindow.document.write(reportContent);
    printWindow.document.close();
    
    if (format === 'pdf') {
      printWindow.print();
    }
    
    toast({
      title: "Export Started",
      description: `Report export initiated for ${format.toUpperCase()} format.`
    });
  };

  const generateReportHTML = (invoice: PatientInvoiceData) => {
    const totalAmount = invoice.invoice_items?.reduce((sum, item) => sum + item.total_price, 0) || 0;
    const amountLess = totalAmount - invoice.amount_received;
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Patient Invoice Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; background: #f0f0f0; }
            .report-container { background: white; padding: 20px; border: 2px solid #000; max-width: 800px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 20px; }
            .header h1 { margin: 0; font-size: 18px; font-weight: bold; }
            .header h2 { margin: 5px 0; font-size: 16px; font-style: italic; }
            .meta-info { display: flex; justify-content: space-between; margin: 20px 0; font-size: 12px; }
            .patient-info { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
            .info-row { display: flex; margin: 5px 0; }
            .info-label { font-weight: bold; min-width: 120px; }
            .tests-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .tests-table th, .tests-table td { border: 1px solid #000; padding: 8px; text-align: left; }
            .tests-table th { background: #f0f0f0; font-weight: bold; }
            .amount-section { margin: 20px 0; }
            .amount-row { display: flex; justify-content: space-between; margin: 5px 0; }
            .signature { text-align: center; margin-top: 40px; font-weight: bold; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="report-container">
            <div class="header">
              <h1>SUNDAS FOUNDATION</h1>
              <h2>PATIENT RECEIPT</h2>
            </div>
            
            <div class="meta-info">
              <div>Print Date: ${format(new Date(), 'dd-MMM-yyyy HH:mm:ss aa')}</div>
              <div>Page 1 of 1</div>
            </div>
            
            <div style="display: flex; justify-content: space-between; margin: 20px 0;">
              <div><strong>Patient #: ${invoice.patient_id || 'N/A'}</strong></div>
              <div><strong>Document No: ${invoice.document_no}</strong></div>
            </div>
            
            <div class="patient-info">
              <div>
                <div class="info-row">
                  <span class="info-label">Patient Name:</span>
                  <span>${invoice.patient_name}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Age/Sex:</span>
                  <span>${invoice.age || 'N/A'} Year(s)/${invoice.gender || 'N/A'}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Phone:</span>
                  <span>${invoice.phone_no || 'N/A'}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Hospital Name:</span>
                  <span>${invoice.hospital_name || 'N/A'}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Blood Group:</span>
                  <span>${invoice.blood_group_separate || 'N/A'}</span>
                </div>
              </div>
              <div>
                <div class="info-row">
                  <span class="info-label">Registration Date:</span>
                  <span>${format(new Date(invoice.document_date), 'dd/MM/yyyy')}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">EX Donor:</span>
                  <span></span>
                </div>
                <div class="info-row">
                  <span class="info-label">Registration Loc:</span>
                  <span>SUNDAS FOUNDATION</span>
                </div>
                <div class="info-row">
                  <span class="info-label">References:</span>
                  <span>${invoice.reference_notes || 'N/A'}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Product Category:</span>
                  <span>0</span>
                </div>
              </div>
            </div>
            
            <table class="tests-table">
              <thead>
                <tr>
                  <th>Test(s)</th>
                  <th>Quantity</th>
                  <th>Rate</th>
                </tr>
              </thead>
              <tbody>
                ${invoice.invoice_items?.map((item, index) => `
                  <tr>
                    <td>${String(index + 1).padStart(2, '0')} ${item.test_name}</td>
                    <td>${item.quantity}</td>
                    <td>${item.unit_price}</td>
                  </tr>
                `).join('') || '<tr><td colspan="3">No tests found</td></tr>'}
              </tbody>
            </table>
            
            <div class="amount-section">
              <div class="amount-row">
                <span><strong>Total Amount :</strong></span>
                <span><strong>${totalAmount}</strong></span>
              </div>
              <div class="amount-row">
                <span><strong>Amount Less :</strong></span>
                <span><strong>${amountLess}</strong></span>
              </div>
              <div class="amount-row">
                <span><strong>To Be Paid :</strong></span>
                <span style="border-bottom: 2px solid #000; min-width: 150px; display: inline-block;"></span>
              </div>
              <div class="amount-row">
                <span><strong>Paid :</strong></span>
                <span style="border-bottom: 2px solid #000; min-width: 150px; display: inline-block;"></span>
              </div>
            </div>
            
            <div class="signature">
              <div style="margin-top: 40px;">
                <strong>Registered By : SUNDAS FOUNDATION</strong>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  };

  const handleExit = () => {
    navigate("/dashboard");
  };

  const currentInvoice = invoices?.[currentPage];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <FileText className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Patient Request Filter</h1>
      </div>

      {/* Filter Card */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="bg-yellow-100 border-b">
          <CardTitle className="flex items-center gap-2 text-lg">
            <span>📊</span>
            Report Filter
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Filter Header */}
            <div className="flex items-center gap-2 pb-2">
              <span className="text-green-600">🔍</span>
              <span className="font-medium">Filter</span>
            </div>

            {/* Filter Table */}
            <div className="border border-gray-300">
              {/* Table Header */}
              <div className="grid grid-cols-3 bg-gray-200 border-b">
                <div className="p-3 border-r text-center font-medium">Column</div>
                <div className="p-3 border-r text-center font-medium">From</div>
                <div className="p-3 text-center font-medium">To</div>
              </div>

              {/* Fiscal Year Row */}
              <div className="grid grid-cols-3 border-b">
                <div className="p-3 border-r bg-gray-50">
                  <Label className="font-medium">Fiscal Year:</Label>
                </div>
                <div className="p-3 border-r">
                  <div className="space-y-2">
                    <Select value={fiscalYear} onValueChange={handleFiscalYearChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select fiscal year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024-25">2024-25</SelectItem>
                        <SelectItem value="2023-24">2023-24</SelectItem>
                        <SelectItem value="2022-23">2022-23</SelectItem>
                        <SelectItem value="2021-22">2021-22</SelectItem>
                        <SelectItem value="2020-21">2020-21</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={datePreset} onValueChange={handleDatePresetChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Quick date selection" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="yesterday">Yesterday</SelectItem>
                        <SelectItem value="this-week">This Week</SelectItem>
                        <SelectItem value="this-month">This Month</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="p-3">
                  {/* Empty cell for fiscal year end */}
                </div>
              </div>

              {/* Invoice No Row */}
              <div className="grid grid-cols-3 border-b">
                <div className="p-3 border-r bg-gray-50">
                  <Label className="font-medium">Invoice No:</Label>
                </div>
                <div className="p-3 border-r">
                  <div className="flex items-center gap-2">
                    <Input
                      value={invoiceNoFrom}
                      onChange={(e) => setInvoiceNoFrom(e.target.value)}
                      placeholder=""
                      className="flex-1"
                      readOnly
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsFromModalOpen(true)}
                      className="p-2"
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex items-center gap-2">
                    <Input
                      value={invoiceNoTo}
                      onChange={(e) => setInvoiceNoTo(e.target.value)}
                      placeholder=""
                      className="flex-1"
                      readOnly
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsToModalOpen(true)}
                      className="p-2"
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* From Date Row */}
              <div className="grid grid-cols-3 border-b">
                <div className="p-3 border-r bg-gray-50">
                  <Label className="font-medium">From Date:</Label>
                </div>
                <div className="p-3 border-r">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !fromDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {fromDate ? format(fromDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={fromDate}
                        onSelect={setFromDate}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="p-3">
                  {/* Empty cell */}
                </div>
              </div>

              {/* To Date Row */}
              <div className="grid grid-cols-3">
                <div className="p-3 border-r bg-gray-50">
                  <Label className="font-medium">To Date:</Label>
                </div>
                <div className="p-3 border-r">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !toDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {toDate ? format(toDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={toDate}
                        onSelect={setToDate}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="p-3">
                  {/* Empty cell */}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 pt-4">
              <Button onClick={handleOK} className="px-8">
                OK
              </Button>
              <Button variant="outline" onClick={handleCancel} className="px-8">
                Cancel
              </Button>
              <div className="flex gap-2">
                <Button onClick={() => handleExport('pdf')} className="px-6 bg-green-600 hover:bg-green-700">
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
                <Button onClick={() => handleExport('jpeg')} className="px-6 bg-blue-600 hover:bg-blue-700">
                  <FileImage className="h-4 w-4 mr-2" />
                  Export JPEG
                </Button>
              </div>
              <Button variant="outline" onClick={handleExit} className="px-8">
                Exit
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Modals */}
      <DocumentSearchModal
        isOpen={isFromModalOpen}
        onOpenChange={setIsFromModalOpen}
        onDocumentSelect={(docNum) => handleDocumentSelect(docNum, true)}
      />
      
      <DocumentSearchModal
        isOpen={isToModalOpen}
        onOpenChange={setIsToModalOpen}
        onDocumentSelect={(docNum) => handleDocumentSelect(docNum, false)}
      />

      {/* Report Results */}
      {invoices && invoices.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Patient Receipt Report</CardTitle>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  Page {currentPage + 1} of {invoices.length}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                    disabled={currentPage === 0}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(invoices.length - 1, currentPage + 1))}
                    disabled={currentPage === invoices.length - 1}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {currentInvoice && (
              <div className="border-2 border-gray-800 p-6 bg-white max-w-4xl mx-auto" style={{ fontFamily: 'Arial, sans-serif' }}>
                {/* Header */}
                <div className="text-center mb-6">
                  <h1 className="text-xl font-bold mb-2">SUNDAS FOUNDATION</h1>
                  <h2 className="text-lg italic underline">PATIENT RECEIPT</h2>
                </div>
                
                {/* Meta Info */}
                <div className="flex justify-between text-xs mb-4">
                  <span>Print Date: {format(new Date(), 'dd-MMM-yyyy HH:mm:ss aa')}</span>
                  <span>Page 1 of 1</span>
                </div>
                
                {/* Patient and Document Numbers */}
                <div className="flex justify-between font-bold mb-4">
                  <span>Patient #: {currentInvoice.patient_id || '0340164047'}</span>
                  <span>Document No: {currentInvoice.document_no}</span>
                </div>
                
                {/* Patient Information */}
                <div className="grid grid-cols-2 gap-8 mb-6 text-sm">
                  <div className="space-y-1">
                    <div><strong>Patient Name:</strong> {currentInvoice.patient_name}</div>
                    <div><strong>Age/Sex:</strong> {currentInvoice.age || 'N/A'} Year(s)/{currentInvoice.gender || 'N/A'}</div>
                    <div><strong>Phone:</strong> {currentInvoice.phone_no || 'N/A'}</div>
                    <div><strong>Hospital Name:</strong> {currentInvoice.hospital_name || 'N/A'}</div>
                    <div><strong>Blood Group:</strong> {currentInvoice.blood_group_separate || 'N/A'}</div>
                  </div>
                  <div className="space-y-1">
                    <div><strong>Registration Date:</strong> {format(new Date(currentInvoice.document_date), 'dd/MM/yyyy')}</div>
                    <div><strong>EX Donor:</strong></div>
                    <div><strong>Registration Loc:</strong> SUNDAS FOUNDATION</div>
                    <div><strong>References:</strong> {currentInvoice.reference_notes || 'N/A'}</div>
                    <div><strong>Product Category:</strong> 0</div>
                  </div>
                </div>
                
                {/* Tests Table */}
                <table className="w-full border-collapse border border-gray-800 mb-6">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-800 p-2 text-left font-bold">Test(s)</th>
                      <th className="border border-gray-800 p-2 text-center font-bold">Quantity</th>
                      <th className="border border-gray-800 p-2 text-right font-bold">Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentInvoice.invoice_items?.map((item, index) => (
                      <tr key={index}>
                        <td className="border border-gray-800 p-2">
                          {String(index + 1).padStart(2, '0')} {item.test_name}
                        </td>
                        <td className="border border-gray-800 p-2 text-center">{item.quantity}</td>
                        <td className="border border-gray-800 p-2 text-right">{item.unit_price}</td>
                      </tr>
                    )) || (
                      <tr>
                        <td colSpan={3} className="border border-gray-800 p-2 text-center">No tests found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
                
                {/* Amount Section */}
                <div className="space-y-2 mb-8">
                  <div className="flex justify-between">
                    <span className="font-bold">Total Amount :</span>
                    <span className="font-bold">{currentInvoice.invoice_items?.reduce((sum, item) => sum + item.total_price, 0) || currentInvoice.total_amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold">Amount Less :</span>
                    <span className="font-bold">{(currentInvoice.invoice_items?.reduce((sum, item) => sum + item.total_price, 0) || currentInvoice.total_amount) - currentInvoice.amount_received}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold">To Be Paid :</span>
                    <span className="border-b-2 border-gray-800 w-32 inline-block"></span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold">Paid :</span>
                    <span className="border-b-2 border-gray-800 w-32 inline-block"></span>
                  </div>
                </div>
                
                {/* Signature */}
                <div className="text-center">
                  <div className="font-bold">Registered By : SUNDAS FOUNDATION</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* No Results */}
      {invoices && invoices.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Report Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No results found. Use the filters above to generate the patient request summary report.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Report Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading report data...</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PatientRequestReportFilter;
