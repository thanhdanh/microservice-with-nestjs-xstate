import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    AuthModule,
    OrderModule,
    UserModule,
    EventEmitterModule.forRoot(),
  ],
})
export class AppModule {}
