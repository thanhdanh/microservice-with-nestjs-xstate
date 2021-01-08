import { ForbiddenException, Injectable, Logger, NotFoundException, NotImplementedException } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { Order, OrderStatus, Prisma } from '@prisma/client';
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

  async findById(orderId: number, user: ICredential): Promise<Order>  {
    const order = await this.prisma.order.findUnique({
      where: {
        id: orderId,
      }
    })

    if (!order) throw new NotFoundException('Order not exist');
    if (order.userId !== user.userId) throw new ForbiddenException();
    return order;
  }

  async getStatusOfOrderById(orderId: number, user: ICredential) {
    const order = await this.findById(orderId, user);
    return order.status;
  }

  async cancelOrder(orderId: number, user: ICredential): Promise<Order>  {
    const order = await this.findById(orderId, user);
    if (order.status === OrderStatus.Cancelled || order.status === OrderStatus.Confirmed) {
      throw new NotImplementedException('Not allow cancel with current status')
    }

    const newOrder = await this.prisma.order.update({
      where: {
        id: orderId
      },
      data: {
        status: OrderStatus.Cancelled
      }
    })

    return newOrder;
  }

  async deliveryOrder(orderId: number) {
    const order = await this.prisma.order.findUnique({
      where: {
        id: orderId,
      }
    })

    if (order.status !== OrderStatus.Confirmed) {
      throw new NotImplementedException('Not allow deliver with current status') 
    }

    const newOrder = await this.prisma.order.update({
      where: {
        id: orderId
      },
      data: {
        status: OrderStatus.Delivered
      }
    })

    return newOrder;
  }
}
