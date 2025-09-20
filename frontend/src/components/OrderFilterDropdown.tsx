import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OrderStatus } from '../api/orders';
import './DirectTagFilter.css'; // Reuse existing styles

interface OrderFilterDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStatuses: OrderStatus[];
  onStatusChange: (statuses: OrderStatus[]) => void;
  dateFilter: {
    startDate: string | null;
    endDate: string | null;
  };
  onDateFilterChange: (dateFilter: { startDate: string | null; endDate: string | null }) => void;
}

export function OrderFilterDropdown({
  isOpen,
  onClose,
  selectedStatuses,
  onStatusChange,
  dateFilter,
  onDateFilterChange
}: OrderFilterDropdownProps) {
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

  const handleStatusToggle = (status: OrderStatus) => {
    if (selectedStatuses.includes(status)) {
      onStatusChange(selectedStatuses.filter(s => s !== status));
    } else {
      onStatusChange([...selectedStatuses, status]);
    }
  };

  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    onDateFilterChange({
      ...dateFilter,
      [field]: value || null
    });
  };

  const clearDateFilter = () => {
    onDateFilterChange({ startDate: null, endDate: null });
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
            style={{ 
              originY: 0, 
              pointerEvents: isOpen ? "auto" : "none",
              width: "300px" // Make it wider for the date inputs
            }}
          >
            <div className="tag-filter-header">
              <span className="tag-filter-title">Filter Orders</span>
            </div>
            
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Status</h3>
              <div className="flex flex-wrap gap-2">
                {Object.values(OrderStatus).map(status => (
                  <label key={status} className="flex items-center gap-2 p-2 border rounded-md hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-indigo-600"
                      checked={selectedStatuses.includes(status)}
                      onChange={() => handleStatusToggle(status)}
                    />
                    <span className="text-sm">{status}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Delivery Date</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">From</label>
                  <input
                    type="date"
                    className="w-full p-2 border rounded-md text-sm"
                    value={dateFilter.startDate || ''}
                    onChange={(e) => handleDateChange('startDate', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">To</label>
                  <input
                    type="date"
                    className="w-full p-2 border rounded-md text-sm"
                    value={dateFilter.endDate || ''}
                    onChange={(e) => handleDateChange('endDate', e.target.value)}
                  />
                </div>
                {(dateFilter.startDate || dateFilter.endDate) && (
                  <button
                    onClick={clearDateFilter}
                    className="text-xs text-indigo-600 hover:text-indigo-800"
                  >
                    Clear date filter
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
