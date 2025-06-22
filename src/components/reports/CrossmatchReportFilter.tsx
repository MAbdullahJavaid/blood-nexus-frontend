
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, FileText, Edit, Trash2, Printer } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CrossmatchRecord {
  id: string;
  crossmatch_no: string;
  patient_name: string;
  date: string;
  hospital: string;
  blood_group: string;
  rh: string;
  result: string;
  albumin: string;
  saline: string;
  coomb: string;
  product_id: string;
  expiry_date: string;
  remarks: string;
  age: number;
  sex: string;
}

interface DonorInfo {
  donor_name: string;
  donor_age: number;
  bag_id: string;
  collection_date: string;
  donor_blood_group: string;
  donor_rh: string;
  hbsag: number;
  hcv: number;
  hiv: number;
  vdrl: number;
  hb: number;
}

interface CrossmatchReportData extends CrossmatchRecord {
  donor_info: DonorInfo;
}

interface CrossmatchReportFilterProps {
  title: string;
}

const CrossmatchReportFilter = ({ title }: CrossmatchReportFilterProps) => {
  const navigate = useNavigate();
  const [codeFrom, setCodeFrom] = useState("");
  const [codeTo, setCodeTo] = useState("");
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [crossmatchRecords, setCrossmatchRecords] = useState<CrossmatchRecord[]>([]);
  const [reportData, setReportData] = useState<CrossmatchReportData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const fetchCrossmatchRecords = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('crossmatch_records')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setCrossmatchRecords(data || []);
    } catch (error) {
      console.error("Error fetching crossmatch records:", error);
      toast.error("Failed to fetch crossmatch records");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDetailedReportData = async (filteredRecords: CrossmatchRecord[]) => {
    try {
      setIsLoading(true);
      const detailedData: CrossmatchReportData[] = [];

      for (const record of filteredRecords) {
        // Fetch donor and bleeding information using product_id (bag_no)
        const { data: bleedingData, error: bleedingError } = await supabase
          .from('bleeding_records')
          .select(`
            bag_id,
            bleeding_date,
            hbsag,
            hcv,
            hiv,
            vdrl,
            hb,
            donors!inner(
              name,
              date_of_birth,
              blood_group_separate,
              rh_factor
            )
          `)
          .eq('bag_id', record.product_id)
          .single();

        if (bleedingError) {
          console.error("Error fetching bleeding data:", bleedingError);
          continue;
        }

        if (bleedingData && bleedingData.donors) {
          const donorAge = bleedingData.donors.date_of_birth 
            ? new Date().getFullYear() - new Date(bleedingData.donors.date_of_birth).getFullYear()
            : 0;

          const donorInfo: DonorInfo = {
            donor_name: bleedingData.donors.name,
            donor_age: donorAge,
            bag_id: bleedingData.bag_id,
            collection_date: bleedingData.bleeding_date,
            donor_blood_group: bleedingData.donors.blood_group_separate,
            donor_rh: bleedingData.donors.rh_factor,
            hbsag: bleedingData.hbsag || 0,
            hcv: bleedingData.hcv || 0,
            hiv: bleedingData.hiv || 0,
            vdrl: bleedingData.vdrl || 0,
            hb: bleedingData.hb || 0
          };

          detailedData.push({
            ...record,
            donor_info: donorInfo
          });
        }
      }

      setReportData(detailedData);
      setShowReport(true);
    } catch (error) {
      console.error("Error fetching detailed report data:", error);
      toast.error("Failed to fetch detailed report data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchClick = () => {
    setIsSearchModalOpen(true);
    fetchCrossmatchRecords();
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const filteredRecordsForModal = crossmatchRecords.filter(record =>
    record.crossmatch_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.hospital?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOK = async () => {
    if (!codeFrom && !codeTo) {
      toast.error("Please specify at least one filter criteria");
      return;
    }

    await fetchCrossmatchRecords();
    
    const filtered = crossmatchRecords.filter(record => {
      const code = record.crossmatch_no;
      const meetsFromCondition = !codeFrom || code >= codeFrom;
      const meetsToCondition = !codeTo || code <= codeTo;
      return meetsFromCondition && meetsToCondition;
    });

    if (filtered.length === 0) {
      toast.error("No records found for the specified criteria");
      return;
    }

    await fetchDetailedReportData(filtered);
    toast.success("Report generated successfully");
  };

  const handleCancel = () => {
    setCodeFrom("");
    setCodeTo("");
    setReportData([]);
    setShowReport(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExit = () => {
    navigate("/dashboard");
  };

  const handleEdit = (record: CrossmatchRecord) => {
    console.log("Edit record:", record);
    toast.success("Edit functionality will be implemented");
  };

  const handleDelete = async (recordId: string) => {
    if (!confirm("Are you sure you want to delete this crossmatch record?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from('crossmatch_records')
        .delete()
        .eq('id', recordId);

      if (error) throw error;

      toast.success("Crossmatch record deleted successfully");
      fetchCrossmatchRecords();
    } catch (error) {
      console.error("Error deleting crossmatch record:", error);
      toast.error("Failed to delete crossmatch record");
    }
  };

  const getTestResult = (value: number | null) => {
    if (value === null || value === undefined) return "N/A";
    return value < 1.0 ? "Non-Reactive" : "Reactive";
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <FileText className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>

      {!showReport ? (
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="bg-yellow-100 border-b">
            <CardTitle className="flex items-center gap-2 text-lg">
              <span>📊</span>
              Report Filter
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2">
                <Search className="text-green-600 h-5 w-5" />
                <span className="font-medium">Filter</span>
              </div>

              <div className="border border-gray-300">
                <div className="grid grid-cols-3 bg-gray-200 border-b">
                  <div className="p-3 border-r text-center font-medium">Column</div>
                  <div className="p-3 border-r text-center font-medium">From</div>
                  <div className="p-3 text-center font-medium">To</div>
                </div>

                <div className="grid grid-cols-3">
                  <div className="p-3 border-r bg-gray-50 flex items-center">
                    <Label className="font-medium">Crossmatch No:</Label>
                  </div>
                  <div className="p-3 border-r">
                    <div className="flex items-center gap-2">
                      <Input
                        value={codeFrom}
                        onChange={(e) => setCodeFrom(e.target.value)}
                        placeholder="Enter crossmatch no"
                        className="w-full"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSearchClick}
                        className="h-8 w-8 p-0"
                      >
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="flex items-center gap-2">
                      <Input
                        value={codeTo}
                        onChange={(e) => setCodeTo(e.target.value)}
                        placeholder="Enter crossmatch no"
                        className="w-full"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSearchClick}
                        className="h-8 w-8 p-0"
                      >
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-4 pt-4">
                <Button onClick={handleOK} className="px-8 bg-red-600 hover:bg-red-700">
                  OK
                </Button>
                <Button variant="outline" onClick={handleCancel} className="px-8">
                  Cancel
                </Button>
                <Button variant="outline" onClick={handleExit} className="px-8">
                  Exit
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-end gap-4 mb-4">
            <Button onClick={handlePrint} className="px-8 bg-blue-600 hover:bg-blue-700">
              <Printer className="h-4 w-4 mr-2" />
              Print Report
            </Button>
            <Button variant="outline" onClick={() => setShowReport(false)} className="px-8">
              Back to Filter
            </Button>
          </div>

          {reportData.map((record, index) => (
            <Card key={record.id} className="p-8 print:shadow-none print:border-black">
              <div className="space-y-6">
                {/* Header */}
                <div className="text-center border-b-2 border-black pb-4">
                  <h1 className="text-2xl font-bold">BLOOD GROUPING SCREENING AND CROSS MATCH REPORT</h1>
                </div>

                {/* Patient Information */}
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-center">Patient Information</h2>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex gap-4">
                        <span className="font-medium">Req. No.</span>
                        <span className="border-b border-black flex-1">{record.crossmatch_no}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-medium">Date: </span>
                      <span>{new Date(record.date).toLocaleDateString('en-GB')}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    <div className="col-span-2">
                      <span className="font-medium">Patient Name: </span>
                      <span className="border-b border-black">{record.patient_name}</span>
                    </div>
                    <div>
                      <span className="font-medium">Age: </span>
                      <span className="border-b border-black">{record.age}</span>
                    </div>
                    <div>
                      <span className="font-medium">B.Group: </span>
                      <span className="border-b border-black">{record.blood_group}{record.rh}</span>
                    </div>
                  </div>

                  <div>
                    <span className="font-medium">Hospital/Clinic: </span>
                    <span className="border-b border-black">{record.hospital}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <span className="font-medium">Bag No: </span>
                      <span className="border-b border-black">{record.donor_info.bag_id}</span>
                    </div>
                    <div>
                      <span className="font-medium">Collection Date: </span>
                      <span className="border-b border-black">{new Date(record.donor_info.collection_date).toLocaleDateString('en-GB')}</span>
                    </div>
                    <div>
                      <span className="font-medium">Expiry Date: </span>
                      <span className="border-b border-black">{record.expiry_date ? new Date(record.expiry_date).toLocaleDateString('en-GB') : 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Donor Information */}
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-center">Donor Information</h2>
                  
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium">REG NO: </span>
                        <span className="border-b border-black">{record.donor_info.bag_id}</span>
                      </div>
                      <div>
                        <span className="font-medium">Donor Name: </span>
                        <span className="border-b border-black">{record.donor_info.donor_name}</span>
                      </div>
                      <div>
                        <span className="font-medium">Age: </span>
                        <span className="border-b border-black">{record.donor_info.donor_age}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium">Document Date: </span>
                        <span className="border-b border-black">{new Date(record.donor_info.collection_date).toLocaleDateString('en-GB')}</span>
                      </div>
                      <div>
                        <span className="font-medium">Blood Group: </span>
                        <span className="border-b border-black">{record.donor_info.donor_blood_group}{record.donor_info.donor_rh}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Screening Report Table */}
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-center">SCREENING REPORT</h2>
                  
                  <table className="w-full border-2 border-black">
                    <thead>
                      <tr className="border-b-2 border-black">
                        <th className="border-r border-black p-2 text-left">Test</th>
                        <th className="border-r border-black p-2">Donor/Patient Value</th>
                        <th className="border-r border-black p-2">Cut Off Value</th>
                        <th className="p-2">RESULT</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-black">
                        <td className="border-r border-black p-2">HBsAg (Hepatitis B)</td>
                        <td className="border-r border-black p-2 text-center">{record.donor_info.hbsag || 'N/A'}</td>
                        <td className="border-r border-black p-2 text-center">1.00</td>
                        <td className="p-2 text-center">{getTestResult(record.donor_info.hbsag)}</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="border-r border-black p-2">Anti - HCV (Hepatitis C)</td>
                        <td className="border-r border-black p-2 text-center">{record.donor_info.hcv || 'N/A'}</td>
                        <td className="border-r border-black p-2 text-center">1.00</td>
                        <td className="p-2 text-center">{getTestResult(record.donor_info.hcv)}</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="border-r border-black p-2">Anti - HIV</td>
                        <td className="border-r border-black p-2 text-center">{record.donor_info.hiv || 'N/A'}</td>
                        <td className="border-r border-black p-2 text-center">1.00</td>
                        <td className="p-2 text-center">{getTestResult(record.donor_info.hiv)}</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="border-r border-black p-2">V.D.R.L (Syphilis)</td>
                        <td className="border-r border-black p-2 text-center">{record.donor_info.vdrl || 'N/A'}</td>
                        <td className="border-r border-black p-2 text-center">1.00</td>
                        <td className="p-2 text-center">{getTestResult(record.donor_info.vdrl)}</td>
                      </tr>
                      <tr>
                        <td className="border-r border-black p-2">HB</td>
                        <td className="border-r border-black p-2 text-center">{record.donor_info.hb || 'N/A'}</td>
                        <td className="border-r border-black p-2 text-center">-</td>
                        <td className="p-2 text-center">-</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Crossmatch Results Table */}
                <div className="space-y-4">
                  <table className="w-full border-2 border-black">
                    <thead>
                      <tr className="border-b-2 border-black">
                        <th className="border-r border-black p-2">Reg No.</th>
                        <th className="border-r border-black p-2">Blood Group</th>
                        <th className="border-r border-black p-2">Saline</th>
                        <th className="border-r border-black p-2">Albumin</th>
                        <th className="border-r border-black p-2">Coomb's</th>
                        <th className="p-2">Result</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border-r border-black p-2 text-center">{record.donor_info.bag_id}</td>
                        <td className="border-r border-black p-2 text-center">{record.donor_info.donor_blood_group}{record.donor_info.donor_rh}</td>
                        <td className="border-r border-black p-2 text-center">{record.saline}</td>
                        <td className="border-r border-black p-2 text-center">{record.albumin}</td>
                        <td className="border-r border-black p-2 text-center">{record.coomb}</td>
                        <td className="p-2 text-center">{record.result}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Remarks */}
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">Remarks:</span>
                  </div>
                  <div className="border-b border-black min-h-[60px] p-2">
                    {record.remarks}
                  </div>
                </div>

                {/* Signatures */}
                <div className="grid grid-cols-2 gap-8 pt-8">
                  <div>
                    <span className="font-medium">SIGNATURE: ( LAB-INCHARGE)</span>
                    <div className="border-b border-black mt-8"></div>
                  </div>
                  <div>
                    <span className="font-medium">SIGNATURE: ( LAB-ASSISTANT)</span>
                    <div className="border-b border-black mt-8"></div>
                  </div>
                </div>

                {index < reportData.length - 1 && <div className="page-break-after-always"></div>}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Search Modal */}
      <Dialog open={isSearchModalOpen} onOpenChange={setIsSearchModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Search Crossmatch Records</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input 
              placeholder="Search by crossmatch number, patient name, or hospital" 
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="mb-4"
            />
            <div className="h-96 border overflow-y-auto">
              {isLoading ? (
                <div className="p-4 text-center">Loading...</div>
              ) : filteredRecordsForModal.length > 0 ? (
                <div className="space-y-2 p-4">
                  {filteredRecordsForModal.map((record) => (
                    <div 
                      key={record.id} 
                      className="p-3 border rounded hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                      onClick={() => {
                        setCodeFrom(record.crossmatch_no);
                        setIsSearchModalOpen(false);
                      }}
                    >
                      <div>
                        <div className="font-medium">{record.crossmatch_no}</div>
                        <div className="text-sm text-gray-600">{record.patient_name} - {record.hospital}</div>
                        <div className="text-sm text-gray-500">{new Date(record.date).toLocaleDateString()}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(record);
                          }}
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(record.id);
                          }}
                          size="sm"
                          variant="destructive"
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No crossmatch records found
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CrossmatchReportFilter;
