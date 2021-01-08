import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    OrderModule,
    EventEmitterModule.forRoot(),
  ],
})
export class AppModule {}
