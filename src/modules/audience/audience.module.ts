import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { basicAuthMiddleware } from "src/common/middlewares";
import { ServiceModule } from "src/infrastructure/services";
import { AudienceControllerV1 } from "./audience-v1.controller";

@Module({
    controllers: [AudienceControllerV1],
    imports: [ServiceModule],
})
export class AudienceModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(basicAuthMiddleware).forRoutes(AudienceControllerV1);
    }
}
