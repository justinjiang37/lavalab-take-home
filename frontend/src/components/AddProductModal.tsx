import React, { useState, useEffect } from 'react';
import { createMaterial, fetchAllTags } from '../api/materials';
import './AddProductModal.css';

interface AddMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMaterialAdded: () => void;
}

export function AddMaterialModal({ isOpen, onClose, onMaterialAdded }: AddMaterialModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    color: 'red',
    size: 'M',
    quantity: 0,
    packSize: 24, // packSize now serves as both the pack size and threshold for low stock warning
    imageUrl: ''
  } as {
    name: string;
    color: string;
    size: string;
    quantity: number | string;
    packSize: number | string;
    imageUrl: string;
  });
  const [selectedTags, setSelectedTags] = useState<string[]>(['blanks']);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load available tags when modal opens
  useEffect(() => {
    if (isOpen) {
      const loadTags = async () => {
        try {
          const tags = await fetchAllTags();
          setAvailableTags(tags);
        } catch (error) {
          console.error('Error loading tags:', error);
        }
      };
      loadTags();
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Special handling for number fields to allow empty values during editing
    if (name === 'quantity' || name === 'packSize') {
      // If the value is empty (user deleted everything), keep it as empty string for editing
      const processedValue = value === '' ? '' : parseInt(value) || 0;
      setFormData(prev => ({
        ...prev,
        [name]: processedValue
      }));
    } else {
      // For non-number fields, process normally
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleAddNewTag = () => {
    const trimmedTag = newTag.trim().toLowerCase();
    if (trimmedTag && !selectedTags.includes(trimmedTag) && !availableTags.includes(trimmedTag)) {
      setSelectedTags([...selectedTags, trimmedTag]);
      setAvailableTags([...availableTags, trimmedTag]);
      setNewTag('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Material name is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Convert any string values back to numbers for submission
      const quantity = typeof formData.quantity === 'string' 
        ? parseInt(formData.quantity) || 0 
        : formData.quantity;
        
      const packSize = typeof formData.packSize === 'string' 
        ? parseInt(formData.packSize) || 1 
        : formData.packSize;
      
      await createMaterial({
        name: formData.name.trim(),
        color: formData.color,
        size: formData.size,
        quantity: quantity,
        packSize: packSize, // packSize now serves as both the pack size and threshold for low stock
        tags: selectedTags,
        imageUrl: formData.imageUrl || undefined
      });

      // Reset form
      setFormData({
        name: '',
        color: 'red',
        size: 'M',
        quantity: 0,
        packSize: 24,
        imageUrl: ''
      } as {
        name: string;
        color: string;
        size: string;
        quantity: number | string;
        packSize: number | string;
        imageUrl: string;
      });
      setSelectedTags(['blanks']);
      setNewTag('');

      onMaterialAdded();
      onClose();
    } catch (err) {
      setError('Failed to create material. Please try again.');
      console.error('Error creating material:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Material</h2>
          <button 
            className="modal-close-button" 
            onClick={handleClose}
            disabled={loading}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="add-product-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="name">Material Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g. Gildan T-Shirt - Red / M"
              required
              disabled={loading}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="color">Color</label>
              <select
                id="color"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                disabled={loading}
              >
                <option value="red">Red</option>
                <option value="black">Black</option>
                <option value="white">White</option>
                <option value="blue">Blue</option>
                <option value="green">Green</option>
                <option value="yellow">Yellow</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="size">Size</label>
              <select
                id="size"
                name="size"
                value={formData.size}
                onChange={handleInputChange}
                disabled={loading}
              >
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
              </select>
            </div>
          </div>

          {/* Tags Section */}
          <div className="form-group">
            <label>Categories/Tags</label>
            <div className="tags-section">
              <div className="available-tags">
                {availableTags.map(tag => (
                  <label key={tag} className="tag-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedTags.includes(tag)}
                      onChange={() => handleTagToggle(tag)}
                      disabled={loading}
                    />
                    <span className="tag-name">{tag}</span>
                  </label>
                ))}
              </div>
              
              <div className="new-tag-section">
                <input
                  type="text"
                  placeholder="Add new category..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddNewTag()}
                  disabled={loading}
                  className="new-tag-input"
                />
                <button
                  type="button"
                  onClick={handleAddNewTag}
                  disabled={loading || !newTag.trim()}
                  className="add-tag-button"
                >
                  Add
                </button>
              </div>
              
              {selectedTags.length > 0 && (
                <div className="selected-tags">
                  <small>Selected: {selectedTags.join(', ')}</small>
                </div>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="quantity">Current Stock</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                min="0"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="packSize">Pack Size / Minimum Threshold *</label>
              <input
                type="number"
                id="packSize"
                name="packSize"
                value={formData.packSize}
                onChange={handleInputChange}
                min="1"
                required
                disabled={loading}
              />
              <small className="form-help">Standard pack size and threshold for low stock warning</small>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="imageUrl">Image URL (Optional)</label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleInputChange}
              placeholder="https://example.com/image.jpg"
              disabled={loading}
            />
            <small className="form-help">Leave blank for now - you can add images later</small>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-button" 
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-button"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Material'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
