
import BDSReportFilter from "@/components/reports/BDSReportFilter";

const RecordGroupWiseReport = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <BDSReportFilter title="Record Group Wise" reportType="group-wise" />
    </div>
  );
};

export default RecordGroupWiseReport;
