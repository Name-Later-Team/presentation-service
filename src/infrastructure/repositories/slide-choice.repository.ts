import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { SlideChoice } from "src/core/entities";
import { DataSource, FindManyOptions, FindOptionsWhere } from "typeorm";
import { SlideChoiceSchema } from "../database/schemas";
import { GenericRepository } from "./generic.repository";
import { ISlideChoiceRepository } from "./interfaces";
import { Common } from "src/common/utils";

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

    getChoiceWithResultAsync(
        slideId: number,
        sessionNo?: number | null,
    ): Promise<(Pick<SlideChoice, "id" | "label"> & { score: string })[]> {
        const selectFields = [`choice.id as "id"`, `choice.label as "label"`, `COUNT(result.id) AS "score"`];
        const builder = this._repository.createQueryBuilder("choice");

        // get all sessions if `sessionNo` is null
        const whereSession = Common.isNullOrUndefined(sessionNo) ? "" : `result.present_no = :sessionNo AND`;
        return builder
            .leftJoin("slide_voting_results", "result", "choice.id = result.choice_id")
            .where(`${whereSession} choice.slide_id = :slideId`, { sessionNo, slideId })
            .groupBy("choice.id, choice.label")
            .select(selectFields)
            .getRawMany<Pick<SlideChoice, "id" | "label"> & { score: string }>();
    }
}
