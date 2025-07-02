
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowLeft, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { toast } from "@/hooks/use-toast";

interface Patient {
  id: string;
  patient_id: string;
  name: string;
  phone: string;
  email: string;
  gender: string;
  age: number;
  blood_group: string;
  hospital: string;
  created_at: string;
}

const PatientList = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPatients = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('patients')
        .select(`
          id,
          patient_id,
          name,
          phone,
          email,
          gender,
          age,
          blood_group,
          hospital,
          created_at
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPatients(data || []);
      setFilteredPatients(data || []);
    } catch (error) {
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

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredPatients(patients);
      return;
    }

    const filtered = patients.filter(patient =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.patient_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.hospital?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredPatients(filtered);
  }, [searchTerm, patients]);

  const getBloodGroupBadge = (bloodGroup: string) => {
    return (
      <Badge variant="outline" className="font-mono">
        {bloodGroup}
      </Badge>
    );
  };

  const getGenderBadge = (gender: string) => {
    const variants = {
      male: "bg-blue-100 text-blue-800",
      female: "bg-pink-100 text-pink-800",
      other: "bg-gray-100 text-gray-800",
    };

    return (
      <Badge className={variants[gender?.toLowerCase() as keyof typeof variants] || variants.other}>
        {gender}
      </Badge>
    );
  };

  return (
    <RoleGuard allowedRoles={['reception', 'admin']}>
      <div className="container mx-auto py-6 px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <User className="w-8 h-8" />
              Patient List
            </h1>
            <p className="text-gray-600 mt-1">Manage and view all patient records</p>
          </div>
          <Button 
            onClick={() => navigate("/dashboard")}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Patients ({filteredPatients.length})</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search patients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Demographics</TableHead>
                      <TableHead>Blood Group</TableHead>
                      <TableHead>Hospital</TableHead>
                      <TableHead>Registration Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPatients.map((patient) => (
                      <TableRow key={patient.id}>
                        <TableCell className="font-mono font-medium">
                          {patient.patient_id}
                        </TableCell>
                        <TableCell className="font-medium">
                          {patient.name}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {patient.phone && (
                              <div className="text-sm">{patient.phone}</div>
                            )}
                            {patient.email && (
                              <div className="text-sm text-gray-500">{patient.email}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {patient.gender && getGenderBadge(patient.gender)}
                            {patient.age && (
                              <div className="text-sm text-gray-600">{patient.age} years</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {patient.blood_group && getBloodGroupBadge(patient.blood_group)}
                        </TableCell>
                        <TableCell>
                          {patient.hospital || '-'}
                        </TableCell>
                        <TableCell>
                          {new Date(patient.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {filteredPatients.length === 0 && !isLoading && (
                  <div className="text-center py-8 text-gray-500">
                    {searchTerm ? 'No patients found matching your search.' : 'No patients found.'}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  );
};

export default PatientList;
