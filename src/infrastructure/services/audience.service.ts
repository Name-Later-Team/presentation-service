import { Inject, Injectable, Logger } from "@nestjs/common";
import * as _ from "lodash";
import { PRESENTATION_SLIDE_EXTRAS_CONFIG_PATHS, RESPONSE_CODE } from "src/common/constants";
import { ForbiddenRequestException, SimpleBadRequestException } from "src/common/exceptions";
import { IVotingActionPublisher } from "src/core/brokers";
import { PresentationSlide, SlideVotingResult } from "src/core/entities";
import { PresentationPaceStateEnum, PresentationSlideTypeEnum, VotingAnswerTypeEnum } from "src/core/types";
import { In, Raw } from "typeorm";
import { VOTING_ACTION_PUB_TOKEN } from "../brokers/publishers";
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

        @Inject(VOTING_ACTION_PUB_TOKEN) private readonly _votingActionPublisher: IVotingActionPublisher,
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
            select: { id: true, identifier: true, pace: { active_slide_id: true, mode: true, state: true } },
        });

        if (!presentation) {
            throw new SimpleBadRequestException(RESPONSE_CODE.PRESENTATION_NOT_FOUND);
        }

        // check presentation enable voting first
        if (presentation.closedForVoting) {
            throw new ForbiddenRequestException(RESPONSE_CODE.DISABLED_PRESENTATION_VOTING);
        }

        // cannot vote on idle presentation
        if (presentation.pace.state === PresentationPaceStateEnum.IDLE) {
            throw new ForbiddenRequestException(RESPONSE_CODE.JOIN_IDLE_PRESENTATION);
        }

        // current solution: only allow voting on active slide - managed by presenter
        if (presentation.pace.active_slide_id !== slideId) {
            throw new ForbiddenRequestException(RESPONSE_CODE.GET_IDLE_SLIDE);
        }

        const slide = await this._presentationSlideRepository.findOnePresentationSlideAsync({
            where: { presentationId: presentation.id, id: slideId },
            select: {
                id: true,
                slideType: true,
                isActive: true,
                extrasConfig: true,
                sessionNo: true,
                presentationIdentifier: true,
            },
        });

        if (!slide) {
            throw new SimpleBadRequestException(RESPONSE_CODE.SLIDE_NOT_FOUND);
        }

        // If slide is active -> is enabled for voting on it.
        if (!slide.isActive) {
            throw new ForbiddenRequestException(RESPONSE_CODE.DISABLED_SLIDE_VOTING);
        }

        // proces voting flow for specific slide type
        // * 1. Multiple choice
        if (slide.slideType === PresentationSlideTypeEnum.MULTIPLE_CHOICE) {
            await this._processVotingOnMultipleChoiceWorkflowAsync(slide, choiceIds, userId);
            return;
        }

        // * 2. Reaction
        const allowReactionSlides = [
            PresentationSlideTypeEnum.HEADING.valueOf(),
            PresentationSlideTypeEnum.PARAGRAPH.valueOf(),
        ];

        if (allowReactionSlides.includes(slide.slideType)) {
            await this._processReactionTypeWorkflowAsync();
            return;
        }
    }

    private async _processVotingOnMultipleChoiceWorkflowAsync(
        slide: Pick<PresentationSlide, "id" | "extrasConfig" | "sessionNo" | "presentationIdentifier">,
        choiceIdList: number[],
        userId: string,
    ) {
        // stop voting process if current user voted on this slide
        const isUserVoted = await this._slideVotingResultRepository.existsByAsync({
            where: { userIdentifier: userId, slideId: slide.id, presentNo: slide.sessionNo },
        });

        if (isUserVoted) {
            throw new ForbiddenRequestException(RESPONSE_CODE.DISABLE_VOTING_SAME_SESSION);
        }

        const parsedExtrasConfig = JSON.parse(slide.extrasConfig ?? "{}");

        const propertyPath = PRESENTATION_SLIDE_EXTRAS_CONFIG_PATHS.ENABLE_MULTIPLE_ANSWERS;
        const isEnabledMultipleAnswers = Boolean(_.get(parsedExtrasConfig, propertyPath, false)).valueOf();

        if (!isEnabledMultipleAnswers && choiceIdList.length !== 1) {
            throw new ForbiddenRequestException(RESPONSE_CODE.DISABLED_MULTIPLE_ANSWERS);
        }

        // Check: `choiceIds` contains any choice which doesn't belong to the given slide
        const validChoiceCount = await this._slideChoiceRepository.countSlideChoicesAsync({
            slideId: slide.id,
            id: In(choiceIdList),
        });

        if (validChoiceCount !== choiceIdList.length) {
            throw new SimpleBadRequestException(RESPONSE_CODE.CHOICE_NOT_FOUND);
        }

        // insert multiple values (transaction is enabled by default)
        const votingResults: Array<Partial<SlideVotingResult>> = choiceIdList.map((choiceId) => {
            return {
                slideId: slide.id,
                userIdentifier: userId,
                userDisplayName: "",
                choiceId,
                presentNo: slide.sessionNo,
            };
        });

        await this._slideVotingResultRepository.createMultipleVotingResultsAsync(votingResults);

        // get the result to send back to client
        Promise.all([
            this._slideChoiceRepository.getChoiceWithResultAsync(slide.id, slide.sessionNo),
            this._slideVotingResultRepository.countTotalRespondentsAsync(slide.id, slide.sessionNo),
        ])
            .then((res) => {
                const [newResult, respondents] = res;

                const resultToSend = newResult.map(({ id, label, score }) => {
                    return { id, label, score: [parseInt(score)] };
                });
                const respondentsToSend = parseInt(_.get(respondents, "[0].respondents", "0"));

                // *SOCKET: publish voting result message to queue
                this._votingActionPublisher.publishVotingAsync({
                    roomId: slide.presentationIdentifier,
                    eventName: "audience_vote",
                    payload: {
                        respondents: respondentsToSend,
                        results: resultToSend,
                    },
                });
            })
            .catch((error) => {
                // error when select result back
                // do not send message
                Logger.error(error, this.constructor.name);
            });
    }

    // TODO: add logic for adding reaction to slide
    private async _processReactionTypeWorkflowAsync() {}
}
