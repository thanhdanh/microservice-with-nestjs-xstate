import { Injectable, Logger } from '@nestjs/common';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { TransactionStatus } from 'src/constants';
import { OrderTriggerPayDto } from './dto/order.dto';
import { TransactionDetailDto } from './dto/tx-detail.dto';

@Injectable()
export class PaymentService {
    private readonly logger = new Logger('Payment Service');

    @Client({
        transport: Transport.REDIS,
        options: { url: process.env.REDIS_URL }
    })
    client: ClientProxy;

    async initProcessPayment(order: OrderTriggerPayDto): Promise<TransactionDetailDto> {
        this.logger.log('-> Trigger new payment processs');

        const newTx = this.generateNewTransaction(order);
        if (await this.validatePayment()) {
            newTx.status = TransactionStatus.CONFIRMED;
        } else {
            newTx.status = TransactionStatus.DECLINED;
        }

        return newTx;
    }

    generateNewTransaction(order: OrderTriggerPayDto) {
        const tx = new TransactionDetailDto();

        tx.orderId = order.id;
        tx.status = TransactionStatus.PENDING;
        tx.totalCost = order.amount * order.price;

        return tx;
    }

    validatePayment(): Promise<boolean> {
        return new Promise(resolve => setTimeout(() => {
            const rand = Math.random();
            this.logger.debug(' -> Rand: ' + rand)
            resolve(rand > 0.4);
        }, 3000))
    }
}