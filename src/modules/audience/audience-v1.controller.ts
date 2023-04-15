import { Controller, Get, Inject, Param, Req } from "@nestjs/common";
import { AUDIENCE_SERVICE_TOKEN, AudienceService } from "src/infrastructure/services";
import { FindOnePresentationByCodeValidationPipe } from "./pipes";
import { FindOnePresentationByCodeDto } from "src/core/dtos";
import { SimpleBadRequestException } from "src/common/exceptions";
import { RESPONSE_CODE } from "src/common/constants";
import { DataResponse } from "src/core/response";

@Controller("v1/audience")
export class AudienceControllerV1 {
    constructor(@Inject(AUDIENCE_SERVICE_TOKEN) private readonly _audienceService: AudienceService) {}

    @Get("/votingCodes/:code/presentation")
    async findOnePresentationByCode(
        @Param(new FindOnePresentationByCodeValidationPipe())
        params: FindOnePresentationByCodeDto,
    ) {
        const userVotingCode = params.code;
        const actualVotingCode = await this._audienceService.findOnePresentationVotingCodeByVotingCodeAsync(
            userVotingCode,
        );

        if (!actualVotingCode) {
            throw new SimpleBadRequestException(RESPONSE_CODE.PRESENTATION_NOT_FOUND);
        }

        const presentation = await this._audienceService.findOnePresentationAndAllSlidesByIdentifierAsync(
            actualVotingCode.presentationIdentifier,
        );
        return new DataResponse(presentation);
    }
}
