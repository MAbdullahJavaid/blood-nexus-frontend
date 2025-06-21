
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Package, TrendingUp, AlertTriangle } from "lucide-react";

interface Product {
  id: string;
  bag_no: string;
  donor_name: string;
  product: string;
  created_at: string;
}

interface StockDisplayProps {
  isVisible: boolean;
}

export const StockDisplay: React.FC<StockDisplayProps> = ({ isVisible }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getProductTypeCounts = () => {
    const counts: { [key: string]: number } = {};
    products.forEach(product => {
      counts[product.product] = (counts[product.product] || 0) + 1;
    });
    return counts;
  };

  const productCounts = getProductTypeCounts();
  const totalStock = products.length;

  if (!isVisible) {
    return null;
  }

  return (
    <div className="space-y-4 mb-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            Available Stock
          </CardTitle>
          <CardDescription>
            Current inventory of blood products
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading stock information...</div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">Total Units</p>
                      <p className="text-2xl font-bold text-blue-800">{totalStock}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-blue-600" />
                  </div>
                </div>

                {Object.entries(productCounts).slice(0, 2).map(([productType, count]) => (
                  <div key={productType} className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-600">{productType}</p>
                        <p className="text-2xl font-bold text-green-800">{count}</p>
                      </div>
                      <Package className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                ))}
              </div>

              {Object.keys(productCounts).length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-2">Product Breakdown:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {Object.entries(productCounts).map(([productType, count]) => (
                      <div key={productType} className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">{productType}:</span>
                        <span className="font-medium">{count} units</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {totalStock === 0 && (
                <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg">
                  <AlertTriangle className="w-5 h-5" />
                  <span>No products currently in stock</span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
