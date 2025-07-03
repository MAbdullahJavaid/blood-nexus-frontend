
import { useState } from "react";
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

      if (error) {
        console.error("Error fetching pre-crossmatch data:", error);
        toast.error("Failed to fetch pre-crossmatch data");
        return;
      }

      setPreCrossmatchData(data || []);
    } catch (error) {
      console.error("Error in fetchPreCrossmatchData:", error);
      toast.error("Failed to fetch pre-crossmatch data");
    }
  };

  const fetchProductsData = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          bleeding_records!inner (
            donor_id,
            donors!inner (
              blood_group_separate,
              rh_factor
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching products data:", error);
        toast.error("Failed to fetch products data");
        return;
      }

      // Transform the data to include blood group information
      const transformedData = data?.map(product => {
        const bleedingRecord = product.bleeding_records;
        const donor = bleedingRecord?.donors;
        let bloodGroup = 'Not Available';
        
        if (donor?.blood_group_separate && donor?.rh_factor) {
          const rhSymbol = donor.rh_factor === '+ve' ? '+' : donor.rh_factor === '-ve' ? '-' : '';
          bloodGroup = `${donor.blood_group_separate}${rhSymbol}`;
        }

        return {
          ...product,
          blood_group: bloodGroup
        };
      }) || [];

      setProductsData(transformedData);
    } catch (error) {
      console.error("Error in fetchProductsData:", error);
      toast.error("Failed to fetch products data");
    }
  };

  const fetchCrossmatchRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('crossmatch_records')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching crossmatch records:", error);
        toast.error("Failed to fetch crossmatch records");
        return;
      }

      setCrossmatchRecords(data || []);
    } catch (error) {
      console.error("Error in fetchCrossmatchRecords:", error);
      toast.error("Failed to fetch crossmatch records");
    }
  };

  const refetchCrossmatchRecords = () => {
    fetchCrossmatchRecords();
  };

  return {
    preCrossmatchData,
    productsData,
    crossmatchRecords,
    fetchPreCrossmatchData,
    fetchProductsData,
    fetchCrossmatchRecords,
    refetchCrossmatchRecords
  };
};
