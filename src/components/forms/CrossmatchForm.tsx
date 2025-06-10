import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchIcon, PlusCircle, Save } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CrossmatchFormProps {
  isSearchEnabled?: boolean;
  isEditable?: boolean;
}

interface DonorItem {
  id: string;
  bagNo: string;
  pipeNo: string;
  name: string;
  product: string;
  quantity: number;
  unit: string;
}

interface PreCrossmatchData {
  document_no: string;
  patient_name: string;
  age: number | null;
  sex: string | null;
  blood_group: string | null;
  rh: string | null;
  hospital: string | null;
}

interface ProductData {
  id: string;
  bag_no: string;
  donor_name: string;
  product: string;
}

const mockDonors = [
  { id: "1", bagNo: "B001", pipeNo: "P121", name: "John Doe", bloodGroup: "A+", product: "F.W.B" },
  { id: "2", bagNo: "B002", pipeNo: "P122", name: "Jane Smith", bloodGroup: "O-", product: "F.W.B" },
  { id: "3", bagNo: "B003", pipeNo: "P123", name: "Robert Brown", bloodGroup: "B+", product: "F.W.B" },
];

const CrossmatchForm = ({ isSearchEnabled = false, isEditable = false }: CrossmatchFormProps) => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isDonorSearchModalOpen, setIsDonorSearchModalOpen] = useState(false);
  const [donorItems, setDonorItems] = useState<DonorItem[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<PreCrossmatchData | null>(null);
  const [crossmatchNo, setCrossmatchNo] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [bloodCategory, setBloodCategory] = useState("");
  const [albumin, setAlbumin] = useState("negative");
  const [saline, setSaline] = useState("negative");
  const [coomb, setCoomb] = useState("negative");
  const [result, setResult] = useState("compatible");
  const [expiryDate, setExpiryDate] = useState("");
  const [remarks, setRemarks] = useState("Donor red cells are compatible with patient Serum/Plasma. Donor ELISA screening is negative and blood is ready for transfusion.");
  const [preCrossmatchData, setPreCrossmatchData] = useState<PreCrossmatchData[]>([]);
  const [productsData, setProductsData] = useState<ProductData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [donorSearchTerm, setDonorSearchTerm] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isSearchModalOpen) {
      fetchPreCrossmatchData();
    }
  }, [isSearchModalOpen]);

  useEffect(() => {
    if (isDonorSearchModalOpen) {
      fetchProductsData();
    }
  }, [isDonorSearchModalOpen]);

  const fetchPreCrossmatchData = async () => {
    try {
      const { data, error } = await supabase
        .from('pre_crossmatch')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setPreCrossmatchData(data || []);
    } catch (error) {
      console.error("Error fetching pre-crossmatch data:", error);
      toast.error("Failed to fetch patient data");
    }
  };

  const fetchProductsData = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setProductsData(data || []);
    } catch (error) {
      console.error("Error fetching products data:", error);
      toast.error("Failed to fetch donor products data");
    }
  };

  const handleSearchDocClick = () => {
    setIsSearchModalOpen(true);
  };

  const handleInvoiceSelect = (invoice: PreCrossmatchData) => {
    setSelectedInvoice(invoice);
    setCrossmatchNo(invoice.document_no);
    setIsSearchModalOpen(false);
    toast.success(`Patient ${invoice.patient_name} selected`);
  };

  const handleAddDonor = () => {
    setIsDonorSearchModalOpen(true);
  };

  const handleDonorSelect = (product: ProductData) => {
    const newDonorItem: DonorItem = {
      id: product.id,
      bagNo: product.bag_no,
      pipeNo: "",
      name: product.donor_name,
      product: product.product,
      quantity: 1.0,
      unit: "Bag"
    };
    
    setDonorItems([...donorItems, newDonorItem]);
    setIsDonorSearchModalOpen(false);
    toast.success(`Donor ${product.donor_name} added`);
  };

  const handleSaveCrossmatch = async () => {
    if (!selectedInvoice) {
      toast.error("Please select a patient first");
      return;
    }

    if (!crossmatchNo.trim()) {
      toast.error("Crossmatch number is required");
      return;
    }

    setIsSaving(true);
    
    try {
      const crossmatchData = {
        crossmatch_no: crossmatchNo,
        quantity: quantity,
        date: date,
        patient_name: selectedInvoice.patient_name,
        age: selectedInvoice.age,
        sex: selectedInvoice.sex,
        blood_group: selectedInvoice.blood_group,
        rh: selectedInvoice.rh,
        hospital: selectedInvoice.hospital,
        blood_category: bloodCategory,
        albumin: albumin,
        saline: saline,
        coomb: coomb,
        result: result,
        expiry_date: expiryDate || null,
        remarks: remarks,
        pre_crossmatch_doc_no: selectedInvoice.document_no
      };

      const { error: crossmatchError } = await supabase
        .from('crossmatch_records')
        .insert(crossmatchData);

      if (crossmatchError) throw crossmatchError;

      // Delete the selected row from pre_crossmatch table
      const { error: preCrossmatchDeleteError } = await supabase
        .from('pre_crossmatch')
        .delete()
        .eq('document_no', selectedInvoice.document_no);

      if (preCrossmatchDeleteError) {
        console.error("Error deleting pre-crossmatch record:", preCrossmatchDeleteError);
        toast.error("Failed to delete pre-crossmatch record");
        return;
      }

      // Delete selected products
      if (donorItems.length > 0) {
        const productIds = donorItems.map(item => item.id);
        const { error: productDeleteError } = await supabase
          .from('products')
          .delete()
          .in('id', productIds);

        if (productDeleteError) {
          console.error("Error deleting product records:", productDeleteError);
          toast.error("Failed to delete product records");
          return;
        }
      }

      toast.success("Crossmatch record saved successfully and related records deleted");
      
      // Reset form after successful save
      setSelectedInvoice(null);
      setCrossmatchNo("");
      setQuantity(1);
      setDate(new Date().toISOString().split('T')[0]);
      setBloodCategory("");
      setAlbumin("negative");
      setSaline("negative");
      setCoomb("negative");
      setResult("compatible");
      setExpiryDate("");
      setRemarks("Donor red cells are compatible with patient Serum/Plasma. Donor ELISA screening is negative and blood is ready for transfusion.");
      setDonorItems([]);
      
    } catch (error) {
      console.error("Error saving crossmatch record:", error);
      toast.error("Failed to save crossmatch record");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredData = preCrossmatchData.filter(item =>
    item.document_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.patient_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProducts = productsData.filter(product =>
    product.bag_no.toLowerCase().includes(donorSearchTerm.toLowerCase()) ||
    product.donor_name.toLowerCase().includes(donorSearchTerm.toLowerCase()) ||
    product.product.toLowerCase().includes(donorSearchTerm.toLowerCase())
  );

  return (
    <div className="bg-white p-4 rounded-md">
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <Label htmlFor="caseNo" className="mb-1 block">Crossmatch No:</Label>
          <div className="flex items-center gap-2">
            <Input 
              id="caseNo" 
              className="h-9" 
              disabled={!isEditable} 
              value={crossmatchNo}
              onChange={(e) => setCrossmatchNo(e.target.value)}
            />
            {isEditable && (
              <button 
                onClick={handleSearchDocClick}
                className="bg-gray-200 p-1 rounded hover:bg-gray-300"
                aria-label="Search crossmatch"
              >
                <SearchIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        <div>
          <Label htmlFor="quantity" className="mb-1 block">Quantity:</Label>
          <Input 
            id="quantity" 
            className="h-9" 
            type="number" 
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            disabled={!isEditable} 
          />
        </div>
        <div>
          <Label htmlFor="date" className="mb-1 block">Date:</Label>
          <Input 
            id="date" 
            className="h-9" 
            type="date" 
            value={date}
            onChange={(e) => setDate(e.target.value)}
            disabled={!isEditable} 
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="patientName" className="mb-1 block">Patient Name:</Label>
          <Input 
            id="patientName" 
            className="h-9" 
            disabled={true} 
            value={selectedInvoice?.patient_name || ""}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="age" className="mb-1 block">Age:</Label>
            <Input 
              id="age" 
              className="h-9" 
              disabled={true} 
              value={selectedInvoice?.age || ""}
            />
          </div>
          <div>
            <Label htmlFor="sex" className="mb-1 block">Sex:</Label>
            <Input 
              id="sex" 
              className="h-9" 
              disabled={true} 
              value={selectedInvoice?.sex || ""}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <Label htmlFor="patientBloodGroup" className="mb-1 block">Patient Blood Group:</Label>
          <div className="flex gap-2">
            <Select disabled={true} value={selectedInvoice?.blood_group || "A"}>
              <SelectTrigger className="h-9 flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A">A</SelectItem>
                <SelectItem value="B">B</SelectItem>
                <SelectItem value="O">O</SelectItem>
                <SelectItem value="AB">AB</SelectItem>
                <SelectItem value="N/A">N/A</SelectItem>
              </SelectContent>
            </Select>
            <Select disabled={true} value={selectedInvoice?.rh || "+ve"}>
              <SelectTrigger className="h-9 flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="+ve">+ve</SelectItem>
                <SelectItem value="-ve">-ve</SelectItem>
                <SelectItem value="N/A">N/A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label htmlFor="hospital" className="mb-1 block">Hospital:</Label>
          <Input 
            id="hospital" 
            className="h-9" 
            disabled={true}
            value={selectedInvoice?.hospital || ""}
          />
        </div>
        <div>
          <Label htmlFor="bloodCate" className="mb-1 block">Blood Category:</Label>
          <Input 
            id="bloodCate" 
            className="h-9" 
            value={bloodCategory}
            onChange={(e) => setBloodCategory(e.target.value)}
            disabled={!isEditable} 
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <Label htmlFor="albumin" className="mb-1 block">Albumin:</Label>
          <Select value={albumin} onValueChange={setAlbumin} disabled={!isEditable}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="positive">Positive</SelectItem>
              <SelectItem value="negative">Negative</SelectItem>
              <SelectItem value="nil">Nil</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="saline" className="mb-1 block">Saline:</Label>
          <Select value={saline} onValueChange={setSaline} disabled={!isEditable}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="positive">Positive</SelectItem>
              <SelectItem value="negative">Negative</SelectItem>
              <SelectItem value="nil">Nil</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="coomb" className="mb-1 block">Coomb:</Label>
          <Select value={coomb} onValueChange={setCoomb} disabled={!isEditable}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="positive">Positive</SelectItem>
              <SelectItem value="negative">Negative</SelectItem>
              <SelectItem value="nil">Nil</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="result" className="mb-1 block">Result:</Label>
          <Select value={result} onValueChange={setResult} disabled={!isEditable}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="compatible">Compatible</SelectItem>
              <SelectItem value="incompatible">Incompatible</SelectItem>
              <SelectItem value="not-performed">Not Performed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="expiryDate" className="mb-1 block">Expiry Date:</Label>
          <Input 
            id="expiryDate" 
            className="h-9" 
            type="date" 
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            disabled={!isEditable} 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-6">
        <div>
          <Label htmlFor="remarks" className="mb-1 block">Remarks:</Label>
          <Input 
            id="remarks" 
            className="h-9" 
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            disabled={!isEditable} 
          />
        </div>
      </div>

      <div className="border rounded-md p-3 mb-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-gray-700">Donor Information</h3>
          {isEditable && (
            <Button 
              onClick={handleAddDonor}
              size="sm"
              className="flex items-center gap-1"
            >
              <PlusCircle className="h-4 w-4" />
              Add Donor
            </Button>
          )}
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Bag No</TableHead>
              <TableHead className="w-[80px]">Pipe No</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Product</TableHead>
              <TableHead className="w-[60px] text-right">Qty</TableHead>
              <TableHead className="w-[60px]">Unit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {donorItems.length > 0 ? (
              donorItems.map((donor) => (
                <TableRow key={donor.id}>
                  <TableCell>{donor.bagNo}</TableCell>
                  <TableCell>{donor.pipeNo}</TableCell>
                  <TableCell>{donor.name}</TableCell>
                  <TableCell>{donor.product}</TableCell>
                  <TableCell className="text-right">{donor.quantity.toFixed(2)}</TableCell>
                  <TableCell>{donor.unit}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                  No donors added yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Save Button */}
      {isEditable && (
        <div className="flex justify-end">
          <Button 
            onClick={handleSaveCrossmatch}
            disabled={isSaving || !selectedInvoice}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Saving..." : "Save Crossmatch"}
          </Button>
        </div>
      )}

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
                    onClick={() => handleInvoiceSelect(invoice)}
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
                    onClick={() => handleDonorSelect(product)}
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
    </div>
  );
};

export default CrossmatchForm;
