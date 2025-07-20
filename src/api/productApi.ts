import api from './axios';
import type { Product, ProductsResponse, ProductFilters, CreateProductData, UpdateProductData } from '../types/Product';

export const productApi = {
  // Get all products with optional filters
  getProducts: async (filters?: ProductFilters): Promise<ProductsResponse> => {
    const params = new URLSearchParams();
    
    if (filters?.search) params.append('search', filters.search);
    if (filters?.min_price) params.append('min_price', filters.min_price.toString());
    if (filters?.max_price) params.append('max_price', filters.max_price.toString());
    if (filters?.in_stock !== undefined) params.append('in_stock', filters.in_stock.toString());
    if (filters?.sort_by) params.append('sort_by', filters.sort_by);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());

    const response = await api.get(`/products?${params.toString()}`);
    return response.data;
  },

  // Get a single product by ID
  getProduct: async (id: number): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Create a new product
  createProduct: async (productData: CreateProductData): Promise<Product> => {
    const response = await api.post('/products', { product: productData });
    return response.data;
  },

  // Update an existing product
  updateProduct: async (id: number, productData: UpdateProductData): Promise<Product> => {
    const response = await api.patch(`/products/${id}`, { product: productData });
    return response.data;
  },

  // Delete a product
  deleteProduct: async (id: number): Promise<void> => {
    await api.delete(`/products/${id}`);
  },

  // Search products
  searchProducts: async (query: string, limit?: number): Promise<{ products: Product[]; query: string; count: number }> => {
    const params = new URLSearchParams();
    params.append('q', query);
    if (limit) params.append('limit', limit.toString());

    const response = await api.get(`/products/search?${params.toString()}`);
    return response.data;
  },

  // Get low stock products
  getLowStockProducts: async (threshold?: number): Promise<{ products: Product[]; threshold: number; count: number }> => {
    const params = new URLSearchParams();
    if (threshold) params.append('threshold', threshold.toString());

    const response = await api.get(`/products/low_stock?${params.toString()}`);
    return response.data;
  }
};
