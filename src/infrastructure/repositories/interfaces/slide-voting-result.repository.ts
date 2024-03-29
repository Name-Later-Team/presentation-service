import { SlideVotingResult } from "src/core/entities";
import { IGenericRepository } from "src/core/repositories";
import { DeleteResult, FindManyOptions, FindOptionsWhere, InsertResult } from "typeorm";

export interface ISlideVotingResultRepository extends IGenericRepository<SlideVotingResult> {
    existsByAsync(options: FindManyOptions<SlideVotingResult>): Promise<boolean>;
    deleteManySlideVotingResultsAsync(options: FindOptionsWhere<SlideVotingResult>): Promise<DeleteResult>;
    createMultipleVotingResultsAsync(entities: Array<Partial<SlideVotingResult>>): Promise<InsertResult>;

    countTotalRespondentsAsync(slideId: number, sessionNo?: number | null): Promise<{ respondents: string }[]>;
}
