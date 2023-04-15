import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";

export abstract class GenericAmqpPublisher {
    constructor(
        protected readonly _amqpConnection: AmqpConnection,
        protected readonly _exchangeName: string,
        protected readonly _topic: string,
    ) {}

    protected _publish<TData = any>(data: TData) {
        return this._amqpConnection.publish(this._exchangeName, this._topic, data);
    }
}
