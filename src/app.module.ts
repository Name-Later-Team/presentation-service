import { BeforeApplicationShutdown, Logger, MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { RsaAuthMiddleware, trackingMiddleware } from "./common/middlewares";
import { DatabaseModule } from "./infrastructure/database";
import { PresentationModule } from "./modules/presentations/presentation.module";

@Module({
    imports: [DatabaseModule, PresentationModule],
    controllers: [AppController],
    providers: [AppService, Logger],
})
export class AppModule implements NestModule, BeforeApplicationShutdown {
    constructor() {}

    public configure(consumer: MiddlewareConsumer): void {
        consumer.apply(trackingMiddleware).forRoutes("*").apply(RsaAuthMiddleware).forRoutes("v1/*");
    }

    beforeApplicationShutdown(signal?: string) {}
}
