import React, { useState } from 'react';
import { ReactComponent as FilterIcon } from '../icons/Filter.svg';
import { ReactComponent as SortIcon } from '../icons/Sort.svg';
import { DirectTagFilter } from './DirectTagFilter';
import { AddProductModal } from './AddProductModal';
import { MaterialsList } from './MaterialsList';

interface InventoryTabProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

export function InventoryTab({ selectedTags, onTagsChange }: InventoryTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<string | null>(null);

  // Handle sort toggle
  const handleSortToggle = () => {
    // Simple sort rotation: null -> name -> quantity -> null
    if (sortBy === null) setSortBy('name');
    else if (sortBy === 'name') setSortBy('quantity');
    else setSortBy(null);
  };

  return (
    <div className="inventory-container max-w-[980px] mx-auto">
      {/* Search and Actions Bar */}
      <div className="search-bar-container flex justify-between items-center mb-4 gap-4">
        <div className="flex gap-2 flex-1 max-w-[550px] relative h-[46px]">
          {/* Search Input */}
          <div className="search-input-wrapper flex-1 h-full">
            <input 
              type="text" 
              placeholder="Search Materials"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input w-full px-4 py-3 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 h-full"
            />
          </div>
          
          {/* Icon Buttons Outside Search Bar - Same height as search bar */}
          <div className="relative h-full">
            <button 
              className={`h-full aspect-square rounded-md border border-gray-300 hover:bg-gray-100 transition-colors flex items-center justify-center ${isFilterOpen ? 'bg-gray-100' : ''}`}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              title="Filter"
            >
              <FilterIcon />
            </button>
            
            {/* Direct Filter dropdown positioned below filter button */}
            <DirectTagFilter
              selectedTags={selectedTags}
              onTagsChange={onTagsChange}
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
            />
          </div>
          
          <div className="relative h-full">
            <button 
              className={`h-full aspect-square rounded-md border border-gray-300 hover:bg-gray-100 transition-colors flex items-center justify-center ${sortBy ? 'bg-gray-100' : ''}`}
              onClick={handleSortToggle}
              title={sortBy ? `Sorting by ${sortBy}` : "Sort"}
            >
              <SortIcon />
            </button>
            {sortBy && (
              <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 text-xs text-gray-400 whitespace-nowrap">
                {sortBy === 'name' ? 'by name' : 'by quantity'}
              </span>
            )}
          </div>
        </div>
        
        <button 
          className="add-new-button bg-indigo-600 text-white px-4 h-[46px] rounded-lg text-sm font-semibold hover:bg-indigo-700 flex items-center"
          onClick={() => setIsAddModalOpen(true)}
        >
          + Add New
        </button>
      </div>

      {/* Materials List */}
      <div className="materials-card bg-white rounded-xl border border-gray-200 py-2">
        <MaterialsList 
          searchTerm={searchTerm} 
          selectedTags={selectedTags} 
          refreshTrigger={refreshTrigger}
          sortBy={sortBy}
        />
      </div>

      {/* Add Material Modal */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onMaterialAdded={() => {
          setRefreshTrigger(prev => prev + 1); // Trigger refresh
          setIsAddModalOpen(false);
        }}
      />
    </div>
  );
}
