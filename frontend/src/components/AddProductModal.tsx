import React, { useState } from 'react';

// Define the props for the AddProductModal component
interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMaterialAdded: () => void;
}

// Define the form data structure
interface ProductFormData {
  name: string;
  description: string;
  stock: number;
  categories: string[];
  sizes: string[];
  colors: string[];
}

export const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onMaterialAdded }) => {
  // Available categories
  const availableCategories = ['T-shirts', 'Hoodies', 'Headwear', 'Sweatpants'];
  
  // Available sizes
  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'];
  
  // Initial form state
  const initialFormData: ProductFormData = {
    name: '',
    description: '',
    stock: 0,
    categories: [],
    sizes: [],
    colors: []
  };
  
  // Form state
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [newColor, setNewColor] = useState('');
  const [errors, setErrors] = useState<{
    name?: string;
    description?: string;
    categories?: string;
    sizes?: string;
    colors?: string;
  }>({});
  
  // If modal is not open, don't render anything
  if (!isOpen) return null;
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'stock') {
      // Handle numeric input
      const numValue = value === '' ? 0 : parseInt(value, 10);
      setFormData({ ...formData, [name]: numValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  
  // Handle category toggle
  const handleCategoryToggle = (category: string) => {
    if (formData.categories.includes(category)) {
      setFormData({
        ...formData,
        categories: formData.categories.filter(c => c !== category)
      });
    } else {
      setFormData({
        ...formData,
        categories: [...formData.categories, category]
      });
    }
  };
  
  // Handle size toggle
  const handleSizeToggle = (size: string) => {
    if (formData.sizes.includes(size)) {
      setFormData({
        ...formData,
        sizes: formData.sizes.filter(s => s !== size)
      });
    } else {
      setFormData({
        ...formData,
        sizes: [...formData.sizes, size]
      });
    }
  };
  
  // Handle adding a new color
  const handleAddColor = () => {
    if (newColor.trim() && !formData.colors.includes(newColor.trim())) {
      setFormData({
        ...formData,
        colors: [...formData.colors, newColor.trim()]
      });
      setNewColor('');
    }
  };
  
  // Handle removing a color
  const handleRemoveColor = (color: string) => {
    setFormData({
      ...formData,
      colors: formData.colors.filter(c => c !== color)
    });
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: { 
      name?: string; 
      description?: string; 
      categories?: string; 
      sizes?: string; 
      colors?: string; 
    } = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (formData.categories.length === 0) {
      newErrors.categories = 'At least one category is required';
    }
    
    if (formData.sizes.length === 0) {
      newErrors.sizes = 'At least one size is required';
    }
    
    if (formData.colors.length === 0) {
      newErrors.colors = 'At least one color is required';
    }
    
    // If there are errors, display them and don't submit
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Clear errors
    setErrors({});
    
    // Here you would typically call an API to create the product
    console.log('Creating product:', formData);
    
    // Call the onMaterialAdded callback
    onMaterialAdded();
    
    // Reset form and close modal
    setFormData(initialFormData);
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Add New Product</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            {/* Product Name */}
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Product Name*
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>
            
            {/* Product Description */}
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description*
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className={`w-full px-3 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              />
              {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
            </div>
            
            {/* Stock Amount */}
            <div className="mb-4">
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                Stock Amount
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            {/* Categories */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categories*
              </label>
              <div className="flex flex-wrap gap-2">
                {availableCategories.map(category => (
                  <label 
                    key={category}
                    className={`inline-flex items-center px-3 py-2 rounded-md border cursor-pointer ${
                      formData.categories.includes(category)
                        ? 'bg-indigo-100 border-indigo-300 text-indigo-800'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={formData.categories.includes(category)}
                      onChange={() => handleCategoryToggle(category)}
                    />
                    <span className="text-sm">{category}</span>
                  </label>
                ))}
              </div>
              {errors.categories && <p className="mt-1 text-xs text-red-500">{errors.categories}</p>}
            </div>
            
            {/* Sizes */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Sizes*
              </label>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map(size => (
                  <label 
                    key={size}
                    className={`inline-flex items-center justify-center h-10 w-14 rounded-md border cursor-pointer ${
                      formData.sizes.includes(size)
                        ? 'bg-indigo-100 border-indigo-300 text-indigo-800'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={formData.sizes.includes(size)}
                      onChange={() => handleSizeToggle(size)}
                    />
                    <span className="text-sm">{size}</span>
                  </label>
                ))}
              </div>
              {errors.sizes && <p className="mt-1 text-xs text-red-500">{errors.sizes}</p>}
            </div>
            
            {/* Colors */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Colors*
              </label>
              <div className="flex mb-2">
                <input
                  type="text"
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  placeholder="Enter color name"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleAddColor}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.colors.map(color => (
                  <span 
                    key={color}
                    className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-800"
                  >
                    {color}
                    <button
                      type="button"
                      onClick={() => handleRemoveColor(color)}
                      className="ml-1 text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              {errors.colors && <p className="mt-1 text-xs text-red-500">{errors.colors}</p>}
            </div>
            
            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 mr-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Add Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};