
import DonationsReportFilter from "@/components/reports/DonationsReportFilter";

export default function DonationsReport() {
  // Optional: Hook up handlers as needed for filter actions
  const handleOk = (from: Date, to: Date) => {
    // Add logic as needed
    console.log("Report for dates:", from, to);
  };
  const handleCancel = () => {
    // Add logic as needed
    console.log("Cancel clicked");
  };
  const handleExport = (from: Date, to: Date) => {
    // Add logic as needed
    console.log("Export from:", from, "to:", to);
  };
  const handleExit = () => {
    // For now, can use window.history.back() or redirect as needed
    window.history.back();
  };

  return (
    <div className="p-8 flex flex-col items-center min-h-screen">
      <DonationsReportFilter
        onOk={handleOk}
        onCancel={handleCancel}
        onExport={handleExport}
        onExit={handleExit}
      />
    </div>
  );
}
