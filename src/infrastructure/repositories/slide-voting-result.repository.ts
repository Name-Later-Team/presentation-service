import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { SlideVotingResult } from "src/core/entities";
import { DataSource, FindManyOptions, FindOptionsWhere } from "typeorm";
import { SlideVotingResultSchema } from "../database/schemas";
import { GenericRepository } from "./generic.repository";
import { ISlideVotingResultRepository } from "./interfaces";
import { Common } from "src/common/utils";

export const SLIDE_VOTING_RESULT_REPO_TOKEN = Symbol("SlideVotingResultRepository");

@Injectable()
export class SlideVotingResultRepository
    extends GenericRepository<SlideVotingResult>
    implements ISlideVotingResultRepository
{
    constructor(
        @InjectDataSource()
        private readonly _dataSource: DataSource,
    ) {
        super(_dataSource.getRepository(SlideVotingResultSchema));
    }

    existsByAsync(options: FindManyOptions<SlideVotingResult>) {
        return this._repository.exist(options);
    }

    deleteManySlideVotingResultsAsync(options: FindOptionsWhere<SlideVotingResult>) {
        return this._repository.delete(options);
    }

    createMultipleVotingResultsAsync(entities: Array<Partial<SlideVotingResult>>) {
        return this._repository.insert(entities);
    }

    countTotalRespondentsAsync(slideId: number, sessionNo?: number | null): Promise<{ respondents: string; }[]> {
        const selectFields = [`COUNT(DISTINCT result.user_identifier) AS "respondents"`];
        const builder = this._repository.createQueryBuilder("result");

        const whereSession = Common.isNullOrUndefined(sessionNo) ? "" : `result.present_no = :sessionNo AND`;
        return builder
            .where(`${whereSession} result.slide_id = :slideId`, { sessionNo, slideId })
            .select(selectFields)
            .getRawMany<{ respondents: string }>();
    }
}
