import React from 'react';
import type { Product } from '../types/Product';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit, onDelete }) => {
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      onDelete(product.id);
    }
  };

  const stockStatus = product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-yellow-600' : 'text-red-600';
  const stockText = product.stock > 0 ? `${product.stock} in stock` : 'Out of stock';

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-900 truncate">{product.name}</h3>
        <span className="text-2xl font-bold text-blue-600">${product.price}</span>
      </div>
      
      <p className="text-gray-600 mb-4 line-clamp-3">{product.description}</p>
      
      <div className="flex justify-between items-center mb-4">
        <span className={`text-sm font-medium ${stockStatus}`}>
          {stockText}
        </span>
        <span className="text-sm text-gray-500">
          ID: {product.id}
        </span>
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(product)}
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
};
