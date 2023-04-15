export interface AudienceFindOnePresentationByCodeDto {
    code: string;
}

export interface AudienceFindOnePresentationSlideDto {
    presentationIdentifier: string;
    slideId: number;
}

export interface AudienceVoteOnPresentationSlideDto {
    userId: string;
    choiceIds: number[];
}
