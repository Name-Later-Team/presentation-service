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

    countPresentations(where: FindOptionsWhere<Presentation> | FindOptionsWhere<Presentation>[]) {
        return this._repository.countBy(where);
    }

    findManyPresentations(options: FindManyOptions<Presentation>) {
        return this._repository.find(options);
    }

    findOnePresentation(options: FindOneOptions<Presentation>) {
        return this._repository.findOne(options);
    }
}
