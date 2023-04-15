import { Inject, Logger } from "@nestjs/common";
import { Injectable } from "@nestjs/common/decorators";
import * as _ from "lodash";
import { RESPONSE_CODE } from "src/common/constants";
import { SimpleBadRequestException } from "src/common/exceptions";
import { PresentationGenerator } from "src/common/utils/generators";
import { EditPresentationSlideDto } from "src/core/dtos";
import { Presentation, PresentationSlide, SlideChoice } from "src/core/entities";
import { BaseService } from "src/core/services";
import { In, Not } from "typeorm";
import {
    PRESENTATION_REPO_TOKEN,
    PRESENTATION_SLIDE_REPO_TOKEN,
    SLIDE_CHOICE_REPO_TOKEN,
    SLIDE_VOTING_RESULT_REPO_TOKEN,
} from "../repositories";
import {
    IPresentationRepository,
    IPresentationSlideRepository,
    ISlideChoiceRepository,
    ISlideVotingResultRepository,
} from "../repositories/interfaces";
import { PresentationPaceStateEnum, PresentationSlideTypeEnum } from "src/core/types";
import { Common } from "src/common/utils";

export const PRESENTATION_SLIDE_SERVICE_TOKEN = Symbol("PresentationSlideService");

@Injectable()
export class PresentationSlideService extends BaseService<PresentationSlide> {
    constructor(
        @Inject(PRESENTATION_REPO_TOKEN)
        private readonly _presentationRepository: IPresentationRepository,
        @Inject(PRESENTATION_SLIDE_REPO_TOKEN)
        private readonly _presentationSlideRepository: IPresentationSlideRepository,
        @Inject(SLIDE_CHOICE_REPO_TOKEN)
        private readonly _slideChoiceRepository: ISlideChoiceRepository,
        @Inject(SLIDE_VOTING_RESULT_REPO_TOKEN)
        private readonly _slideVotingResultRepository: ISlideVotingResultRepository,
    ) {
        super(_presentationSlideRepository);
    }

    async createSlideAsync(presentation: Presentation, slideType: PresentationSlideTypeEnum) {
        const {
            id: presentationId,
            identifier: presentationIdentifier,
            totalSlides: currentTotalSlids,
            pace: currentPace,
        } = presentation;

        // Create slide
        const createdSlide = await this._presentationSlideRepository.saveRecordAsync({
            presentationId: presentationId,
            presentationIdentifier: presentationIdentifier,
            question: "Default question",
            slideType,
            position: currentTotalSlids,
        });

        Logger.debug(JSON.stringify(createdSlide), this.constructor.name);

        const presentationDataToUpdate: Partial<Presentation> = {
            totalSlides: currentTotalSlids + 1,
        };

        // If this is the first slide, it will be set to presented slide
        if (currentTotalSlids === 0) {
            presentationDataToUpdate.pace = {
                ...currentPace,
                active_slide_id: createdSlide.id,
            };
        }

        // Update presentation to link the first slide information
        await this._presentationRepository.updateRecordByIdAsync(presentationId, presentationDataToUpdate);

        if (slideType === PresentationSlideTypeEnum.MULTIPLE_CHOICE) {
            // Create default slide choices: 1 option
            const optionList = PresentationGenerator.generateMultipleChoiceOptions(1, createdSlide.id);
            await this._slideChoiceRepository.saveManyRecordAsync(optionList);
        }

        return createdSlide;
    }

    async findOnePresentationSlideAsync(slideId: number, includeChoices = true) {
        const slide = await this._presentationSlideRepository.getRecordByIdAsync(slideId);
        if (!slide) {
            throw new SimpleBadRequestException(RESPONSE_CODE.SLIDE_NOT_FOUND);
        }

        if (includeChoices) {
            const choices = await this._slideChoiceRepository.findManySlideChoicesAsync({
                select: {
                    id: true,
                    label: true,
                    position: true,
                    type: true,
                    isCorrectAnswer: true,
                    metadata: true,
                },
                where: { slideId },
                order: { position: "ASC" },
            });

            return { ...slide, choices };
        }

        return slide;
    }

    async existsByPresentationIdentifierAndSlideIdAsync(
        presentationIdentifier: string | number,
        slideId: number,
        isThrowError = false,
    ) {
        const presentationIdentifierField =
            typeof presentationIdentifier === "number" ? "presentationId" : "presentationIdentifier";
        const numberOfSlides = await this._presentationSlideRepository.countPresentationSlidesAsync({
            id: slideId,
            [presentationIdentifierField]: presentationIdentifier,
        });

        if (isThrowError && numberOfSlides !== 1) {
            throw new SimpleBadRequestException(RESPONSE_CODE.SLIDE_NOT_FOUND);
        }

        return numberOfSlides === 1;
    }

    async getVotingResultsBySlideIdAsync(slideId: number, sessionNo?: number) {
        // ensure that slideId is an integer number and valid serial id
        const safeSlideId = parseInt(slideId.toString());
        if (Number.isNaN(safeSlideId) || safeSlideId < 1) {
            throw new Error("slideId must be an integer number and greater than zero");
        }

        // get all sessions if `sessionNo` is null
        const whereBySessionNo = Common.isNullOrUndefined(sessionNo) ? "" : `svr.present_no = ${sessionNo} AND`;
        const sqlVotingResults = `
        SELECT 
            sc.id AS "id",
            sc.label AS "label", 
            COUNT(svr.id) AS "score"
        FROM "slide_choices" AS sc
            JOIN "slide_voting_results" AS svr
            ON sc.id = svr.choice_id
        WHERE ${whereBySessionNo} sc.slide_id = ${safeSlideId}
        GROUP BY sc.id, sc.label;
        `;

        const sqlRespondents = `
        SELECT COUNT(DISTINCT "user_identifier") AS "respondents"
        FROM "slide_voting_results"
        WHERE ${whereBySessionNo} slide_id = ${safeSlideId};
        `;

        // { id: number, label: string, score: string }[]
        const votingResults: Array<{
            id: number;
            label: string;
            score: string;
        }> = await this._slideChoiceRepository.executeRawQueryAsync(sqlVotingResults);

        const respondents: Array<{
            respondents: string;
        }> = await this._slideVotingResultRepository.executeRawQueryAsync(sqlRespondents);

        return {
            respondents: parseInt(_.get(respondents, "[0].respondents", "0")),
            results: votingResults.map(({ id, label, score }) => ({ id, label, score: [parseInt(score)] })),
        };
    }

    private async _validateEditSlideDataAndPrefetchSlide(
        userId: string,
        presentationIdentifier: string | number,
        slideId: number,
        editSlideDto: EditPresentationSlideDto,
    ) {
        // Ensure that `presentationIdentifier` same with `dto.presentationId` or `dto.presentationIdentifier`
        if (
            (typeof presentationIdentifier === "number" && presentationIdentifier !== editSlideDto.presentationId) ||
            (typeof presentationIdentifier === "string" &&
                presentationIdentifier !== editSlideDto.presentationIdentifier)
        ) {
            throw new SimpleBadRequestException(RESPONSE_CODE.PRESENTATION_NOT_FOUND);
        }

        // Check ownership of presentaiton and
        const presentation = await this._presentationRepository.findOnePresentation({
            where: {
                ownerIdentifier: userId,
                id: editSlideDto.presentationId,
                identifier: editSlideDto.presentationIdentifier,
            },
        });
        if (!presentation) {
            throw new SimpleBadRequestException(RESPONSE_CODE.PRESENTATION_NOT_FOUND);
        }

        // Find slide by slide id
        const slide = await this._presentationSlideRepository.findOnePresentationSlideAsync({
            where: {
                id: slideId,
                presentationId: presentation.id, // faster than find by string (identifier)
            },
        });
        if (!slide) {
            throw new SimpleBadRequestException(RESPONSE_CODE.SLIDE_NOT_FOUND);
        }

        // Check presentation pace
        if (presentation.pace.state === PresentationPaceStateEnum.PRESENTING) {
            throw new SimpleBadRequestException(RESPONSE_CODE.PRESENTING_PRESENTATION);
        }

        // Cannot change slide type if it has voted
        if (slide.slideType !== editSlideDto.slideType) {
            const hasVoted = await this._slideVotingResultRepository.existsByAsync({ where: { slideId } });
            if (hasVoted) {
                throw new SimpleBadRequestException(RESPONSE_CODE.EDIT_VOTED_SLIDE_PERMISSION);
            }
        }

        return slide;
    }

    private async _updateSlideChoicesForEditingSlide(slide: PresentationSlide, editSlideDto: EditPresentationSlideDto) {
        const { id: slideId, slideType } = slide;

        if (slideType !== editSlideDto.slideType) {
            await this._slideChoiceRepository.deleteManySlideChoicesAsync({ slideId });
            await this._slideVotingResultRepository.deleteManySlideVotingResultsAsync({ slideId });

            // Create new choices for new slide type
            if (editSlideDto.choices.length > 0) {
                const choicesToCreate = editSlideDto.choices.map((choice) => ({ ...choice, slideId }));
                await this._slideChoiceRepository.saveManyRecordAsync(choicesToCreate);
            }

            // Terminate this flow
            return;
        }

        // Remove old choices, voting results => save new choices
        if (editSlideDto.choices.length === 0) {
            await this._slideChoiceRepository.deleteManySlideChoicesAsync({ slideId });
            await this._slideVotingResultRepository.deleteManySlideVotingResultsAsync({ slideId });
        } else {
            // new choices with id = 0
            const currentChoices = await this._slideChoiceRepository.findManySlideChoicesAsync({
                select: { id: true },
                where: { slideId },
            });
            const currentChoiceIds = currentChoices.map((it) => it.id);
            const choicesToUpdate: SlideChoice[] = [];
            const newChoicesToCreate: Omit<SlideChoice, "id">[] = [];

            for (const choice of editSlideDto.choices) {
                if (currentChoiceIds.includes(choice.id)) {
                    choicesToUpdate.push({ ...choice, slideId });
                } else {
                    const newChoiceData = _.pick(choice, ["label", "position", "type", "isCorrectAnswer", "metadata"]);
                    newChoicesToCreate.push({ ...newChoiceData, slideId });
                }
            }

            // Delete choices and voting results
            if (choicesToUpdate.length !== currentChoiceIds.length) {
                const choiceIdsToUpdate = choicesToUpdate.map((it) => it.id);

                // Validate delete parameters
                if (choiceIdsToUpdate.some((id) => typeof id !== "number" || Number.isNaN(parseInt(id.toString())))) {
                    throw new Error("Invalid choice ids to delete");
                }

                await this._slideChoiceRepository.deleteManySlideChoicesAsync({
                    slideId,
                    id: Not(In(choiceIdsToUpdate)),
                });
                await this._slideVotingResultRepository.deleteManySlideVotingResultsAsync({
                    slideId,
                    id: Not(In(choiceIdsToUpdate)),
                });
            }

            // Create new choices
            if (newChoicesToCreate.length > 0) {
                await this._slideChoiceRepository.saveManyRecordAsync(newChoicesToCreate);
            }

            // Update old choices
            if (choicesToUpdate.length > 0) {
                const updatePromises = choicesToUpdate.map(
                    (choice) => this._slideChoiceRepository.updateRecordByIdAsync(choice.id, choice),
                    this,
                );
                await Promise.all(updatePromises);
            }
        }
    }

    async editSlideAsync(
        userId: string,
        presentationIdentifier: string | number,
        slideId: number,
        editSlideDto: EditPresentationSlideDto,
    ) {
        const slide = await this._validateEditSlideDataAndPrefetchSlide(
            userId,
            presentationIdentifier,
            slideId,
            editSlideDto,
        );

        await this._updateSlideChoicesForEditingSlide(slide, editSlideDto);

        // Save slide
        const slideToUpdate: any = _.omit(editSlideDto, "choices");
        await this._presentationSlideRepository.updateRecordByIdAsync(slideId, slideToUpdate);
    }

    async deleteOnePresentationSlideAsync(presentation: Presentation, slideId: number) {
        const safeSlideId = parseInt(slideId.toString());
        if (Number.isNaN(safeSlideId) || safeSlideId < 1) {
            throw new Error("slideId must be an integer number and greater than zero");
        }
        const slide = await this._presentationSlideRepository.getRecordByIdAsync(safeSlideId);
        const { id: presentationId, totalSlides: currentTotalSlids, pace: currentPace } = presentation;
        if (!slide) {
            throw new SimpleBadRequestException(RESPONSE_CODE.SLIDE_NOT_FOUND);
        }

        if (slide.presentationId !== presentationId) {
            throw new SimpleBadRequestException(RESPONSE_CODE.SLIDE_NOT_FOUND);
        }

        const safeSlidePos = parseInt(slide.position.toString());
        if (Number.isNaN(safeSlidePos) || safeSlidePos < 1) {
            throw new Error("Slide Position must be an integer number and greater than zero");
        }
        const safePresentationId = parseInt(presentationId.toString());
        if (Number.isNaN(safePresentationId) || safePresentationId < 1) {
            throw new Error("Presentation ID must be an integer number and greater than zero");
        }

        //Update Presentation totalSlide and pace
        let presentationDataToUpdate: Partial<Presentation> = {
            totalSlides: currentTotalSlids - 1,
        };
        if (currentPace.active_slide_id === safeSlideId) {
            const activeSlide = await this._presentationSlideRepository.findOnePresentationSlideAsync({
                where: {
                    presentationId: safePresentationId,
                    position: safeSlidePos !== currentTotalSlids - 1 ? safeSlidePos + 1 : safeSlidePos - 1,
                },
            });

            if (!activeSlide) {
                throw new Error("Cannot find a slide to replace");
            }

            presentationDataToUpdate = {
                totalSlides: currentTotalSlids - 1,
                pace: {
                    ...currentPace,
                    active_slide_id: activeSlide.id,
                },
            };
        }
        await this._presentationRepository.updateRecordByIdAsync(presentationId, presentationDataToUpdate);

        //Update Slides pos
        if (safeSlidePos !== currentTotalSlids - 1) {
            const sqlUpdateSlidePosition = `
            UPDATE "presentation_slides" 
            SET position = position - 1
            WHERE presentation_id = ${safePresentationId} AND position > ${safeSlidePos};
            `;

            await this._presentationSlideRepository.executeRawQueryAsync(sqlUpdateSlidePosition);
        }

        await this._presentationSlideRepository.deleteRecordByIdAsync(slideId);
        await this._slideChoiceRepository.deleteManySlideChoicesAsync({ slideId: safeSlideId });
        await this._slideVotingResultRepository.deleteManySlideVotingResultsAsync({ slideId: safeSlideId });
    }
}
