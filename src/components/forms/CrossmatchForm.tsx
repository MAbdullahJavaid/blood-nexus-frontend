
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

import { CrossmatchFormHeader } from "./crossmatch/CrossmatchFormHeader";
import { PatientInfoSection } from "./crossmatch/PatientInfoSection";
import { TestResultsSection } from "./crossmatch/TestResultsSection";
import { DonorInfoTable } from "./crossmatch/DonorInfoTable";
import { SearchModals } from "./crossmatch/SearchModals";
import { useCrossmatchData } from "./crossmatch/hooks/useCrossmatchData";
import { 
  CrossmatchFormProps, 
  DonorItem, 
  PreCrossmatchData, 
  ProductData, 
  CrossmatchRecord 
} from "./crossmatch/types";

interface CrossmatchFormRef {
  clearForm: () => void;
  handleSave: () => Promise<{success: boolean, error?: any}>;
}

const CrossmatchForm = forwardRef<CrossmatchFormRef, CrossmatchFormProps>(
  ({ isSearchEnabled = false, isEditable = false }, ref) => {
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
    const [searchTerm, setSearchTerm] = useState("");
    const [donorSearchTerm, setDonorSearchTerm] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [crossmatchSearchTerm, setCrossmatchSearchTerm] = useState("");
    const [isCrossmatchSearchModalOpen, setIsCrossmatchSearchModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<CrossmatchRecord | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    const {
      preCrossmatchData,
      productsData,
      crossmatchRecords,
      fetchPreCrossmatchData,
      fetchProductsData,
      fetchCrossmatchRecords,
      refetchCrossmatchRecords
    } = useCrossmatchData();

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

    useEffect(() => {
      if (isCrossmatchSearchModalOpen) {
        fetchCrossmatchRecords();
      }
    }, [isCrossmatchSearchModalOpen]);

    const handleSearchDocClick = () => {
      setIsSearchModalOpen(true);
    };

    const handleSearchCrossmatchClick = () => {
      setIsCrossmatchSearchModalOpen(true);
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

    const handleRemoveDonor = (donorId: string) => {
      setDonorItems(donorItems.filter(donor => donor.id !== donorId));
      toast.success("Donor removed");
    };

    const handleEditCrossmatch = async (record: CrossmatchRecord) => {
      console.log("Loading crossmatch record for editing:", record);
      setEditingRecord(record);
      setIsEditing(true);
      setCrossmatchNo(record.crossmatch_no);
      setQuantity(record.quantity);
      setDate(record.date);
      setBloodCategory(record.blood_category || "");
      setAlbumin(record.albumin);
      setSaline(record.saline);
      setCoomb(record.coomb);
      setResult(record.result);
      setExpiryDate(record.expiry_date || "");
      setRemarks(record.remarks || "");
      
      // Set patient data
      setSelectedInvoice({
        document_no: record.crossmatch_no,
        patient_name: record.patient_name,
        age: record.age,
        sex: record.sex,
        blood_group: record.blood_group,
        rh: record.rh,
        hospital: record.hospital
      });

      // Load donor information if product_id exists
      if (record.product_id) {
        try {
          const { data: productData, error } = await supabase
            .from('products')
            .select('*')
            .eq('bag_no', record.product_id)
            .single();

          if (productData && !error) {
            const donorItem: DonorItem = {
              id: productData.id,
              bagNo: productData.bag_no,
              pipeNo: "",
              name: productData.donor_name,
              product: productData.product,
              quantity: 1.0,
              unit: "Bag"
            };
            setDonorItems([donorItem]);
          }
        } catch (error) {
          console.error("Error loading donor data for editing:", error);
        }
      }

      setIsCrossmatchSearchModalOpen(false);
      toast.success("Record loaded for editing");
    };

    const handleDeleteCrossmatch = async (recordId: string) => {
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
        refetchCrossmatchRecords();
      } catch (error) {
        console.error("Error deleting crossmatch record:", error);
        toast.error("Failed to delete crossmatch record");
      }
    };

    const handleSaveCrossmatch = async () => {
      console.log("CrossmatchForm: Starting crossmatch save process...");
      
      // VALIDATION: Check if document number is provided - this is required
      if (!crossmatchNo.trim()) {
        console.log("CrossmatchForm: Validation failed - missing document number");
        toast.error("Document number is required and cannot be empty");
        throw new Error("Document number is required");
      }

      // VALIDATION: For new records, require patient selection
      if (!selectedInvoice && !isEditing) {
        console.log("CrossmatchForm: Validation failed - no patient selected");
        toast.error("Please select a patient first");
        throw new Error("Patient selection is required");
      }

      // VALIDATION: For new records, require at least one donor
      if (donorItems.length === 0 && !isEditing) {
        console.log("CrossmatchForm: Validation failed - no donors selected");
        toast.error("Please add at least one donor");
        throw new Error("At least one donor is required");
      }

      setIsSaving(true);
      
      try {
        console.log("CrossmatchForm: Validation passed, proceeding with save", {
          selectedInvoice,
          donorItems: donorItems.length,
          isEditing
        });
        
        // Prepare base crossmatch data
        const baseCrossmatchData = {
          crossmatch_no: crossmatchNo,
          quantity: quantity,
          date: date,
          patient_name: selectedInvoice?.patient_name || editingRecord?.patient_name || "",
          age: selectedInvoice?.age || editingRecord?.age,
          sex: selectedInvoice?.sex || editingRecord?.sex,
          blood_group: selectedInvoice?.blood_group || editingRecord?.blood_group,
          rh: selectedInvoice?.rh || editingRecord?.rh,
          hospital: selectedInvoice?.hospital || editingRecord?.hospital,
          blood_category: bloodCategory,
          albumin: albumin,
          saline: saline,
          coomb: coomb,
          result: result,
          expiry_date: expiryDate || null,
          remarks: remarks,
          pre_crossmatch_doc_no: selectedInvoice?.document_no || editingRecord?.crossmatch_no
        };

        if (isEditing && editingRecord) {
          // Update existing record
          const updateData = {
            ...baseCrossmatchData,
            product_id: donorItems.length > 0 ? donorItems[0].bagNo : editingRecord.product_id
          };

          console.log("CrossmatchForm: Updating crossmatch data:", updateData);

          const { error: updateError } = await supabase
            .from('crossmatch_records')
            .update(updateData)
            .eq('id', editingRecord.id);

          if (updateError) {
            console.error("CrossmatchForm: Update error:", updateError);
            throw updateError;
          }
        } else {
          // Create new record(s)
          if (donorItems.length > 1) {
            // Handle multiple donors - create separate records for each
            for (const donor of donorItems) {
              const crossmatchData = {
                ...baseCrossmatchData,
                crossmatch_no: `${crossmatchNo}-${donor.bagNo}`,
                product_id: donor.bagNo
              };

              console.log("CrossmatchForm: Inserting crossmatch data for multiple donors:", crossmatchData);

              const { error: crossmatchError } = await supabase
                .from('crossmatch_records')
                .insert(crossmatchData);

              if (crossmatchError) {
                console.error("CrossmatchForm: Error inserting crossmatch record:", crossmatchError);
                throw crossmatchError;
              }
            }
          } else if (donorItems.length === 1) {
            // Handle single donor
            const crossmatchData = {
              ...baseCrossmatchData,
              product_id: donorItems[0].bagNo
            };

            console.log("CrossmatchForm: Inserting crossmatch data for single donor:", crossmatchData);

            const { error: crossmatchError } = await supabase
              .from('crossmatch_records')
              .insert(crossmatchData);

            if (crossmatchError) {
              console.error("CrossmatchForm: Error inserting crossmatch record:", crossmatchError);
              throw crossmatchError;
            }
          }

          // Only delete pre_crossmatch and products if this is a new record (not editing)
          if (selectedInvoice) {
            console.log("CrossmatchForm: Deleting pre_crossmatch record with document_no:", selectedInvoice.document_no);
            const { error: preCrossmatchDeleteError } = await supabase
              .from('pre_crossmatch')
              .delete()
              .eq('document_no', selectedInvoice.document_no);

            if (preCrossmatchDeleteError) {
              console.error("CrossmatchForm: Error deleting pre-crossmatch record:", preCrossmatchDeleteError);
            }
          }

          // Delete selected products
          if (donorItems.length > 0) {
            const productIds = donorItems.map(item => item.id);
            console.log("CrossmatchForm: Deleting products with IDs:", productIds);
            
            const { error: productDeleteError } = await supabase
              .from('products')
              .delete()
              .in('id', productIds);

            if (productDeleteError) {
              console.error("CrossmatchForm: Error deleting product records:", productDeleteError);
            }
          }
        }

        console.log("CrossmatchForm: Save successful");
        toast.success(isEditing ? "Crossmatch record updated successfully" : "Crossmatch record saved successfully");
      
        // Reset form after successful save
        resetForm();
      
      } catch (error) {
        console.error("CrossmatchForm: Error saving crossmatch record:", error);
        throw error;
      } finally {
        setIsSaving(false);
      }
    };

    const resetForm = () => {
      setSelectedInvoice(null);
      setEditingRecord(null);
      setIsEditing(false);
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
    };

    useImperativeHandle(ref, () => ({
      clearForm: resetForm,
      handleSave: async () => {
        try {
          await handleSaveCrossmatch();
          return { success: true };
        } catch (error) {
          console.error("CrossmatchForm: Error saving crossmatch:", error);
          return { success: false, error };
        }
      }
    }));

    return (
      <div className="bg-white p-4 rounded-md">
        <CrossmatchFormHeader
          crossmatchNo={crossmatchNo}
          setCrossmatchNo={setCrossmatchNo}
          quantity={quantity}
          setQuantity={setQuantity}
          date={date}
          setDate={setDate}
          isEditable={isEditable}
          onSearchClick={handleSearchDocClick}
        />

        <PatientInfoSection
          selectedInvoice={selectedInvoice}
          bloodCategory={bloodCategory}
          setBloodCategory={setBloodCategory}
          isEditable={isEditable}
        />

        <TestResultsSection
          albumin={albumin}
          setAlbumin={setAlbumin}
          saline={saline}
          setSaline={setSaline}
          coomb={coomb}
          setCoomb={setCoomb}
          result={result}
          setResult={setResult}
          expiryDate={expiryDate}
          setExpiryDate={setExpiryDate}
          remarks={remarks}
          setRemarks={setRemarks}
          isEditable={isEditable}
        />

        <DonorInfoTable
          donorItems={donorItems}
          onAddDonor={handleAddDonor}
          onRemoveDonor={handleRemoveDonor}
          isEditable={isEditable}
        />

        <SearchModals
          isSearchModalOpen={isSearchModalOpen}
          setIsSearchModalOpen={setIsSearchModalOpen}
          preCrossmatchData={preCrossmatchData}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onInvoiceSelect={handleInvoiceSelect}
          isDonorSearchModalOpen={isDonorSearchModalOpen}
          setIsDonorSearchModalOpen={setIsDonorSearchModalOpen}
          productsData={productsData}
          donorSearchTerm={donorSearchTerm}
          setDonorSearchTerm={setDonorSearchTerm}
          onDonorSelect={handleDonorSelect}
          isCrossmatchSearchModalOpen={isCrossmatchSearchModalOpen}
          setIsCrossmatchSearchModalOpen={setIsCrossmatchSearchModalOpen}
          crossmatchRecords={crossmatchRecords}
          crossmatchSearchTerm={crossmatchSearchTerm}
          setCrossmatchSearchTerm={setCrossmatchSearchTerm}
          onEditCrossmatch={handleEditCrossmatch}
          onDeleteCrossmatch={handleDeleteCrossmatch}
        />
      </div>
    );
  }
);

CrossmatchForm.displayName = "CrossmatchForm";

export default CrossmatchForm;
