import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RabbitmqService {
  constructor(private readonly amqpConnection: AmqpConnection) { }

  async publish(
    exchange: string,
    routingKey: string,
    msg: object,
    options?: object,
  ) {
    this.amqpConnection.publish(exchange, routingKey, msg, options);
  }

  async request(
    exchange: string,
    routingKey: string,
    payload: object,
    timeout: number,
  ) {
    const response = await this.amqpConnection.request({
      exchange: exchange,
      routingKey: routingKey,
      payload: payload,
      timeout: timeout, // optional timeout for how long the request
      // should wait before failing if no response is received
    });

    return response;
  }
}
