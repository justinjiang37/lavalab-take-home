import React from 'react';
import './ProductsPage.css';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  variants: string[];
  status: 'active' | 'draft' | 'archived';
}

export function ProductsPage() {
  // Mock product data for clothing brand
  const products: Product[] = [
    {
      id: 1,
      name: "Classic Cotton T-Shirt",
      category: "T-Shirts",
      price: 24.99,
      description: "Premium 100% cotton t-shirt with a comfortable fit",
      image: "👕",
      variants: ["S", "M", "L", "XL"],
      status: "active"
    },
    {
      id: 2,
      name: "Hooded Sweatshirt",
      category: "Hoodies",
      price: 49.99,
      description: "Cozy fleece-lined hoodie perfect for casual wear",
      image: "🧥",
      variants: ["S", "M", "L", "XL", "XXL"],
      status: "active"
    },
    {
      id: 3,
      name: "Denim Jacket",
      category: "Jackets",
      price: 89.99,
      description: "Classic denim jacket with vintage wash",
      image: "🧥",
      variants: ["S", "M", "L", "XL"],
      status: "active"
    },
    {
      id: 4,
      name: "Athletic Shorts",
      category: "Shorts",
      price: 34.99,
      description: "Lightweight athletic shorts for active lifestyle",
      image: "🩳",
      variants: ["S", "M", "L", "XL"],
      status: "active"
    },
    {
      id: 5,
      name: "Baseball Cap",
      category: "Accessories",
      price: 19.99,
      description: "Adjustable baseball cap with embroidered logo",
      image: "🧢",
      variants: ["One Size"],
      status: "active"
    }
  ];

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'active': return 'status-badge status-active';
      case 'draft': return 'status-badge status-draft';
      case 'archived': return 'status-badge status-archived';
      default: return 'status-badge status-archived';
    }
  };

  return (
    <div className="products-page">
      <div className="products-container">
        {/* Header */}
        <div className="products-header">
          <h1 className="products-title">Your Products</h1>
          <p className="products-subtitle">Manage your clothing brand products and inventory</p>
        </div>

        {/* Products Grid */}
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              {/* Product Image */}
              <div className="product-image">
                {product.image}
              </div>
              
              {/* Product Info */}
              <div className="product-info">
                <div className="product-header">
                  <h3 className="product-name">{product.name}</h3>
                  <span className={getStatusClass(product.status)}>
                    {product.status}
                  </span>
                </div>
                
                <p className="product-category">{product.category}</p>
                <p className="product-description">{product.description}</p>
                
                <div className="product-price-row">
                  <span className="product-price">${product.price}</span>
                  <span className="product-variants-count">{product.variants.length} variants</span>
                </div>
                
                {/* Variants */}
                <div className="product-variants">
                  {product.variants.map((variant, index) => (
                    <span key={index} className="variant-tag">
                      {variant}
                    </span>
                  ))}
                </div>
                
                {/* Action Buttons */}
                <div className="product-actions">
                  <button className="action-button action-button-primary">
                    Edit
                  </button>
                  <button className="action-button action-button-secondary">
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add New Product Button */}
        <div className="add-product-button">
          <button className="add-product-btn">
            <span className="add-product-icon">+</span>
            Add New Product
          </button>
        </div>
      </div>
    </div>
  );
}
