import { Body, Controller, Get, HttpCode, Inject, Param, Post } from "@nestjs/common";
import { RESPONSE_CODE } from "src/common/constants";
import { SimpleBadRequestException } from "src/common/exceptions";
import {
    AudienceFindOnePresentationByCodeDto,
    AudienceFindOnePresentationByIdentifierDto,
    AudienceFindOnePresentationSlideDto,
    AudienceVoteOnPresentationSlideDto,
} from "src/core/dtos";
import { DataResponse } from "src/core/response";
import { AUDIENCE_SERVICE_TOKEN, AudienceService } from "src/infrastructure/services";
import {
    FindOnePresentationByCodeValidationPipe,
    FindOnePresentationByIdentifierValidationPipe,
    FindOnePresentationSlideValidationPipe,
    VoteOnPresentationSlideValidationPipe,
} from "./pipes";

@Controller("v1/audience")
export class AudienceControllerV1 {
    constructor(@Inject(AUDIENCE_SERVICE_TOKEN) private readonly _audienceService: AudienceService) {}

    @Get("/votingCodes/:code/presentation")
    async findOnePresentationByCodeAsync(
        @Param(new FindOnePresentationByCodeValidationPipe())
        params: AudienceFindOnePresentationByCodeDto,
    ) {
        const userVotingCode = params.code;
        const actualVotingCode = await this._audienceService.findOnePresentationVotingCodeByVotingCodeAsync(
            userVotingCode,
        );

        if (!actualVotingCode) {
            throw new SimpleBadRequestException(RESPONSE_CODE.PRESENTATION_NOT_FOUND);
        }

        const { identifier } = await this._audienceService.findOnePresentationByIdentifierAsync(
            actualVotingCode.presentationIdentifier,
        );

        return new DataResponse({ identifier });
    }

    @Get("/presentations/:presentationIdentifier/slides/:slideId")
    async findOnePresentationSlideByIdAsync(
        @Param(new FindOnePresentationSlideValidationPipe())
        params: AudienceFindOnePresentationSlideDto,
    ) {
        const { presentationIdentifier, slideId } = params;
        const slide = await this._audienceService.findOnePresentationSlideById(presentationIdentifier, slideId);
        return new DataResponse(slide);
    }

    @Post("/presentations/:presentationIdentifier/slides/:slideId/vote")
    @HttpCode(204)
    async voteOnPresentationSlideAsync(
        @Param(new FindOnePresentationSlideValidationPipe()) params: AudienceFindOnePresentationSlideDto,
        @Body(new VoteOnPresentationSlideValidationPipe()) body: AudienceVoteOnPresentationSlideDto,
    ) {
        const { presentationIdentifier, slideId } = params;
        const { userId, choiceIds } = body;
        await this._audienceService.voteOnPresentationSlideAsync(userId, presentationIdentifier, slideId, choiceIds);
    }

    @Get("/presentations/:presentationIdentifier")
    async findOnePresentationByIdentifierAsync(
        @Param(new FindOnePresentationByIdentifierValidationPipe())
        params: AudienceFindOnePresentationByIdentifierDto,
    ) {
        const { presentationIdentifier } = params;
        const presentation = await this._audienceService.findOnePresentationByIdentifierAsync(presentationIdentifier);
        return new DataResponse(presentation);
    }
}
