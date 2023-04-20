import { PublishVotingMessageDto } from "../../dtos";

export interface IVotingActionPublisher {
    publishVotingAsync(message: PublishVotingMessageDto): Promise<void>;
}
