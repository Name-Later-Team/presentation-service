import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { SlideChoice } from "src/core/entities";
import { ISlideChoiceRepository } from "src/core/repositories";
import { DataSource } from "typeorm";
import { SlideChoiceSchema } from "../database/schemas";
import { GenericRepository } from "./generic.repository";

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
}
