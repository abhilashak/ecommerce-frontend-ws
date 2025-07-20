import React from 'react';
import type { ProductFilters } from '../types/Product';

interface ProductFiltersProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  onClearFilters: () => void;
}

export const ProductFiltersComponent: React.FC<ProductFiltersProps> = ({ 
  filters, 
  onFiltersChange, 
  onClearFilters 
}) => {
  const handleInputChange = (field: keyof ProductFilters, value: any) => {
    onFiltersChange({ ...filters, [field]: value });
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== '' && value !== null
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            type="text"
            value={filters.search || ''}
            onChange={(e) => handleInputChange('search', e.target.value)}
            placeholder="Search products..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Min Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Min Price
          </label>
          <input
            type="number"
            value={filters.min_price || ''}
            onChange={(e) => handleInputChange('min_price', e.target.value ? parseFloat(e.target.value) : undefined)}
            placeholder="0.00"
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Max Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Price
          </label>
          <input
            type="number"
            value={filters.max_price || ''}
            onChange={(e) => handleInputChange('max_price', e.target.value ? parseFloat(e.target.value) : undefined)}
            placeholder="999.99"
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sort By
          </label>
          <select
            value={filters.sort_by || ''}
            onChange={(e) => handleInputChange('sort_by', e.target.value || undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Default (Name A-Z)</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name">Name A-Z</option>
            <option value="newest">Newest First</option>
          </select>
        </div>
      </div>

      {/* In Stock Toggle */}
      <div className="mt-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={filters.in_stock || false}
            onChange={(e) => handleInputChange('in_stock', e.target.checked || undefined)}
            className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="text-sm font-medium text-gray-700">
            Show only products in stock
          </span>
        </label>
      </div>
    </div>
  );
};
