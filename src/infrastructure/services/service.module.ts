import { Module } from "@nestjs/common";
import { BrokerModule } from "../brokers";
import { DomainRepositoryModule } from "../repositories";
import { AUDIENCE_SERVICE_TOKEN, AudienceService } from "./audience.service";
import { PRESENTATION_SLIDE_SERVICE_TOKEN, PresentationSlideService } from "./presentation-slide.service";
import { PRESENTATION_SERVICE_TOKEN, PresentationService } from "./presentation.service";

@Module({
    imports: [DomainRepositoryModule, BrokerModule],
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
