import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { Logger } from "@nestjs/common";

export abstract class GenericAmqpPublisher {
    protected _logger: Logger;

    constructor(
        protected readonly _amqpConnection: AmqpConnection,
        protected readonly _exchangeName: string,
        protected readonly _topic: string,
    ) {
        this._logger = new Logger(this.constructor.name);
    }

    protected _publish<TData = any>(data: TData) {
        return this._amqpConnection.publish(this._exchangeName, this._topic, data);
    }
}
