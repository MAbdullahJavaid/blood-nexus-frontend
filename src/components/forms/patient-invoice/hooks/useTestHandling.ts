
import { useState } from "react";
import { InvoiceItem } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useTestHandling() {
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
  const [currentTestIndex, setCurrentTestIndex] = useState<number | null>(null);

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
      return newItems;
    }
    return items;
  };

  const handleQuantityChange = (index: number, value: number) => {
    const updatedItems = [...items];
    updatedItems[index].qty = value;
    updatedItems[index].amount = value * updatedItems[index].rate;
    setItems(updatedItems);
    return updatedItems;
  };
  
  const handleRateChange = (index: number, value: number) => {
    const updatedItems = [...items];
    updatedItems[index].rate = value;
    updatedItems[index].amount = value * updatedItems[index].qty;
    setItems(updatedItems);
    return updatedItems;
  };

  const handleTestSelect = async (testId: number) => {
    try {
      const { data, error } = await supabase
        .from('test_information')
        .select('id, name, price')
        .eq('id', testId)
        .single();
      
      if (error) throw error;
      
      if (data && currentTestIndex !== null) {
        const updatedItems = [...items];
        updatedItems[currentTestIndex] = {
          ...updatedItems[currentTestIndex],
          testId: data.id,
          testName: data.name,
          rate: data.price,
          amount: data.price * updatedItems[currentTestIndex].qty
        };
        
        setItems(updatedItems);
        setCurrentTestIndex(null);
        return updatedItems;
      }
    } catch (error) {
      console.error("Error selecting test:", error);
      toast.error("Failed to select test");
    }
    return items;
  };

  const handleSearchTest = (index: number) => {
    setCurrentTestIndex(index);
  };

  return {
    items,
    setItems,
    selectedItemIndex,
    setSelectedItemIndex,
    currentTestIndex,
    setCurrentTestIndex,
    handleAddItem,
    handleDeleteItem,
    handleQuantityChange,
    handleRateChange,
    handleTestSelect,
    handleSearchTest
  };
}
