import * as fastStringify from "fast-safe-stringify";
import * as moment from "moment";
import { WinstonModule } from "nest-winston";
import { APP_CONFIG } from "src/infrastructure/configs";
import * as winston from "winston";
import "winston-daily-rotate-file";

/**
 * @description Example:   Logger.debug ("debug", "error", ["debug 3"], {key: "value"}, "and many parameters")
 */
const formatFunction = winston.format.printf(({ context, level, timestamp, ms, message }) => {
	const timestampString = moment(timestamp).toLocaleString();

	const outMessage = typeof message === "object" ? fastStringify.default(message) : message;

	return `[${timestampString}] : [${level}] : [${context}] : ${outMessage} ${ms}\n`;
});

const format = winston.format.combine(winston.format.timestamp(), winston.format.ms(), formatFunction);

const logTransports: winston.transport[] = [];

if (APP_CONFIG.logDriver === "file") {
	const FileTransport = new winston.transports.DailyRotateFile({
		filename: "log-%DATE%",
		extension: ".log",
		dirname: "logs",
		datePattern: "YYYY-MM-DD",
		maxSize: "20m",
		maxFiles: "30d",
	});
	logTransports.push(FileTransport);
}

if (APP_CONFIG.logDriver === "console") {
	const ConsoleTransport = new winston.transports.Console();
	logTransports.push(ConsoleTransport);
}

export const WinstonLogger = WinstonModule.createLogger({
	transports: logTransports,
	format,
	level: APP_CONFIG.logLevel,
});
