import { ForbiddenException, HttpException, HttpStatus, Injectable, Logger, NotFoundException, NotImplementedException } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { Order, OrderStatus, Prisma } from '@prisma/client';
import { ICredential } from 'src/auth/constants';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { DELIVERY_TIME, InternalEvents, MessagesTransport, REQUEST_TIMEOUT, TransactionStatus } from '../constants';
import { filter, takeUntil, timeout } from 'rxjs/operators';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { TransactionDetailDto } from './dto/tx-detail.dto';
import { Subject, timer } from "rxjs";
import { OrderGateway } from './order.gateway';

@Injectable()
export class OrderService {
  private readonly logger = new Logger('OrderService');
  private readonly cancelOrder$ = new Subject();

  @Client({
    transport: Transport.REDIS,
    options: { url: process.env.REDIS_URL }
  })
  client: ClientProxy;

  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
    private readonly webSocket: OrderGateway
  ) {}
  
  /**
   * Create new order
   * @param data {Object}
   */
  async createNewOrder(data: Prisma.OrderCreateInput, user: ICredential): Promise<Order> {
    const newOrder = await this.prisma.order.create({
      data: {
        ...data,
        user: {
          connect: {
            id: user.userId
          }
        }
      },
    });

    this.eventEmitter.emit(InternalEvents.ORDER_CREATED, newOrder.id);
    this.webSocket.newOrderAdded(newOrder);
    return newOrder;
  }

  async getAllOrders(user: ICredential) {
    return this.prisma.order.findMany({
      where: {
        userId: user.userId 
      },
      orderBy: {
        createdAt: 'desc',
      }
    })
  }

  async findById(orderId: number, user: ICredential): Promise<Order>  {
    const order = await this.prisma.order.findUnique({
      where: {
        id: +orderId,
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
    if (order.status === OrderStatus.Canceled || order.status === OrderStatus.Confirmed) {
      throw new NotImplementedException('Not allow cancel with current status')
    }

    const newOrder = await this.prisma.order.update({
      where: {
        id: +orderId
      },
      data: {
        status: OrderStatus.Canceled
      }
    })

    this.cancelOrder$.next(+orderId)
    this.logger.debug('Canceled order ' + orderId);
    this.webSocket.orderStatusUpdated(newOrder);

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

    setTimeout(async () => {
      const newOrder = await this.prisma.order.update({
        where: {
          id: +orderId
        },
        data: {
          status: OrderStatus.Delivered
        }
      })
      this.webSocket.orderStatusUpdated(newOrder);
    }, DELIVERY_TIME)
  }

  async triggerNewPaymentProcess(orderId: number) {
    const order = await this.prisma.order.findUnique({
      where: {
        id: +orderId,
      }
    });

    if (!order || order.status !== OrderStatus.Created) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Invalid order',
      }, HttpStatus.BAD_REQUEST);
    }

    this.client
      .send(
        MessagesTransport.initPayment, {
          id: orderId,
          amount: order.amount,
          price: order.price,
        })
      .pipe(timeout(REQUEST_TIMEOUT))
      .subscribe(this.updateOrderAfterProcessPayment.bind(this));
  }

  async updateOrderAfterProcessPayment(paymentTxDetail: TransactionDetailDto): Promise<Order> {
    const { orderId } = paymentTxDetail;
    
    this.logger.debug('Payment status ' + paymentTxDetail.status)

    const order = await this.prisma.order.findUnique({
      where: {
        id: orderId,
      }
    });

    if (!order || order.status !== OrderStatus.Created) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Invalid order',
      }, HttpStatus.BAD_REQUEST);
    }

    let isSuccess = false;
    const data = {
      txId: paymentTxDetail.txId,
      status: <OrderStatus>OrderStatus.Canceled,
    }

    if (paymentTxDetail.status === TransactionStatus.CONFIRMED) {
      data.status = <OrderStatus>OrderStatus.Confirmed;
      isSuccess = true;
    }

    const updatedOrder = await this.prisma.order.update({
      data,
      where: {
        id: +orderId,
      }
    })

    this.logger.debug('After payment ' + updatedOrder.status);
    this.eventEmitter.emit(isSuccess ? InternalEvents.ORDER_CONFIRMED : InternalEvents.ORDER_CANCELED, updatedOrder.id);
    this.webSocket.orderStatusUpdated(updatedOrder);

    return updatedOrder;
  }

  async getStatistic(user: ICredential) {
    const statuses = Object.keys(OrderStatus);
    const promises = statuses.map(status => this.prisma.order.count({
      where: {
        userId: user.userId,
        status: OrderStatus[status],
      }
    }));

    const result = await Promise.all(promises);
    const total = result.reduce((prevValue, value) => value + prevValue, 0);
    const obj = {
      total,
    }

    result.forEach((value, index) => {
      obj[statuses[index]] = value;
    }) 

    return obj;
  }

  @OnEvent(InternalEvents.ORDER_CREATED)
  handleOrderCreated(orderId: number) {
    this.logger.log('Have new order ' + orderId)
    return timer(10000).pipe(
      takeUntil(this.cancelOrder$.pipe(filter(val => val === +orderId))),
    ).subscribe(() => this.triggerNewPaymentProcess(orderId));
  }

  @OnEvent(InternalEvents.ORDER_CONFIRMED)
  handleOrderConfirmed(orderId: number) {
    return this.deliveryOrder(orderId)
  }
}
