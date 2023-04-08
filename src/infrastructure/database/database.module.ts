import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { dataSourceOptions } from "./data-source.config";

@Module({
    imports: [TypeOrmModule.forRoot(dataSourceOptions)],
    exports: [],
})
export class DatabaseModule {}
