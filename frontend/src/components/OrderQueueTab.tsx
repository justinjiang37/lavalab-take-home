import React, { useState, useEffect } from 'react';
import { ReactComponent as FilterIcon } from '../icons/Filter.svg';
import { ReactComponent as SortIcon } from '../icons/Sort.svg';
import { OrderFilterDropdown } from './OrderFilterDropdown';
import { AddOrderModal } from './AddOrderModal';
import { fetchOrders, deleteOrder, OrderStatus, Order } from '../api/orders';

export function OrderQueueTab() {
  // State for handling add order modal
  const [isAddOrderModalOpen, setIsAddOrderModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState<OrderStatus[]>([]);
  const [dateFilter, setDateFilter] = useState<{ startDate: string | null; endDate: string | null }>({
    startDate: null,
    endDate: null
  });
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Fetch orders from API when component mounts
  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        const data = await fetchOrders();
        
        // Filter out any cancelled orders from the initial load
        const filteredData = data.filter(order => order.status !== OrderStatus.CANCELLED);
        
        setOrders(filteredData);
        setError(null);
      } catch (err) {
        setError('Failed to load orders. Please try again.');
        console.error('Error loading orders:', err);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [refreshTrigger]); // Re-fetch when refreshTrigger changes
  
  // Handle sort toggle
  const handleSortToggle = () => {
    // Sort rotation: null -> orderId -> scheduledDelivery -> name -> null
    if (sortBy === null) setSortBy('orderId');
    else if (sortBy === 'orderId') setSortBy('scheduledDelivery');
    else if (sortBy === 'scheduledDelivery') setSortBy('name');
    else setSortBy(null);
  };
  
  // Filter orders based on search term, status, and date
  const filteredOrders = orders.filter(order => {
    // Search term filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = (
        (order.description && order.description.toLowerCase().includes(searchLower)) ||
        order.orderFrom.toLowerCase().includes(searchLower) ||
        order.contactInfo.toLowerCase().includes(searchLower)
      );
      if (!matchesSearch) return false;
    }
    
    // Status filter
    if (selectedStatuses.length > 0 && !selectedStatuses.includes(order.status)) {
      return false;
    }
    
    // Date filter
    if (dateFilter.startDate || dateFilter.endDate) {
      const orderDate = new Date(order.scheduledDelivery);
      
      if (dateFilter.startDate) {
        const startDate = new Date(dateFilter.startDate);
        startDate.setHours(0, 0, 0, 0);
        if (orderDate < startDate) return false;
      }
      
      if (dateFilter.endDate) {
        const endDate = new Date(dateFilter.endDate);
        endDate.setHours(23, 59, 59, 999);
        if (orderDate > endDate) return false;
      }
    }
    
    return true;
  });
  
  // Sort orders based on sortBy parameter
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (!sortBy) return 0; // No sorting
    
    if (sortBy === 'orderId') {
      return a.id - b.id; // Sort by order ID
    } else if (sortBy === 'scheduledDelivery') {
      // Convert dates to timestamps for comparison
      const dateA = new Date(a.scheduledDelivery).getTime();
      const dateB = new Date(b.scheduledDelivery).getTime();
      return dateA - dateB; // Sort by scheduled delivery date
    } else if (sortBy === 'name') {
      return a.orderFrom.localeCompare(b.orderFrom); // Sort by customer name
    }
    
    return 0;
  });

  const handleCancelOrder = async (orderId: number) => {
    try {
      // Delete the order from the database
      await deleteOrder(orderId);
      
      // Update the local state by removing the order
      setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
    } catch (err) {
      console.error(`Error removing order ${orderId}:`, err);
      // If there's an error, refresh the entire list
      setRefreshTrigger(prev => prev + 1);
    }
  };

  return (
    <div className="order-queue-tab">
      <div className="order-queue-container">
        <div className="order-queue-content">
          {/* Search and Actions Bar */}
          <div className="search-bar-container flex justify-between items-center mb-4 gap-4">
            <div className="flex gap-2 flex-1 max-w-[550px] relative h-[46px]">
              <div className="search-input-wrapper flex-1 h-full">
                <input 
                  type="text" 
                  placeholder="Search by order number, customer name, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input w-full px-4 py-3 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 h-full"
                />
              </div>
              
              {/* Filter Button */}
              <div className="relative h-full">
                <button 
                  className={`h-full aspect-square rounded-md border border-gray-300 hover:bg-gray-100 transition-colors flex items-center justify-center relative ${isFilterOpen ? 'bg-gray-100' : ''} ${(selectedStatuses.length > 0 || dateFilter.startDate || dateFilter.endDate) ? 'border-indigo-500' : ''}`}
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  title={`Filter${selectedStatuses.length > 0 ? ` (${selectedStatuses.length} status${selectedStatuses.length > 1 ? 'es' : ''} selected)` : ''}${(dateFilter.startDate || dateFilter.endDate) ? ' (Date filter active)' : ''}`}
                >
                  <FilterIcon />
                  {(selectedStatuses.length > 0 || dateFilter.startDate || dateFilter.endDate) && (
                    <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-indigo-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {selectedStatuses.length + (dateFilter.startDate || dateFilter.endDate ? 1 : 0)}
                    </span>
                  )}
                </button>
                
                {/* Order Filter dropdown positioned below filter button */}
                <OrderFilterDropdown
                  isOpen={isFilterOpen}
                  onClose={() => setIsFilterOpen(false)}
                  selectedStatuses={selectedStatuses}
                  onStatusChange={setSelectedStatuses}
                  dateFilter={dateFilter}
                  onDateFilterChange={setDateFilter}
                />
              </div>
              
              {/* Sort Button */}
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
                    {sortBy === 'orderId' ? 'by order ID' : 
                     sortBy === 'scheduledDelivery' ? 'by delivery date' : 
                     'by name'}
                  </span>
                )}
              </div>
            </div>
            
            <button 
              className="add-new-button bg-indigo-600 text-white px-4 h-[46px] rounded-lg text-sm font-semibold hover:bg-indigo-700 flex items-center"
              onClick={() => setIsAddOrderModalOpen(true)}
            >
              + Add Order
            </button>
          </div>
          
          {/* Add Order Modal */}
          <AddOrderModal
            isOpen={isAddOrderModalOpen}
            onClose={() => setIsAddOrderModalOpen(false)}
            onOrderAdded={() => {
              setRefreshTrigger(prev => prev + 1); // Trigger refresh
              setIsAddOrderModalOpen(false);
            }}
          />

          {/* Active filters summary */}
          {(selectedStatuses.length > 0 || dateFilter.startDate || dateFilter.endDate) && (
            <div className="active-filters mb-4 flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-500">Active filters:</span>
              
              {selectedStatuses.map(status => (
                <span key={status} className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md text-xs flex items-center gap-1">
                  {status}
                  <button 
                    onClick={() => setSelectedStatuses(selectedStatuses.filter(s => s !== status))}
                    className="text-indigo-400 hover:text-indigo-600 ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
              
              {(dateFilter.startDate || dateFilter.endDate) && (
                <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md text-xs flex items-center gap-1">
                  {dateFilter.startDate && dateFilter.endDate 
                    ? `${new Date(dateFilter.startDate).toLocaleDateString()} - ${new Date(dateFilter.endDate).toLocaleDateString()}`
                    : dateFilter.startDate
                      ? `From ${new Date(dateFilter.startDate).toLocaleDateString()}`
                      : `Until ${new Date(dateFilter.endDate!).toLocaleDateString()}`
                  }
                  <button 
                    onClick={() => setDateFilter({ startDate: null, endDate: null })}
                    className="text-indigo-400 hover:text-indigo-600 ml-1"
                  >
                    ×
                  </button>
                </span>
              )}
              
              <button
                onClick={() => {
                  setSelectedStatuses([]);
                  setDateFilter({ startDate: null, endDate: null });
                }}
                className="text-xs text-indigo-600 hover:text-indigo-800 ml-2"
              >
                Clear all filters
              </button>
            </div>
          )}

          {loading ? (
            <div className="loading-state p-8 text-center">
              <p>Loading orders...</p>
            </div>
          ) : error ? (
            <div className="error-state p-8 text-center">
              <p className="text-red-500">{error}</p>
              <button 
                onClick={() => setRefreshTrigger(prev => prev + 1)}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="order-list">
              <div className="order-list-header">
                <div className="order-header-cell">Description</div>
                <div className="order-header-cell">Quantity</div>
                <div className="order-header-cell">From</div>
                <div className="order-header-cell">Contact</div>
                <div className="order-header-cell">Scheduled Delivery</div>
                <div className="order-header-cell">Status</div>
              </div>
              
              <div className="order-list-body">
                {sortedOrders.length === 0 ? (
                  <div className="empty-state p-8 text-center">
                    <p className="text-gray-500">No orders found. Add an order to get started.</p>
                  </div>
                ) : (
                  sortedOrders.map((order) => (
                    <div key={order.id} className="order-row">
                      <div className="order-cell">
                        <span className="inline-block text-center w-full">{order.description || `Order #${order.id}`}</span>
                      </div>
                      <div className="order-cell">
                        <span className="inline-block text-center w-full">{order.quantity || '-'}</span>
                      </div>
                      <div className="order-cell">
                        <span className="inline-block text-center w-full">{order.orderFrom}</span>
                      </div>
                      <div className="order-cell">
                        <span className="inline-block text-center w-full">{order.contactInfo}</span>
                      </div>
                      <div className="order-cell">
                        <span className="inline-block text-center w-full">{new Date(order.scheduledDelivery).toLocaleString()}</span>
                      </div>
                      <div className="order-cell">
                        <span className={`status-badge status-${order.status.toLowerCase()}`}>
                          {order.status}
                        </span>
                      </div>
                      <button 
                        className="absolute right-[-60px] top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:text-white hover:bg-red-500 transition-colors text-lg font-bold shadow-sm"
                        onClick={() => handleCancelOrder(order.id)}
                        title="Remove order"
                      >
                        ×
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
