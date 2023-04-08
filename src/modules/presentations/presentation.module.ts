import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { basicAuthMiddleware } from "src/common/middlewares";
import { ServiceModule } from "src/infrastructure/services";
import { PresentationControllerV1 } from "./presentation-v1.controller";

@Module({
    controllers: [PresentationControllerV1],
    imports: [ServiceModule],
})
export class PresentationModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(basicAuthMiddleware).forRoutes(PresentationControllerV1);
    }
}
