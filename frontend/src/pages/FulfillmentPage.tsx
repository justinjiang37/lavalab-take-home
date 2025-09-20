import React, { useState, useEffect } from 'react';
import { ReactComponent as SortIcon } from '../icons/Sort.svg';
import { ReactComponent as FilterIcon } from '../icons/Filter.svg';
import { FulfillmentFilterDropdown, FulfillmentFilterState, PaymentStatus, FulfillmentStatus } from '../components/FulfillmentFilterDropdown';
import { SortDropdown, SortOption } from '../components/SortDropdown';
import { nestedObjectsToCsv, downloadCsv } from '../utils/csvExport';
import { ProductPerformanceChart, ProductPerformance, ProductMetric } from '../components/ProductPerformanceChart';
import { MetricToggle } from '../components/MetricToggle';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Define the interface for an order
interface Order {
  id: number;
  orderNumber: string;
  orderDate: string;
  customerName: string;
  totalPrice: number;
  paymentStatus: 'Paid' | 'Pending' | 'Failed';
  fulfillmentStatus: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
}

// Define the types for analytics metrics
type AnalyticsMetric = 'quantitySold' | 'totalRevenue' | 'inventorySize';

interface MetricData {
  label: string;
  value: AnalyticsMetric;
  format: (value: number) => string;
  color: string;
}

export function FulfillmentPage() {
  const [activeTab, setActiveTab] = useState<'orders' | 'storePerformance' | 'productPerformance'>('orders');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<keyof Order | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedMetric, setSelectedMetric] = useState<AnalyticsMetric>('quantitySold');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [filterState, setFilterState] = useState<FulfillmentFilterState>({
    paymentStatuses: [],
    fulfillmentStatuses: [],
    dateRange: {
      startDate: null,
      endDate: null
    }
  });
  
  // Product Performance states
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [selectedProductMetrics, setSelectedProductMetrics] = useState<ProductMetric[]>(['quantitySold']);
  
  // Toggle product metrics
  const toggleProductMetric = (metric: ProductMetric) => {
    if (selectedProductMetrics.includes(metric)) {
      // Don't remove the last metric
      if (selectedProductMetrics.length > 1) {
        setSelectedProductMetrics(selectedProductMetrics.filter(m => m !== metric));
      }
    } else {
      setSelectedProductMetrics([...selectedProductMetrics, metric]);
    }
  };
  
  // Sample product performance data
  const productPerformanceData: ProductPerformance[] = [
    {
      id: 1,
      name: 'Navy Jersey Pocket Tee',
      category: 'T-shirts',
      metrics: {
        amountSold: [1200, 1350, 1100, 1400, 1600, 1800, 1750, 1900, 2100, 2300, 2500, 2700],
        quantitySold: [40, 45, 36, 47, 53, 60, 58, 63, 70, 76, 83, 90],
        amountReturned: [120, 135, 110, 140, 160, 180, 175, 190, 210, 230, 250, 270]
      }
    },
    {
      id: 2,
      name: 'White Midweight Hoodie',
      category: 'Hoodies',
      metrics: {
        amountSold: [2400, 2200, 2600, 2800, 3000, 2900, 3100, 3300, 3500, 3700, 3900, 4100],
        quantitySold: [30, 27, 32, 35, 37, 36, 39, 41, 44, 46, 49, 51],
        amountReturned: [240, 220, 260, 280, 300, 290, 310, 330, 350, 370, 390, 410]
      }
    },
    {
      id: 3,
      name: 'Charcoal Beanie',
      category: 'Headwear',
      metrics: {
        amountSold: [900, 850, 950, 1000, 1100, 1050, 1150, 1200, 1300, 1350, 1400, 1450],
        quantitySold: [45, 42, 47, 50, 55, 52, 57, 60, 65, 67, 70, 72],
        amountReturned: [90, 85, 95, 100, 110, 105, 115, 120, 130, 135, 140, 145]
      }
    },
    {
      id: 4,
      name: 'Dark Coffee Sweatpants',
      category: 'Sweatpants',
      metrics: {
        amountSold: [1800, 1900, 1750, 2000, 2100, 2200, 2150, 2300, 2400, 2500, 2600, 2700],
        quantitySold: [25, 27, 24, 28, 30, 31, 30, 32, 34, 35, 37, 38],
        amountReturned: [180, 190, 175, 200, 210, 220, 215, 230, 240, 250, 260, 270]
      }
    }
  ];
  
  // Sort options for orders
  const sortOptions: SortOption[] = [
    { key: 'orderNumber', label: 'Order Number' },
    { key: 'orderDate', label: 'Date' },
    { key: 'totalPrice', label: 'Total Cost' }
  ];
  
  // Handle sort option selection
  const handleSortChange = (key: string) => {
    const typedKey = key as keyof Order;
    if (sortBy === typedKey) {
      // Toggle direction if already sorting by this column
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new sort column and default to ascending
      setSortBy(typedKey);
      setSortDirection('asc');
    }
    setIsSortOpen(false);
  };
  
  // Handle CSV export
  const handleExportCSV = async () => {
    try {
      setIsExporting(true);
      
      // Simulate a delay to show loading state (remove in production)
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Define columns for parent order data
      const orderColumns = [
        { header: 'Order Number', accessor: 'orderNumber' as keyof Order },
        { header: 'Date', accessor: 'orderDate' as keyof Order },
        { header: 'Customer Name', accessor: 'customerName' as keyof Order },
        { header: 'Total Price', accessor: 'totalPrice' as keyof Order },
        { header: 'Payment Status', accessor: 'paymentStatus' as keyof Order },
        { header: 'Fulfillment Status', accessor: 'fulfillmentStatus' as keyof Order }
      ];
      
      // Define columns for order items
      const itemColumns = [
        { header: 'Item Name', accessor: 'name' as keyof Order['items'][0] },
        { header: 'Quantity', accessor: 'quantity' as keyof Order['items'][0] },
        { header: 'Price', accessor: 'price' as keyof Order['items'][0] }
      ];
      
      // Generate CSV content with nested data
      const csvContent = nestedObjectsToCsv(
        sortedOrders,
        orderColumns,
        'items' as keyof Order,
        itemColumns
      );
      
      // Generate filename with current date
      const date = new Date().toISOString().split('T')[0];
      const filename = `tally-orders-${date}.csv`;
      
      // Trigger download
      downloadCsv(csvContent, filename);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Failed to export orders. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };
  
  // Sample orders data
  const sampleOrders: Order[] = [
    {
      id: 1,
      orderNumber: 'ORD-2023-001',
      orderDate: '2023-09-15',
      customerName: 'John Smith',
      totalPrice: 89.97,
      paymentStatus: 'Paid',
      fulfillmentStatus: 'Delivered',
      items: [
        { name: 'Navy Jersey Pocket Tee', quantity: 2, price: 29.99 },
        { name: 'Charcoal Beanie', quantity: 1, price: 29.99 }
      ]
    },
    {
      id: 2,
      orderNumber: 'ORD-2023-002',
      orderDate: '2023-09-18',
      customerName: 'Emily Johnson',
      totalPrice: 129.98,
      paymentStatus: 'Paid',
      fulfillmentStatus: 'Shipped',
      items: [
        { name: 'White Midweight Hoodie', quantity: 1, price: 79.99 },
        { name: 'Navy Boiled Wool Hat', quantity: 1, price: 49.99 }
      ]
    },
    {
      id: 3,
      orderNumber: 'ORD-2023-003',
      orderDate: '2023-09-20',
      customerName: 'Michael Brown',
      totalPrice: 159.97,
      paymentStatus: 'Pending',
      fulfillmentStatus: 'Processing',
      items: [
        { name: 'Dark Coffee Fleece Hoodie', quantity: 1, price: 89.99 },
        { name: 'Dark Coffee Sweatpants', quantity: 1, price: 69.98 }
      ]
    },
    {
      id: 4,
      orderNumber: 'ORD-2023-004',
      orderDate: '2023-09-22',
      customerName: 'Sarah Wilson',
      totalPrice: 59.98,
      paymentStatus: 'Paid',
      fulfillmentStatus: 'Processing',
      items: [
        { name: 'Ash Heather Heavyweight Tee', quantity: 2, price: 29.99 }
      ]
    },
    {
      id: 5,
      orderNumber: 'ORD-2023-005',
      orderDate: '2023-09-25',
      customerName: 'David Martinez',
      totalPrice: 219.95,
      paymentStatus: 'Failed',
      fulfillmentStatus: 'Cancelled',
      items: [
        { name: 'White Midweight Hoodie', quantity: 1, price: 79.99 },
        { name: 'Ash Heather Sweatpants', quantity: 2, price: 69.98 }
      ]
    }
  ];
  
  // Handle sorting
  const handleSort = (column: keyof Order) => {
    if (sortBy === column) {
      // Toggle direction if already sorting by this column
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new sort column and default to ascending
      setSortBy(column);
      setSortDirection('asc');
    }
  };
  
  // Filter and sort orders
  const filteredOrders = sampleOrders.filter(order => {
    // Search term filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = (
        order.orderNumber.toLowerCase().includes(searchLower) ||
        order.customerName.toLowerCase().includes(searchLower) ||
        order.items.some(item => item.name.toLowerCase().includes(searchLower))
      );
      if (!matchesSearch) return false;
    }
    
    // Payment status filter
    if (filterState.paymentStatuses.length > 0 && 
        !filterState.paymentStatuses.includes(order.paymentStatus)) {
      return false;
    }
    
    // Fulfillment status filter
    if (filterState.fulfillmentStatuses.length > 0 && 
        !filterState.fulfillmentStatuses.includes(order.fulfillmentStatus)) {
      return false;
    }
    
    // Date range filter
    const orderDate = new Date(order.orderDate);
    if (filterState.dateRange.startDate) {
      const startDate = new Date(filterState.dateRange.startDate);
      if (orderDate < startDate) return false;
    }
    if (filterState.dateRange.endDate) {
      const endDate = new Date(filterState.dateRange.endDate);
      // Set to end of day
      endDate.setHours(23, 59, 59, 999);
      if (orderDate > endDate) return false;
    }
    
    return true;
  });
  
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (!sortBy) return 0;
    
    let comparison = 0;
    
    if (sortBy === 'totalPrice') {
      comparison = a[sortBy] - b[sortBy];
    } else if (sortBy === 'orderDate') {
      comparison = new Date(a[sortBy]).getTime() - new Date(b[sortBy]).getTime();
    } else {
      const aValue = String(a[sortBy]).toLowerCase();
      const bValue = String(b[sortBy]).toLowerCase();
      comparison = aValue.localeCompare(bValue);
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  return (
    <div className="fulfillment-page flex flex-col h-full">
      {/* Tab Navigation */}
      <div className="fulfillment-tabs flex gap-0 border-b border-gray-200 mb-6">
        <button 
          className={`tab-button px-6 py-3 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-indigo-600 ${activeTab === 'orders' ? 'active text-indigo-600 border-indigo-600' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Your Orders
        </button>
        <button 
          className={`tab-button px-6 py-3 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-indigo-600 ${activeTab === 'storePerformance' ? 'active text-indigo-600 border-indigo-600' : ''}`}
          onClick={() => setActiveTab('storePerformance')}
        >
          Store Performance
        </button>
        <button 
          className={`tab-button px-6 py-3 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-indigo-600 ${activeTab === 'productPerformance' ? 'active text-indigo-600 border-indigo-600' : ''}`}
          onClick={() => setActiveTab('productPerformance')}
        >
          Product Performance
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content flex-1">
        {activeTab === 'orders' && (
          <div className="orders-tab">
            {/* Search and Actions Bar */}
            <div className="flex justify-between items-center mb-6 gap-4">
              <div className="flex gap-2 flex-1 max-w-[550px] relative h-[46px]">
                {/* Search input */}
                <div className="search-input-wrapper flex-1 h-full">
                  <input 
                    type="text" 
                    placeholder="Search orders by number, customer, or item..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 h-full"
                  />
                </div>
                
                {/* Filter Button */}
                <div className="relative h-full">
                  <button 
                    className={`h-full aspect-square rounded-md border border-gray-300 hover:bg-gray-100 transition-colors flex items-center justify-center ${isFilterOpen ? 'bg-gray-100' : ''}`}
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    title="Filter orders"
                  >
                    <FilterIcon />
                    {(filterState.paymentStatuses.length > 0 || 
                      filterState.fulfillmentStatuses.length > 0 || 
                      filterState.dateRange.startDate || 
                      filterState.dateRange.endDate) && (
                      <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                        •
                      </span>
                    )}
                  </button>
                  <FulfillmentFilterDropdown 
                    isOpen={isFilterOpen}
                    onClose={() => setIsFilterOpen(false)}
                    filterState={filterState}
                    onFilterChange={setFilterState}
                  />
                </div>
                
                {/* Sort Button */}
                <div className="relative h-full">
                  <button 
                    className={`h-full aspect-square rounded-md border border-gray-300 hover:bg-gray-100 transition-colors flex items-center justify-center ${isSortOpen ? 'bg-gray-100' : ''}`}
                    onClick={() => setIsSortOpen(!isSortOpen)}
                    title="Sort orders"
                  >
                    <SortIcon />
                    {sortBy && (
                      <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                        •
                      </span>
                    )}
                  </button>
                  <SortDropdown 
                    isOpen={isSortOpen}
                    onClose={() => setIsSortOpen(false)}
                    sortOptions={sortOptions}
                    currentSort={sortBy}
                    currentDirection={sortDirection}
                    onSortChange={handleSortChange}
                  />
                </div>
              </div>
              
              {/* Export Button */}
              <button 
                className={`bg-gray-100 text-gray-700 border border-gray-300 px-4 h-[46px] rounded-lg text-sm font-medium hover:bg-gray-200 flex items-center gap-2 ${isExporting ? 'opacity-75 cursor-not-allowed' : ''}`}
                onClick={handleExportCSV}
                disabled={isExporting}
              >
                {isExporting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Exporting...
                  </>
                ) : (
                  'Export CSV'
                )}
              </button>
            </div>
            
            {/* Active Filters */}
            {(filterState.paymentStatuses.length > 0 || 
              filterState.fulfillmentStatuses.length > 0 || 
              filterState.dateRange.startDate || 
              filterState.dateRange.endDate ||
              sortBy) && (
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-sm text-gray-500">Filtered by:</span>
                
                {/* Payment Status Filters */}
                {filterState.paymentStatuses.map(status => (
                  <span 
                    key={`payment-${status}`}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                  >
                    Payment: {status}
                    <button 
                      onClick={() => setFilterState({
                        ...filterState,
                        paymentStatuses: filterState.paymentStatuses.filter(s => s !== status)
                      })}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
                
                {/* Fulfillment Status Filters */}
                {filterState.fulfillmentStatuses.map(status => (
                  <span 
                    key={`fulfillment-${status}`}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800"
                  >
                    Fulfillment: {status}
                    <button 
                      onClick={() => setFilterState({
                        ...filterState,
                        fulfillmentStatuses: filterState.fulfillmentStatuses.filter(s => s !== status)
                      })}
                      className="ml-1 text-purple-600 hover:text-purple-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
                
                {/* Date Range Filter */}
                {(filterState.dateRange.startDate || filterState.dateRange.endDate) && (
                  <span 
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800"
                  >
                    Date: {filterState.dateRange.startDate ? new Date(filterState.dateRange.startDate).toLocaleDateString() : 'Any'} 
                    to {filterState.dateRange.endDate ? new Date(filterState.dateRange.endDate).toLocaleDateString() : 'Any'}
                    <button 
                      onClick={() => setFilterState({
                        ...filterState,
                        dateRange: { startDate: null, endDate: null }
                      })}
                      className="ml-1 text-green-600 hover:text-green-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                
                {/* Sort Indicator */}
                {sortBy && (
                  <span 
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800"
                  >
                    Sort: {sortOptions.find(option => option.key === sortBy)?.label} ({sortDirection === 'asc' ? 'Ascending' : 'Descending'})
                    <button 
                      onClick={() => setSortBy(null)}
                      className="ml-1 text-amber-600 hover:text-amber-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                
                {/* Clear All Button */}
                <button 
                  onClick={() => {
                    setFilterState({
                      paymentStatuses: [],
                      fulfillmentStatuses: [],
                      dateRange: { startDate: null, endDate: null }
                    });
                    setSortBy(null);
                  }}
                  className="text-xs text-indigo-600 hover:text-indigo-800 ml-2"
                >
                  Clear All
                </button>
              </div>
            )}
            
            {/* Orders Table */}
            <div className="orders-table-container overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
              <table className="orders-table w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
                  <tr>
                    <th 
                      className="px-6 py-4 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('orderNumber')}
                    >
                      <div className="flex items-center justify-between">
                        <span>Order #</span>
                        {sortBy === 'orderNumber' && (
                          <span>{sortDirection === 'asc' ? '\u2191' : '\u2193'}</span>
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('orderDate')}
                    >
                      <div className="flex items-center justify-between">
                        <span>Date</span>
                        {sortBy === 'orderDate' && (
                          <span>{sortDirection === 'asc' ? '\u2191' : '\u2193'}</span>
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('customerName')}
                    >
                      <div className="flex items-center justify-between">
                        <span>Customer</span>
                        {sortBy === 'customerName' && (
                          <span>{sortDirection === 'asc' ? '\u2191' : '\u2193'}</span>
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('totalPrice')}
                    >
                      <div className="flex items-center justify-between">
                        <span>Total</span>
                        {sortBy === 'totalPrice' && (
                          <span>{sortDirection === 'asc' ? '\u2191' : '\u2193'}</span>
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('paymentStatus')}
                    >
                      <div className="flex items-center justify-between">
                        <span>Payment</span>
                        {sortBy === 'paymentStatus' && (
                          <span>{sortDirection === 'asc' ? '\u2191' : '\u2193'}</span>
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('fulfillmentStatus')}
                    >
                      <div className="flex items-center justify-between">
                        <span>Fulfillment</span>
                        {sortBy === 'fulfillmentStatus' && (
                          <span>{sortDirection === 'asc' ? '\u2191' : '\u2193'}</span>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-4">Items</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sortedOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                        No orders found matching your search criteria.
                      </td>
                    </tr>
                  ) : (
                    sortedOrders.map(order => (
                      <tr key={order.id} className="bg-white hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {order.orderNumber}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {new Date(order.orderDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          {order.customerName}
                        </td>
                        <td className="px-6 py-4 font-medium">
                          ${order.totalPrice.toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`status-badge status-${order.paymentStatus.toLowerCase()}`}>
                            {order.paymentStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`status-badge status-${order.fulfillmentStatus.toLowerCase()}`}>
                            {order.fulfillmentStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            {order.items.map((item, index) => (
                              <div key={index} className="text-sm">
                                <span className="font-medium">{item.quantity}x</span> {item.name}
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {activeTab === 'storePerformance' && (
          <div className="analytics-tab">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Store Performance</h2>
              <div className="flex items-center gap-3">
                <label htmlFor="metric-select" className="text-sm font-medium text-gray-600">
                  Metric:
                </label>
                <select
                  id="metric-select"
                  value={selectedMetric}
                  onChange={(e) => setSelectedMetric(e.target.value as AnalyticsMetric)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="quantitySold">Quantity Sold</option>
                  <option value="totalRevenue">Total Revenue</option>
                  <option value="inventorySize">Inventory Size</option>
                </select>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-6">
              <AnalyticsChart metric={selectedMetric} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricCard 
                title="Total Orders" 
                value="127"
                change="+12%"
                isPositive={true}
                period="vs last month"
              />
              <MetricCard 
                title="Average Order Value" 
                value="$78.45"
                change="+5.3%"
                isPositive={true}
                period="vs last month"
              />
              <MetricCard 
                title="Return Rate" 
                value="2.4%"
                change="-0.8%"
                isPositive={true}
                period="vs last month"
              />
            </div>
          </div>
        )}
        
        {activeTab === 'productPerformance' && (
          <div className="product-performance-tab">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Product Performance</h2>
              <div className="flex items-center gap-3">
                <label htmlFor="product-select" className="text-sm font-medium text-gray-600">
                  Product:
                </label>
                <select
                  id="product-select"
                  value={selectedProduct || ''}
                  onChange={(e) => setSelectedProduct(e.target.value ? Number(e.target.value) : null)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-w-[200px]"
                >
                  <option value="">Select a product</option>
                  {productPerformanceData.map(product => (
                    <option key={product.id} value={product.id}>{product.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {selectedProduct ? (
              <>
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {productPerformanceData.find(p => p.id === selectedProduct)?.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Category: {productPerformanceData.find(p => p.id === selectedProduct)?.category}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <MetricToggle
                        label="Amount Sold"
                        value="amountSold"
                        isActive={selectedProductMetrics.includes('amountSold')}
                        color="rgba(79, 70, 229, 0.8)"
                        onClick={() => toggleProductMetric('amountSold')}
                      />
                      <MetricToggle
                        label="Quantity Sold"
                        value="quantitySold"
                        isActive={selectedProductMetrics.includes('quantitySold')}
                        color="rgba(16, 185, 129, 0.8)"
                        onClick={() => toggleProductMetric('quantitySold')}
                      />
                      <MetricToggle
                        label="Amount Returned"
                        value="amountReturned"
                        isActive={selectedProductMetrics.includes('amountReturned')}
                        color="rgba(245, 158, 11, 0.8)"
                        onClick={() => toggleProductMetric('amountReturned')}
                      />
                    </div>
                  </div>
                  <div style={{ height: '400px' }}>
                    <ProductPerformanceChart 
                      product={productPerformanceData.find(p => p.id === selectedProduct)!}
                      selectedMetrics={selectedProductMetrics}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <MetricCard 
                    title="Total Revenue" 
                    value={`$${productPerformanceData
                      .find(p => p.id === selectedProduct)?.metrics.amountSold
                      .reduce((sum, val) => sum + val, 0)
                      .toLocaleString()}`}
                    change="+18.3%"
                    isPositive={true}
                    period="vs last year"
                  />
                  <MetricCard 
                    title="Units Sold" 
                    value={productPerformanceData
                      .find(p => p.id === selectedProduct)?.metrics.quantitySold
                      .reduce((sum, val) => sum + val, 0)
                      .toString() || '0'}
                    change="+22.5%"
                    isPositive={true}
                    period="vs last year"
                  />
                  <MetricCard 
                    title="Return Rate" 
                    value={`${((productPerformanceData
                      .find(p => p.id === selectedProduct)?.metrics.amountReturned
                      .reduce((sum, val) => sum + val, 0) || 0) / 
                      (productPerformanceData
                      .find(p => p.id === selectedProduct)?.metrics.amountSold
                      .reduce((sum, val) => sum + val, 0) || 1) * 100).toFixed(1)}%`}
                    change="-1.2%"
                    isPositive={true}
                    period="vs last year"
                  />
                </div>
              </>
            ) : (
              <div className="bg-white p-12 rounded-lg border border-gray-200 shadow-sm text-center">
                <p className="text-gray-500">Select a product to view its performance metrics</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Analytics Chart Component
function AnalyticsChart({ metric }: { metric: AnalyticsMetric }) {
  // Sample data for the chart
  const metricData: Record<AnalyticsMetric, MetricData> = {
    quantitySold: {
      label: 'Quantity Sold',
      value: 'quantitySold',
      format: (value) => `${value} units`,
      color: 'rgba(79, 70, 229, 0.8)' // Indigo color
    },
    totalRevenue: {
      label: 'Total Revenue',
      value: 'totalRevenue',
      format: (value) => `$${value.toLocaleString()}`,
      color: 'rgba(16, 185, 129, 0.8)' // Green color
    },
    inventorySize: {
      label: 'Inventory Size',
      value: 'inventorySize',
      format: (value) => `${value} units`,
      color: 'rgba(245, 158, 11, 0.8)' // Amber color
    }
  };
  
  // Generate last 12 months as labels
  const generateMonthLabels = () => {
    const months = [];
    const currentDate = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setMonth(currentDate.getMonth() - i);
      months.push(date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));
    }
    
    return months;
  };
  
  // Generate random data based on the selected metric
  const generateData = (metric: AnalyticsMetric) => {
    const baseValue = metric === 'totalRevenue' ? 5000 : metric === 'quantitySold' ? 200 : 500;
    const variance = metric === 'totalRevenue' ? 2000 : metric === 'quantitySold' ? 100 : 150;
    
    return Array.from({ length: 12 }, () => {
      return Math.floor(baseValue + Math.random() * variance);
    });
  };
  
  const labels = generateMonthLabels();
  const data = generateData(metric);
  
  const chartData = {
    labels,
    datasets: [
      {
        label: metricData[metric].label,
        data,
        borderColor: metricData[metric].color,
        backgroundColor: `${metricData[metric].color.slice(0, -1)}, 0.1)`,
        tension: 0.3,
        fill: true,
        pointBackgroundColor: metricData[metric].color,
        pointRadius: 4,
        pointHoverRadius: 6
      },
    ],
  };
  
  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 14,
            family: "'Inter', sans-serif"
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.parsed.y;
            return metricData[metric].format(value);
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            if (typeof value === 'number') {
              if (metric === 'totalRevenue') {
                return '$' + value.toLocaleString();
              }
              return value;
            }
            return '';
          }
        }
      }
    }
  };
  
  return (
    <div style={{ height: '400px' }}>
      <Line data={chartData} options={options} />
    </div>
  );
}

// Metric Card Component
interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  period: string;
}

function MetricCard({ title, value, change, isPositive, period }: MetricCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <h3 className="text-sm font-medium text-gray-500 mb-2">{title}</h3>
      <div className="flex items-end gap-3">
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        <p className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'} flex items-center`}>
          {isPositive ? '↑' : '↓'} {change}
        </p>
      </div>
      <p className="text-xs text-gray-500 mt-1">{period}</p>
    </div>
  );
}