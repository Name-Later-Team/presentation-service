import { PresentationVotingCode } from "src/core/entities";
import { IGenericRepository } from "src/core/repositories";
import { DeleteResult, FindManyOptions, FindOneOptions, FindOptionsWhere } from "typeorm";

export interface IPresentationVotingCodeRepository extends IGenericRepository<PresentationVotingCode> {
    findOnePresentationVotingCodeAsync(
        options: FindOneOptions<PresentationVotingCode>,
    ): Promise<PresentationVotingCode | null>;
    existsPresentationVotingCodeAsync(options: FindManyOptions<PresentationVotingCode>): Promise<boolean>;
    deleteManyVotingCodesAsync(options: FindOptionsWhere<PresentationVotingCode>): Promise<DeleteResult>;
}
