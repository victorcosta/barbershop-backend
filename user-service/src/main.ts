import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: parseInt(process.env.MICROSERVICE_PORT, 10),
    },
  });
  await app.startAllMicroservices();
  await app.listen(parseInt(process.env.PORT, 10));
}
bootstrap();
