
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
  measuring_unit?: string;
  value_remarks?: string;
  remarks?: string;
  test_rate: number;
  is_active: boolean;
  male_low_value: number;
  male_high_value: number;
  female_low_value: number;
  female_high_value: number;
  other_low_value: number;
  other_high_value: number;
}
