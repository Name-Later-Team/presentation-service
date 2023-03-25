import { Module } from "@nestjs/common";
import { DomainRepositoryModule } from "../repositories";
import { PresentationService, PRESENTATION_SERVICE_TOKEN } from "./presentation.service";

@Module({
    imports: [DomainRepositoryModule],
    providers: [{ provide: PRESENTATION_SERVICE_TOKEN, useClass: PresentationService }],
    exports: [{ provide: PRESENTATION_SERVICE_TOKEN, useClass: PresentationService }],
})
export class ServiceModule {}
