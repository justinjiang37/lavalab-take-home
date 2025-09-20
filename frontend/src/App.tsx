import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import './App.css';

// Pages
import { ProductsPage } from './pages/ProductsPage';
import { FulfillmentPage } from './pages/FulfillmentPage';
import { IntegrationsPage } from './pages/IntegrationsPage';

// Components
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { InventoryTab } from './components/InventoryTab';
import { OrderQueueTab } from './components/OrderQueueTab';

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

  return (
    <div className="app-container min-h-screen bg-white flex">
      {/* Left Sidebar Navigation */}
      <Sidebar 
        isSidebarExpanded={isSidebarExpanded} 
        setIsSidebarExpanded={setIsSidebarExpanded} 
      />

      {/* Main Content Wrapper */}
      <motion.div 
        className="main-wrapper flex-1 flex flex-col"
        initial={{ marginLeft: "4rem" }}
        animate={{ marginLeft: isSidebarExpanded ? "12rem" : "4rem" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}>
        
        {/* Header Section with Breadcrumb */}
        <Header 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          selectedTags={selectedTags} 
        />

        {/* Main Content Area */}
        <main className="main-content p-8 flex-1">
          <Routes>
            <Route path="/" element={
              <>
                {activeTab === 'inventory' && 
                  <InventoryTab 
                    selectedTags={selectedTags} 
                    onTagsChange={setSelectedTags} 
                  />
                }
                {activeTab === 'order-queue' && <OrderQueueTab />}
              </>
            } />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/fulfillment" element={<FulfillmentPage />} />
            <Route path="/integrations" element={<IntegrationsPage />} />
          </Routes>
        </main>
      </motion.div>
    </div>
  );
}

export default App;