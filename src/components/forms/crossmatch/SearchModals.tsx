
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import { PreCrossmatchData, ProductData, CrossmatchRecord } from "./types";

interface SearchModalsProps {
  // Patient search modal
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
  preCrossmatchData: PreCrossmatchData[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onInvoiceSelect: (invoice: PreCrossmatchData) => void;

  // Donor search modal
  isDonorSearchModalOpen: boolean;
  setIsDonorSearchModalOpen: (open: boolean) => void;
  productsData: ProductData[];
  donorSearchTerm: string;
  setDonorSearchTerm: (term: string) => void;
  onDonorSelect: (product: ProductData) => void;

  // Crossmatch records modal
  isCrossmatchSearchModalOpen: boolean;
  setIsCrossmatchSearchModalOpen: (open: boolean) => void;
  crossmatchRecords: CrossmatchRecord[];
  crossmatchSearchTerm: string;
  setCrossmatchSearchTerm: (term: string) => void;
  onEditCrossmatch: (record: CrossmatchRecord) => void;
  onDeleteCrossmatch: (recordId: string) => void;
}

export const SearchModals = ({
  isSearchModalOpen,
  setIsSearchModalOpen,
  preCrossmatchData,
  searchTerm,
  setSearchTerm,
  onInvoiceSelect,
  isDonorSearchModalOpen,
  setIsDonorSearchModalOpen,
  productsData,
  donorSearchTerm,
  setDonorSearchTerm,
  onDonorSelect,
  isCrossmatchSearchModalOpen,
  setIsCrossmatchSearchModalOpen,
  crossmatchRecords,
  crossmatchSearchTerm,
  setCrossmatchSearchTerm,
  onEditCrossmatch,
  onDeleteCrossmatch
}: SearchModalsProps) => {
  const filteredData = preCrossmatchData.filter(item =>
    item.document_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.patient_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProducts = productsData.filter(product =>
    product.bag_no.toLowerCase().includes(donorSearchTerm.toLowerCase()) ||
    product.donor_name.toLowerCase().includes(donorSearchTerm.toLowerCase()) ||
    product.product.toLowerCase().includes(donorSearchTerm.toLowerCase())
  );

  const filteredCrossmatchRecords = crossmatchRecords.filter(record =>
    record.crossmatch_no.toLowerCase().includes(crossmatchSearchTerm.toLowerCase()) ||
    record.patient_name.toLowerCase().includes(crossmatchSearchTerm.toLowerCase())
  );

  return (
    <>
      {/* Search Invoice Modal */}
      <Dialog open={isSearchModalOpen} onOpenChange={setIsSearchModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Patient Invoice</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input 
              placeholder="Search by document number or patient name" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="h-64 border mt-4 overflow-y-auto">
              {filteredData.length > 0 ? (
                filteredData.map((invoice) => (
                  <div 
                    key={invoice.document_no} 
                    className="p-2 border-b hover:bg-gray-100 cursor-pointer"
                    onClick={() => onInvoiceSelect(invoice)}
                  >
                    <div className="font-medium">Doc #: {invoice.document_no}</div>
                    <div className="text-sm text-gray-600">
                      Patient: {invoice.patient_name}, {invoice.sex}, {invoice.age} yrs
                    </div>
                    <div className="text-sm text-gray-600">
                      Blood Group: {invoice.blood_group}{invoice.rh}, Hospital: {invoice.hospital}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No patient invoices found
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Donor Search Modal */}
      <Dialog open={isDonorSearchModalOpen} onOpenChange={setIsDonorSearchModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Donor Product</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input 
              placeholder="Search by bag number, donor name, or product" 
              value={donorSearchTerm}
              onChange={(e) => setDonorSearchTerm(e.target.value)}
            />
            <div className="h-64 border mt-4 overflow-y-auto">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div 
                    key={product.id} 
                    className="p-2 border-b hover:bg-gray-100 cursor-pointer"
                    onClick={() => onDonorSelect(product)}
                  >
                    <div className="font-medium">Bag #: {product.bag_no}</div>
                    <div className="text-sm text-gray-600">
                      Donor: {product.donor_name}
                    </div>
                    <div className="text-sm text-gray-500">
                      Product: {product.product}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No donor products found
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Crossmatch Records Search Modal */}
      <Dialog open={isCrossmatchSearchModalOpen} onOpenChange={setIsCrossmatchSearchModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Manage Crossmatch Records</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input 
              placeholder="Search by crossmatch number or patient name" 
              value={crossmatchSearchTerm}
              onChange={(e) => setCrossmatchSearchTerm(e.target.value)}
            />
            <div className="h-96 border mt-4 overflow-y-auto">
              {filteredCrossmatchRecords.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Crossmatch No</TableHead>
                      <TableHead>Patient Name</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Result</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCrossmatchRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{record.crossmatch_no}</TableCell>
                        <TableCell>{record.patient_name}</TableCell>
                        <TableCell>{record.date}</TableCell>
                        <TableCell>{record.result}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => onEditCrossmatch(record)}
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => onDeleteCrossmatch(record.id)}
                              size="sm"
                              variant="destructive"
                              className="h-8 w-8 p-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No crossmatch records found
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
