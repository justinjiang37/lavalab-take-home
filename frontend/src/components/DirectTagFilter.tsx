import React, { useState, useEffect, useRef } from 'react';
import { fetchAllTags } from '../api/materials';
import { motion, AnimatePresence } from 'framer-motion';
import './TagFilter.css';
import './DirectTagFilter.css';

interface DirectTagFilterProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function DirectTagFilter({ selectedTags, onTagsChange, isOpen, onClose }: DirectTagFilterProps) {
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load tags when component mounts
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

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };


  // Simple animation configuration
  const dropdownAnimation = {
    initial: { opacity: 0, y: -10, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -10, scale: 0.95 },
    transition: { duration: 0.2 }
  };

  return (
    <div className="direct-tag-filter" ref={dropdownRef}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="tag-filter-dropdown direct-dropdown"
            initial={dropdownAnimation.initial}
            animate={dropdownAnimation.animate}
            exit={dropdownAnimation.exit}
            transition={dropdownAnimation.transition}
            style={{ originY: 0, pointerEvents: isOpen ? "auto" : "none" }}
          >
            <div className="tag-filter-header">
              <span className="tag-filter-title">Filter by Category</span>
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
