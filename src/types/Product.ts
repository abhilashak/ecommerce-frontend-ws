export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  stock: number;
  created_at: string;
  updated_at: string;
}

export interface ProductsResponse {
  products: Product[];
  total_count: number;
  filtered_count: number;
}

export interface ProductFilters {
  search?: string;
  min_price?: number;
  max_price?: number;
  in_stock?: boolean;
  sort_by?: 'price_asc' | 'price_desc' | 'name' | 'newest';
  limit?: number;
  offset?: number;
}

export interface CreateProductData {
  name: string;
  price: number;
  description: string;
  stock: number;
}

export interface UpdateProductData extends Partial<CreateProductData> {}
