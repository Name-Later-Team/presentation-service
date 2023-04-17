import { RabbitMQModule } from "@golevelup/nestjs-rabbitmq";
import { Logger, Module } from "@nestjs/common";
import { MESSAGE_BROKER_CONFIG } from "../configs";
import {
    PRESENTATION_ACTION_PUB_TOKEN,
    PresentationActionPublisher,
    VOTING_ACTION_PUB_TOKEN,
    VotingActionPublisher,
} from "./publishers";

/**
 * @description Defines all message brokers connector that used by app
 */
@Module({
    imports: [
        /**
         * - Rabbitmq connector
         * - Ref: https://www.npmjs.com/package/@golevelup/nestjs-rabbitmq
         */
        RabbitMQModule.forRoot(RabbitMQModule, {
            uri: MESSAGE_BROKER_CONFIG.rabbitmq.uri,
            connectionInitOptions: { wait: false },
            exchanges: [
                {
                    name: MESSAGE_BROKER_CONFIG.rabbitmq.exchange.name,
                    type: MESSAGE_BROKER_CONFIG.rabbitmq.exchange.type,
                    options: { durable: MESSAGE_BROKER_CONFIG.rabbitmq.exchange.isDurable },
                    createExchangeIfNotExists: true,
                },
            ],
            logger: Logger, // bind app logger
        }),
    ],
    providers: [
        { provide: PRESENTATION_ACTION_PUB_TOKEN, useClass: PresentationActionPublisher },
        { provide: VOTING_ACTION_PUB_TOKEN, useClass: VotingActionPublisher },
    ],
    exports: [
        { provide: PRESENTATION_ACTION_PUB_TOKEN, useClass: PresentationActionPublisher },
        { provide: VOTING_ACTION_PUB_TOKEN, useClass: VotingActionPublisher },
    ],
})
export class BrokerModule {}
