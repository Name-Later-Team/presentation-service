import { Inject, Logger } from "@nestjs/common";
import { Injectable } from "@nestjs/common/decorators";
import * as _ from "lodash";
import * as moment from "moment";
import { RESPONSE_CODE } from "src/common/constants";
import { SimpleBadRequestException } from "src/common/exceptions";
import { PresentationGenerator } from "src/common/utils/generators";
import { Presentation } from "src/core/entities";
import { BaseService } from "src/core/services";
import {
    PRESENTATION_REPO_TOKEN,
    PRESENTATION_SLIDE_REPO_TOKEN,
    PRESENTATION_VOTING_CODE_REPO_TOKEN,
    SLIDE_CHOICE_REPO_TOKEN,
} from "../repositories";
import {
    IPresentationRepository,
    IPresentationSlideRepository,
    IPresentationVotingCodeRepository,
    ISlideChoiceRepository,
} from "../repositories/interfaces";
import { EditBasicInfoPresentationDto } from "src/core/dtos";

export const PRESENTATION_SERVICE_TOKEN = Symbol("PresentationService");

@Injectable()
export class PresentationService extends BaseService<Presentation> {
    constructor(
        @Inject(PRESENTATION_REPO_TOKEN) private readonly _presentationRepository: IPresentationRepository,
        @Inject(PRESENTATION_SLIDE_REPO_TOKEN)
        private readonly _presentationSlideRepository: IPresentationSlideRepository,
        @Inject(PRESENTATION_VOTING_CODE_REPO_TOKEN)
        private readonly _presentationVotingCodeRepo: IPresentationVotingCodeRepository,
        @Inject(SLIDE_CHOICE_REPO_TOKEN)
        private readonly _slideChoiceRepo: ISlideChoiceRepository,
    ) {
        super(_presentationRepository);
    }

    async createPresentationWithDefaultSlideAsync(data: {
        presentationName: string;
        userId: string;
        userDisplayName: string;
    }) {
        // generate default presentation pace value
        const defaultPace = PresentationGenerator.generatePresentationPace();

        // create presentation
        const createdPresentation = await this.saveRecordAsync({
            name: data.presentationName,
            ownerIdentifier: data.userId,
            ownerDisplayName: data.userDisplayName,
            pace: defaultPace,
            totalSlides: 0,
        });

        Logger.debug(JSON.stringify(createdPresentation), this.constructor.name);

        // generate presentation voting code
        // ! Refactor later: add mechanism to handle duplicated code
        const code = PresentationGenerator.generateVotingCode(8);
        await this._presentationVotingCodeRepo.saveRecordAsync({
            code,
            presentationIdentifier: createdPresentation.identifier,
            isValid: true,
            expiresAt: moment().add(2, "days").toDate(),
        });

        // create default slide
        const slide = await this._presentationSlideRepository.saveRecordAsync({
            presentationId: createdPresentation.id,
            presentationIdentifier: createdPresentation.identifier,
            question: "Default question",
            slideType: "multiple_choice",
            position: 0,
        });

        Logger.debug(JSON.stringify(slide), this.constructor.name);

        // update presentation to link the first slide information
        // this is the first slide, it will be set to presented slide
        await this._presentationRepository.updateRecordByIdAsync(createdPresentation.id, {
            totalSlides: 1,
            pace: { ...defaultPace, active_slide_id: slide.id },
        });

        // create default slide choices: 1 option
        const optionList = PresentationGenerator.generateMultipleChoiceOptions(1, slide.id);

        await this._slideChoiceRepo.saveManyRecordAsync(optionList);

        return createdPresentation.identifier;
    }

    async findAllPresentationsByUserAsync(userId: string, pagination: { page: number; limit: number }) {
        const { page, limit } = pagination;
        const offset = limit * (page - 1);

        const count = await this._presentationRepository.countByUserId(userId);
        const presentations = await this._presentationRepository.findAllByUserId(userId, { offset, limit });

        return {
            items: presentations,
            pagination: { count, page, limit },
        };
    }

    async findOnePresentationAsync(userId: string, presentationIdentifier: number | string, isIncludeSlides = false) {
        const presentationIdentifierField = typeof presentationIdentifier === "number" ? "id" : "identifier";
        const presentation = await this._presentationRepository.findOne({
            where: {
                [presentationIdentifierField]: presentationIdentifier,
                ownerIdentifier: userId,
            },
        });

        if (presentation === null) {
            throw new SimpleBadRequestException(RESPONSE_CODE.PRESENTATION_NOT_FOUND, "Presentation not found");
        }

        let slides: { id: number; slideType: string; position: number }[] | undefined = undefined;
        if (isIncludeSlides) {
            const fkField = `presentation${_.capitalize(presentationIdentifierField)}`;
            slides = await this._presentationSlideRepository.findMany({
                select: ["id", "slideType", "position"],
                where: {
                    [fkField]: presentationIdentifier,
                },
            });

            if (slides.length === 0) {
                throw new Error("The presentation does not have any slides");
            }
        }

        return { ...presentation, slides };
    }

    async editBasicInfoPresentationeAsync(
        userId: string,
        presentationIdentifier: number | string,
        editInfo: EditBasicInfoPresentationDto,
    ) {
        const presentationIdentifierField = typeof presentationIdentifier === "number" ? "id" : "identifier";
        const presentation = await this._presentationRepository.findOne({
            where: {
                [presentationIdentifierField]: presentationIdentifier,
                ownerIdentifier: userId,
            },
        });

        if (presentation === null) {
            throw new SimpleBadRequestException(RESPONSE_CODE.PRESENTATION_NOT_FOUND, "Presentation not found");
        }
        await this._presentationRepository.updateRecordByIdAsync(presentation.id, {
            name: editInfo.name,
            closedForVoting: editInfo.closedForVoting,
        });
    }
}
