import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Order, Prisma } from '@prisma/client';
import { from, Observable } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { ICredential } from 'src/auth/constants';
import { InternalEvents } from 'src/constants';
import { Credential } from 'src/decorators/credential.decorator';
import { OrderService } from './order.service';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Get()
  list(@Credential() user: ICredential): Observable<Order[]> {
    return from(this.orderService.getAllOrders(user));
  }

  @Post()
  async create(@Body() payload: Prisma.OrderCreateInput, @Credential() user: ICredential) {
    const order = await this.orderService.createNewOrder(payload, user);
    return order;
  }

  @Get('/statistic')
  Statistic(@Credential() user: ICredential): Observable<any> {
    return from(this.orderService.getStatistic(user));
  }
  
  @Get(':id')
  async details(@Param('id') id: number, @Credential() user: ICredential) {
    return this.orderService.findById(id, user);
  }

  @Get(':id/status')
  async checkStatus(@Param('id') id: number, @Credential() user: ICredential) {
    return this.orderService.getStatusOfOrderById(id, user);
  }

  @Get(':id/cancel')
  async cancelOrder(@Param('id') id: number, @Credential() user: ICredential) {
    return this.orderService.cancelOrder(id, user);
  }

  @OnEvent(InternalEvents.ORDER_CREATED)
  handleOrderCreated(orderId: number) {
    return this.orderService.triggerNewPaymentProcess(orderId)
  }

  @OnEvent(InternalEvents.ORDER_CONFIRMED)
  handleOrderConfirmed(orderId: number) {
    return this.orderService.deliveryOrder(orderId)
  }
}
