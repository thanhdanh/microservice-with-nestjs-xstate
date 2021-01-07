import { Body, Controller, Get, Logger, Post, Req, Request, UseGuards } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { ICredential } from 'src/auth/constants';
import { Credential } from 'src/decorators/credential.decorator';
import { OrderService } from './order.service';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
  private readonly logger = new Logger('OrderController');
  
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(@Body() payload: Prisma.OrderCreateInput, @Credential() user:ICredential) {
    const order = await this.orderService.createNewOrder(payload, user);
    return order;
  }
}
