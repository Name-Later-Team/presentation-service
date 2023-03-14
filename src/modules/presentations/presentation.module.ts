import { Module } from "@nestjs/common";
import { DomainRepositoryModule } from "src/infrastructure/repositories/domain-repository.module";
import { PresentationControllerV1 } from "./presentation-v1.controller";

@Module({
	controllers: [PresentationControllerV1],
	imports: [DomainRepositoryModule]
})
export class PresentationModule {}
