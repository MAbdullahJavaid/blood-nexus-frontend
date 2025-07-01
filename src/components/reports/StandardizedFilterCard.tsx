
import React from "react";
import { Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StandardizedFilterCardProps {
  children: React.ReactNode;
  title?: string;
}

export default function StandardizedFilterCard({
  children,
  title = "Report Filter"
}: StandardizedFilterCardProps) {
  return (
    <Card className="max-w-4xl mx-auto mb-6 border-gray-300 shadow-sm">
      {/* Yellow header matching the standardized design */}
      <CardHeader className="bg-yellow-200 border-b border-gray-300 rounded-t-lg px-6 py-4">
        <CardTitle className="flex items-center gap-3 text-lg font-bold text-gray-800">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-blue-600">
            <rect x="3" y="4" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
            <path d="M7 8h10M7 12h7" stroke="currentColor" strokeWidth="2"/>
          </svg>
          {title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-6 pb-6 bg-white">
        {/* Filter section header */}
        <div className="flex items-center gap-2 mb-6">
          <Search size={20} className="text-gray-600" />
          <span className="font-semibold text-gray-800">Filter</span>
        </div>
        
        {children}
      </CardContent>
    </Card>
  );
}
