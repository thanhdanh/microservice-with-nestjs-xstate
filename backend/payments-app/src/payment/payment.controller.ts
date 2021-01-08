import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { MessagesRequestResponse } from 'src/constants';
import { OrderTriggerPayDto } from './dto/order.dto';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) {}

    @MessagePattern(MessagesRequestResponse.initPayment)
    initProcessPayment(order: OrderTriggerPayDto) {
        return this.paymentService.initProcessPayment(order);
    }
}