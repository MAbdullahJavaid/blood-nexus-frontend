
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DropletIcon, UserIcon, ReceiptIcon, TestTubeIcon } from "lucide-react";

const StatCard = ({ title, value, icon: Icon, description, color }: {
  title: string;
  value: string;
  icon: React.ElementType;
  description: string;
  color: string;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">
        {title}
      </CardTitle>
      <Icon className={`h-4 w-4 ${color}`} />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">
        {description}
      </p>
    </CardContent>
  </Card>
);

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Blood Units"
        value="536"
        icon={DropletIcon}
        description="127 added this month"
        color="text-blood"
      />
      <StatCard
        title="Total Donors"
        value="2,423"
        icon={UserIcon}
        description="412 new donors this year"
        color="text-medical"
      />
      <StatCard
        title="Pending Requests"
        value="42"
        icon={ReceiptIcon}
        description="15 high priority"
        color="text-amber-500"
      />
      <StatCard
        title="Tests Conducted"
        value="1,287"
        icon={TestTubeIcon}
        description="38 tests today"
        color="text-green-500"
      />
    </div>
  );
}
