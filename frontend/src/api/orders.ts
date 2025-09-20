// API service for communicating with our backend orders

const API_BASE_URL = 'http://localhost:3001';

// Order status enum to match backend
export enum OrderStatus {
  CREATED = 'CREATED',
  RECEIVED = 'RECEIVED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED'
}

export interface Order {
  id: number;
  orderFrom: string;
  contactInfo: string;
  description: string;
  quantity: number;
  scheduledDelivery: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

// Get all orders from the backend
export const fetchOrders = async (): Promise<Order[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

// Get a specific order by ID
export const fetchOrderById = async (id: number): Promise<Order> => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

// Create a new order
export const createOrder = async (order: {
  orderFrom: string;
  contactInfo: string;
  description: string;
  quantity: number;
  scheduledDelivery: string;
  status: OrderStatus;
}): Promise<Order> => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(order),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Update order status
export const updateOrderStatus = async (id: number, status: OrderStatus): Promise<Order> => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

// Update order details
export const updateOrder = async (id: number, orderData: Partial<Order>): Promise<Order> => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
};

// Delete an order
export const deleteOrder = async (id: number): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
};
