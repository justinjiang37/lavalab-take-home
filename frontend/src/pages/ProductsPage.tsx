import React, { useState, useEffect } from 'react';
import { fetchProducts, fetchAllCategories, Product as ApiProduct } from '../api/products';
import { ReactComponent as FilterIcon } from '../icons/Filter.svg';
import { ReactComponent as SortIcon } from '../icons/Sort.svg';
import { AddProductModalReal } from '../components/AddProductModalReal';

// Use the Product interface from the API
type Product = ApiProduct;

// Product Details Modal Component
interface ProductDetailsModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete?: (productId: number) => void;
}

const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ product, isOpen, onClose, onDelete }) => {
  if (!product || !isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        {/* Product Image */}
        <div className="w-full md:w-1/2 bg-gray-100">
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No image available
            </div>
          )}
        </div>
        
        {/* Product Details */}
        <div className="w-full md:w-1/2 p-6 overflow-y-auto">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold text-gray-900">{product.name}</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Stock Status */}
          <div className="mb-4">
            <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
              product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>
          
          {/* Description */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Description</h3>
            <p className="text-gray-700">{product.description}</p>
          </div>
          
          {/* Categories */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Category</h3>
            <div className="flex flex-wrap gap-1">
              {product.categories.map((category, idx) => (
                <span 
                  key={idx} 
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
          
          {/* Sizes */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Available Sizes</h3>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size, idx) => (
                <span 
                  key={idx} 
                  className="inline-flex items-center justify-center h-8 w-12 border border-gray-200 rounded text-sm"
                >
                  {size}
                </span>
              ))}
            </div>
          </div>
          
          {/* Colors */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Available Colors</h3>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((color, idx) => (
                <span 
                  key={idx} 
                  className="inline-flex items-center px-3 py-1 rounded-full border border-gray-200 text-sm"
                >
                  {color}
                </span>
              ))}
            </div>
          </div>
          
          {/* Delete Button */}
          {onDelete && (
            <div className="mt-8 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  if (window.confirm(`Are you sure you want to remove ${product.name} from your store?`)) {
                    onDelete(product.id);
                    onClose();
                  }
                }}
                className="w-full py-2 px-4 rounded-md border border-red-300 text-red-600 text-sm font-medium hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
              >
                Remove Product
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Product component
const ProductItem: React.FC<{ product: Product; onClick: (product: Product) => void }> = ({ product, onClick }) => {
  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md cursor-pointer"
      onClick={() => onClick(product)}
    >
      {/* Image area */}
      <div className="aspect-square bg-gray-100 flex items-center justify-center">
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-gray-400 text-sm flex items-center justify-center h-full">
            <span>No image</span>
          </div>
        )}
      </div>
      
      {/* Product title - simplified */}
      <div className="p-3">
        <h3 className="font-medium text-gray-900 text-center truncate">{product.name}</h3>
      </div>
    </div>
  );
};


export function ProductsPage() {
  // State for selected product and modal visibility
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // State for products data
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // State for add product modal
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  
  // Search, filter, and sort state
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'name' | 'stock' | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // State for categories
  const [allCategories, setAllCategories] = useState<string[]>([]);
  
  // Load products and categories
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch products
        const productsData = await fetchProducts();
        setProducts(productsData);
        
        // Fetch categories
        const categoriesData = await fetchAllCategories();
        setAllCategories(categoriesData.length > 0 ? categoriesData : ['T-shirts', 'Hoodies', 'Headwear', 'Sweatpants']);
      } catch (err) {
        console.error('Error loading products:', err);
        setError('Failed to load products. Please try again.');
        // Use sample data as fallback
        setAllCategories(['T-shirts', 'Hoodies', 'Headwear', 'Sweatpants']);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [refreshTrigger]);

  // Handle product click
  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  // Handle product deletion
  const handleDeleteProduct = async (productId: number) => {
    try {
      setIsDeleting(true);
      // Import the deleteProduct function from the API
      const { deleteProduct } = await import('../api/products');
      await deleteProduct(productId);
      
      // Remove the product from the local state
      setProducts(products.filter(p => p.id !== productId));
      
      // Show success message
      alert('Product removed successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to remove product. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };
  
  // Handle sort toggle
  const handleSortToggle = () => {
    if (sortBy === null) {
      setSortBy('name');
      setSortDirection('asc');
    } else if (sortBy === 'name') {
      setSortBy('stock');
      setSortDirection('desc');
    } else if (sortBy === 'stock') {
      setSortBy(null);
    }
  };
  
  // Handle category toggle
  const handleCategoryToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSelectedCategories([]);
  };

  // State variables and handlers

  // Filter products based on search term and selected categories
  const filteredProducts = products.filter(product => {
    // Search term filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        product.name.toLowerCase().includes(searchLower) || 
        product.description.toLowerCase().includes(searchLower);
      
      if (!matchesSearch) return false;
    }
    
    // Category filter
    if (selectedCategories.length > 0) {
      const hasSelectedCategory = product.categories.some(category => 
        selectedCategories.includes(category)
      );
      
      if (!hasSelectedCategory) return false;
    }
    
    return true;
  });

  // Sort products based on sortBy and sortDirection
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'name') {
      return sortDirection === 'asc' 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name);
    } else if (sortBy === 'stock') {
      return sortDirection === 'asc' 
        ? a.stock - b.stock 
        : b.stock - a.stock;
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-grow flex flex-col py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full">
          
          {/* Search and Actions Bar */}
          <div className="flex justify-between items-center mb-8 gap-4">
            <div className="flex gap-2 flex-1 max-w-[550px] relative h-[46px]">
              {/* Search input */}
              <div className="search-input-wrapper flex-1 h-full">
                <input 
                  type="text" 
                  placeholder="Search products by name..."
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
                  title="Filter by category"
                >
                  <FilterIcon />
                </button>
                
                {/* Filter dropdown */}
                {isFilterOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-10 border border-gray-200 overflow-hidden">
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-sm font-medium text-gray-700">Filter by Category</h3>
                        {selectedCategories.length > 0 && (
                          <button 
                            onClick={clearFilters}
                            className="text-xs text-indigo-600 hover:text-indigo-800"
                          >
                            Clear all
                          </button>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        {allCategories.map(category => (
                          <label key={category} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedCategories.includes(category)}
                              onChange={() => handleCategoryToggle(category)}
                              className="rounded text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="text-sm text-gray-700">{category}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
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
                    {sortBy === 'name' ? 'by name' : 'by stock'}
                  </span>
                )}
              </div>
            </div>
            
            {/* Add Product Button */}
            <button 
              className="bg-indigo-600 text-white px-4 h-[46px] rounded-lg text-sm font-semibold hover:bg-indigo-700 flex items-center"
              onClick={() => setIsAddProductModalOpen(true)}
            >
              + Add Product
            </button>
          </div>
          
          {/* Active filters display */}
          {selectedCategories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-sm text-gray-500">Filtered by:</span>
              {selectedCategories.map(category => (
                <span 
                  key={category}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-indigo-100 text-indigo-800"
                >
                  {category}
                  <button 
                    onClick={() => handleCategoryToggle(category)}
                    className="ml-1 text-indigo-600 hover:text-indigo-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          
          {/* Products grid - responsive with different columns based on screen size */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {loading ? (
              <div className="col-span-full py-12 text-center text-gray-500">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="h-8 w-32 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 w-48 bg-gray-200 rounded"></div>
                </div>
              </div>
            ) : error ? (
              <div className="col-span-full py-12 text-center text-red-500">
                {error}
                <button 
                  onClick={() => setRefreshTrigger(prev => prev + 1)}
                  className="block mx-auto mt-4 text-sm text-indigo-600 hover:text-indigo-800"
                >
                  Try Again
                </button>
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="col-span-full py-12 text-center text-gray-500">
                No products found matching your criteria.
              </div>
            ) : (
              sortedProducts.map((product) => (
                <ProductItem 
                  key={product.id} 
                  product={{
                    ...product,
                    // Use the product's image directly from the database
                    image: product.image
                  }}
                  onClick={handleProductClick} 
                />
              ))
            )}
          </div>
        </div>
      </div>
      
      {/* Product Details Modal */}
      <ProductDetailsModal 
        product={selectedProduct} 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        onDelete={handleDeleteProduct} 
      />
      
      {/* Add Product Modal */}
      <AddProductModalReal
        isOpen={isAddProductModalOpen}
        onClose={() => setIsAddProductModalOpen(false)}
        onProductAdded={() => {
          // Refresh the products list
          setRefreshTrigger(prev => prev + 1);
          setIsAddProductModalOpen(false);
        }}
      />
    </div>
  );
}