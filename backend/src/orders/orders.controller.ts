import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { SupabaseService, OrderStatus } from '../supabase/supabase.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly supabaseService: SupabaseService) {}

  @Get()
  async findAll() {
    return this.supabaseService.getOrders();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.supabaseService.getOrderById(Number(id));
  }

  @Post()
  async create(@Body() createOrderDto: {
    orderFrom: string;
    contactInfo: string;
    description: string;
    quantity: number;
    scheduledDelivery: string;
    status: OrderStatus;
  }) {
    return this.supabaseService.createOrder(createOrderDto);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: { status: OrderStatus },
  ) {
    return this.supabaseService.updateOrderStatus(
      Number(id),
      updateStatusDto.status,
    );
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: {
      orderFrom?: string;
      contactInfo?: string;
      description?: string;
      quantity?: number;
      scheduledDelivery?: string;
      status?: OrderStatus;
    },
  ) {
    return this.supabaseService.updateOrder(Number(id), updateOrderDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.supabaseService.deleteOrder(Number(id));
  }
}
