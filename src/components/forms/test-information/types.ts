
export interface TestCategory {
  id: number;
  name: string;
  description?: string;
}

export interface TestInformation {
  id: number;
  name: string;
  category_id: number;
  category?: TestCategory;
  description?: string;  // JSON string containing additional test metadata including is_active status
  price: number;         // Database field name is price
  test_rate?: number;    // UI compatibility (maps to price)
  test_type?: 'single' | 'full' | 'other'; // New test_type column
  is_active?: boolean;   // Derived from description JSON
}
