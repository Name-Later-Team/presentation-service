import { Inject, Logger } from "@nestjs/common";
import { Injectable } from "@nestjs/common/decorators";
import { PRESENTATION_SLIDE_TYPE } from "src/common/constants";
import { PresentationGenerator } from "src/common/utils/generators";
import { Presentation, PresentationSlide } from "src/core/entities";
import { BaseService } from "src/core/services";
import { PRESENTATION_REPO_TOKEN, PRESENTATION_SLIDE_REPO_TOKEN, SLIDE_CHOICE_REPO_TOKEN } from "../repositories";
import {
    IPresentationRepository,
    IPresentationSlideRepository,
    ISlideChoiceRepository,
} from "../repositories/interfaces";

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
    ) {
        super(_presentationSlideRepository);
    }

    async createSlideAsync(presentation: Presentation, slideType: PRESENTATION_SLIDE_TYPE) {
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

        if (slideType === PRESENTATION_SLIDE_TYPE.MULTIPLE_CHOICE) {
            // Create default slide choices: 1 option
            const optionList = PresentationGenerator.generateMultipleChoiceOptions(1, createdSlide.id);
            await this._slideChoiceRepository.saveManyRecordAsync(optionList);
        }
    }
}
