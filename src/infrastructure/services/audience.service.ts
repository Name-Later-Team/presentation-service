import { Inject, Injectable } from "@nestjs/common";
import {
    PRESENTATION_REPO_TOKEN,
    PRESENTATION_SLIDE_REPO_TOKEN,
    PRESENTATION_VOTING_CODE_REPO_TOKEN,
} from "../repositories";
import {
    IPresentationRepository,
    IPresentationSlideRepository,
    IPresentationVotingCodeRepository,
} from "../repositories/interfaces";
import { Raw } from "typeorm";
import { SimpleBadRequestException } from "src/common/exceptions";
import { RESPONSE_CODE } from "src/common/constants";
import { PresentationPaceStateEnum } from "src/core/types";

export const AUDIENCE_SERVICE_TOKEN = Symbol("AudienceService");

@Injectable()
export class AudienceService {
    constructor(
        @Inject(PRESENTATION_REPO_TOKEN)
        private readonly _presentationRepository: IPresentationRepository,
        @Inject(PRESENTATION_SLIDE_REPO_TOKEN)
        private readonly _presentationSlideRepository: IPresentationSlideRepository,
        @Inject(PRESENTATION_VOTING_CODE_REPO_TOKEN)
        private readonly _presentationVotingCodeRepo: IPresentationVotingCodeRepository,
    ) {}

    findOnePresentationVotingCodeByVotingCodeAsync(votingCode: string) {
        return this._presentationVotingCodeRepo.findOnePresentationVotingCodeAsync({
            where: {
                code: votingCode,
                isValid: true,
                expiresAt: Raw((expiresAt) => `${expiresAt} >= NOW()`),
            },
            order: { id: "DESC" },
        });
    }

    async findOnePresentationAndAllSlidesByIdentifierAsync(identifier: string) {
        const presentation = await this._presentationRepository.findOnePresentation({
            where: { identifier },
            select: {
                name: true,
                identifier: true,
                ownerDisplayName: true,
                pace: {
                    active_slide_id: true,
                    counter: true,
                    mode: true,
                    state: true,
                },
                closedForVoting: true,
                totalSlides: true,
            },
        });

        if (!presentation) {
            throw new SimpleBadRequestException(RESPONSE_CODE.PRESENTATION_NOT_FOUND);
        } else if (presentation.pace.state === PresentationPaceStateEnum.IDLE) {
            throw new SimpleBadRequestException(RESPONSE_CODE.JOIN_IDLE_PRESENTATION);
        }

        const slides = await this._presentationSlideRepository.findManyPresentationSlidesAsync({
            where: { presentationIdentifier: identifier },
            select: {
                id: true,
                slideType: true,
                position: true,
            },
            order: { position: "ASC" },
        });

        return { ...presentation, slides };
    }
}
