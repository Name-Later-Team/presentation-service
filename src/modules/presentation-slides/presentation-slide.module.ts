import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { basicAuthMiddleware } from "src/common/middlewares";
import { ServiceModule } from "src/infrastructure/services";
import { PresentationSlideControllerV1 } from "./presentation-slide-v1.controller";

@Module({
    controllers: [PresentationSlideControllerV1],
    imports: [ServiceModule],
})
export class PresentationSlideModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(basicAuthMiddleware).forRoutes(PresentationSlideControllerV1);
    }
}
