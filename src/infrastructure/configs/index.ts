import * as dotenv from "dotenv";
dotenv.config();

export const APP_CONFIG = {
	appEnvironment: process.env.APP_ENV || "",
	appProtocol: process.env.PROTOCOL || "http",
	appHost: process.env.HOST || "localhost",
	appPort: process.env.PORT ? +process.env.PORT : 5000,
	logLevel: process.env.LOG_LEVEL || "info",
	logDriver: process.env.LOG_DRIVER || "console",
	powerBy: process.env.POWER_BY || "",
} as const;

export const CORS_CONFIG = {
	origin: process.env.ORIGIN || "*",
	credential: Boolean(process.env.CREDENTIAL).valueOf() || false,
} as const;
