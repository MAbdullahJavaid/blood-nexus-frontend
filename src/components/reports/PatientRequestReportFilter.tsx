
import React, { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onOk?: (from: string, to: string) => void;
  onCancel?: () => void;
}

export default function PatientRequestReportFilter({
  onOk,
  onCancel,
}: Props) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  // For now, the search buttons don't trigger a modal, but this is where you'd wire it up.

  return (
    <div
      className="bg-[#f8f8f8] border border-gray-400 rounded shadow-[0_2px_15px_rgba(0,0,0,0.08)] p-0"
      style={{
        minWidth: 450,
        maxWidth: 480,
        minHeight: 260,
        boxShadow: "0px 2px 16px 0px #0002",
        fontFamily: "Segoe UI, Arial, sans-serif",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 bg-[#eeeeee] border-b border-gray-300 px-4 py-2 rounded-t"
        style={{ height: 38 }}
      >
        <img alt="icon" src="https://cdn.jsdelivr.net/gh/lucide-icons/lucide@latest/icons/filter.svg" width={18} height={18} />
        <div className="text-base font-semibold">Report Filter</div>
      </div>
      {/* Tab strip */}
      <div className="flex items-center gap-2 bg-[#f2f3f3] border-b border-gray-200 px-4 py-1" style={{ fontSize: 14 }}>
        <Search size={17} className="text-gray-600 opacity-70" />
        <span className="font-medium text-[15px]">Filter</span>
      </div>
      {/* Main grid */}
      <div className="px-4 py-5 bg-white">
        <div className="border border-gray-300 rounded">
          <table className="w-full border-separate border-spacing-0 text-[15px]">
            <thead>
              <tr className="bg-[#e8e8e8]">
                <th className="border-b border-r border-gray-300 font-normal py-2 px-2 text-left" style={{ width: 120 }}>Column</th>
                <th className="border-b border-r border-gray-300 font-normal py-2 px-2 text-left" style={{ width: 140 }}>From</th>
                <th className="border-b border-gray-300 font-normal py-2 px-2 text-left" style={{ width: 140 }}>To</th>
              </tr>
            </thead>
            <tbody>
              <tr className="h-12">
                <td className="border-r border-gray-300 font-medium px-2 py-2 text-gray-700">Code:</td>
                {/* From field */}
                <td className="border-r border-gray-300 px-2 py-2">
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={from}
                      onChange={e => setFrom(e.target.value)}
                      className="border border-gray-400 bg-white rounded px-2 py-1 w-full text-[15px] focus:outline-none focus:ring-1 focus:ring-blue-300"
                      style={{ height: 28 }}
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      tabIndex={-1}
                      type="button"
                      className="ml-1 px-0 py-0 w-7 h-7 rounded border border-gray-400 bg-[#e8e8e8] hover:bg-gray-200"
                    >
                      <span className="font-bold text-gray-600 text-lg leading-none">?</span>
                    </Button>
                  </div>
                </td>
                {/* To field */}
                <td className="px-2 py-2">
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={to}
                      onChange={e => setTo(e.target.value)}
                      className="border border-gray-400 bg-white rounded px-2 py-1 w-full text-[15px] focus:outline-none focus:ring-1 focus:ring-blue-300"
                      style={{ height: 28 }}
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      tabIndex={-1}
                      type="button"
                      className="ml-1 px-0 py-0 w-7 h-7 rounded border border-gray-400 bg-[#e8e8e8] hover:bg-gray-200"
                    >
                      <span className="font-bold text-gray-600 text-lg leading-none">?</span>
                    </Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      {/* Bottom buttons */}
      <div className="flex flex-row gap-3 justify-end px-7 pb-5 pt-2 bg-[#f8f8f8] rounded-b">
        <Button
          type="button"
          size="sm"
          className="min-w-[70px] border border-gray-300 bg-[#f4f4f4] text-gray-900 shadow-sm hover:bg-gray-200"
          onClick={() => onOk?.(from, to)}
        >
          OK
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="min-w-[70px]"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
