import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

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

  // Get all products
  async getProducts() {
    const { data, error } = await this.supabase
      .from('Product')
      .select('*');
    
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

  // Update product quantity
  async updateProductQuantity(id: number, quantity: number) {
    const { data, error } = await this.supabase
      .from('Product')
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

  // Create new product
  async createProduct(product: {
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
      .from('Product')
      .insert([{
        ...product,
        minQuantity: null // Set to null to indicate we're not using it anymore
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Get all unique tags from products
  async getAllTags() {
    const { data, error } = await this.supabase
      .from('Product')
      .select('tags');
    
    if (error) throw error;
    
    // Extract unique tags from all products
    const allTags = new Set<string>();
    data.forEach(product => {
      if (product.tags && Array.isArray(product.tags)) {
        product.tags.forEach(tag => allTags.add(tag));
      }
    });
    
    return Array.from(allTags).sort();
  }
}
