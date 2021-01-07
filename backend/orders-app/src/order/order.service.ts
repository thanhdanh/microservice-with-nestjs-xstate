import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Order, Prisma } from '@prisma/client';

@Injectable()
export class OrderService {
  private readonly logger = new Logger('OrderService');
  
  constructor(private prisma: PrismaService) {}
  
  /**
   * Create new order
   * @param data {Object}
   */
  async createNewOrder(data: Prisma.OrderCreateInput): Promise<Order> {
    return this.prisma.order.create({
      data: {
        ...data,
        user: {
          connect: {
            id: userId,
          }
        }
      },
    });
  }

}
