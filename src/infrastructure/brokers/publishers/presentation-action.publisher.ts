import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { Injectable } from "@nestjs/common";
import { GenericAmqpPublisher } from "./generic-amqp.publisher";
import { IPresentationActionPublisher } from "src/core/brokers";
import { MESSAGE_BROKER_CONFIG } from "src/infrastructure/configs";

export const PRESENTATION_ACTION_PUB_TOKEN = Symbol("PresentationActionPublisher");

@Injectable()
export class PresentationActionPublisher extends GenericAmqpPublisher implements IPresentationActionPublisher {
    constructor(_connection: AmqpConnection) {
        super(_connection, MESSAGE_BROKER_CONFIG.rabbitmq.exchange.name, "test_topic");
    }

    publish<TData = any>(data: TData) {
        return this._publish(data);
    }
}
