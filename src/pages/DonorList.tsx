
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowLeft, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { toast } from "@/hooks/use-toast";

interface Donor {
  id: string;
  donor_id: string;
  name: string;
  phone: string;
  email: string;
  gender: string;
  blood_group: string;
  address: string;
  last_donation_date: string;
  status: boolean;
  created_at: string;
}

const DonorList = () => {
  const navigate = useNavigate();
  const [donors, setDonors] = useState<Donor[]>([]);
  const [filteredDonors, setFilteredDonors] = useState<Donor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchDonors = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('donors')
        .select(`
          id,
          donor_id,
          name,
          phone,
          email,
          gender,
          blood_group,
          address,
          last_donation_date,
          status,
          created_at
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDonors(data || []);
      setFilteredDonors(data || []);
    } catch (error) {
      console.error('Error fetching donors:', error);
      toast({
        title: "Error",
        description: "Failed to fetch donors",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDonors();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredDonors(donors);
      return;
    }

    const filtered = donors.filter(donor =>
      donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donor.donor_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donor.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donor.address?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredDonors(filtered);
  }, [searchTerm, donors]);

  const getBloodGroupBadge = (bloodGroup: string) => {
    return (
      <Badge variant="outline" className="font-mono">
        {bloodGroup}
      </Badge>
    );
  };

  const getStatusBadge = (status: boolean) => {
    return (
      <Badge className={status ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
        {status ? "Active" : "Inactive"}
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
    <RoleGuard allowedRoles={['bds', 'admin']}>
      <div className="container mx-auto py-6 px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Heart className="w-8 h-8 text-red-500" />
              Donor List
            </h1>
            <p className="text-gray-600 mt-1">Manage and view all donor records</p>
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
            <CardTitle>All Donors ({filteredDonors.length})</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search donors..."
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
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Donor ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Demographics</TableHead>
                      <TableHead>Blood Group</TableHead>
                      <TableHead>Last Donation</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Registration Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDonors.map((donor) => (
                      <TableRow key={donor.id}>
                        <TableCell className="font-mono font-medium">
                          {donor.donor_id}
                        </TableCell>
                        <TableCell className="font-medium">
                          {donor.name}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {donor.phone && (
                              <div className="text-sm">{donor.phone}</div>
                            )}
                            {donor.email && (
                              <div className="text-sm text-gray-500">{donor.email}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {donor.gender && getGenderBadge(donor.gender)}
                            {donor.address && (
                              <div className="text-sm text-gray-600 max-w-32 truncate">
                                {donor.address}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {donor.blood_group && getBloodGroupBadge(donor.blood_group)}
                        </TableCell>
                        <TableCell>
                          {donor.last_donation_date 
                            ? new Date(donor.last_donation_date).toLocaleDateString()
                            : "Never"
                          }
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(donor.status)}
                        </TableCell>
                        <TableCell>
                          {new Date(donor.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {filteredDonors.length === 0 && !isLoading && (
                  <div className="text-center py-8 text-gray-500">
                    {searchTerm ? 'No donors found matching your search.' : 'No donors found.'}
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

export default DonorList;
