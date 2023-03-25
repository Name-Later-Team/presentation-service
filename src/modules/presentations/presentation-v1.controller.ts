import { Body, Controller, Inject, Post, Req } from "@nestjs/common";
import { Request } from "express";
import { CreatePresentationDto } from "src/core/dtos";
import { CreatedResponse } from "src/core/response";
import { PresentationService, PRESENTATION_SERVICE_TOKEN } from "src/infrastructure/services";
import { CreatePresentationValidationPipe } from "./pipes/create-presentation-validation.pipe";

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
}
