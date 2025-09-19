// API service for communicating with our backend

const API_BASE_URL = 'http://localhost:3001';

export interface Material {
  id: number;
  name: string;
  color: string;
  size: string;
  quantity: number;
  packSize: number; // packSize serves as the threshold for low stock warning
  imageUrl?: string;
  minQuantity?: number; // Keep for backward compatibility but mark as optional
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// Get all materials from the backend
export const fetchMaterials = async (): Promise<Material[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching materials:', error);
    throw error;
  }
};

// Get a specific material by ID
export const fetchMaterialById = async (id: number): Promise<Material> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching material:', error);
    throw error;
  }
};

// Update material quantity
export const updateMaterialQuantity = async (id: number, quantity: number): Promise<Material> => {
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
    console.error('Error updating material quantity:', error);
    throw error;
  }
};

// Create a new material
export const createMaterial = async (material: {
  name: string;
  color: string;
  size: string;
  quantity: number;
  packSize: number; // packSize serves as the threshold for low stock warning
  tags: string[];
  imageUrl?: string;
}): Promise<Material> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(material),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating material:', error);
    throw error;
  }
};

// Get all unique tags from materials
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

// For backward compatibility - these will be deprecated
export interface Product extends Material {}
export const fetchProducts = fetchMaterials;
export const fetchProductById = fetchMaterialById;
export const updateProductQuantity = updateMaterialQuantity;
export const createProduct = createMaterial;
