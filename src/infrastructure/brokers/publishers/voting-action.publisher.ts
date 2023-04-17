import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { Injectable } from "@nestjs/common";
import * as _ from "lodash";
import { IVotingActionPublisher } from "src/core/brokers";
import { PublishVotingMessageDto } from "src/core/dtos";
import { MESSAGE_BROKER_CONFIG } from "../../configs";
import { GenericAmqpPublisher } from "./generic-amqp.publisher";

export const VOTING_ACTION_PUB_TOKEN = Symbol("VotingActionPublisher");

@Injectable()
export class VotingActionPublisher extends GenericAmqpPublisher implements IVotingActionPublisher {
    constructor(_connection: AmqpConnection) {
        super(
            _connection,
            MESSAGE_BROKER_CONFIG.rabbitmq.exchange.name,
            MESSAGE_BROKER_CONFIG.rabbitmq.topics.votingTopic,
        );
    }

    async publishVotingAsync(message: PublishVotingMessageDto): Promise<void> {
        try {
            this._logger.log("------- Publising message for voting action - Start");

            await this._publish(message);

            this._logger.log("------- Publising message for voting action - OK");
        } catch (error) {
            this._logger.log("------- Publising message for voting action - Failed");
            this._logger.error(error);
        }
    }
}
