import { Inject, Injectable } from "@nestjs/common";
import {
    PRESENTATION_REPO_TOKEN,
    PRESENTATION_SLIDE_REPO_TOKEN,
    PRESENTATION_VOTING_CODE_REPO_TOKEN,
    SLIDE_CHOICE_REPO_TOKEN,
    SLIDE_VOTING_RESULT_REPO_TOKEN,
} from "../repositories";
import {
    IPresentationRepository,
    IPresentationSlideRepository,
    IPresentationVotingCodeRepository,
    ISlideChoiceRepository,
    ISlideVotingResultRepository,
} from "../repositories/interfaces";
import { In, Not, Raw } from "typeorm";
import { ForbiddenRequestException, SimpleBadRequestException } from "src/common/exceptions";
import { PRESENTATION_SLIDE_EXTRAS_CONFIG_PATHS, RESPONSE_CODE } from "src/common/constants";
import { PresentationPaceStateEnum, PresentationSlideTypeEnum } from "src/core/types";
import * as _ from "lodash";
import { SlideVotingResult } from "src/core/entities";

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
        @Inject(SLIDE_CHOICE_REPO_TOKEN)
        private readonly _slideChoiceRepository: ISlideChoiceRepository,
        @Inject(SLIDE_VOTING_RESULT_REPO_TOKEN)
        private readonly _slideVotingResultRepository: ISlideVotingResultRepository,
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
            throw new ForbiddenRequestException(RESPONSE_CODE.JOIN_IDLE_PRESENTATION);
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

    async findOnePresentationSlideById(presentationIdentifier: string, slideId: number) {
        const presentation = await this._presentationRepository.findOnePresentation({
            where: { identifier: presentationIdentifier },
            select: {
                id: true,
                pace: {
                    active_slide_id: true,
                    counter: true,
                    mode: true,
                    state: true,
                },
            },
        });

        if (!presentation) {
            throw new SimpleBadRequestException(RESPONSE_CODE.PRESENTATION_NOT_FOUND);
        } else if (presentation.pace.state === PresentationPaceStateEnum.IDLE) {
            throw new ForbiddenRequestException(RESPONSE_CODE.JOIN_IDLE_PRESENTATION);
        } else if (presentation.pace.active_slide_id !== slideId) {
            throw new ForbiddenRequestException(RESPONSE_CODE.GET_IDLE_SLIDE);
        }

        const presentationId = presentation.id;
        const slide = await this._presentationSlideRepository.findOnePresentationSlideAsync({
            where: {
                presentationId,
                id: slideId,
            },
            select: {
                id: true,
                presentationIdentifier: true,
                question: true,
                questionDescription: true,
                questionImageUrl: true,
                questionVideoEmbedUrl: true,
                slideType: true,
                speakerNotes: true,
                isActive: true,
                showResult: true,
                hideInstructionBar: true,
                extrasConfig: true,
                position: true,
                textSize: true,
            },
        });

        if (!slide) {
            throw new SimpleBadRequestException(RESPONSE_CODE.SLIDE_NOT_FOUND);
        }

        const slideChoices = await this._slideChoiceRepository.findManySlideChoicesAsync({
            where: { slideId },
            select: {
                id: true,
                label: true,
                position: true,
                type: true,
                isCorrectAnswer: true,
                metadata: true,
            },
            order: { position: "ASC" },
        });

        return { ...slide, choices: slideChoices };
    }

    async voteOnPresentationSlideAsync(
        userId: string,
        presentationIdentifier: string,
        slideId: number,
        choiceIds: number[],
    ) {
        const presentation = await this._presentationRepository.findOnePresentation({
            where: { identifier: presentationIdentifier },
            select: {
                id: true,
                pace: {
                    active_slide_id: true,
                    mode: true,
                    state: true,
                },
            },
        });

        if (!presentation) {
            throw new SimpleBadRequestException(RESPONSE_CODE.PRESENTATION_NOT_FOUND);
        } else if (presentation.pace.state === PresentationPaceStateEnum.IDLE) {
            throw new ForbiddenRequestException(RESPONSE_CODE.JOIN_IDLE_PRESENTATION);
        } else if (presentation.pace.active_slide_id !== slideId) {
            throw new ForbiddenRequestException(RESPONSE_CODE.GET_IDLE_SLIDE);
        } else if (presentation.closedForVoting) {
            throw new ForbiddenRequestException(RESPONSE_CODE.DISABLED_VOTING);
        }

        const presentationId = presentation.id;
        const slide = await this._presentationSlideRepository.findOnePresentationSlideAsync({
            where: {
                presentationId,
                id: slideId,
            },
            select: {
                slideType: true,
                isActive: true,
                extrasConfig: true,
                sessionNo: true,
            },
        });

        if (!slide) {
            throw new SimpleBadRequestException(RESPONSE_CODE.SLIDE_NOT_FOUND);
        } else if (!slide.isActive || slide.slideType !== PresentationSlideTypeEnum.MULTIPLE_CHOICE) {
            throw new ForbiddenRequestException(RESPONSE_CODE.DISABLED_VOTING);
        }

        const parsedExtrasConfig = JSON.parse(slide.extrasConfig ?? "{}");
        const propertyPath = PRESENTATION_SLIDE_EXTRAS_CONFIG_PATHS.ENABLE_MULTIPLE_ANSWERS;
        const isEnabledMultipleAnswers = Boolean(_.get(parsedExtrasConfig, propertyPath, false)).valueOf();

        if (!isEnabledMultipleAnswers && choiceIds.length !== 1) {
            throw new ForbiddenRequestException(RESPONSE_CODE.DISABLED_MULTIPLE_ANSWERS);
        }

        // Check: `choiceIds` contains any choice which doesn't belong to the given slide
        const notBelongToChoicesCount = await this._slideChoiceRepository.countSlideChoicesAsync({
            slideId,
            id: In(choiceIds),
        });
        if (notBelongToChoicesCount === choiceIds.length) {
            throw new SimpleBadRequestException(RESPONSE_CODE.CHOICE_NOT_FOUND);
        }

        // insert multiple values (transaction is enabled by default)
        const votingResults: Array<Partial<SlideVotingResult>> = choiceIds.map((choiceId) => {
            return {
                slideId,
                userIdentifier: userId,
                userDisplayName: "",
                choiceId,
                presentNo: slide.sessionNo,
            };
        });
        await this._slideVotingResultRepository.createMultipleVotingResultsAsync(votingResults);
    }
}
