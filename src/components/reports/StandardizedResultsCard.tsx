
import React from "react";
import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StandardizedResultsCardProps {
  children?: React.ReactNode;
  showResults: boolean;
  title?: string;
  emptyMessage?: string;
}

export default function StandardizedResultsCard({
  children,
  showResults,
  title = "Report Results",
  emptyMessage = "No results found. Use the filters above to generate the report."
}: StandardizedResultsCardProps) {
  if (showResults && children) {
    return <>{children}</>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12 text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>{emptyMessage}</p>
        </div>
      </CardContent>
    </Card>
  );
}
