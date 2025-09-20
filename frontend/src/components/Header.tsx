import React from 'react';
import { useLocation } from 'react-router-dom';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedTags: string[];
}

export function Header({ activeTab, setActiveTab, selectedTags }: HeaderProps) {
  const location = useLocation();

  // Helper function to format breadcrumb categories
  const formatBreadcrumbCategories = (tags: string[], maxLength: number = 30) => {
    if (tags.length === 0) return null;
    
    // Capitalize each tag before joining
    const capitalizedTags = tags.map(tag => 
      tag.split(' ')
         .map(word => word.charAt(0).toUpperCase() + word.slice(1))
         .join(' ')
    );
    
    const categoryText = capitalizedTags.join(' + ');
    if (categoryText.length <= maxLength) {
      return categoryText;
    }
    
    // Truncate and add ellipsis
    return categoryText.substring(0, maxLength - 3) + '...';
  };

  // Get page title based on current route
  const getPageTitle = () => {
    if (location.pathname === '/products') return 'Products';
    if (location.pathname === '/fulfillment') return 'Fulfillment';
    if (location.pathname === '/integrations') return 'Integrations';
    return 'Materials';
  };

  return (
    <header className="app-header bg-white border-b border-gray-200 px-8 py-5 flex justify-between items-end">
      <div className="header-left flex-1">
        <div className="breadcrumb flex items-center mb-6 text-2xl">
          <span className="breadcrumb-item text-gray-900 font-bold">{getPageTitle()}</span>
          {location.pathname === '/' && formatBreadcrumbCategories(selectedTags) && (
            <>
              <span className="breadcrumb-separator mx-3 text-gray-400">/</span>
              <span className="breadcrumb-item active text-gray-500">{formatBreadcrumbCategories(selectedTags)}</span>
            </>
          )}
        </div>
      </div>
      <div className="header-right flex-shrink-0">
        {location.pathname === '/' && (
          <div className="header-tabs flex gap-0">
            <button 
              className={`tab-button px-6 py-3 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-indigo-600 ${activeTab === 'inventory' ? 'active text-indigo-600 border-indigo-600' : ''}`}
              onClick={() => setActiveTab('inventory')}
            >
              Inventory
            </button>
            <button 
              className={`tab-button px-6 py-3 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-indigo-600 ${activeTab === 'order-queue' ? 'active text-indigo-600 border-indigo-600' : ''}`}
              onClick={() => setActiveTab('order-queue')}
            >
              Order Queue
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
