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
import { Search, FileText, Calendar as CalendarIcon, Download, FileImage } from "lucide-react";
import { DocumentSearchModal } from "@/components/forms/patient-invoice/DocumentSearchModal";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

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
  discount_amount: number;
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
  const itemsPerPage = 20;

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
    queryKey: ['patient-invoices-summary', invoiceNoFrom, invoiceNoTo, fromDate, toDate],
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

    const reportContent = generateSummaryReportHTML(invoices, currentPage);
    
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

  const generateSummaryReportHTML = (invoices: PatientInvoiceData[], pageNumber: number) => {
    const totalPages = Math.ceil(invoices.length / itemsPerPage);
    const startIndex = pageNumber * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = invoices.slice(startIndex, endIndex);
    
    const totalAmount = invoices.reduce((sum, invoice) => sum + (invoice.total_amount || 0), 0);
    const totalDiscount = invoices.reduce((sum, invoice) => sum + (invoice.discount_amount || 0), 0);
    const totalNet = totalAmount - totalDiscount;
    
    const showTotals = pageNumber === totalPages - 1; // Show totals on last page
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Patient Invoice Summary</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .header h1 { margin: 0; font-size: 18px; font-weight: bold; }
            .header h2 { margin: 5px 0; font-size: 16px; text-decoration: underline; }
            .meta-info { display: flex; justify-content: space-between; margin: 20px 0; font-size: 12px; }
            .summary-table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 12px; }
            .summary-table th, .summary-table td { border: 1px solid #000; padding: 4px; text-align: left; }
            .summary-table th { background: #f0f0f0; font-weight: bold; text-align: center; }
            .summary-table .amount-col { text-align: right; }
            .totals-row { background: #e0e0e0; font-weight: bold; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>BLOOD CARE FOUNDATION</h1>
            <h2>PATIENT INVOICE SUMMARY</h2>
          </div>
          
          <div class="meta-info">
            <div>Print Date: ${format(new Date(), 'dd-MMM-yyyy HH:mm:ss aa')}</div>
            <div>Page ${pageNumber + 1} of ${totalPages}</div>
          </div>
          
          <table class="summary-table">
            <thead>
              <tr>
                <th>Document No</th>
                <th>Document Date</th>
                <th>Patient Info</th>
                <th>Amount</th>
                <th>Discount</th>
                <th>Net Amount</th>
              </tr>
            </thead>
            <tbody>
              ${pageData.map(invoice => `
                <tr>
                  <td>${invoice.document_no}</td>
                  <td>${format(new Date(invoice.document_date), 'dd/MM/yyyy')}</td>
                  <td>${invoice.patient_name || ''}</td>
                  <td class="amount-col">${(invoice.total_amount || 0).toFixed(2)}</td>
                  <td class="amount-col">${(invoice.discount_amount || 0).toFixed(2)}</td>
                  <td class="amount-col">${((invoice.total_amount || 0) - (invoice.discount_amount || 0)).toFixed(2)}</td>
                </tr>
              `).join('')}
              ${showTotals ? `
                <tr class="totals-row">
                  <td colspan="3" style="text-align: center;">TOTAL</td>
                  <td class="amount-col">${totalAmount.toFixed(2)}</td>
                  <td class="amount-col">${totalDiscount.toFixed(2)}</td>
                  <td class="amount-col">${totalNet.toFixed(2)}</td>
                </tr>
              ` : ''}
            </tbody>
          </table>
        </body>
      </html>
    `;
  };

  const handleExit = () => {
    navigate("/dashboard");
  };

  const totalPages = invoices ? Math.ceil(invoices.length / itemsPerPage) : 0;
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const pageData = invoices ? invoices.slice(startIndex, endIndex) : [];

  const totalAmount = invoices ? invoices.reduce((sum, invoice) => sum + (invoice.total_amount || 0), 0) : 0;
  const totalDiscount = invoices ? invoices.reduce((sum, invoice) => sum + (invoice.discount_amount || 0), 0) : 0;
  const totalNet = totalAmount - totalDiscount;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <FileText className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Patient Request Summary Filter</h1>
      </div>

      {/* Filter Card - keep existing code unchanged */}
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

      {/* Summary Report Results */}
      {invoices && invoices.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Patient Invoice Summary Report</CardTitle>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  Page {currentPage + 1} of {totalPages}
                </span>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                        className={currentPage === 0 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                        className={currentPage === totalPages - 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-white p-6 border" style={{ fontFamily: 'Arial, sans-serif' }}>
              {/* Header */}
              <div className="text-center mb-6">
                <h1 className="text-xl font-bold mb-2">BLOOD CARE FOUNDATION</h1>
                <h2 className="text-lg underline">PATIENT INVOICE SUMMARY</h2>
              </div>
              
              {/* Meta Info */}
              <div className="flex justify-between text-xs mb-4">
                <span>Print Date: {format(new Date(), 'dd-MMM-yyyy HH:mm:ss aa')}</span>
                <span>Page {currentPage + 1} of {totalPages}</span>
              </div>
              
              {/* Summary Table */}
              <Table className="text-xs">
                <TableHeader>
                  <TableRow>
                    <TableHead className="border border-gray-800 text-center font-bold">Document No</TableHead>
                    <TableHead className="border border-gray-800 text-center font-bold">Document Date</TableHead>
                    <TableHead className="border border-gray-800 text-center font-bold">Patient Info</TableHead>
                    <TableHead className="border border-gray-800 text-center font-bold">Amount</TableHead>
                    <TableHead className="border border-gray-800 text-center font-bold">Discount</TableHead>
                    <TableHead className="border border-gray-800 text-center font-bold">Net Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageData.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="border border-gray-800 p-1">{invoice.document_no}</TableCell>
                      <TableCell className="border border-gray-800 p-1">{format(new Date(invoice.document_date), 'dd/MM/yyyy')}</TableCell>
                      <TableCell className="border border-gray-800 p-1">{invoice.patient_name || ''}</TableCell>
                      <TableCell className="border border-gray-800 p-1 text-right">{(invoice.total_amount || 0).toFixed(2)}</TableCell>
                      <TableCell className="border border-gray-800 p-1 text-right">{(invoice.discount_amount || 0).toFixed(2)}</TableCell>
                      <TableCell className="border border-gray-800 p-1 text-right">{((invoice.total_amount || 0) - (invoice.discount_amount || 0)).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                  {/* Show totals only on the last page */}
                  {currentPage === totalPages - 1 && (
                    <TableRow className="bg-gray-100 font-bold">
                      <TableCell className="border border-gray-800 p-1 text-center" colSpan={3}>TOTAL</TableCell>
                      <TableCell className="border border-gray-800 p-1 text-right">{totalAmount.toFixed(2)}</TableCell>
                      <TableCell className="border border-gray-800 p-1 text-right">{totalDiscount.toFixed(2)}</TableCell>
                      <TableCell className="border border-gray-800 p-1 text-right">{totalNet.toFixed(2)}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
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
