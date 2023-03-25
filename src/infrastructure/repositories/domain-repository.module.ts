import { Module } from "@nestjs/common";
import { PresentationSlideRepository, PRESENTATION_SLIDE_REPO_TOKEN } from "./presentation-slide.repository";
import {
    PresentationVotingCodeRepository,
    PRESENTATION_VOTING_CODE_REPO_TOKEN,
} from "./presentation-voting-code.repository";
import { PresentationRepository, PRESENTATION_REPO_TOKEN } from "./presentation.repository";
import { SlideChoiceRepository, SLIDE_CHOICE_REPO_TOKEN } from "./slide-choice.repository";

@Module({
    providers: [
        { provide: PRESENTATION_REPO_TOKEN, useClass: PresentationRepository },
        { provide: PRESENTATION_SLIDE_REPO_TOKEN, useClass: PresentationSlideRepository },
        { provide: PRESENTATION_VOTING_CODE_REPO_TOKEN, useClass: PresentationVotingCodeRepository },
        { provide: SLIDE_CHOICE_REPO_TOKEN, useClass: SlideChoiceRepository },
    ],
    exports: [
        { provide: PRESENTATION_REPO_TOKEN, useClass: PresentationRepository },
        { provide: PRESENTATION_SLIDE_REPO_TOKEN, useClass: PresentationSlideRepository },
        { provide: PRESENTATION_VOTING_CODE_REPO_TOKEN, useClass: PresentationVotingCodeRepository },
        { provide: SLIDE_CHOICE_REPO_TOKEN, useClass: SlideChoiceRepository },
    ],
})
export class DomainRepositoryModule {}
