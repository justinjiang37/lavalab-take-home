import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly supabaseService: SupabaseService) {}

  @Get()
  async findAll() {
    return this.supabaseService.getProducts();
  }

  @Get('tags')
  async getAllTags() {
    return this.supabaseService.getAllTags();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.supabaseService.getProductById(Number(id));
  }

  @Post()
  async create(@Body() createProductDto: {
    name: string;
    color: string;
    size: string;
    quantity: number;
    packSize: number;
    tags: string[];
    imageUrl?: string;
  }) {
    return this.supabaseService.createProduct(createProductDto);
  }

  @Patch(':id/quantity')
  async updateQuantity(
    @Param('id') id: string,
    @Body() updateQuantityDto: { quantity: number },
  ) {
    return this.supabaseService.updateProductQuantity(
      Number(id),
      updateQuantityDto.quantity,
    );
  }
}
