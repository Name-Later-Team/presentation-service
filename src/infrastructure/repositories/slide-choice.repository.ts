import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { SlideChoice } from "src/core/entities";
import { DataSource, FindManyOptions, FindOptionsWhere } from "typeorm";
import { SlideChoiceSchema } from "../database/schemas";
import { GenericRepository } from "./generic.repository";
import { ISlideChoiceRepository } from "./interfaces";

export const SLIDE_CHOICE_REPO_TOKEN = Symbol("SlideChoiceRepository");

@Injectable()
export class SlideChoiceRepository extends GenericRepository<SlideChoice> implements ISlideChoiceRepository {
    constructor(
        @InjectDataSource()
        private readonly _dataSource: DataSource,
    ) {
        super(_dataSource.getRepository(SlideChoiceSchema));
    }

    async saveManyRecordAsync(entityList: Partial<SlideChoice>[]) {
        const queryBuilder = this._dataSource.createQueryBuilder();

        const result = await queryBuilder.insert().into(SlideChoiceSchema).values(entityList).execute();

        return result;
    }

    findManySlideChoicesAsync(options: FindManyOptions<SlideChoice>) {
        return this._repository.find(options);
    }

    deleteManySlideChoicesAsync(options: FindOptionsWhere<SlideChoice>) {
        return this._repository.delete(options);
    }

    countSlideChoicesAsync(where: FindOptionsWhere<SlideChoice> | FindOptionsWhere<SlideChoice>[]) {
        return this._repository.countBy(where);
    }
}
