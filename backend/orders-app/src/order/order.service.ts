import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { Order, Prisma } from '@prisma/client';
import { ICredential } from 'src/auth/constants';

@Injectable()
export class OrderService {
  private readonly logger = new Logger('OrderService');
  
  constructor(private prisma: PrismaService) {}
  
  /**
   * Create new order
   * @param data {Object}
   */
  async createNewOrder(data: Prisma.OrderCreateInput, user: ICredential): Promise<Order> {
    return this.prisma.order.create({
      data: {
        ...data,
        user: {
          connect: {
            id: user.userId
          }
        }
      },
    });
  }

  async getAllOrders(user: ICredential) {
    return this.prisma.order.findMany({
      where: {
        userId: user.userId 
      }
    })
  }
}
