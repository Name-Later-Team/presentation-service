import { Module } from "@nestjs/common";
import { PresentationRepository, PRESENTATION_REPOSITORY_TOKEN } from "./presentation.repository";

@Module({
	providers: [{ provide: PRESENTATION_REPOSITORY_TOKEN, useClass: PresentationRepository }],
	exports: [{ provide: PRESENTATION_REPOSITORY_TOKEN, useClass: PresentationRepository }],
})
export class DomainRepositoryModule {}
