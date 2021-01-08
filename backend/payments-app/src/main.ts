import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Payment Main');
  
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.REDIS,
    options: {
      url: process.env.REDIS_URL,
      retryDelay: 1000,
      retryAttempts: 5,
    },
  });

  await app.listenAsync().then(() => { logger.log('Payment app microservice is listening...') });  
}

bootstrap();
