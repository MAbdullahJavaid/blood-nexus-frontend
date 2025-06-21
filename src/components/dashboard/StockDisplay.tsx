
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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

  const getGroupWiseStock = () => {
    // Extract blood groups and categories from product names
    const stockMatrix: { [bloodGroup: string]: { [category: string]: number } } = {};
    const allCategories = new Set<string>();
    const allBloodGroups = new Set<string>();

    products.forEach(product => {
      // Try to extract blood group and category from product name
      // Assuming format like "A+ WB" or "O- RBC" etc.
      const productName = product.product.trim();
      
      // Extract blood group (A+, A-, B+, B-, AB+, AB-, O+, O-)
      const bloodGroupMatch = productName.match(/^(A|B|AB|O)([+-])/);
      let bloodGroup = 'Unknown';
      let category = productName;
      
      if (bloodGroupMatch) {
        bloodGroup = bloodGroupMatch[0];
        // Extract category (everything after blood group)
        category = productName.replace(bloodGroupMatch[0], '').trim();
      } else {
        // If no blood group pattern found, treat whole string as category
        category = productName;
      }

      allBloodGroups.add(bloodGroup);
      allCategories.add(category);

      if (!stockMatrix[bloodGroup]) {
        stockMatrix[bloodGroup] = {};
      }
      stockMatrix[bloodGroup][category] = (stockMatrix[bloodGroup][category] || 0) + 1;
    });

    return {
      stockMatrix,
      bloodGroups: Array.from(allBloodGroups).sort(),
      categories: Array.from(allCategories).sort()
    };
  };

  const productCounts = getProductTypeCounts();
  const totalStock = products.length;
  const { stockMatrix, bloodGroups, categories } = getGroupWiseStock();

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
            <div className="space-y-6">
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

              {/* Group-wise Stock Table */}
              {totalStock > 0 && (
                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="font-medium text-gray-700 mb-4">Stock by Blood Group and Category</h4>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="font-semibold">Blood Group</TableHead>
                          {categories.map(category => (
                            <TableHead key={category} className="text-center font-semibold">
                              {category || 'Other'}
                            </TableHead>
                          ))}
                          <TableHead className="text-center font-semibold bg-blue-50">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bloodGroups.map(bloodGroup => {
                          const rowTotal = categories.reduce((sum, category) => {
                            return sum + (stockMatrix[bloodGroup]?.[category] || 0);
                          }, 0);
                          
                          return (
                            <TableRow key={bloodGroup}>
                              <TableCell className="font-medium bg-gray-50">{bloodGroup}</TableCell>
                              {categories.map(category => (
                                <TableCell key={category} className="text-center">
                                  {stockMatrix[bloodGroup]?.[category] || 0}
                                </TableCell>
                              ))}
                              <TableCell className="text-center font-semibold bg-blue-50">
                                {rowTotal}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                        <TableRow className="bg-blue-50 font-semibold">
                          <TableCell>Total</TableCell>
                          {categories.map(category => {
                            const columnTotal = bloodGroups.reduce((sum, bloodGroup) => {
                              return sum + (stockMatrix[bloodGroup]?.[category] || 0);
                            }, 0);
                            return (
                              <TableCell key={category} className="text-center">
                                {columnTotal}
                              </TableCell>
                            );
                          })}
                          <TableCell className="text-center">{totalStock}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
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
