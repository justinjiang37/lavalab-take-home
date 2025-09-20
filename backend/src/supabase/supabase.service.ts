import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

// Define Product interface
export interface Product {
  id: number;
  name: string;
  description: string;
  stock: number;
  image: string;
  categories: string[];
  sizes: string[];
  colors: string[];
  createdAt?: string;
  updatedAt?: string;
}

// Define Order status enum
export enum OrderStatus {
  CREATED = 'CREATED',
  RECEIVED = 'RECEIVED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED'
}

// Define Order interface
export interface Order {
  id: number;
  orderFrom: string;
  contactInfo: string;
  description: string;
  quantity: number;
  scheduledDelivery: string;
  status: OrderStatus;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable()
export class SupabaseService {
  private supabase;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables. Please check your .env file.');
    }
    
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  // Get all materials
  async getMaterials() {
    const { data, error } = await this.supabase
      .from('Material')
      .select('*');
    
    if (error) throw error;
    return data;
  }

  // Get material by ID
  async getMaterialById(id: number) {
    const { data, error } = await this.supabase
      .from('Material')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  // Update material quantity
  async updateMaterialQuantity(id: number, quantity: number) {
    const { data, error } = await this.supabase
      .from('Material')
      .update({ 
        quantity,
        updatedAt: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Create new material
  async createMaterial(material: {
    name: string;
    color: string;
    size: string;
    quantity: number;
    packSize: number;
    tags: string[];
    imageUrl?: string;
  }) {
    // packSize is now used as the threshold (previously minQuantity)
    const { data, error } = await this.supabase
      .from('Material')
      .insert([{
        ...material,
        minQuantity: null // Set to null to indicate we're not using it anymore
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Get all unique tags from materials
  async getAllTags() {
    const { data, error } = await this.supabase
      .from('Material')
      .select('tags');
    
    if (error) throw error;
    
    // Extract unique tags from all materials
    const allTags = new Set<string>();
    data.forEach(material => {
      if (material.tags && Array.isArray(material.tags)) {
        material.tags.forEach(tag => allTags.add(tag));
      }
    });
    
    return Array.from(allTags).sort();
  }

  // ORDER RELATED METHODS

  // Get all orders
  async getOrders() {
    const { data, error } = await this.supabase
      .from('Order')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) throw error;
    return data;
  }

  // Get order by ID
  async getOrderById(id: number) {
    const { data, error } = await this.supabase
      .from('Order')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  // Create new order
  async createOrder(order: {
    orderFrom: string;
    contactInfo: string;
    description: string;
    quantity: number;
    scheduledDelivery: string;
    status: OrderStatus;
  }) {
    const now = new Date().toISOString();
    
    const { data, error } = await this.supabase
      .from('Order')
      .insert([{
        ...order,
        createdAt: now,
        updatedAt: now
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Update order status
  async updateOrderStatus(id: number, status: OrderStatus) {
    const { data, error } = await this.supabase
      .from('Order')
      .update({ 
        status,
        updatedAt: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Update order
  async updateOrder(id: number, orderData: Partial<Order>) {
    const { data, error } = await this.supabase
      .from('Order')
      .update({ 
        ...orderData,
        updatedAt: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Delete order
  async deleteOrder(id: number) {
    const { error } = await this.supabase
      .from('Order')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true, message: `Order ${id} deleted successfully` };
  }

  // PRODUCT RELATED METHODS

  // Get all products
  async getProducts() {
    const { data, error } = await this.supabase
      .from('Product')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) throw error;
    return data;
  }

  // Get product by ID
  async getProductById(id: number) {
    const { data, error } = await this.supabase
      .from('Product')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  // Create new product
  async createProduct(product: {
    name: string;
    description: string;
    stock: number;
    image?: string;
    categories: string[];
    sizes: string[];
    colors: string[];
  }) {
    const now = new Date().toISOString();
    
    const { data, error } = await this.supabase
      .from('Product')
      .insert([{
        ...product,
        createdAt: now,
        updatedAt: now
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Update product stock
  async updateProductStock(id: number, stock: number) {
    const { data, error } = await this.supabase
      .from('Product')
      .update({ 
        stock,
        updatedAt: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Update product
  async updateProduct(id: number, productData: Partial<Product>) {
    const { data, error } = await this.supabase
      .from('Product')
      .update({ 
        ...productData,
        updatedAt: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Delete product
  async deleteProduct(id: number) {
    const { error } = await this.supabase
      .from('Product')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true, message: `Product ${id} deleted successfully` };
  }

  // Get all unique categories from products
  async getAllCategories() {
    const { data, error } = await this.supabase
      .from('Product')
      .select('categories');
    
    if (error) throw error;
    
    // Extract unique categories from all products
    const allCategories = new Set<string>();
    data.forEach(product => {
      if (product.categories && Array.isArray(product.categories)) {
        product.categories.forEach(category => allCategories.add(category));
      }
    });
    
    return Array.from(allCategories).sort();
  }
}
