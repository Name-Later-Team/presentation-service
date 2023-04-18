import { PresentationPace } from "src/core/entities";

type BasePublishMessageDto<T> = {
    roomId: string;
    eventName: string;
    payload: T;
};

export type PublishPresentActionMessageDto = BasePublishMessageDto<{
    presentationIdentifier: string;
    pace?: Omit<PresentationPace, "counter">;
}>;

export type PublishVotingMessageDto = BasePublishMessageDto<{
    respondents: number;
    results: Array<{ id: number; label: string; score: number[] }>;
    slideId: number,
}>;
