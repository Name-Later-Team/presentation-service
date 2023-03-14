import { Controller, Get, Inject } from "@nestjs/common";
import { IPresentationRepository } from "src/core/repositories";
import { DataResponse } from "src/core/response";
import { PRESENTATION_REPOSITORY_TOKEN } from "src/infrastructure/repositories";

@Controller("v1/presentations")
export class PresentationControllerV1 {
    constructor(
        @Inject(PRESENTATION_REPOSITORY_TOKEN) private readonly _presentationRepository: IPresentationRepository,
    ) {}

    @Get("")
    async getAllPresentationAsync() {
        // !this is demo logic, you must change this code to meet the bussiness use cases
        const res = await this._presentationRepository.getAllRecordsAsync();
        return new DataResponse(res);
    }
}
