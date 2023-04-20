import { BeforeApplicationShutdown, Logger, MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { RawBodyMiddleware, RsaAuthMiddleware, trackingMiddleware } from "./common/middlewares";
import { DatabaseModule } from "./infrastructure/database";
import { AudienceModule } from "./modules/audience/audience.module";
import { PresentationSlideModule } from "./modules/presentation-slides/presentation-slide.module";
import { PresentationModule } from "./modules/presentations/presentation.module";

@Module({
    imports: [DatabaseModule, PresentationModule, PresentationSlideModule, AudienceModule],
    controllers: [AppController],
    providers: [AppService, Logger],
})
export class AppModule implements NestModule, BeforeApplicationShutdown {
    constructor() {}

    public configure(consumer: MiddlewareConsumer): void {
        consumer.apply(trackingMiddleware).forRoutes("*").apply(RawBodyMiddleware, RsaAuthMiddleware).forRoutes("v1/*");
    }

    beforeApplicationShutdown(signal?: string) {}
}
