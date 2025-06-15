
import BloodDriveReportFilter from "@/components/reports/BloodDriveReportFilter";
import { toast } from "@/hooks/use-toast";

export default function BloodDriveReport() {
  // Placeholder handlers for filter actions
  function handleOk(from: Date, to: Date) {
    toast({
      title: "Filter applied",
      description: `From ${from.toLocaleDateString()} to ${to.toLocaleDateString()}`,
    });
  }
  function handleCancel() {
    toast({
      title: "Filter cancelled"
    });
  }
  function handleExport() {
    toast({
      title: "Export",
      description: "Export not yet implemented."
    });
  }
  function handleExit() {
    window.history.back();
  }

  return (
    <div className="p-8 flex flex-col items-center min-h-screen bg-gray-50">
      <h1 className="text-3xl font-extrabold mb-2 tracking-wide">Blood Care Foundation</h1>
      <h2 className="text-xl italic underline mb-6 text-gray-700">Blood Drive Report</h2>
      <BloodDriveReportFilter
        onOk={handleOk}
        onCancel={handleCancel}
        onExport={handleExport}
        onExit={handleExit}
      />
      {/* Replace below with actual blood drive table/report */}
      <div className="w-full max-w-2xl bg-white rounded shadow border mt-8 p-6">
        <p className="text-gray-700">Feature coming soon. Your blood drive data will be shown here.</p>
      </div>
    </div>
  );
}
