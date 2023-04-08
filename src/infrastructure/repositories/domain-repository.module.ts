import { Module } from "@nestjs/common";
import { PRESENTATION_SLIDE_REPO_TOKEN, PresentationSlideRepository } from "./presentation-slide.repository";
import {
    PRESENTATION_VOTING_CODE_REPO_TOKEN,
    PresentationVotingCodeRepository,
} from "./presentation-voting-code.repository";
import { PRESENTATION_REPO_TOKEN, PresentationRepository } from "./presentation.repository";
import { SLIDE_CHOICE_REPO_TOKEN, SlideChoiceRepository } from "./slide-choice.repository";
import { SLIDE_VOTING_RESULT_REPO_TOKEN, SlideVotingResultRepository } from "./slide-voting-result.repository";

@Module({
    providers: [
        { provide: PRESENTATION_REPO_TOKEN, useClass: PresentationRepository },
        { provide: PRESENTATION_SLIDE_REPO_TOKEN, useClass: PresentationSlideRepository },
        { provide: PRESENTATION_VOTING_CODE_REPO_TOKEN, useClass: PresentationVotingCodeRepository },
        { provide: SLIDE_CHOICE_REPO_TOKEN, useClass: SlideChoiceRepository },
        { provide: SLIDE_VOTING_RESULT_REPO_TOKEN, useClass: SlideVotingResultRepository },
    ],
    exports: [
        { provide: PRESENTATION_REPO_TOKEN, useClass: PresentationRepository },
        { provide: PRESENTATION_SLIDE_REPO_TOKEN, useClass: PresentationSlideRepository },
        { provide: PRESENTATION_VOTING_CODE_REPO_TOKEN, useClass: PresentationVotingCodeRepository },
        { provide: SLIDE_CHOICE_REPO_TOKEN, useClass: SlideChoiceRepository },
        { provide: SLIDE_VOTING_RESULT_REPO_TOKEN, useClass: SlideChoiceRepository },
    ],
})
export class DomainRepositoryModule {}
