import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { SupabaseService, Product } from '../supabase/supabase.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly supabaseService: SupabaseService) {}

  @Get()
  async findAll() {
    return this.supabaseService.getProducts();
  }

  @Get('categories')
  async getAllCategories() {
    return this.supabaseService.getAllCategories();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.supabaseService.getProductById(Number(id));
  }

  @Post()
  async create(@Body() createProductDto: {
    name: string;
    description: string;
    stock: number;
    image?: string;
    categories: string[];
    sizes: string[];
    colors: string[];
  }) {
    return this.supabaseService.createProduct(createProductDto);
  }

  @Patch(':id/stock')
  async updateStock(
    @Param('id') id: string,
    @Body() updateStockDto: { stock: number },
  ) {
    return this.supabaseService.updateProductStock(
      Number(id),
      updateStockDto.stock,
    );
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: Partial<Product>,
  ) {
    return this.supabaseService.updateProduct(Number(id), updateProductDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.supabaseService.deleteProduct(Number(id));
  }
}
