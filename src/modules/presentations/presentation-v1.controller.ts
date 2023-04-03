import { Body, Controller, Get, Inject, Param, Post, Put, Query, Req } from "@nestjs/common";
import { Request } from "express";
import * as _ from "lodash";
import {
    CreatePresentationDto,
    EditBasicInfoPresentationDto,
    FindAllPresentationsDto,
    FindOnePresentationDto,
} from "src/core/dtos";
import { CreatedResponse, DataResponse, UpdateResponse } from "src/core/response";
import { PRESENTATION_SERVICE_TOKEN, PresentationService } from "src/infrastructure/services";
import {
    CreatePresentationValidationPipe,
    EditBasicInfoPresentationValidationPipe,
    FindAllPresentationsValidationPipe,
    FindOnePresentationValidationPipe,
} from "./pipes";

@Controller("v1/presentations")
export class PresentationControllerV1 {
    constructor(@Inject(PRESENTATION_SERVICE_TOKEN) private readonly _presentationService: PresentationService) {}

    @Post("")
    async createPresentationAsync(
        @Req() request: Request,
        @Body(new CreatePresentationValidationPipe()) createPresentationDto: CreatePresentationDto,
    ) {
        const { userinfo } = request;
        await this._presentationService.createPresentationWithDefaultSlideAsync({
            presentationName: createPresentationDto.name,
            userDisplayName: userinfo.displayName,
            userId: userinfo.identifier,
        });

        return new CreatedResponse();
    }

    @Get("")
    async findAllPresentationsAsync(
        @Req() request: Request,
        @Query(new FindAllPresentationsValidationPipe()) query: FindAllPresentationsDto,
    ) {
        const userId = request.userinfo.identifier;
        const options = {
            page: query.page,
            limit: query.limit,
            order: query.order,
        };

        const result = await this._presentationService.findAllPresentationsByUserAsync(userId, options);
        const presentationsWithoutId = result.items.map((presentation) => _.omit(presentation, "id"));

        return new DataResponse({ ...result, items: presentationsWithoutId });
    }

    @Get("/:identifier")
    async findOnePresentationAsync(
        @Req() request: Request,
        @Param(new FindOnePresentationValidationPipe()) params: FindOnePresentationDto,
    ) {
        const userId = request.userinfo.identifier;
        const presentationIdentifier = params.identifier;
        const result = await this._presentationService.findOnePresentationAsync(userId, presentationIdentifier, true);

        return new DataResponse(_.omit(result, "id"));
    }

    @Put("/:identifier")
    async editBasicInfoPresentationAsync(
        @Req() request: Request,
        @Param(new FindOnePresentationValidationPipe()) params: FindOnePresentationDto,
        @Body(new EditBasicInfoPresentationValidationPipe())
        editBasicInfoPresentationDto: EditBasicInfoPresentationDto,
    ) {
        const presentationId = params.identifier;
        const userId = request.userinfo.identifier;

        await this._presentationService.editBasicInfoPresentationeAsync(
            userId,
            presentationId,
            editBasicInfoPresentationDto,
        );
        return new UpdateResponse();
    }
}
