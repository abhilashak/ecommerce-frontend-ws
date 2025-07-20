import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Product, ProductFilters, CreateProductData, UpdateProductData } from '../types/Product';
import { productApi } from '../api/productApi';
import { ProductCard } from './ProductCard';
import { ProductFiltersComponent } from './ProductFilters';
import { ProductForm } from './ProductForm';

export const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [filteredCount, setFilteredCount] = useState(0);
  const [filters, setFilters] = useState<ProductFilters>({});
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const [formLoading, setFormLoading] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  
  // Track initial load to avoid dependency issues
  const isInitialLoadRef = useRef(true);

  // Debounced filters to prevent API calls on every keystroke
  const [debouncedFilters, setDebouncedFilters] = useState<ProductFilters>({});

  // Debounce the filters (especially search) to avoid excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [filters]);

  // Fetch products with debounced filters
  const fetchProducts = useCallback(async () => {
    try {
      // Use different loading states for initial load vs search/filter updates
      if (isInitialLoadRef.current) {
        setLoading(true);
      } else {
        setSearchLoading(true);
      }
      setError(null);
      
      const filtersWithPagination = {
        ...debouncedFilters,
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage
      };
      
      const response = await productApi.getProducts(filtersWithPagination);
      setProducts(response.products);
      setTotalCount(response.total_count);
      setFilteredCount(response.filtered_count);
      
      // Mark initial load as complete
      isInitialLoadRef.current = false;
    } catch (err) {
      setError('Failed to fetch products. Please try again.');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  }, [debouncedFilters, currentPage]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Reset to first page when debounced filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedFilters]);

  const handleFiltersChange = (newFilters: ProductFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const handleCreateProduct = () => {
    setEditingProduct(undefined);
    setShowForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleFormSubmit = async (data: CreateProductData | UpdateProductData) => {
    try {
      setFormLoading(true);
      
      if (editingProduct) {
        await productApi.updateProduct(editingProduct.id, data);
      } else {
        await productApi.createProduct(data as CreateProductData);
      }
      
      setShowForm(false);
      setEditingProduct(undefined);
      fetchProducts(); // Refresh the list
    } catch (err) {
      console.error('Error saving product:', err);
      setError('Failed to save product. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      await productApi.deleteProduct(id);
      fetchProducts(); // Refresh the list
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('Failed to delete product. Please try again.');
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingProduct(undefined);
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredCount / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, filteredCount);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">
            {filteredCount === totalCount 
              ? `${totalCount} products` 
              : `${filteredCount} of ${totalCount} products`
            }
          </p>
        </div>
        <button
          onClick={handleCreateProduct}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Add New Product
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
          <button 
            onClick={() => setError(null)}
            className="float-right text-red-700 hover:text-red-900"
          >
            ×
          </button>
        </div>
      )}

      {/* Filters */}
      <ProductFiltersComponent
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
      />

      {/* Subtle Search Loading Indicator */}
      {searchLoading && (
        <div className="mb-4 flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
          <span className="text-gray-600">Searching...</span>
        </div>
      )}

      {/* Products Grid */}
      {products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-700">
                Showing {startItem} to {endItem} of {filteredCount} results
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                
                {/* Page Numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-2 border rounded-md ${
                        pageNum === currentPage
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📦</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600 mb-4">
            {Object.keys(filters).length > 0 
              ? 'Try adjusting your filters or search terms.'
              : 'Get started by adding your first product.'
            }
          </p>
          {Object.keys(filters).length === 0 && (
            <button
              onClick={handleCreateProduct}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Your First Product
            </button>
          )}
        </div>
      )}

      {/* Product Form Modal */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          isLoading={formLoading}
        />
      )}
    </div>
  );
};
