import React, { useState, useEffect } from 'react';
import { fetchAllTags } from '../api/products';
import './TagFilter.css';

interface TagFilterProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

export function TagFilter({ selectedTags, onTagsChange }: TagFilterProps) {
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTags = async () => {
      try {
        setLoading(true);
        const tags = await fetchAllTags();
        setAvailableTags(tags);
      } catch (error) {
        console.error('Error loading tags:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTags();
  }, []);

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const clearAllTags = () => {
    onTagsChange([]);
  };

  const getDisplayText = () => {
    if (selectedTags.length === 0) return 'All Categories';
    if (selectedTags.length === 1) return selectedTags[0];
    return `${selectedTags.length} Categories`;
  };

  return (
    <div className="tag-filter">
      <button 
        className="tag-filter-button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
      >
        <span className="tag-filter-text">{getDisplayText()}</span>
        <span className="tag-filter-arrow">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="tag-filter-dropdown">
          <div className="tag-filter-header">
            <span className="tag-filter-title">Filter by Category</span>
            {selectedTags.length > 0 && (
              <button 
                className="clear-tags-button"
                onClick={clearAllTags}
              >
                Clear All
              </button>
            )}
          </div>
          
          <div className="tag-list">
            {loading ? (
              <div className="tag-loading">Loading categories...</div>
            ) : (
              availableTags.map(tag => (
                <label key={tag} className="tag-option">
                  <input
                    type="checkbox"
                    checked={selectedTags.includes(tag)}
                    onChange={() => handleTagToggle(tag)}
                  />
                  <span className="tag-label">{tag}</span>
                </label>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
