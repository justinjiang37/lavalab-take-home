import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import './App.css';
import { fetchMaterials, updateMaterialQuantity, Material } from './api/materials';
import { AddMaterialModal } from './components/AddProductModal';
import { DirectTagFilter } from './components/DirectTagFilter';
import { ProductsPage } from './pages/ProductsPage';
import { FulfillmentPage } from './pages/FulfillmentPage';
import { MaterialRow } from './components/MaterialRow';
import { ReactComponent as TallyIcon } from './icons/Tally Icon.svg';
import { ReactComponent as HomeActiveSvg } from './icons/Property 1=Home - Active.svg';
import { ReactComponent as HomeInactiveSvg } from './icons/Property 1=Home - Inactive.svg';
import { ReactComponent as ProductsActiveSvg } from './icons/Property 1=Products  - Active.svg';
import { ReactComponent as ProductsInactiveSvg } from './icons/Property 1=Products  - Inactive.svg';
import { ReactComponent as OrdersActiveSvg } from './icons/Property 1=Orders - Active.svg';
import { ReactComponent as OrdersInactiveSvg } from './icons/Property 1=Orders - Inactive.svg';
import { ReactComponent as IntegrationsActiveSvg } from './icons/Property 1=Integrations - Active.svg';
import { ReactComponent as IntegrationsInactiveSvg } from './icons/Property 1=Integrations - Inactive.svg';
import { ReactComponent as FilterIcon } from './icons/Filter.svg';
import { ReactComponent as SortIcon } from './icons/Sort.svg';

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

function AppLayout() {
  const [activeTab, setActiveTab] = useState('inventory');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;

  // Helper function to format breadcrumb categories
  const formatBreadcrumbCategories = (tags: string[], maxLength: number = 30) => {
    if (tags.length === 0) return null;
    
    const categoryText = tags.join(' + ');
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
    return 'Materials';
  };

  return (
    <div className="app-container min-h-screen bg-white flex">
      {/* Left Sidebar Navigation - Expandable on hover */}
      <motion.aside 
        className="sidebar bg-gray-100 border-r border-gray-200 flex flex-col py-5 fixed h-screen left-0 top-0 z-50 overflow-hidden"
        initial={{ width: "4rem" }}
        animate={{ width: isSidebarExpanded ? "12rem" : "4rem" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        onHoverStart={() => setIsSidebarExpanded(true)}
        onHoverEnd={() => setIsSidebarExpanded(false)}
      >
        <div className="sidebar-logo mb-8 flex items-center px-3">
          <div className="logo-icon flex items-center justify-center w-9 h-9 flex-shrink-0"><TallyIcon /></div>
          <motion.div 
            className="ml-3 font-normal text-gray-500 text-lg whitespace-nowrap overflow-hidden tracking-wide"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: isSidebarExpanded ? 1 : 0, width: isSidebarExpanded ? "auto" : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            Tally
          </motion.div>
        </div>
        <nav className="sidebar-nav flex flex-col gap-2 w-full px-2">
          <Link to="/" className={`nav-item ${pathname === '/' ? 'bg-gray-200' : ''} rounded-lg hover:bg-gray-200 transition-colors flex items-center px-2 py-2`}>
            <span className="nav-icon-img flex-shrink-0">
              {pathname === '/' ? <HomeActiveSvg /> : <HomeInactiveSvg />}
            </span>
            <motion.span 
              className="ml-3 text-sm font-medium text-gray-700 whitespace-nowrap overflow-hidden"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: isSidebarExpanded ? 1 : 0, width: isSidebarExpanded ? "auto" : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              Materials
            </motion.span>
          </Link>
          <Link to="/products" className={`nav-item ${pathname === '/products' ? 'bg-gray-200' : ''} rounded-lg hover:bg-gray-200 transition-colors flex items-center px-2 py-2`}>
            <span className="nav-icon-img flex-shrink-0">
              {pathname === '/products' ? <ProductsActiveSvg /> : <ProductsInactiveSvg />}
            </span>
            <motion.span 
              className="ml-3 text-sm font-medium text-gray-700 whitespace-nowrap overflow-hidden"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: isSidebarExpanded ? 1 : 0, width: isSidebarExpanded ? "auto" : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              Products
            </motion.span>
          </Link>
          <Link to="/fulfillment" className={`nav-item ${pathname === '/fulfillment' ? 'bg-gray-200' : ''} rounded-lg hover:bg-gray-200 transition-colors flex items-center px-2 py-2`}>
            <span className="nav-icon-img flex-shrink-0">
              {pathname === '/fulfillment' ? <OrdersActiveSvg /> : <OrdersInactiveSvg />}
            </span>
            <motion.span 
              className="ml-3 text-sm font-medium text-gray-700 whitespace-nowrap overflow-hidden"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: isSidebarExpanded ? 1 : 0, width: isSidebarExpanded ? "auto" : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              Fulfillment
            </motion.span>
          </Link>
          <div className="nav-item rounded-lg hover:bg-gray-200 transition-colors flex items-center px-2 py-2">
            <span className="nav-icon-img flex-shrink-0">
              <IntegrationsInactiveSvg />
            </span>
            <motion.span 
              className="ml-3 text-sm font-medium text-gray-700 whitespace-nowrap overflow-hidden"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: isSidebarExpanded ? 1 : 0, width: isSidebarExpanded ? "auto" : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              Integrations
            </motion.span>
          </div>
        </nav>
      </motion.aside>

      {/* Main Content Wrapper */}
      <motion.div 
        className="main-wrapper flex-1 flex flex-col"
        initial={{ marginLeft: "4rem" }}
        animate={{ marginLeft: isSidebarExpanded ? "12rem" : "4rem" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}>
        {/* Header Section with Breadcrumb */}
        <header className="app-header bg-white border-b border-gray-200 px-8 py-5 flex justify-between items-end">
          <div className="header-left flex-1">
            <div className="breadcrumb flex items-center mb-6 text-2xl font-semibold">
              <span className="breadcrumb-item text-gray-500">{getPageTitle()}</span>
              {location.pathname === '/' && formatBreadcrumbCategories(selectedTags) && (
                <>
                  <span className="breadcrumb-separator mx-3 text-gray-500">/</span>
                  <span className="breadcrumb-item active text-gray-900">{formatBreadcrumbCategories(selectedTags)}</span>
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

        {/* Main Content Area */}
        <main className="main-content p-8 flex-1">
          <Routes>
            <Route path="/" element={
              <>
                {activeTab === 'inventory' && <InventoryTab selectedTags={selectedTags} onTagsChange={setSelectedTags} />}
                {activeTab === 'order-queue' && <OrderQueueTab />}
              </>
            } />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/fulfillment" element={<FulfillmentPage />} />
          </Routes>
        </main>
      </motion.div>
    </div>
  );
}

// Inventory Tab Component
function InventoryTab({ selectedTags, onTagsChange }: { selectedTags: string[]; onTagsChange: (tags: string[]) => void }) {
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
      <AddMaterialModal
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

// Order Queue Tab Component
function OrderQueueTab() {
  // Mock order data
  const orders = [
    {
      id: 1,
      orderNumber: "#1012",
      from: "Eugene Scheepers",
      contact: "eugene@example.com",
      scheduledDelivery: "05/06/2025, 15:08:57",
      status: "PENDING"
    },
    {
      id: 2,
      orderNumber: "#1013",
      from: "Sarah Johnson",
      contact: "sarah.j@example.com",
      scheduledDelivery: "07/06/2025, 10:30:00",
      status: "PENDING"
    },
    {
      id: 3,
      orderNumber: "#1014",
      from: "Mike Chen",
      contact: "mike.chen@example.com",
      scheduledDelivery: "08/06/2025, 14:15:30",
      status: "PENDING"
    }
  ];

  const handleCancelOrder = (orderId: number) => {
    console.log(`Cancelling order ${orderId}`);
    // TODO: Implement cancel functionality
  };

  return (
    <div className="order-queue-tab">
      <div className="order-queue-container">
        <div className="order-queue-content">
          <div className="order-queue-search">
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input 
                type="text" 
                placeholder="Search by order number, customer name, email, or reminder name"
                className="order-search-input"
              />
            </div>
          </div>

          <div className="order-list">
            <div className="order-list-header">
              <div className="order-header-cell">Order</div>
              <div className="order-header-cell">From</div>
              <div className="order-header-cell">Contact</div>
              <div className="order-header-cell">Scheduled Delivery</div>
              <div className="order-header-cell">Status</div>
              <div className="order-header-cell">Actions</div>
            </div>
            
            <div className="order-list-body">
              {orders.map((order) => (
                <div key={order.id} className="order-row">
                  <div className="order-cell">{order.orderNumber}</div>
                  <div className="order-cell">{order.from}</div>
                  <div className="order-cell">{order.contact}</div>
                  <div className="order-cell">{order.scheduledDelivery}</div>
                  <div className="order-cell">
                    <span className={`status-badge status-${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="order-cell">
                    <button 
                      className="cancel-button"
                      onClick={() => handleCancelOrder(order.id)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Materials List Component
function MaterialsList({ 
  searchTerm, 
  selectedTags, 
  refreshTrigger,
  sortBy
}: { 
  searchTerm: string; 
  selectedTags: string[]; 
  refreshTrigger: number;
  sortBy: string | null;
}) {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch materials from API when component mounts
  useEffect(() => {
    const loadMaterials = async () => {
      try {
        setLoading(true);
        const data = await fetchMaterials();
        setMaterials(data);
        setError(null);
      } catch (err) {
        setError('Failed to load materials. Please try again.');
        console.error('Error loading materials:', err);
      } finally {
        setLoading(false);
      }
    };

    loadMaterials();
  }, [refreshTrigger]); // Re-fetch when refreshTrigger changes

  // Filter materials based on search term and selected tags
  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tag => material.tags.includes(tag));
    return matchesSearch && matchesTags;
  });
  
  // Sort materials based on sortBy parameter
  const sortedMaterials = [...filteredMaterials].sort((a, b) => {
    if (!sortBy) return 0; // No sorting
    
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'quantity') {
      return b.quantity - a.quantity; // Sort by quantity descending
    }
    
    return 0;
  });

  // Handle quantity updates
  const handleQuantityUpdate = async (materialId: number, newQuantity: number) => {
    try {
      const updatedMaterial = await updateMaterialQuantity(materialId, newQuantity);
      
      // Update the local state with the new quantity
      setMaterials(prevMaterials =>
        prevMaterials.map(material =>
          material.id === materialId ? updatedMaterial : material
        )
      );
    } catch (err) {
      console.error('Error updating quantity:', err);
      // You could show an error message to the user here
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        <p>Loading materials...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="materials-list">
      {sortedMaterials.map(material => (
        <MaterialRow
          key={material.id}
          product={material} // Still using 'product' prop name for compatibility
          onQuantityUpdate={handleQuantityUpdate}
        />
      ))}
    </div>
  );
}

export default App;
