import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Controller('materials')
export class MaterialsController {
  constructor(private readonly supabaseService: SupabaseService) {}

  @Get()
  async findAll() {
    return this.supabaseService.getMaterials();
  }

  @Get('tags')
  async getAllTags() {
    return this.supabaseService.getAllTags();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.supabaseService.getMaterialById(Number(id));
  }

  @Post()
  async create(@Body() createMaterialDto: {
    name: string;
    color: string;
    size: string;
    quantity: number;
    packSize: number;
    tags: string[];
    imageUrl?: string;
  }) {
    return this.supabaseService.createMaterial(createMaterialDto);
  }

  @Patch(':id/quantity')
  async updateQuantity(
    @Param('id') id: string,
    @Body() updateQuantityDto: { quantity: number },
  ) {
    return this.supabaseService.updateMaterialQuantity(
      Number(id),
      updateQuantityDto.quantity,
    );
  }
}
