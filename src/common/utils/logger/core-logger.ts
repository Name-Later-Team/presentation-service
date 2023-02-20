import * as moment from "moment";
import { WinstonModule } from "nest-winston";
import { APP_CONFIG } from "src/infrastructure/configs";
import * as winston from "winston";
import "winston-daily-rotate-file";

const format = winston.format.combine(
	winston.format.timestamp(),
	winston.format.ms(),
	winston.format.printf(({ context, level, timestamp, ms, message }) => {
		const timestampString = moment(timestamp).toLocaleString();
		return `[${timestampString}] : [${level}] : [${context}] : ${message} ${ms}`;
	}),
);

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
