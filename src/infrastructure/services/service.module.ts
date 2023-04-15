import { Module } from "@nestjs/common";
import { DomainRepositoryModule } from "../repositories";
import { PresentationService, PRESENTATION_SERVICE_TOKEN } from "./presentation.service";
import { PRESENTATION_SLIDE_SERVICE_TOKEN, PresentationSlideService } from "./presentation-slide.service";
import { AUDIENCE_SERVICE_TOKEN, AudienceService } from "./audience.service";

@Module({
    imports: [DomainRepositoryModule],
    providers: [
        {
            provide: PRESENTATION_SERVICE_TOKEN,
            useClass: PresentationService,
        },
        {
            provide: PRESENTATION_SLIDE_SERVICE_TOKEN,
            useClass: PresentationSlideService,
        },
        {
            provide: AUDIENCE_SERVICE_TOKEN,
            useClass: AudienceService,
        },
    ],
    exports: [
        {
            provide: PRESENTATION_SERVICE_TOKEN,
            useClass: PresentationService,
        },
        {
            provide: PRESENTATION_SLIDE_SERVICE_TOKEN,
            useClass: PresentationSlideService,
        },
        {
            provide: AUDIENCE_SERVICE_TOKEN,
            useClass: AudienceService,
        },
    ],
})
export class ServiceModule {}
