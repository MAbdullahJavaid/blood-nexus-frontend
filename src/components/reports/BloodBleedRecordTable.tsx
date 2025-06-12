
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";

interface BloodBleedRecordTableProps {
  fromDate?: Date;
  toDate?: Date;
}

interface BleedingRecord {
  id: string;
  bag_id: string;
  bleeding_date: string;
  remarks: string | null;
  technician: string | null;
  donors: {
    name: string;
    phone: string | null;
    blood_group_separate: string | null;
    rh_factor: string | null;
    age?: number;
    gender: string | null;
  } | null;
}

const BloodBleedRecordTable = ({ fromDate, toDate }: BloodBleedRecordTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;

  const { data: bleedingRecords, isLoading, error } = useQuery({
    queryKey: ['bleeding-records', fromDate, toDate, searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('bleeding_records')
        .select(`
          id,
          bag_id,
          bleeding_date,
          remarks,
          technician,
          donors!inner (
            name,
            phone,
            blood_group_separate,
            rh_factor,
            gender,
            date_of_birth
          )
        `)
        .order('bleeding_date', { ascending: false });

      if (fromDate) {
        query = query.gte('bleeding_date', format(fromDate, 'yyyy-MM-dd'));
      }
      if (toDate) {
        query = query.lte('bleeding_date', format(toDate, 'yyyy-MM-dd'));
      }

      if (searchTerm) {
        query = query.or(`bag_id.ilike.%${searchTerm}%,donors.name.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) {
        console.error('Error fetching bleeding records:', error);
        throw error;
      }

      // Calculate age from date_of_birth
      return data?.map(record => ({
        ...record,
        donors: record.donors ? {
          ...record.donors,
          age: record.donors.date_of_birth 
            ? new Date().getFullYear() - new Date(record.donors.date_of_birth).getFullYear()
            : undefined
        } : null
      })) || [];
    }
  });

  const filteredRecords = bleedingRecords || [];
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRecords = filteredRecords.slice(startIndex, endIndex);

  const getBloodGroup = (record: BleedingRecord) => {
    if (!record.donors) return '';
    const bloodGroup = record.donors.blood_group_separate || '';
    const rhFactor = record.donors.rh_factor || '';
    return bloodGroup + (rhFactor === '+ve' ? '+' : rhFactor === '-ve' ? '-' : rhFactor);
  };

  const getDonorType = () => "Call Donor"; // Default for now
  const getBagType = () => "Double Bag"; // Default for now

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading bleeding records...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">Error loading bleeding records</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="text-center border-b">
        <div className="space-y-2">
          <h1 className="text-xl font-bold">BLOOD CARE FOUNDATION</h1>
          <h2 className="text-lg font-semibold">Blood Donor Register</h2>
          <div className="text-right text-sm">Page 1 of {totalPages}</div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* Search Filter */}
        <div className="mb-4 flex gap-4 items-center">
          <Label htmlFor="search" className="font-medium">Search:</Label>
          <Input
            id="search"
            type="text"
            placeholder="Search by bag number or donor name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        {/* Report Table */}
        <div className="overflow-x-auto">
          <Table className="min-w-full border border-gray-300">
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="border border-gray-300 text-center font-bold text-black">No</TableHead>
                <TableHead className="border border-gray-300 text-center font-bold text-black">Bag No</TableHead>
                <TableHead className="border border-gray-300 text-center font-bold text-black">Name</TableHead>
                <TableHead className="border border-gray-300 text-center font-bold text-black">Date</TableHead>
                <TableHead className="border border-gray-300 text-center font-bold text-black">Age</TableHead>
                <TableHead className="border border-gray-300 text-center font-bold text-black">Sex</TableHead>
                <TableHead className="border border-gray-300 text-center font-bold text-black">Phone No</TableHead>
                <TableHead className="border border-gray-300 text-center font-bold text-black">Donor Type</TableHead>
                <TableHead className="border border-gray-300 text-center font-bold text-black">Bag Type</TableHead>
                <TableHead className="border border-gray-300 text-center font-bold text-black">Blood Group</TableHead>
                <TableHead className="border border-gray-300 text-center font-bold text-black" colSpan={5}>Screening Results</TableHead>
                <TableHead className="border border-gray-300 text-center font-bold text-black">Remarks</TableHead>
              </TableRow>
              <TableRow className="bg-gray-100">
                <TableHead className="border border-gray-300"></TableHead>
                <TableHead className="border border-gray-300"></TableHead>
                <TableHead className="border border-gray-300"></TableHead>
                <TableHead className="border border-gray-300"></TableHead>
                <TableHead className="border border-gray-300"></TableHead>
                <TableHead className="border border-gray-300"></TableHead>
                <TableHead className="border border-gray-300"></TableHead>
                <TableHead className="border border-gray-300"></TableHead>
                <TableHead className="border border-gray-300"></TableHead>
                <TableHead className="border border-gray-300"></TableHead>
                <TableHead className="border border-gray-300 text-center font-bold text-black text-xs">V.D.R.L</TableHead>
                <TableHead className="border border-gray-300 text-center font-bold text-black text-xs">HbsAg</TableHead>
                <TableHead className="border border-gray-300 text-center font-bold text-black text-xs">Anti HCV</TableHead>
                <TableHead className="border border-gray-300 text-center font-bold text-black text-xs">Anti HIV</TableHead>
                <TableHead className="border border-gray-300 text-center font-bold text-black text-xs">HB</TableHead>
                <TableHead className="border border-gray-300"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentRecords.map((record, index) => (
                <TableRow key={record.id} className="hover:bg-gray-50">
                  <TableCell className="border border-gray-300 text-center text-sm">
                    {startIndex + index + 1}
                  </TableCell>
                  <TableCell className="border border-gray-300 text-center text-sm">
                    {record.bag_id}
                  </TableCell>
                  <TableCell className="border border-gray-300 text-sm">
                    {record.donors?.name || 'N/A'}
                  </TableCell>
                  <TableCell className="border border-gray-300 text-center text-sm">
                    {format(new Date(record.bleeding_date), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell className="border border-gray-300 text-center text-sm">
                    {record.donors?.age || 'N/A'}
                  </TableCell>
                  <TableCell className="border border-gray-300 text-center text-sm">
                    {record.donors?.gender || 'N/A'}
                  </TableCell>
                  <TableCell className="border border-gray-300 text-center text-sm">
                    {record.donors?.phone || 'N/A'}
                  </TableCell>
                  <TableCell className="border border-gray-300 text-center text-sm">
                    {getDonorType()}
                  </TableCell>
                  <TableCell className="border border-gray-300 text-center text-sm">
                    {getBagType()}
                  </TableCell>
                  <TableCell className="border border-gray-300 text-center text-sm">
                    {getBloodGroup(record)}
                  </TableCell>
                  {/* Screening Results - Mock data for now */}
                  <TableCell className="border border-gray-300 text-center text-sm">0.04</TableCell>
                  <TableCell className="border border-gray-300 text-center text-sm">0.26</TableCell>
                  <TableCell className="border border-gray-300 text-center text-sm">0.10</TableCell>
                  <TableCell className="border border-gray-300 text-center text-sm">0.21</TableCell>
                  <TableCell className="border border-gray-300 text-center text-sm">14.9</TableCell>
                  <TableCell className="border border-gray-300 text-sm">
                    {record.remarks || 'c/d'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

        {filteredRecords.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No bleeding records found for the selected criteria.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BloodBleedRecordTable;
