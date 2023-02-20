import { BeforeApplicationShutdown, Logger, MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { trackingMiddleware } from "./common/middlewares";

@Module({
	imports: [],
	controllers: [AppController],
	providers: [AppService, Logger],
})
export class AppModule implements NestModule, BeforeApplicationShutdown {
	constructor() {}

	public configure(consumer: MiddlewareConsumer): void {
		consumer.apply(trackingMiddleware).forRoutes("*");
	}

	beforeApplicationShutdown(signal?: string) {}
}
