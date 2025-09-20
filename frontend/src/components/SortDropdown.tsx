import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type SortOption = {
  key: string;
  label: string;
};

interface SortDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  sortOptions: SortOption[];
  currentSort: string | null;
  currentDirection: 'asc' | 'desc';
  onSortChange: (key: string) => void;
}

export function SortDropdown({
  isOpen,
  onClose,
  sortOptions,
  currentSort,
  currentDirection,
  onSortChange
}: SortDropdownProps) {
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  React.useEffect(() => {
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

  // Animation configuration
  const dropdownAnimation = {
    initial: { opacity: 0, y: -10, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -10, scale: 0.95 },
    transition: { duration: 0.2 }
  };

  return (
    <div className="sort-dropdown-container" ref={dropdownRef}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 border border-gray-200 overflow-hidden"
            initial={dropdownAnimation.initial}
            animate={dropdownAnimation.animate}
            exit={dropdownAnimation.exit}
            transition={dropdownAnimation.transition}
            style={{ 
              originY: 0, 
              pointerEvents: isOpen ? "auto" : "none"
            }}
          >
            <div className="py-1">
              {sortOptions.map((option) => (
                <button
                  key={option.key}
                  className={`w-full text-left px-4 py-2 text-sm ${
                    currentSort === option.key 
                      ? 'bg-gray-100 text-gray-900' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => onSortChange(option.key)}
                >
                  <div className="flex items-center justify-between">
                    <span>{option.label}</span>
                    {currentSort === option.key && (
                      <span className="text-gray-500">
                        {currentDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
