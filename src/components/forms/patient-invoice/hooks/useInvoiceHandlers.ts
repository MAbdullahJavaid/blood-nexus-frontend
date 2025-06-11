
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { InvoiceItem, Patient } from "../types";

export const useInvoiceHandlers = (
  items: InvoiceItem[],
  setItems: (items: InvoiceItem[]) => void,
  setTotalAmount: (amount: number) => void,
  setDiscount: (discount: number) => void,
  receivedAmount: number,
  setSelectedItemIndex: (index: number | null) => void,
  selectedItemIndex: number | null,
  setCurrentTestIndex: (index: number | null) => void,
  setIsTestSearchModalOpen: (open: boolean) => void
) => {
  const calculateTotal = (itemsArray: InvoiceItem[]) => {
    const sum = itemsArray.reduce((acc, item) => acc + item.amount, 0);
    setTotalAmount(sum);
    
    const calculatedDiscount = sum - receivedAmount;
    setDiscount(calculatedDiscount >= 0 ? calculatedDiscount : 0);
  };

  const handleAddItem = () => {
    const tempId = `temp-${items.length}`;
    const newItem: InvoiceItem = {
      id: tempId,
      testId: 0,
      testName: "",
      qty: 1,
      rate: 0,
      amount: 0
    };
    
    setItems([...items, newItem]);
    setSelectedItemIndex(items.length);
    setCurrentTestIndex(items.length);
  };

  const handleDeleteItem = () => {
    if (selectedItemIndex !== null) {
      const newItems = [...items];
      newItems.splice(selectedItemIndex, 1);
      setItems(newItems);
      setSelectedItemIndex(null);
      calculateTotal(newItems);
    }
  };

  const handleTestSelect = async (testId: number) => {
    try {
      const { data, error } = await supabase
        .from('test_information')
        .select(`
          id, 
          name, 
          price, 
          test_type,
          test_categories!inner(name)
        `)
        .eq('id', testId)
        .single();
      
      if (error) throw error;
      
      if (data && setCurrentTestIndex !== null) {
        const updatedItems = [...items];
        const currentIndex = updatedItems.findIndex(item => item.testId === 0);
        if (currentIndex !== -1) {
          updatedItems[currentIndex] = {
            ...updatedItems[currentIndex],
            testId: data.id,
            testName: data.name,
            rate: data.price,
            amount: data.price * updatedItems[currentIndex].qty,
            type: data.test_type,
            category: data.test_categories?.name
          };
          
          setItems(updatedItems);
          calculateTotal(updatedItems);
          setIsTestSearchModalOpen(false);
          setCurrentTestIndex(null);
        }
      }
    } catch (error) {
      console.error("Error selecting test:", error);
      toast.error("Failed to select test");
    }
  };

  const handleQuantityChange = (index: number, value: number) => {
    const updatedItems = [...items];
    updatedItems[index].qty = value;
    updatedItems[index].amount = value * updatedItems[index].rate;
    setItems(updatedItems);
    calculateTotal(updatedItems);
  };
  
  const handleRateChange = (index: number, value: number) => {
    const updatedItems = [...items];
    updatedItems[index].rate = value;
    updatedItems[index].amount = value * updatedItems[index].qty;
    setItems(updatedItems);
    calculateTotal(updatedItems);
  };

  return {
    calculateTotal,
    handleAddItem,
    handleDeleteItem,
    handleTestSelect,
    handleQuantityChange,
    handleRateChange
  };
};
