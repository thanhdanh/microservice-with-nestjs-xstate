import { WebSocketGateway, WebSocketServer, OnGatewayInit } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server } from 'socket.io';
import { Order } from '@prisma/client';

@WebSocketGateway()
export class OrderGateway implements OnGatewayInit {
    private readonly logger = new Logger('OrderGateway');
    
    @WebSocketServer()
    wss: Server;

    afterInit() {
        this.wss.on('connection', () => {
            this.logger.debug('A user connected');
        });
    }

    newOrderAdded(payload: Order): void {
        this.wss.emit('order.new', payload);
    }

    orderStatusUpdated(payload: Order): void {
        this.wss.emit('order.status.changed', payload);
    }
}