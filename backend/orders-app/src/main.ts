import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

const logger = new Logger('Main');

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.REDIS,
    options: {
      url: process.env.REDIS_URL,
      // port: 3000,
    },
  });

  await app.listenAsync().then(() => { logger.log('Order app microservice is listening...') });
}

bootstrap();
