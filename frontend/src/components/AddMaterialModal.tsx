import React, { useState, useEffect, useCallback } from 'react';
import { fetchAllTags, createMaterial } from '../api/materials';
import './AddMaterialModal.css';

// Define the props for the AddMaterialModal component
interface AddMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMaterialAdded: () => void;
}

// Define the form data structure
interface MaterialFormData {
  name: string;
  color: string;
  size: string;
  quantity: number | string;
  packSize: number | string;
  tags: string[];
}

export const AddMaterialModal = ({ isOpen, onClose, onMaterialAdded }: AddMaterialModalProps) => {
  // Fixed set of available tags with correct casing
  const ALLOWED_TAGS = ['Blanks', 'Bright', 'Dark', 'Floral Designs', 'Neutral'];
  const [availableTags, setAvailableTags] = useState<string[]>(ALLOWED_TAGS);
  const [isLoadingTags, setIsLoadingTags] = useState(false);
  
  // Available sizes
  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'];
  
  // Initial form state
  const initialFormData: MaterialFormData = {
    name: '',
    color: '',
    size: '',
    quantity: '',
    packSize: '',
    tags: []
  };
  
  // Form state
  const [formData, setFormData] = useState<MaterialFormData>(initialFormData);
  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState<{
    name?: string;
    color?: string;
    size?: string;
    quantity?: string;
    packSize?: string;
    tags?: string;
  }>({});

  // Fetch tags from API - but we'll only use our predefined tags
  const fetchTags = useCallback(async () => {
    setIsLoadingTags(true);
    try {
      // We're intentionally not using fetched tags anymore
      // Just using the predefined ALLOWED_TAGS
      setAvailableTags(ALLOWED_TAGS);
    } catch (error) {
      console.error('Error in tags setup:', error);
    } finally {
      setIsLoadingTags(false);
    }
  }, [ALLOWED_TAGS]);
  
  // Fetch available tags when component mounts
  useEffect(() => {
    if (isOpen) {
      fetchTags();
    }
  }, [isOpen, fetchTags]);
  
  // If modal is not open, don't render anything
  if (!isOpen) return null;
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'quantity' || name === 'packSize') {
      // Allow empty input for quantity and packSize
      setFormData({ ...formData, [name]: value === '' ? '' : parseInt(value) || 0 });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  
  // Handle tag toggle with proper casing
  const handleTagToggle = (tag: string) => {
    // Check if the tag is already selected (case-insensitive)
    const isSelected = formData.tags.some(t => t.toLowerCase() === tag.toLowerCase());
    
    if (isSelected) {
      // Remove the tag
      setFormData({
        ...formData,
        tags: formData.tags.filter(t => t.toLowerCase() !== tag.toLowerCase())
      });
    } else {
      // Add the tag with correct casing from ALLOWED_TAGS
      const correctCaseTag = ALLOWED_TAGS.find(t => t.toLowerCase() === tag.toLowerCase()) || tag;
      setFormData({
        ...formData,
        tags: [...formData.tags, correctCaseTag]
      });
    }
  };
  
  // Handle adding a new tag - but only from our allowed list
  const handleAddTag = () => {
    const trimmedTag = newTag.trim();
    
    if (!trimmedTag) {
      return; // Don't add empty tags
    }
    
    // Find the matching allowed tag with correct casing
    const matchingTag = ALLOWED_TAGS.find(
      tag => tag.toLowerCase() === trimmedTag.toLowerCase()
    );
    
    if (matchingTag) {
      // Only add if it's not already in selected tags
      if (!formData.tags.some(tag => tag.toLowerCase() === matchingTag.toLowerCase())) {
        setFormData({
          ...formData,
          tags: [...formData.tags, matchingTag]
        });
      }
    } else {
      // Show a message that only predefined tags are allowed
      alert('Please select from the available tags: Blanks, Bright, Dark, Floral Designs, Neutral');
    }
    
    // Clear input
    setNewTag('');
  };
  
  // Normalize tags to ensure correct casing and uniqueness
  const normalizeSelectedTags = (tags: string[]): string[] => {
    // Create a map of lowercase -> correct case
    const tagMap = new Map<string, string>();
    
    // Add all allowed tags to the map
    ALLOWED_TAGS.forEach(tag => {
      tagMap.set(tag.toLowerCase(), tag);
    });
    
    // Create a set of normalized tags
    const normalizedTags = new Set<string>();
    
    // Process each selected tag
    tags.forEach(tag => {
      const normalizedTag = tagMap.get(tag.toLowerCase());
      if (normalizedTag) {
        normalizedTags.add(normalizedTag);
      }
    });
    
    return Array.from(normalizedTags);
  };

  // Handle form submission
  const handleSubmit = async () => {
    console.log('Form submitted');
    
    // Validate form
    const newErrors: { 
      name?: string; 
      color?: string; 
      size?: string; 
      quantity?: string; 
      packSize?: string; 
      tags?: string; 
    } = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.color.trim()) {
      newErrors.color = 'Color is required';
    }
    
    if (!formData.size) {
      newErrors.size = 'Size is required';
    }
    
    if (formData.tags.length === 0) {
      newErrors.tags = 'At least one tag is required';
    }
    
    // If there are errors, display them and don't submit
    if (Object.keys(newErrors).length > 0) {
      console.log('Form validation errors:', newErrors);
      setErrors(newErrors);
      return;
    }
    
    // Clear errors
    setErrors({});
    
    try {
      // Convert quantity and packSize to numbers with defaults
      const quantity = typeof formData.quantity === 'string' 
        ? (formData.quantity === '' ? 0 : parseInt(formData.quantity)) 
        : formData.quantity;
      
      const packSize = typeof formData.packSize === 'string' 
        ? (formData.packSize === '' ? 1 : parseInt(formData.packSize)) 
        : formData.packSize;
      
      // Normalize tags to ensure correct casing and uniqueness
      const normalizedTags = normalizeSelectedTags(formData.tags);
      console.log('Normalized tags:', normalizedTags);
      
      // Prepare data to send to API
      const materialData = {
        name: formData.name.trim(),
        color: formData.color.trim(),
        size: formData.size,
        quantity: quantity,
        packSize: packSize,
        tags: normalizedTags
      };
      
      console.log('Sending data to API:', materialData);
      
      // Call API to create material
      const result = await createMaterial(materialData);
      console.log('API response:', result);
      
      // Call the onMaterialAdded callback
      console.log('Calling onMaterialAdded callback');
      onMaterialAdded();
      
      // Reset form and close modal
      console.log('Resetting form and closing modal');
      setFormData(initialFormData);
      onClose();
    } catch (error) {
      console.error('Error creating material:', error);
      
      // More detailed error message
      let errorMessage = 'Failed to add material. ';
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
        errorMessage += `Error: ${error.message}`;
      } else {
        console.error('Unknown error type:', typeof error, error);
        errorMessage += 'Unknown error occurred.';
      }
      
      alert(errorMessage + ' Please check the console for full details.');
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Add New Material</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form>
            {/* Material Name */}
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Material Name*
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                placeholder="e.g., Gildan T-Shirt"
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>
            
            {/* Color */}
            <div className="mb-4">
              <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
                Color*
              </label>
              <input
                type="text"
                id="color"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${errors.color ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                placeholder="e.g., Red, Black, White"
              />
              {errors.color && <p className="mt-1 text-xs text-red-500">{errors.color}</p>}
            </div>
            
            {/* Size */}
            <div className="mb-4">
              <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-1">
                Size*
              </label>
              <select
                id="size"
                name="size"
                value={formData.size}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${errors.size ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              >
                <option value="">Select a size</option>
                {availableSizes.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
              {errors.size && <p className="mt-1 text-xs text-red-500">{errors.size}</p>}
            </div>
            
            {/* Current Stock */}
            <div className="mb-4">
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                Current Stock
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="0"
              />
            </div>
            
            {/* Pack Size */}
            <div className="mb-4">
              <label htmlFor="packSize" className="block text-sm font-medium text-gray-700 mb-1">
                Pack Size (Low Stock Warning Threshold)
              </label>
              <input
                type="number"
                id="packSize"
                name="packSize"
                value={formData.packSize}
                onChange={handleInputChange}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="24"
              />
            </div>
            
            {/* Tags Section */}
            <div className="mb-6 tags-section">
              <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                Tags*
              </label>
              
              {/* Add New Tag */}
              <div className="new-tag-section flex items-center mb-4">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Enter new tag"
                  className="new-tag-input flex-1"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="add-tag-button bg-indigo-600 text-white"
                >
                  Add Tag
                </button>
              </div>
              
              {/* Available Tags */}
              <div className="available-tags flex flex-wrap">
                {isLoadingTags ? (
                  <div className="text-center w-full py-2">Loading tags...</div>
                ) : (
                  availableTags.map(tag => {
                    // Check if tag is selected (case insensitive)
                    const isSelected = formData.tags.some(t => t.toLowerCase() === tag.toLowerCase());
                    return (
                      <label 
                        key={tag}
                        className="tag-checkbox"
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleTagToggle(tag)}
                        />
                        <span className="tag-name">{tag}</span>
                      </label>
                    );
                  })
                )}
              </div>
              
              {/* Selected Tags */}
              {formData.tags.length > 0 && (
                <div className="selected-tags">
                  Selected: {normalizeSelectedTags(formData.tags).join(', ')}
                </div>
              )}
              
              {errors.tags && <p className="mt-1 text-xs text-red-500 text-center">{errors.tags}</p>}
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
                type="button"
                onClick={handleSubmit}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Add Material
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};