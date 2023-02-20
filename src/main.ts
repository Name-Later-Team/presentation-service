import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { LoggingInterceptor, ResponseMappingInterceptor } from "./common/interceptors";
import { WinstonLogger } from "./common/utils/logger/core-logger";
import { APP_CONFIG, CORS_CONFIG } from "./infrastructure/configs";

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		logger: WinstonLogger,
	});

	app.enableCors({
		origin: CORS_CONFIG.origin,
		credentials: CORS_CONFIG.credential,
		methods: ["GET", "PUT", "POST", "PATCH", "DELETE"],
		allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization", "x-realm-id"],
	});

	// interceptors
	app.useGlobalInterceptors(new LoggingInterceptor(), new ResponseMappingInterceptor());

	app.enableShutdownHooks();

	const HOSTNAME = APP_CONFIG.appHost;
	const PORT = APP_CONFIG.appPort;
	const PROTOCOL = APP_CONFIG.appProtocol;

	await app.listen(PORT);
	Logger.log(`Presentation service ready on ${PROTOCOL}://${HOSTNAME}:${PORT}`, "bootstrap");
}
bootstrap();
