// API service for communicating with our backend

const API_BASE_URL = 'http://localhost:3001';

export interface Product {
  id: number;
  name: string;
  color: string;
  size: string;
  quantity: number;
  packSize: number; // packSize now serves as the threshold for low stock warning
  imageUrl?: string;
  minQuantity?: number; // Keep for backward compatibility but mark as optional
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// Get all products from the backend
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Get a specific product by ID
export const fetchProductById = async (id: number): Promise<Product> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

// Update product quantity
export const updateProductQuantity = async (id: number, quantity: number): Promise<Product> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}/quantity`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quantity }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating product quantity:', error);
    throw error;
  }
};

// Create a new product
export const createProduct = async (product: {
  name: string;
  color: string;
  size: string;
  quantity: number;
  packSize: number; // packSize now serves as the threshold for low stock warning
  tags: string[];
  imageUrl?: string;
}): Promise<Product> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

// Get all unique tags from products
export const fetchAllTags = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/tags`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching tags:', error);
    throw error;
  }
};
