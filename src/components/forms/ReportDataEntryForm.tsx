
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface TestResult {
  testId: string;
  testName: string;
  mju: string;
  lowValue: string;
  highValue: string;
  value: string;
}

interface ReportData {
  documentNo: string;
  patientId: string;
  patientName: string;
  hospitalName: string;
  phoneNo: string;
  age: string;
  bloodGroup: string;
  rh: string;
  type: string;
  gender: string;
  dob: string;
  documentDate: string;
  registrationDate: string;
  references: string;
  bloodCategory: string;
  bottleRequired: string;
  testResults: TestResult[];
}

interface ReportDataEntryFormProps {
  isSearchEnabled?: boolean;
  isEditable?: boolean;
}

const ReportDataEntryForm = ({ isSearchEnabled = false, isEditable = false }: ReportDataEntryFormProps) => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);

  // Mock data for search results
  const mockReports: ReportData[] = [
    {
      documentNo: "25010001",
      patientId: "P001",
      patientName: "John Doe",
      hospitalName: "General Hospital",
      phoneNo: "123-456-7890",
      age: "35",
      bloodGroup: "A",
      rh: "+ve",
      type: "Regular",
      gender: "Male",
      dob: "09/01/89",
      documentDate: "10/06/2025",
      registrationDate: "10/06/25 08:58:15 PM",
      references: "REF001",
      bloodCategory: "F.W.B",
      bottleRequired: "2",
      testResults: [
        {
          testId: "T001",
          testName: "Complete Blood Count",
          mju: "cells/mcL",
          lowValue: "4000",
          highValue: "11000",
          value: "7500"
        },
        {
          testId: "T002",
          testName: "Hemoglobin",
          mju: "g/dL",
          lowValue: "12.0",
          highValue: "16.0",
          value: "14.2"
        }
      ]
    }
  ];

  const filteredReports = mockReports.filter(report =>
    report.documentNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.patientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchClick = () => {
    if (isSearchEnabled) {
      setIsSearchModalOpen(true);
    }
  };

  const handleReportSelect = (report: ReportData) => {
    setSelectedReport(report);
    setIsSearchModalOpen(false);
  };

  return (
    <div className="bg-white p-6 rounded-md space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <h2 className="text-xl font-semibold text-gray-800">Test Result</h2>
      </div>

      {/* Patient Information Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* First Column */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="documentNo" className="text-sm font-medium">
              Document No:
            </Label>
            <div className="flex gap-2">
              <Input
                id="documentNo"
                value={selectedReport?.documentNo || ""}
                readOnly
                className="bg-gray-50"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleSearchClick}
                disabled={!isSearchEnabled}
                className="px-3"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div>
            <Label htmlFor="patientName" className="text-sm font-medium">
              Patient Name:
            </Label>
            <Input
              id="patientName"
              value={selectedReport?.patientName || ""}
              readOnly
              className="bg-gray-50"
            />
          </div>
          
          <div>
            <Label htmlFor="hospitalName" className="text-sm font-medium">
              Hospital Name:
            </Label>
            <Input
              id="hospitalName"
              value={selectedReport?.hospitalName || ""}
              readOnly
              className="bg-gray-50"
            />
          </div>
          
          <div>
            <Label htmlFor="phoneNo" className="text-sm font-medium">
              Phone No:
            </Label>
            <Input
              id="phoneNo"
              value={selectedReport?.phoneNo || ""}
              readOnly
              className="bg-gray-50"
            />
          </div>
          
          <div>
            <Label htmlFor="bloodGroup" className="text-sm font-medium">
              Blood Group:
            </Label>
            <Input
              id="bloodGroup"
              value={selectedReport?.bloodGroup || ""}
              readOnly
              className="bg-gray-50"
            />
          </div>
        </div>

        {/* Second Column */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="patientId" className="text-sm font-medium">
              Patient ID:
            </Label>
            <Input
              id="patientId"
              value={selectedReport?.patientId || ""}
              readOnly
              className="bg-gray-50"
            />
          </div>
          
          <div>
            <Label htmlFor="type" className="text-sm font-medium">
              Type:
            </Label>
            <Select disabled>
              <SelectTrigger className="bg-gray-50">
                <SelectValue placeholder={selectedReport?.type || "Regular"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="regular">Regular</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="gender" className="text-sm font-medium">
              Gender:
            </Label>
            <Select disabled>
              <SelectTrigger className="bg-gray-50">
                <SelectValue placeholder={selectedReport?.gender || "Male"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="age" className="text-sm font-medium">
              Age:
            </Label>
            <Input
              id="age"
              value={selectedReport?.age || ""}
              readOnly
              className="bg-gray-50"
            />
          </div>
          
          <div>
            <Label htmlFor="rh" className="text-sm font-medium">
              RH:
            </Label>
            <Input
              id="rh"
              value={selectedReport?.rh || ""}
              readOnly
              className="bg-gray-50"
            />
          </div>
        </div>

        {/* Third Column */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="documentDate" className="text-sm font-medium">
              Document Date:
            </Label>
            <Select disabled>
              <SelectTrigger className="bg-gray-50">
                <SelectValue placeholder={selectedReport?.documentDate || "10/06/2025"} />
              </SelectTrigger>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="registrationDate" className="text-sm font-medium">
              Registration Date:
            </Label>
            <Input
              id="registrationDate"
              value={selectedReport?.registrationDate || ""}
              readOnly
              className="bg-gray-50"
            />
          </div>
          
          <div>
            <Label htmlFor="dob" className="text-sm font-medium">
              DOB:
            </Label>
            <Select disabled>
              <SelectTrigger className="bg-gray-50">
                <SelectValue placeholder={selectedReport?.dob || "09/01/00"} />
              </SelectTrigger>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="references" className="text-sm font-medium">
              References:
            </Label>
            <Input
              id="references"
              value={selectedReport?.references || ""}
              readOnly
              className="bg-gray-50"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="bloodCategory" className="text-sm font-medium">
                Blood Category:
              </Label>
              <Input
                id="bloodCategory"
                value={selectedReport?.bloodCategory || ""}
                readOnly
                className="bg-gray-50"
              />
            </div>
            <div>
              <Label htmlFor="bottleRequired" className="text-sm font-medium">
                Bottle Required:
              </Label>
              <div className="flex gap-1">
                <Input
                  id="bottleRequired"
                  value={selectedReport?.bottleRequired || ""}
                  readOnly
                  className="bg-gray-50"
                />
                <span className="text-sm text-gray-600 flex items-center">ml</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Test Results Table */}
      <div className="space-y-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Test ID</TableHead>
              <TableHead>Test Name</TableHead>
              <TableHead className="w-20">M/U</TableHead>
              <TableHead className="w-24">Low Value</TableHead>
              <TableHead className="w-24">High Value</TableHead>
              <TableHead className="w-24">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {selectedReport?.testResults?.map((test, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Input value={test.testId} readOnly className="bg-gray-50 h-8" />
                </TableCell>
                <TableCell>
                  <Input value={test.testName} readOnly className="bg-gray-50 h-8" />
                </TableCell>
                <TableCell>
                  <Input value={test.mju} readOnly className="bg-gray-50 h-8" />
                </TableCell>
                <TableCell>
                  <Input value={test.lowValue} readOnly className="bg-gray-50 h-8" />
                </TableCell>
                <TableCell>
                  <Input value={test.highValue} readOnly className="bg-gray-50 h-8" />
                </TableCell>
                <TableCell>
                  <Input value={test.value} readOnly className="bg-gray-50 h-8" />
                </TableCell>
              </TableRow>
            )) || (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                  No test results available. Please select a document to view test data.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Search Modal */}
      <Dialog open={isSearchModalOpen} onOpenChange={setIsSearchModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Document</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input 
              placeholder="Search by document number or patient name" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="h-64 border mt-4 overflow-y-auto">
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <div 
                    key={report.documentNo} 
                    className="p-2 border-b hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleReportSelect(report)}
                  >
                    <div className="font-medium">Doc #: {report.documentNo}</div>
                    <div className="text-sm text-gray-600">
                      Patient: {report.patientName}, {report.gender}, {report.age} yrs
                    </div>
                    <div className="text-sm text-gray-600">
                      Hospital: {report.hospitalName}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No documents found
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReportDataEntryForm;
