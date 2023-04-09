import { PresentationSlide } from "src/core/entities";

export type FindOnePresentatonSlideResponseDto = PresentationSlide & {
    results?: {
        respondents: number;
        results: any;
    };
};

export interface GetVotingResultsResponseDto {
    respondents: number;
    results: any;
    slideId: number;
}
