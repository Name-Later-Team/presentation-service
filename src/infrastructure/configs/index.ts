import * as dotenv from "dotenv";
dotenv.config();

export const APP_CONFIG = {
    appPort: process.env.PORT ? +process.env.PORT : 5000,
    logLevel: process.env.LOG_LEVEL || "info",
    logDriver: process.env.LOG_DRIVER || "console",
    powerBy: process.env.POWER_BY || "",

    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    rsa: {
        publicKey: process.env.RSA_PUBLIC_KEY,
    },
} as const;

export const CORS_CONFIG = {
    origin: process.env.ORIGIN || "*",
    credential: Boolean(process.env.CREDENTIAL).valueOf() || false,
} as const;

export const DATABASE_CONFIG = {
    host: process.env.DB_HOST || "",
    port: process.env.DB_PORT ? +process.env.DB_PORT : 0,
    username: process.env.DB_USERNAME || "",
    password: process.env.DB_PASSWORD || "",
    dbName: process.env.DB_NAME || "",
} as const;

export const MESSAGE_BROKER_CONFIG = {
    rabbitmq: {
        uri: process.env.RABBITMQ_URI || "",
        exchange: {
            name: process.env.RABBITMQ_EXCHANGE_NAME || "",
            type: process.env.RABBITMQ_EXCHANGE_TYPE || "",
            isDurable: Boolean(process.env.RABBITMQ_EXCHANGE_DURABLE).valueOf() || true,
        },

        topics: {
            actionTopic: process.env.RABBITMQ_PRESENTATION_ACTION_TOPIC || "",
            votingTopic: process.env.RABBITMQ_PRESENTATION_VOTING_TOPIC || "",
        },
    },
};
