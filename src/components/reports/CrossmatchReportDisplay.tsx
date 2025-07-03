
import React from "react";

interface CrossmatchData {
  crossmatch_no: string;
  patient_name: string;
  age: number;
  blood_group: string;
  rh: string;
  hospital: string;
  date: string;
  quantity: number;
  albumin: string;
  saline: string;
  coomb: string;
  result: string;
  remarks: string;
  expiry_date: string;
  // Donor information from bleeding_records and donors
  donor_name?: string;
  donor_age?: number;
  donor_blood_group?: string;
  donor_rh?: string;
  bag_id?: string;
  bleeding_date?: string;
  hbsag?: number;
  hcv?: number;
  hiv?: number;
  vdrl?: number;
  hb?: number;
}

interface CrossmatchReportDisplayProps {
  data: CrossmatchData[];
  onPrint?: () => void;
}

const CrossmatchReportDisplay: React.FC<CrossmatchReportDisplayProps> = ({ data, onPrint }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  const getScreeningResult = (value: number | undefined) => {
    if (value === undefined || value === null) return "";
    return value === 0 ? "Non-Reactive" : "Reactive";
  };

  return (
    <div className="bg-white">
      {data.map((record, index) => (
        <div key={index} className="crossmatch-report-page bg-white p-4 min-h-screen mb-8" style={{ 
          pageBreakAfter: 'always',
          breakAfter: 'page',
          minHeight: '100vh',
          display: 'block'
        }}>
          {/* Header */}
          <div className="border-b-2 border-black pb-2 mb-3">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-xs font-bold">LOGO</span>
                </div>
                <div>
                  <p className="text-sm">We Care About.....</p>
                  <p className="font-bold text-sm">THALASSAEMIC, HAEMOPHILIC BLOOD CANCER PATIENTS!</p>
                  <h1 className="text-xl font-bold">BLOOD CARE FOUNDATION</h1>
                  <p className="text-sm">BLOOD TRANSFUSION AND HEMATOLOGICAL SERVICES</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm">AFFILIATED WITH</p>
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mx-auto">
                  <span className="text-xs font-bold">TIF</span>
                </div>
                <p className="text-xs">THALASSAEMIA<br/>INTERNATIONAL FEDERATION</p>
              </div>
            </div>
          </div>

          {/* Report Title */}
          <div className="text-center mb-3">
            <h2 className="text-lg font-bold">BLOOD GROUPING SCREENING AND CROSS MATCH REPORT</h2>
          </div>

          {/* Patient Information */}
          <div className="mb-3">
            <h3 className="text-lg font-bold text-center mb-2">Patient Information</h3>
            
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div className="flex">
                <span className="font-semibold w-32">Req. No.</span>
                <span className="border-b border-black flex-1 ml-2">{record.crossmatch_no}</span>
              </div>
              <div className="flex justify-end">
                <span className="font-semibold">Date:</span>
                <span className="border-b border-black ml-2 w-32">{formatDate(record.date)}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-2">
              <div className="flex">
                <span className="font-semibold w-32">Patient Name</span>
                <span className="border-b border-black flex-1 ml-2">{record.patient_name}</span>
              </div>
              <div className="flex">
                <span className="font-semibold w-16">Age</span>
                <span className="border-b border-black flex-1 ml-2">{record.age}</span>
              </div>
              <div className="flex">
                <span className="font-semibold w-20">B.Group</span>
                <span className="border-b border-black w-16 ml-2">{record.blood_group}</span>
                <span className="font-semibold ml-4 w-12">Rh(D)</span>
                <span className="border-b border-black w-16 ml-2">{record.rh}</span>
              </div>
            </div>

            <div className="flex mb-2">
              <span className="font-semibold w-32">Hospital/Clinic</span>
              <span className="border-b border-black flex-1 ml-2">{record.hospital}</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="flex">
                <span className="font-semibold w-16">Bag No</span>
                <span className="border-b border-black flex-1 ml-2">{record.bag_id || ''}</span>
              </div>
              <div className="flex">
                <span className="font-semibold w-32">Collection Date:</span>
                <span className="border-b border-black flex-1 ml-2">{record.bleeding_date ? formatDate(record.bleeding_date) : ''}</span>
              </div>
              <div className="flex">
                <span className="font-semibold w-24">Expiry Date:</span>
                <span className="border-b border-black flex-1 ml-2">{record.expiry_date ? formatDate(record.expiry_date) : ''}</span>
              </div>
            </div>
          </div>

          {/* Donor Information */}
          <div className="mb-3">
            <h3 className="text-lg font-bold text-center mb-2">Donor Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex mb-2">
                  <span className="font-semibold w-24">REG NO:</span>
                  <span className="border-b border-black flex-1 ml-2">{record.bag_id || ''}</span>
                </div>
                <div className="flex mb-2">
                  <span className="font-semibold w-24">Donor Name:</span>
                  <span className="border-b border-black flex-1 ml-2">{record.donor_name || ''}</span>
                </div>
                <div className="flex">
                  <span className="font-semibold w-24">Age:</span>
                  <span className="border-b border-black flex-1 ml-2">{record.donor_age || ''}</span>
                </div>
              </div>
              <div>
                <div className="flex mb-2">
                  <span className="font-semibold w-32">Document Date:</span>
                  <span className="border-b border-black flex-1 ml-2">{record.bleeding_date ? formatDate(record.bleeding_date) : ''}</span>
                </div>
                <div className="flex">
                  <span className="font-semibold w-32">Blood Group</span>
                  <span className="border-b border-black flex-1 ml-2">{record.donor_blood_group || ''}{record.donor_rh || ''}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Screening Report */}
          <div className="mb-3">
            <div className="border-2 border-black">
              <h3 className="text-lg font-bold text-center py-1 bg-gray-100">SCREENING REPORT</h3>
              
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-black">
                    <th className="border-r border-black p-1 font-bold text-center text-sm">Test</th>
                    <th className="border-r border-black p-1 font-bold text-center text-sm">Donor/Patient<br/>Value</th>
                    <th className="border-r border-black p-1 font-bold text-center text-sm">Cut Off<br/>Value</th>
                    <th className="p-1 font-bold text-center text-sm">RESULT</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-black">
                    <td className="border-r border-black p-1 text-sm">HBsAg (Hepatitis B)</td>
                    <td className="border-r border-black p-1 text-center text-sm">{record.hbsag || ''}</td>
                    <td className="border-r border-black p-1 text-center text-sm">1.00</td>
                    <td className="p-1 text-center text-sm">{getScreeningResult(record.hbsag)}</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="border-r border-black p-1 text-sm">Anti - HCV (Hepatitis C)</td>
                    <td className="border-r border-black p-1 text-center text-sm">{record.hcv || ''}</td>
                    <td className="border-r border-black p-1 text-center text-sm">1.00</td>
                    <td className="p-1 text-center text-sm">{getScreeningResult(record.hcv)}</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="border-r border-black p-1 text-sm">Anti - HIV</td>
                    <td className="border-r border-black p-1 text-center text-sm">{record.hiv || ''}</td>
                    <td className="border-r border-black p-1 text-center text-sm">1.00</td>
                    <td className="p-1 text-center text-sm">{getScreeningResult(record.hiv)}</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="border-r border-black p-1 text-sm">V.D.R.L (Syphilis)</td>
                    <td className="border-r border-black p-1 text-center text-sm">{record.vdrl || ''}</td>
                    <td className="border-r border-black p-1 text-center text-sm">1.00</td>
                    <td className="p-1 text-center text-sm">{getScreeningResult(record.vdrl)}</td>
                  </tr>
                  <tr>
                    <td className="border-r border-black p-1 text-sm">HB</td>
                    <td className="border-r border-black p-1 text-center text-sm">{record.hb || ''}</td>
                    <td className="border-r border-black p-1 text-center text-sm"></td>
                    <td className="p-1 text-center text-sm"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Crossmatch Results */}
          <div className="mb-3">
            <table className="w-full border-2 border-black border-collapse">
              <thead>
                <tr>
                  <th className="border-r border-black p-1 font-bold text-sm">Reg No.</th>
                  <th className="border-r border-black p-1 font-bold text-sm">Blood Group</th>
                  <th className="border-r border-black p-1 font-bold text-sm">Saline</th>
                  <th className="border-r border-black p-1 font-bold text-sm">Albumin</th>
                  <th className="border-r border-black p-1 font-bold text-sm">Coomb's</th>
                  <th className="p-1 font-bold text-sm">Result</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-r border-black p-1 h-8 text-sm">{record.bag_id || ''}</td>
                  <td className="border-r border-black p-1 text-sm">{record.donor_blood_group || ''}{record.donor_rh || ''}</td>
                  <td className="border-r border-black p-1 text-center text-sm">{record.saline}</td>
                  <td className="border-r border-black p-1 text-center text-sm">{record.albumin}</td>
                  <td className="border-r border-black p-1 text-center text-sm">{record.coomb}</td>
                  <td className="p-1 text-center text-sm">{record.result}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Remarks */}
          <div className="mb-4">
            <div className="flex">
              <span className="font-semibold">Remarks:</span>
              <div className="flex-1 ml-2">
                <div className="border-b border-black min-h-[20px]">{record.remarks}</div>
              </div>
            </div>
          </div>

          {/* Signatures */}
          <div className="mt-6">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <span className="font-semibold">SIGNATURE: ( LAB-INCHARGE)</span>
                <div className="border-b border-black mt-4"></div>
              </div>
              <div>
                <span className="font-semibold">SIGNATURE: ( LAB-ASSISTANT)</span>
                <div className="border-b border-black mt-4"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CrossmatchReportDisplay;
