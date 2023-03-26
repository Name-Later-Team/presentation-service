import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DATABASE_CONFIG } from "../configs";
import {
    PresentationSchema,
    PresentationSlideSchema,
    PresentationVotingCodeSchema,
    SlideChoiceSchema,
    SlideVotingResultSchema,
} from "./schemas";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: "postgres",
            host: DATABASE_CONFIG.host,
            port: DATABASE_CONFIG.port,
            username: DATABASE_CONFIG.username,
            password: DATABASE_CONFIG.password,
            database: DATABASE_CONFIG.dbName,
            poolSize: 10,
            synchronize: false, // disable sync between entity class and db
            // migrations: [DATABASE_CONFIG.migrationsPath],
            entities: [
                PresentationSchema,
                PresentationSlideSchema,
                PresentationVotingCodeSchema,
                SlideChoiceSchema,
                SlideVotingResultSchema,
            ],
        }),
    ],
    exports: [],
})
export class DatabaseModule {}
