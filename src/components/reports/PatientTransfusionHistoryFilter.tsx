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
  rh_factor: string;
  reference_notes: string;
  document_date: string;
  total_amount: number;
  amount_received: number;
  discount_amount: number;
  created_at: string;
  bottle_quantity: number;
  bottle_unit: string;
  blood_category: string;
}

interface Patient {
  id: string;
  patient_id: string;
  name: string;
  phone: string;
  blood_group_separate: string;
  rh_factor: string;
}

const PatientTransfusionHistoryFilter = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [fiscalYear, setFiscalYear] = useState("2024-25");
  const [datePreset, setDatePreset] = useState("");
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [isPatientSearchOpen, setIsPatientSearchOpen] = useState(false);
  const [patientSearchTerm, setPatientSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 20;

  // Fetch all patients for search
  const { data: patients } = useQuery({
    queryKey: ['all-patients-search', patientSearchTerm],
    queryFn: async () => {
      let query = supabase
        .from('patients')
        .select('id, patient_id, name, phone, blood_group_separate, rh_factor')
        .order('name');

      if (patientSearchTerm) {
        query = query.or(`patient_id.ilike.%${patientSearchTerm}%,name.ilike.%${patientSearchTerm}%,phone.ilike.%${patientSearchTerm}%`);
      }

      const { data, error } = await query.limit(50);
      
      if (error) throw error;
      return data as Patient[];
    },
    enabled: isPatientSearchOpen
  });

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    setSelectedPatientId(patient.patient_id);
    setIsPatientSearchOpen(false);
    setPatientSearchTerm("");
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
        const diff = today.getDate() - day + (day === 0 ? -6 : 1);
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

  // Fetch patient transfusion history using the selected patient_id
  const { data: transfusionHistory, isLoading, refetch } = useQuery({
    queryKey: ['patient-transfusion-history', selectedPatientId, fromDate, toDate],
    queryFn: async () => {
      if (!selectedPatientId) return [];

      let query = supabase
        .from('patient_invoices')
        .select('*')
        .eq('patient_id', selectedPatientId);

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
    enabled: false
  });

  const handleOK = () => {
    if (!selectedPatientId) {
      toast({
        title: "Patient Required",
        description: "Please select a patient first.",
        variant: "destructive"
      });
      return;
    }

    console.log("Applying filters:", {
      selectedPatientId,
      fiscalYear,
      fromDate,
      toDate
    });
    setCurrentPage(0);
    refetch();
  };

  const handleCancel = () => {
    setSelectedPatientId("");
    setSelectedPatient(null);
    setFiscalYear("2024-25");
    setDatePreset("");
    setFromDate(undefined);
    setToDate(undefined);
    setCurrentPage(0);
  };

  const handleExport = (format: 'pdf' | 'jpeg') => {
    if (!transfusionHistory || transfusionHistory.length === 0) {
      toast({
        title: "No Data",
        description: "Please generate a report first before exporting.",
        variant: "destructive"
      });
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const reportContent = generateTransfusionHistoryHTML(transfusionHistory);
    
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

  const generateTransfusionHistoryHTML = (data: PatientInvoiceData[]) => {
    const combinedBloodGroup = selectedPatient?.blood_group_separate && selectedPatient?.rh_factor 
      ? `${selectedPatient.blood_group_separate}${selectedPatient.rh_factor === '+ve' ? '+' : '-'}`
      : '';

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Patient Transfusion History</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; font-size: 12px; }
            .header { margin-bottom: 20px; }
            .header h1 { margin: 0; font-size: 16px; font-weight: bold; }
            .header h2 { margin: 5px 0; font-size: 14px; }
            .patient-info { display: flex; justify-content: space-between; margin: 15px 0; }
            .patient-info div { display: flex; align-items: center; gap: 10px; }
            .patient-info span { font-weight: bold; }
            .history-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .history-table th, .history-table td { border: 1px solid #000; padding: 6px; text-align: center; }
            .history-table th { background: #f0f0f0; font-weight: bold; }
            .history-table .date-col { text-align: left; }
            .history-table .blood-info-col { text-align: left; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>BLOOD CARE FOUNDATION</h1>
            <h2>Patient Transfusion History</h2>
          </div>
          
          <div class="patient-info">
            <div>
              <span>Patient ID:</span> ${selectedPatient?.patient_id || ''}
              <span>Type:</span> OPD
            </div>
          </div>
          
          <div class="patient-info">
            <div>
              <span>Name:</span> ${selectedPatient?.name || ''}
            </div>
          </div>
          
          <div class="patient-info">
            <div>
              <span>Blood Group:</span> ${combinedBloodGroup}
              <span>Phone No:</span> ${selectedPatient?.phone || ''}
            </div>
          </div>
          
          <table class="history-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Blood Info</th>
              </tr>
            </thead>
            <tbody>
              ${data.map(record => `
                <tr>
                  <td class="date-col">${format(new Date(record.document_date), 'dd/MM/yyyy')}</td>
                  <td class="blood-info-col">${record.bottle_quantity || 1} ${record.bottle_unit || 'Bag'} ${record.blood_category || 'PC'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;
  };

  const handleExit = () => {
    navigate("/dashboard");
  };

  const totalPages = transfusionHistory ? Math.ceil(transfusionHistory.length / itemsPerPage) : 0;
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const pageData = transfusionHistory ? transfusionHistory.slice(startIndex, endIndex) : [];

  const combinedBloodGroup = selectedPatient?.blood_group_separate && selectedPatient?.rh_factor 
    ? `${selectedPatient.blood_group_separate}${selectedPatient.rh_factor === '+ve' ? '+' : '-'}`
    : '';

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <FileText className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Patient Transfusion History</h1>
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

              {/* Patient ID Row */}
              <div className="grid grid-cols-3 border-b">
                <div className="p-3 border-r bg-gray-50">
                  <Label className="font-medium">Patient ID:</Label>
                </div>
                <div className="p-3 border-r">
                  <div className="flex items-center gap-2">
                    <Input
                      value={selectedPatientId}
                      placeholder="Select patient"
                      className="flex-1"
                      readOnly
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsPatientSearchOpen(true)}
                      className="p-2"
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-3">
                  {/* Empty cell */}
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

      {/* Patient Search Modal */}
      {isPatientSearchOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Select Patient</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPatientSearchOpen(false)}
              >
                ✕
              </Button>
            </div>
            
            <Input
              placeholder="Search by Patient ID, Name, or Phone..."
              value={patientSearchTerm}
              onChange={(e) => setPatientSearchTerm(e.target.value)}
              className="mb-4"
            />
            
            <div className="max-h-60 overflow-y-auto">
              {patients?.map((patient) => (
                <div
                  key={patient.id}
                  className="p-3 border-b cursor-pointer hover:bg-gray-50"
                  onClick={() => handlePatientSelect(patient)}
                >
                  <div className="font-medium">{patient.patient_id} - {patient.name}</div>
                  <div className="text-sm text-gray-600">
                    Phone: {patient.phone || 'N/A'} | 
                    Blood Group: {patient.blood_group_separate || 'N/A'}{patient.rh_factor === '+ve' ? '+' : patient.rh_factor === '-ve' ? '-' : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Transfusion History Results */}
      {transfusionHistory && transfusionHistory.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Patient Transfusion History Report</CardTitle>
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
              <div className="mb-6">
                <h1 className="text-xl font-bold mb-2">BLOOD CARE FOUNDATION</h1>
                <h2 className="text-lg">Patient Transfusion History</h2>
              </div>
              
              {/* Patient Info */}
              <div className="space-y-2 mb-6 text-sm">
                <div className="flex gap-8">
                  <span><strong>Patient ID:</strong> {selectedPatient?.patient_id || ''}</span>
                  <span><strong>Type:</strong> OPD</span>
                </div>
                <div>
                  <span><strong>Name:</strong> {selectedPatient?.name || ''}</span>
                </div>
                <div className="flex gap-8">
                  <span><strong>Blood Group:</strong> {combinedBloodGroup}</span>
                  <span><strong>Phone No:</strong> {selectedPatient?.phone || ''}</span>
                </div>
              </div>
              
              {/* History Table */}
              <Table className="text-sm">
                <TableHeader>
                  <TableRow>
                    <TableHead className="border border-gray-800 text-center font-bold">Date</TableHead>
                    <TableHead className="border border-gray-800 text-center font-bold">Blood Info</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageData.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="border border-gray-800 p-2">{format(new Date(record.document_date), 'dd/MM/yyyy')}</TableCell>
                      <TableCell className="border border-gray-800 p-2">
                        {record.bottle_quantity || 1} {record.bottle_unit || 'Bag'} {record.blood_category || 'PC'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Results */}
      {transfusionHistory && transfusionHistory.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Report Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No transfusion history found for the selected patient. Use the filters above to generate the report.</p>
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
              <p>Loading transfusion history...</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PatientTransfusionHistoryFilter;
