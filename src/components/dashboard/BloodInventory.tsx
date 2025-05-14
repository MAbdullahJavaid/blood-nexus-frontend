
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const bloodTypes = [
  { type: "A+", available: 24, total: 30, color: "bg-blood" },
  { type: "A-", available: 8, total: 15, color: "bg-blood" },
  { type: "B+", available: 18, total: 25, color: "bg-red-500" },
  { type: "B-", available: 5, total: 10, color: "bg-red-500" },
  { type: "AB+", available: 7, total: 15, color: "bg-amber-500" },
  { type: "AB-", available: 3, total: 10, color: "bg-amber-500" },
  { type: "O+", available: 30, total: 40, color: "bg-medical" },
  { type: "O-", available: 12, total: 25, color: "bg-medical" },
];

export function BloodInventory() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Blood Inventory</CardTitle>
        <CardDescription>
          Current blood unit availability
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bloodTypes.map((blood) => (
            <div key={blood.type} className="space-y-1">
              <div className="flex justify-between">
                <div className="font-medium">{blood.type}</div>
                <div className="text-sm text-muted-foreground">
                  {blood.available} / {blood.total} units
                </div>
              </div>
              <Progress
                value={(blood.available / blood.total) * 100}
                className={`h-2 ${(blood.available / blood.total) < 0.3 ? "bg-gray-200" : ""}`}
                indicatorClassName={blood.color}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
