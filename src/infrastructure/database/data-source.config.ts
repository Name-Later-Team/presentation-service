import { DataSource, DataSourceOptions } from "typeorm";
import { DATABASE_CONFIG } from "../configs";
import {
    PresentationSchema,
    PresentationSlideSchema,
    PresentationVotingCodeSchema,
    SlideChoiceSchema,
    SlideVotingResultSchema,
} from "./schemas";
import {
    AddTextSizeIntoPresentationSlideTable1680573463021,
    ChangeDefaultValueOfTextSizeInPresentationSlideTable1681090963041,
} from "./migrations";

export const dataSourceOptions: DataSourceOptions = {
    type: "postgres",
    host: DATABASE_CONFIG.host,
    port: DATABASE_CONFIG.port,
    username: DATABASE_CONFIG.username,
    password: DATABASE_CONFIG.password,
    database: DATABASE_CONFIG.dbName,
    poolSize: 10,
    synchronize: false, // disable sync between entity class and db
    entities: [
        PresentationSchema,
        PresentationSlideSchema,
        PresentationVotingCodeSchema,
        SlideChoiceSchema,
        SlideVotingResultSchema,
    ],
    migrations: [
        AddTextSizeIntoPresentationSlideTable1680573463021,
        ChangeDefaultValueOfTextSizeInPresentationSlideTable1681090963041,
    ],
};

// It hasn't established a connection to postgres db because the `intialize()` function still wasn't be called
const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
