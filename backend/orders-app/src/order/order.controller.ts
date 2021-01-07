import { Body, Controller, Get, Logger, Post, Req } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  private readonly logger = new Logger('OrderController');
  
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(@Body() payload: Prisma.OrderCreateInput) {
    const order = await this.orderService.createNewOrder(payload);
    return order;
  }
}
