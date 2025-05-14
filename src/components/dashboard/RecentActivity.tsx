
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Sample data
const recentActivity = [
  {
    id: "1",
    type: "Donation",
    patient: "John Doe",
    bloodType: "A+",
    date: "2023-05-14",
    status: "Completed",
  },
  {
    id: "2",
    type: "Transfusion",
    patient: "Jane Smith",
    bloodType: "O-",
    date: "2023-05-14",
    status: "In Progress",
  },
  {
    id: "3",
    type: "Testing",
    patient: "Michael Johnson",
    bloodType: "B+",
    date: "2023-05-13",
    status: "Completed",
  },
  {
    id: "4",
    type: "Donation",
    patient: "Robert Williams",
    bloodType: "AB+",
    date: "2023-05-13",
    status: "Completed",
  },
  {
    id: "5",
    type: "Transfusion",
    patient: "Emily Brown",
    bloodType: "A-",
    date: "2023-05-12",
    status: "Completed",
  },
];

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          Recent blood donation and transfusion records
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Blood Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentActivity.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell>{activity.id}</TableCell>
                <TableCell>{activity.type}</TableCell>
                <TableCell>{activity.patient}</TableCell>
                <TableCell>{activity.bloodType}</TableCell>
                <TableCell>{activity.date}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    activity.status === "Completed" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-amber-100 text-amber-800"
                  }`}>
                    {activity.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
