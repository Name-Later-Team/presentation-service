import { SlideVotingResult } from "src/core/entities";
import { IGenericRepository } from "src/core/repositories";
import { DeleteResult, FindManyOptions, FindOptionsWhere } from "typeorm";

export interface ISlideVotingResultRepository extends IGenericRepository<SlideVotingResult> {
    existsByAsync(options: FindManyOptions<SlideVotingResult>): Promise<boolean>;
    deleteManySlideVotingResultsAsync(options: FindOptionsWhere<SlideVotingResult>): Promise<DeleteResult>;
}
