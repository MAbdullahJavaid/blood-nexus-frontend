
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SearchIcon } from "lucide-react";
import { PreCrossmatchData, ProductData, CrossmatchRecord } from "./types";

interface SearchModalsProps {
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
  preCrossmatchData: PreCrossmatchData[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onInvoiceSelect: (invoice: PreCrossmatchData) => void;
  isDonorSearchModalOpen: boolean;
  setIsDonorSearchModalOpen: (open: boolean) => void;
  productsData: ProductData[];
  donorSearchTerm: string;
  setDonorSearchTerm: (term: string) => void;
  onDonorSelect: (product: ProductData) => void;
  isCrossmatchSearchModalOpen: boolean;
  setIsCrossmatchSearchModalOpen: (open: boolean) => void;
  crossmatchRecords: CrossmatchRecord[];
  crossmatchSearchTerm: string;
  setCrossmatchSearchTerm: (term: string) => void;
  onEditCrossmatch: (record: CrossmatchRecord) => void;
  onDeleteCrossmatch: (recordId: string) => void;
}

export function SearchModals({
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
  onDeleteCrossmatch,
}: SearchModalsProps) {
  const filteredInvoices = preCrossmatchData.filter(
    (invoice) =>
      invoice.document_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.patient_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProducts = productsData.filter(
    (product) =>
      product.bag_no.toLowerCase().includes(donorSearchTerm.toLowerCase()) ||
      product.donor_name.toLowerCase().includes(donorSearchTerm.toLowerCase()) ||
      product.product.toLowerCase().includes(donorSearchTerm.toLowerCase()) ||
      (product.blood_group && product.blood_group.toLowerCase().includes(donorSearchTerm.toLowerCase()))
  );

  const filteredCrossmatchRecords = crossmatchRecords.filter(
    (record) =>
      record.crossmatch_no.toLowerCase().includes(crossmatchSearchTerm.toLowerCase()) ||
      record.patient_name.toLowerCase().includes(crossmatchSearchTerm.toLowerCase())
  );

  return (
    <>
      {/* Pre-crossmatch Search Modal */}
      <Dialog open={isSearchModalOpen} onOpenChange={setIsSearchModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Select Pre-crossmatch Invoice</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="search">Search Invoices</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="search"
                  type="text"
                  placeholder="Search by document number or patient name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button variant="outline" size="sm">
                  <SearchIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="border rounded-md">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left border-b">Document No</th>
                    <th className="px-4 py-2 text-left border-b">Patient Name</th>
                    <th className="px-4 py-2 text-left border-b">Age</th>
                    <th className="px-4 py-2 text-left border-b">Sex</th>
                    <th className="px-4 py-2 text-left border-b">Blood Group</th>
                    <th className="px-4 py-2 text-left border-b">RH</th>
                    <th className="px-4 py-2 text-left border-b">Hospital</th>
                    <th className="px-4 py-2 text-left border-b">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.document_no} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border-b">{invoice.document_no}</td>
                      <td className="px-4 py-2 border-b">{invoice.patient_name}</td>
                      <td className="px-4 py-2 border-b">{invoice.age || 'N/A'}</td>
                      <td className="px-4 py-2 border-b">{invoice.sex || 'N/A'}</td>
                      <td className="px-4 py-2 border-b">{invoice.blood_group || 'N/A'}</td>
                      <td className="px-4 py-2 border-b">{invoice.rh || 'N/A'}</td>
                      <td className="px-4 py-2 border-b">{invoice.hospital || 'N/A'}</td>
                      <td className="px-4 py-2 border-b">
                        <Button
                          size="sm"
                          onClick={() => onInvoiceSelect(invoice)}
                        >
                          Select
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredInvoices.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  No invoices found.
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Donor Search Modal */}
      <Dialog open={isDonorSearchModalOpen} onOpenChange={setIsDonorSearchModalOpen}>
        <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Select Donor Product</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="donorSearch">Search Donor Products</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="donorSearch"
                  type="text"
                  placeholder="Search by bag number, donor name, product, or blood group..."
                  value={donorSearchTerm}
                  onChange={(e) => setDonorSearchTerm(e.target.value)}
                />
                <Button variant="outline" size="sm">
                  <SearchIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="border rounded-md">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left border-b">Bag No</th>
                    <th className="px-4 py-2 text-left border-b">Donor Name</th>
                    <th className="px-4 py-2 text-left border-b">Product</th>
                    <th className="px-4 py-2 text-left border-b">Blood Group</th>
                    <th className="px-4 py-2 text-left border-b">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border-b font-medium">{product.bag_no}</td>
                      <td className="px-4 py-2 border-b">{product.donor_name}</td>
                      <td className="px-4 py-2 border-b">{product.product}</td>
                      <td className="px-4 py-2 border-b">
                        <span className="font-medium text-blue-600">
                          {product.blood_group || 'Not Available'}
                        </span>
                      </td>
                      <td className="px-4 py-2 border-b">
                        <Button
                          size="sm"
                          onClick={() => onDonorSelect(product)}
                        >
                          Select
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredProducts.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  No donor products found.
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Crossmatch Search Modal */}
      <Dialog open={isCrossmatchSearchModalOpen} onOpenChange={setIsCrossmatchSearchModalOpen}>
        <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Select Crossmatch Record</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="crossmatchSearch">Search Crossmatch Records</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="crossmatchSearch"
                  type="text"
                  placeholder="Search by crossmatch number or patient name..."
                  value={crossmatchSearchTerm}
                  onChange={(e) => setCrossmatchSearchTerm(e.target.value)}
                />
                <Button variant="outline" size="sm">
                  <SearchIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="border rounded-md">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left border-b">Crossmatch No</th>
                    <th className="px-4 py-2 text-left border-b">Patient Name</th>
                    <th className="px-4 py-2 text-left border-b">Date</th>
                    <th className="px-4 py-2 text-left border-b">Blood Group</th>
                    <th className="px-4 py-2 text-left border-b">RH</th>
                    <th className="px-4 py-2 text-left border-b">Result</th>
                    <th className="px-4 py-2 text-left border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCrossmatchRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border-b">{record.crossmatch_no}</td>
                      <td className="px-4 py-2 border-b">{record.patient_name}</td>
                      <td className="px-4 py-2 border-b">{record.date}</td>
                      <td className="px-4 py-2 border-b">{record.blood_group || 'N/A'}</td>
                      <td className="px-4 py-2 border-b">{record.rh || 'N/A'}</td>
                      <td className="px-4 py-2 border-b">{record.result}</td>
                      <td className="px-4 py-2 border-b">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => onEditCrossmatch(record)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => onDeleteCrossmatch(record.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredCrossmatchRecords.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  No crossmatch records found.
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
