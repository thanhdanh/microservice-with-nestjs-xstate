import { Module } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { OrderController } from './order.controller';
import { OrderGateway } from './order.gateway';
import { OrderService } from './order.service';

@Module({
    controllers: [OrderController],
    providers: [
        OrderService,
        PrismaService,
        OrderGateway
    ]
})
export class OrderModule { }