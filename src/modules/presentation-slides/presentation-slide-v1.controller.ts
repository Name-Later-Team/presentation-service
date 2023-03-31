import { Body, Controller, Inject, Param, Post, Req } from "@nestjs/common";
import { Request } from "express";
import { PRESENTATION_PACE_STATE, RESPONSE_CODE } from "src/common/constants";
import { SimpleBadRequestException } from "src/common/exceptions";
import { CreatePresentationSlideDto, PresentationIdentifierDto } from "src/core/dtos";
import { CreatedResponse } from "src/core/response";
import {
    PRESENTATION_SERVICE_TOKEN,
    PRESENTATION_SLIDE_SERVICE_TOKEN,
    PresentationService,
    PresentationSlideService,
} from "src/infrastructure/services";
import { CreatePresentationSlideValidationPipe, PresentationIdentifierValidationPipe } from "./pipes";

@Controller("v1/presentations/:identifier/slides")
export class PresentationSlideControllerV1 {
    constructor(
        @Inject(PRESENTATION_SERVICE_TOKEN) private readonly _presentationService: PresentationService,
        @Inject(PRESENTATION_SLIDE_SERVICE_TOKEN) private readonly _presentationSlideService: PresentationSlideService,
    ) {}

    @Post("")
    async createPresentationSlideAsync(
        @Req() request: Request,
        @Param(new PresentationIdentifierValidationPipe()) pathParams: PresentationIdentifierDto,
        @Body(new CreatePresentationSlideValidationPipe()) createPresentationSlideDto: CreatePresentationSlideDto,
    ) {
        const userId = request.userinfo.identifier;
        const presentationIdentifier = pathParams.identifier;
        const slideType = createPresentationSlideDto.type;

        const presentation = await this._presentationService.findOnePresentationAsync(userId, presentationIdentifier);

        // The presentation is presenting
        if (presentation.pace.state === PRESENTATION_PACE_STATE.PRESENTING) {
            throw new SimpleBadRequestException(RESPONSE_CODE.PRESENTING_PRESENTATION);
        }

        const createdSlide = await this._presentationSlideService.createSlideAsync(presentation, slideType);
        return new CreatedResponse(createdSlide);
    }
}
