import { Body, Controller, Get, Inject, Param, Post, Put, Req } from "@nestjs/common";
import { Request } from "express";
import { PRESENTATION_PACE_STATE, RESPONSE_CODE } from "src/common/constants";
import { SimpleBadRequestException } from "src/common/exceptions";
import {
    CreatePresentationSlideDto,
    EditPresentationSlideDto,
    FindOnePresentationSlideDto,
    PresentationIdentifierDto,
} from "src/core/dtos";
import { CreatedResponse, DataResponse } from "src/core/response";
import {
    PRESENTATION_SERVICE_TOKEN,
    PRESENTATION_SLIDE_SERVICE_TOKEN,
    PresentationService,
    PresentationSlideService,
} from "src/infrastructure/services";
import {
    CreatePresentationSlideValidationPipe,
    EditPresentationSlideValidationPipe,
    FindOnePresentationSlideValidationPipe,
    PresentationIdentifierValidationPipe,
} from "./pipes";

@Controller("v1/presentations/:presentationIdentifier/slides")
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
        const presentationIdentifier = pathParams.presentationIdentifier;
        const slideType = createPresentationSlideDto.type;

        const presentation = await this._presentationService.findOnePresentationAsync(userId, presentationIdentifier);

        // The presentation is presenting
        if (presentation.pace.state === PRESENTATION_PACE_STATE.PRESENTING) {
            throw new SimpleBadRequestException(RESPONSE_CODE.PRESENTING_PRESENTATION);
        }

        const createdSlide = await this._presentationSlideService.createSlideAsync(presentation, slideType);
        return new CreatedResponse(createdSlide);
    }

    @Get("/:slideId")
    async findOnePresentationSlideAsync(
        @Req() request: Request,
        @Param(new FindOnePresentationSlideValidationPipe()) pathParams: FindOnePresentationSlideDto,
    ) {
        const userId = request.userinfo.identifier;
        const { presentationIdentifier, slideId } = pathParams;

        // check existence of the given presentation and throw an error if it doesn't exist
        await this._presentationService.existsByIdentifierAsync(userId, presentationIdentifier, true);

        const slide = await this._presentationSlideService.findOnePresentationSlideAsync(slideId);

        return new DataResponse(slide);
    }

    @Get("/:slideId/results")
    async getVotingResultsBySlideIdAsync(
        @Req() request: Request,
        @Param(new FindOnePresentationSlideValidationPipe()) pathParams: FindOnePresentationSlideDto,
    ) {
        const userId = request.userinfo.identifier;
        const { presentationIdentifier, slideId } = pathParams;

        // check existence of the given presentation and slide
        // throw an error if one of them don't exist
        await this._presentationService.existsByIdentifierAsync(userId, presentationIdentifier, true);
        await this._presentationSlideService.existsByPresentationIdentifierAndSlideIdAsync(
            presentationIdentifier,
            slideId,
            true,
        );

        const votingResults = await this._presentationSlideService.getVotingResultsBySlideIdAsync(slideId);
        return new DataResponse({ ...votingResults, slideId });
    }

    @Put("/:slideId")
    async editSlideByIdAsync(
        @Req() request: Request,
        @Param(new FindOnePresentationSlideValidationPipe()) pathParams: FindOnePresentationSlideDto,
        @Body(new EditPresentationSlideValidationPipe()) editPresentationSlideDto: EditPresentationSlideDto,
    ) {
        const userId = request.userinfo.identifier;
        const { presentationIdentifier, slideId } = pathParams;

        await this._presentationSlideService.editSlideAsync(
            userId,
            presentationIdentifier,
            slideId,
            editPresentationSlideDto,
        );
        const updatedSlide = await this._presentationSlideService.findOnePresentationSlideAsync(slideId);
        return new DataResponse(updatedSlide);
    }
}
