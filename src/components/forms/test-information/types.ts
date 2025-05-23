
export interface TestCategory {
  id: string;
  name: string;
  description?: string;
}

export interface TestInformation {
  id: string;
  name: string;
  category_id: string;
  category?: TestCategory;
  description?: string;  // JSON string containing additional test metadata including is_active status
  price: number;         // Database field name is price
  test_rate?: number;    // UI compatibility (maps to price)
  is_active?: boolean;   // Derived from description JSON
}
