import { Body, Controller, Get, Inject, Post, Query, Req } from "@nestjs/common";
import { Request } from "express";
import { CreatePresentationDto, FindAllPresentationsDto } from "src/core/dtos";
import { CreatedResponse, DataResponse } from "src/core/response";
import { PresentationService, PRESENTATION_SERVICE_TOKEN } from "src/infrastructure/services";
import { CreatePresentationValidationPipe, FindAllPresentationsValidationPipe } from "./pipes";

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
        const options = { page: query.page, limit: query.limit };

        const result = await this._presentationService.findAllPresentationsByUserAsync(userId, options);
        return new DataResponse(result);
    }
}
