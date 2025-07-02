
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Search, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useRoleAccess } from "@/hooks/useRoleAccess";

interface Patient {
  id: string;
  patient_id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  gender: string;
  age: number;
  hospital: string;
  blood_group: string;
  created_at: string;
}

const PatientList = () => {
  const navigate = useNavigate();
  const { canAccessReport } = useRoleAccess();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFirstLetter, setSelectedFirstLetter] = useState("all");

  const firstLetterOptions = [
    { value: "all", label: "All Patients" },
    { value: "T", label: "T" },
    { value: "H", label: "H" },
    { value: "S", label: "S" }
  ];

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPatients(data || []);
    } catch (error: any) {
      console.error('Error fetching patients:', error);
      toast({
        title: "Error",
        description: "Failed to fetch patients",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const extractPostfixNumber = (patientId: string): number => {
    const match = patientId.match(/(\d+)$/);
    return match ? parseInt(match[1], 10) : 0;
  };

  const filteredPatients = patients
    .filter(patient => {
      // Filter out patient IDs that are only numbers
      if (/^\d+$/.test(patient.patient_id)) {
        return false;
      }

      // Filter by first letter
      if (selectedFirstLetter !== "all" && !patient.patient_id.startsWith(selectedFirstLetter)) {
        return false;
      }

      // Filter by search term
      const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.patient_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    })
    .sort((a, b) => {
      // Sort by postfix number in ascending order
      const postfixA = extractPostfixNumber(a.patient_id);
      const postfixB = extractPostfixNumber(b.patient_id);
      return postfixA - postfixB;
    });

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  // Check access after hooks are initialized
  if (!canAccessReport('/reports/reception/patient-list')) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Patient List</h1>
        <Button 
          onClick={handleBackToDashboard}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Patients</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center space-x-2 flex-1">
              <Search className="w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by name, ID, phone, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <Select value={selectedFirstLetter} onValueChange={setSelectedFirstLetter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by first letter" />
                </SelectTrigger>
                <SelectContent>
                  {firstLetterOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Blood Group</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Hospital</TableHead>
                  <TableHead>Created Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">{patient.patient_id}</TableCell>
                    <TableCell>{patient.name}</TableCell>
                    <TableCell>{patient.age || 'N/A'}</TableCell>
                    <TableCell>{patient.gender || 'N/A'}</TableCell>
                    <TableCell>{patient.blood_group}</TableCell>
                    <TableCell>{patient.phone || 'N/A'}</TableCell>
                    <TableCell>{patient.hospital || 'N/A'}</TableCell>
                    <TableCell>
                      {new Date(patient.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredPatients.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No patients found matching your search criteria.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientList;
