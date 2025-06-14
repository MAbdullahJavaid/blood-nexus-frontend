
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface LoadedTestResult {
  test_id: number;
  test_name: string;
  measuring_unit: string;
  low_value: string;
  high_value: string;
  user_value: string;
  category: string;
  is_category_header?: boolean;
}

type TestResultsTableProps = {
  loadedTestResults: LoadedTestResult[];
  isEditable: boolean;
  onValueChange: (testId: number, value: string) => void;
};

export default function TestResultsTable({
  loadedTestResults,
  isEditable,
  onValueChange,
}: TestResultsTableProps) {
  return (
    <div className="space-y-2">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-20">Test ID</TableHead>
            <TableHead>Test Name</TableHead>
            <TableHead className="w-24">M/U</TableHead>
            <TableHead className="w-24">Low Value</TableHead>
            <TableHead className="w-24">High Value</TableHead>
            <TableHead className="w-32">Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loadedTestResults.length > 0 ? (
            loadedTestResults.map((test, index) =>
              test.is_category_header ? (
                <TableRow
                  key={`head-${test.category}-${index}`}
                  className="bg-blue-500 text-white"
                >
                  <TableCell
                    colSpan={6}
                    className="font-bold text-lg text-center py-2 uppercase tracking-wider"
                  >
                    {test.test_name}
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow key={`${test.test_id}-${index}`}>
                  <TableCell>
                    <Input value={test.test_id.toString()} readOnly className="bg-gray-50 h-8" />
                  </TableCell>
                  <TableCell>
                    <Input value={test.test_name} readOnly className="bg-gray-50 h-8" />
                  </TableCell>
                  <TableCell>
                    <Input value={test.measuring_unit} readOnly className="bg-gray-50 h-8" />
                  </TableCell>
                  <TableCell>
                    <Input value={test.low_value} readOnly className="bg-gray-50 h-8" />
                  </TableCell>
                  <TableCell>
                    <Input value={test.high_value} readOnly className="bg-gray-50 h-8" />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={test.user_value}
                      onChange={e => onValueChange(test.test_id, e.target.value)}
                      className="h-8"
                      placeholder="Enter value"
                      readOnly={!isEditable}
                      disabled={!isEditable}
                    />
                  </TableCell>
                </TableRow>
              )
            )
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                No test results available. Please select a document to view test data.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
