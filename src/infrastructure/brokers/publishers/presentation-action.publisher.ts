import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { Injectable } from "@nestjs/common";
import * as _ from "lodash";
import { IPresentationActionPublisher } from "src/core/brokers";
import { PublishPresentActionMessageDto } from "src/core/dtos";
import { PresentPresentationActionEnum } from "src/core/types";
import { MESSAGE_BROKER_CONFIG } from "../../configs";
import { GenericAmqpPublisher } from "./generic-amqp.publisher";

export const PRESENTATION_ACTION_PUB_TOKEN = Symbol("PresentationActionPublisher");

@Injectable()
export class PresentationActionPublisher extends GenericAmqpPublisher implements IPresentationActionPublisher {
    constructor(_connection: AmqpConnection) {
        super(
            _connection,
            MESSAGE_BROKER_CONFIG.rabbitmq.exchange.name,
            MESSAGE_BROKER_CONFIG.rabbitmq.topics.actionTopic,
        );
    }

    async publishPresentActionAsync(message: PublishPresentActionMessageDto): Promise<void> {
        try {
            this._logger.log("------- Publising message for presentation action - Start");

            const messageToSend = _.cloneDeep(message);
            switch (message.eventName) {
                case PresentPresentationActionEnum.PRESENT:
                case PresentPresentationActionEnum.CHANGE_SLIDE:
                    break;
                case PresentPresentationActionEnum.QUIT: {
                    delete messageToSend.payload.pace;
                    break;
                }
            }

            await this._publish(messageToSend);
            this._logger.log("------- Publising message for presentation action - OK");
        } catch (error) {
            this._logger.log("------- Publising message for presentation action - Failed");
            this._logger.error(error);
        }
    }
}
