
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PreCrossmatchData, ProductData, CrossmatchRecord } from "../types";

export const useCrossmatchData = () => {
  const [preCrossmatchData, setPreCrossmatchData] = useState<PreCrossmatchData[]>([]);
  const [productsData, setProductsData] = useState<ProductData[]>([]);
  const [crossmatchRecords, setCrossmatchRecords] = useState<CrossmatchRecord[]>([]);

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

  const fetchCrossmatchRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('crossmatch_records')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setCrossmatchRecords(data || []);
    } catch (error) {
      console.error("Error fetching crossmatch records:", error);
      toast.error("Failed to fetch crossmatch records");
    }
  };

  return {
    preCrossmatchData,
    productsData,
    crossmatchRecords,
    fetchPreCrossmatchData,
    fetchProductsData,
    fetchCrossmatchRecords,
    refetchCrossmatchRecords: fetchCrossmatchRecords
  };
};
