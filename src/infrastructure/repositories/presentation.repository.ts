import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { Presentation } from "src/core/entities";
import { DataSource, FindManyOptions, FindOneOptions, FindOptionsWhere } from "typeorm";
import { PresentationSchema } from "../database/schemas";
import { GenericRepository } from "./generic.repository";
import { IPresentationRepository } from "./interfaces";

export const PRESENTATION_REPO_TOKEN = Symbol("PresentationRepository");

@Injectable()
export class PresentationRepository extends GenericRepository<Presentation> implements IPresentationRepository {
    constructor(
        @InjectDataSource()
        private readonly _dataSource: DataSource,
    ) {
        super(_dataSource.getRepository(PresentationSchema));
    }

    countBy(where: FindOptionsWhere<Presentation> | FindOptionsWhere<Presentation>[]) {
        return this._repository.countBy(where);
    }

    findMany(options: FindManyOptions<Presentation>) {
        return this._repository.find(options);
    }

    findOne(options: FindOneOptions<Presentation>) {
        return this._repository.findOne(options);
    }
}
