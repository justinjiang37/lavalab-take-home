import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './DirectTagFilter.css'; // Reuse existing styles

// Define the payment and fulfillment status types
export type PaymentStatus = 'Paid' | 'Pending' | 'Failed';
export type FulfillmentStatus = 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

// Define the filter state interface
export interface FulfillmentFilterState {
  paymentStatuses: PaymentStatus[];
  fulfillmentStatuses: FulfillmentStatus[];
  dateRange: {
    startDate: string | null;
    endDate: string | null;
  };
}

interface FulfillmentFilterDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  filterState: FulfillmentFilterState;
  onFilterChange: (newState: FulfillmentFilterState) => void;
}

export function FulfillmentFilterDropdown({
  isOpen,
  onClose,
  filterState,
  onFilterChange
}: FulfillmentFilterDropdownProps) {
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);

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

  // Toggle payment status
  const handlePaymentStatusToggle = (status: PaymentStatus) => {
    const { paymentStatuses } = filterState;
    if (paymentStatuses.includes(status)) {
      onFilterChange({
        ...filterState,
        paymentStatuses: paymentStatuses.filter(s => s !== status)
      });
    } else {
      onFilterChange({
        ...filterState,
        paymentStatuses: [...paymentStatuses, status]
      });
    }
  };

  // Toggle fulfillment status
  const handleFulfillmentStatusToggle = (status: FulfillmentStatus) => {
    const { fulfillmentStatuses } = filterState;
    if (fulfillmentStatuses.includes(status)) {
      onFilterChange({
        ...filterState,
        fulfillmentStatuses: fulfillmentStatuses.filter(s => s !== status)
      });
    } else {
      onFilterChange({
        ...filterState,
        fulfillmentStatuses: [...fulfillmentStatuses, status]
      });
    }
  };

  // Handle date change
  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    onFilterChange({
      ...filterState,
      dateRange: {
        ...filterState.dateRange,
        [field]: value || null
      }
    });
  };

  // Clear date filter
  const clearDateFilter = () => {
    onFilterChange({
      ...filterState,
      dateRange: { startDate: null, endDate: null }
    });
  };

  // Clear all filters
  const clearAllFilters = () => {
    onFilterChange({
      paymentStatuses: [],
      fulfillmentStatuses: [],
      dateRange: { startDate: null, endDate: null }
    });
  };

  // Check if any filters are active
  const hasActiveFilters = 
    filterState.paymentStatuses.length > 0 || 
    filterState.fulfillmentStatuses.length > 0 || 
    filterState.dateRange.startDate !== null || 
    filterState.dateRange.endDate !== null;

  // Toggle section visibility
  const toggleSection = (section: string) => {
    if (activeSection === section) {
      setActiveSection(null);
    } else {
      setActiveSection(section);
    }
  };

  // Animation configuration
  const dropdownAnimation = {
    initial: { opacity: 0, y: -10, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -10, scale: 0.95 },
    transition: { duration: 0.2 }
  };

  const sectionAnimation = {
    initial: { opacity: 0, height: 0 },
    animate: { opacity: 1, height: 'auto' },
    exit: { opacity: 0, height: 0 },
    transition: { duration: 0.2 }
  };

  // Payment status options
  const paymentStatusOptions: PaymentStatus[] = ['Paid', 'Pending', 'Failed'];
  
  // Fulfillment status options
  const fulfillmentStatusOptions: FulfillmentStatus[] = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];

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
              width: "320px" // Make it wider for the date inputs
            }}
          >
            <div className="tag-filter-header">
              <span className="tag-filter-title">Filter Orders</span>
              {hasActiveFilters && (
                <button 
                  onClick={clearAllFilters}
                  className="text-xs text-indigo-600 hover:text-indigo-800"
                >
                  Clear All
                </button>
              )}
            </div>
            
            {/* Payment Status Section */}
            <div className="border-b border-gray-200">
              <button 
                className="w-full p-4 text-left flex justify-between items-center hover:bg-gray-50"
                onClick={() => toggleSection('payment')}
              >
                <span className="text-sm font-medium text-gray-700">Payment Status</span>
                <span className="text-gray-400">
                  {activeSection === 'payment' ? '−' : '+'}
                </span>
              </button>
              
              <AnimatePresence>
                {activeSection === 'payment' && (
                  <motion.div 
                    className="p-4 pt-0"
                    initial={sectionAnimation.initial}
                    animate={sectionAnimation.animate}
                    exit={sectionAnimation.exit}
                    transition={sectionAnimation.transition}
                  >
                    <div className="flex flex-wrap gap-2 mt-2">
                      {paymentStatusOptions.map(status => (
                        <label key={status} className="flex items-center gap-2 p-2 border rounded-md hover:bg-gray-50 cursor-pointer">
                          <input
                            type="checkbox"
                            className="form-checkbox h-4 w-4 text-indigo-600"
                            checked={filterState.paymentStatuses.includes(status)}
                            onChange={() => handlePaymentStatusToggle(status)}
                          />
                          <span className="text-sm">{status}</span>
                        </label>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Fulfillment Status Section */}
            <div className="border-b border-gray-200">
              <button 
                className="w-full p-4 text-left flex justify-between items-center hover:bg-gray-50"
                onClick={() => toggleSection('fulfillment')}
              >
                <span className="text-sm font-medium text-gray-700">Fulfillment Status</span>
                <span className="text-gray-400">
                  {activeSection === 'fulfillment' ? '−' : '+'}
                </span>
              </button>
              
              <AnimatePresence>
                {activeSection === 'fulfillment' && (
                  <motion.div 
                    className="p-4 pt-0"
                    initial={sectionAnimation.initial}
                    animate={sectionAnimation.animate}
                    exit={sectionAnimation.exit}
                    transition={sectionAnimation.transition}
                  >
                    <div className="flex flex-wrap gap-2 mt-2">
                      {fulfillmentStatusOptions.map(status => (
                        <label key={status} className="flex items-center gap-2 p-2 border rounded-md hover:bg-gray-50 cursor-pointer">
                          <input
                            type="checkbox"
                            className="form-checkbox h-4 w-4 text-indigo-600"
                            checked={filterState.fulfillmentStatuses.includes(status)}
                            onChange={() => handleFulfillmentStatusToggle(status)}
                          />
                          <span className="text-sm">{status}</span>
                        </label>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Order Time Section */}
            <div>
              <button 
                className="w-full p-4 text-left flex justify-between items-center hover:bg-gray-50"
                onClick={() => toggleSection('date')}
              >
                <span className="text-sm font-medium text-gray-700">Order Time</span>
                <span className="text-gray-400">
                  {activeSection === 'date' ? '−' : '+'}
                </span>
              </button>
              
              <AnimatePresence>
                {activeSection === 'date' && (
                  <motion.div 
                    className="p-4 pt-0"
                    initial={sectionAnimation.initial}
                    animate={sectionAnimation.animate}
                    exit={sectionAnimation.exit}
                    transition={sectionAnimation.transition}
                  >
                    <div className="space-y-3 mt-2">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">From</label>
                        <input
                          type="date"
                          className="w-full p-2 border rounded-md text-sm"
                          value={filterState.dateRange.startDate || ''}
                          onChange={(e) => handleDateChange('startDate', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">To</label>
                        <input
                          type="date"
                          className="w-full p-2 border rounded-md text-sm"
                          value={filterState.dateRange.endDate || ''}
                          onChange={(e) => handleDateChange('endDate', e.target.value)}
                        />
                      </div>
                      {(filterState.dateRange.startDate || filterState.dateRange.endDate) && (
                        <button
                          onClick={clearDateFilter}
                          className="text-xs text-indigo-600 hover:text-indigo-800"
                        >
                          Clear date filter
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
