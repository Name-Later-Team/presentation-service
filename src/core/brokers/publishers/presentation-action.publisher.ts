import { PublishPresentActionMessageDto } from "../../dtos";

export interface IPresentationActionPublisher {
    publishPresentActionAsync(message: PublishPresentActionMessageDto): Promise<void>;
}
