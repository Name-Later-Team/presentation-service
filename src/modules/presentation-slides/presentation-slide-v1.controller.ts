import { Body, Controller, Delete, Get, HttpCode, Inject, Param, Post, Put, Query, Req } from "@nestjs/common";
import { Request } from "express";
import { RESPONSE_CODE } from "src/common/constants";
import { SimpleBadRequestException } from "src/common/exceptions";
import {
    CreatePresentationSlideDto,
    EditPresentationSlideDto,
    FindOnePresentationSlideDto,
    FindOnePresentationSlideQueryDto,
    FindOnePresentatonSlideResponseDto,
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
    FindOnePresentationSlideQueryValidationPipe,
    FindOnePresentationSlideValidationPipe,
    PresentationIdentifierValidationPipe,
} from "./pipes";
import { PresentationPaceStateEnum } from "src/core/types";

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
        if (presentation.pace.state === PresentationPaceStateEnum.PRESENTING) {
            throw new SimpleBadRequestException(RESPONSE_CODE.PRESENTING_PRESENTATION);
        }

        const createdSlide = await this._presentationSlideService.createSlideAsync(presentation, slideType);
        return new CreatedResponse(createdSlide);
    }

    @Get("/:slideId")
    async findOnePresentationSlideAsync(
        @Req() request: Request,
        @Param(new FindOnePresentationSlideValidationPipe()) pathParams: FindOnePresentationSlideDto,
        @Query(new FindOnePresentationSlideQueryValidationPipe()) query: FindOnePresentationSlideQueryDto,
    ) {
        const userId = request.userinfo.identifier;
        const { presentationIdentifier, slideId } = pathParams;
        const includeResults = query.includeResults;

        const presentation = await this._presentationService.findOnePresentationAsync(userId, presentationIdentifier);
        const slide = await this._presentationSlideService.findOnePresentationSlideByPresentationIdAndSlideIdAsync(
            slideId,
            presentation.id,
        );

        const respData: FindOnePresentatonSlideResponseDto = { ...slide };

        if (includeResults) {
            const votingResults = await this._presentationSlideService.getVotingResultsBySlideIdAsync(
                slideId,
                slide.sessionNo,
            );
            respData.votingResult = votingResults;
        }

        return new DataResponse(respData);
    }

    @Get("/:slideId/results")
    async getVotingResultsBySlideIdAsync(
        @Req() request: Request,
        @Param(new FindOnePresentationSlideValidationPipe()) pathParams: FindOnePresentationSlideDto,
    ) {
        const userId = request.userinfo.identifier;
        const { presentationIdentifier, slideId } = pathParams;

        const presentation = await this._presentationService.findOnePresentationAsync(userId, presentationIdentifier);
        const slide = await this._presentationSlideService.findOnePresentationSlideByPresentationIdAndSlideIdAsync(
            slideId,
            presentation.id,
            false,
        );
        const votingResults = await this._presentationSlideService.getVotingResultsBySlideIdAsync(
            slideId,
            slide.sessionNo,
        );

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
        const updatedSlide = await this._presentationSlideService.findOnePresentationSlideBySlideIdAsync(slideId);
        return new DataResponse(updatedSlide);
    }

    @Delete("/:slideId")
    async deleteSlideAsync(
        @Req() request: Request,
        @Param(new FindOnePresentationSlideValidationPipe()) pathParams: FindOnePresentationSlideDto,
    ) {
        const userId = request.userinfo.identifier;
        const { presentationIdentifier, slideId } = pathParams;

        // check existence of the given presentation and throw an error if it doesn't exist
        const presentation = await this._presentationService.findOnePresentationAsync(userId, presentationIdentifier);
        await this._presentationSlideService.deleteOnePresentationSlideAsync(presentation, slideId);
        return new DataResponse(null);
    }

    @Post("/:slideId/results/reset")
    @HttpCode(204)
    async resetVotingResultsAsync(
        @Req() request: Request,
        @Param(new FindOnePresentationSlideValidationPipe()) pathParams: FindOnePresentationSlideDto,
    ) {
        const userId = request.userinfo.identifier;
        const { presentationIdentifier, slideId } = pathParams;

        const presentation = await this._presentationService.findOnePresentationAsync(userId, presentationIdentifier);
        const slide = await this._presentationSlideService.findOnePresentationSlideByPresentationIdAndSlideIdAsync(
            slideId,
            presentation.id,
            false,
        );

        await this._presentationSlideService.updateRecordByIdAsync(slideId, { sessionNo: slide.sessionNo + 1 });
    }
}
