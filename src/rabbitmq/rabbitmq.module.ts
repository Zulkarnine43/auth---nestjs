import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { RabbitmqService } from './rabbitmq.service';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        // {
        //   name: 'shop',
        //   type: 'topic',
        // },
        // {
        //   name: 'product',
        //   type: 'topic',
        // },
        // {
        //   name: 'order',
        //   type: 'topic',
        // },
        // {
        //   name: 'catalog',
        //   type: 'topic',
        // },
        // {
        //   name: 'promotion',
        //   type: 'topic',
        // },
        // {
        //   name: 'bulk-service',
        //   type: 'topic',
        // },
      ],
      uri: process.env.RMQ_URL,
      connectionInitOptions: {
        wait: false,
      },
      enableControllerDiscovery: true,
    }),
  ],
  exports: [RabbitMQModule, RabbitmqService],
  providers: [RabbitmqService],
})
export class RabbitmqModule {}
