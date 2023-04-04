import { Inject, Logger } from "@nestjs/common";
import { Injectable } from "@nestjs/common/decorators";
import { isBefore } from "date-fns";
import * as moment from "moment";
import { PAGINATION, RESPONSE_CODE, VOTING_CODE_GENERATION_RETRY_ATTEMPTS } from "src/common/constants";
import { SimpleBadRequestException } from "src/common/exceptions";
import { PresentationGenerator } from "src/common/utils/generators";
import { EditBasicInfoPresentationDto } from "src/core/dtos";
import { Presentation } from "src/core/entities";
import { BaseService } from "src/core/services";
import { FindOptionsOrder, Raw } from "typeorm";
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
        const code = await this._generateVotingCodeWithCheckingDuplicateAsync(8);
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

    async findAllPresentationsByUserAsync(
        userId: string,
        options: { page?: number; limit?: number; order?: FindOptionsOrder<Presentation> },
    ) {
        const order = options.order ?? { createdAt: "DESC" };
        const page = options.page ?? PAGINATION.DEFAULT_PAGE;
        const limit = options.limit ?? PAGINATION.DEFAULT_PAGE_SIZE;
        const offset = limit * (page - 1);

        const count = await this._presentationRepository.countPresentations({ ownerIdentifier: userId });
        const presentations = await this._presentationRepository.findManyPresentations({
            order,
            skip: offset,
            take: limit,
            where: { ownerIdentifier: userId },
        });

        return {
            items: presentations,
            pagination: { count, page, limit },
        };
    }

    async findOnePresentationAsync(userId: string, presentationIdentifier: number | string, isIncludeSlides = false) {
        const presentationIdentifierField = typeof presentationIdentifier === "number" ? "id" : "identifier";
        const presentation = await this._presentationRepository.findOnePresentation({
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
            slides = await this._presentationSlideRepository.findManyPresentationSlidesAsync({
                select: {
                    id: true,
                    slideType: true,
                    position: true,
                },
                where: {
                    presentationIdentifier: presentation.identifier,
                },
                order: {
                    position: "ASC",
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
        const presentation = await this._presentationRepository.findOnePresentation({
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

    async existsByIdentifierAsync(userId: string, presentationIdentifier: string | number, isThrowError = false) {
        const presentationIdentifierField = typeof presentationIdentifier === "number" ? "id" : "identifier";
        const count = await this._presentationRepository.countPresentations({
            [presentationIdentifierField]: presentationIdentifier,
            ownerIdentifier: userId,
        });

        if (isThrowError && count !== 1) {
            throw new SimpleBadRequestException(RESPONSE_CODE.PRESENTATION_NOT_FOUND);
        }

        return count === 1;
    }

    findOnePresentationVotingCodeAsync(presentationIdentifier: string) {
        return this._presentationVotingCodeRepo.findOnePresentationVotingCodeAsync({
            where: {
                presentationIdentifier: presentationIdentifier,
                isValid: true,
                expiresAt: Raw((expiresAt) => `${expiresAt} >= NOW()`),
            },
            order: { id: "DESC" },
        });
    }

    async addOrFindPresenationVotingCodeAsync(presentationIdentifier: string) {
        const votingCode = await this._presentationVotingCodeRepo.findOnePresentationVotingCodeAsync({
            where: { presentationIdentifier },
            order: { id: "DESC" },
        });

        // valid code
        if (votingCode && votingCode.isValid && isBefore(new Date(), votingCode.expiresAt)) {
            return votingCode;
        }

        // invalidate this voting code
        if (votingCode) {
            await this._presentationVotingCodeRepo.updateRecordByIdAsync(votingCode.id, { isValid: false });
        }

        const newCode = await this._generateVotingCodeWithCheckingDuplicateAsync(8);
        const createdCode = await this._presentationVotingCodeRepo.saveRecordAsync({
            code: newCode,
            presentationIdentifier,
            isValid: true,
            expiresAt: moment().add(2, "days").toDate(),
        });

        return createdCode;
    }

    private async _generateVotingCodeWithCheckingDuplicateAsync(codeLength: number) {
        let retryCount = 0;
        let isDuplicateCode = false;
        let code: string;

        do {
            code = PresentationGenerator.generateVotingCode(codeLength);
            isDuplicateCode = await this._presentationVotingCodeRepo.existsPresentationVotingCodeAsync({
                where: { code },
            });

            if (retryCount >= VOTING_CODE_GENERATION_RETRY_ATTEMPTS) {
                throw new Error("Max retry count (1 + 3 retry) for regenerating voting code");
            }

            retryCount += 1;
        } while (isDuplicateCode);

        return code;
    }
}
