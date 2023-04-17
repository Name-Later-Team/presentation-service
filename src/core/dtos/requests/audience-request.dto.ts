export interface AudienceFindOnePresentationByCodeDto {
    code: string;
}

export interface AudienceFindOnePresentationSlideDto {
    presentationIdentifier: string;
    slideId: number;
}

export interface AudienceVoteOnPresentationSlideDto {
    userId: string;
    type: string;
    /**
     * @description
     * - List of option id (multiple choice)
     * - List of reaction id (reaction choice)
     * - List of option id (ranking)
     */
    choiceIds: number[];
}
