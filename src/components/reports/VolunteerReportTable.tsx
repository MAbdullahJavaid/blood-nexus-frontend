
import React from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

type Volunteer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  age?: number;
  occupation?: string;
  experience?: string;
  availability?: string;
  interests?: string;
  motivation: string;
  created_at: string;
};

export default function VolunteerReportTable({
  data,
  isLoading,
  isError,
  error,
}: {
  data: Volunteer[];
  isLoading: boolean;
  isError: boolean;
  error: any;
}) {
  if (isLoading) {
    return (
      <div className="py-6 text-center text-lg text-gray-500 animate-pulse">
        Loading volunteers...
      </div>
    );
  }
  if (isError) {
    return (
      <div className="py-6 text-center text-red-600">
        Error loading volunteers: {error?.message || "Unknown error"}
      </div>
    );
  }
  if (data.length === 0) {
    return (
      <div className="py-6 text-center text-gray-500">
        No volunteers found for this date range.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="whitespace-nowrap">Name</TableHead>
            <TableHead className="whitespace-nowrap">Email</TableHead>
            <TableHead className="whitespace-nowrap">Phone</TableHead>
            <TableHead className="whitespace-nowrap">Age</TableHead>
            <TableHead className="whitespace-nowrap">Occupation</TableHead>
            <TableHead className="whitespace-nowrap">Motivation</TableHead>
            <TableHead className="whitespace-nowrap">Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map(v => (
            <TableRow key={v.id}>
              <TableCell>{v.name}</TableCell>
              <TableCell>{v.email}</TableCell>
              <TableCell>{v.phone}</TableCell>
              <TableCell>{v.age ?? "-"}</TableCell>
              <TableCell>{v.occupation ?? "-"}</TableCell>
              <TableCell>
                <span title={v.motivation} className="line-clamp-2 block max-w-[180px]">
                  {v.motivation}
                </span>
              </TableCell>
              <TableCell>{new Date(v.created_at).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
