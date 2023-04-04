import { PresentationVotingCode } from "src/core/entities";
import { IGenericRepository } from "src/core/repositories";
import { FindManyOptions, FindOneOptions } from "typeorm";

export interface IPresentationVotingCodeRepository extends IGenericRepository<PresentationVotingCode> {
    findOnePresentationVotingCodeAsync(
        options: FindOneOptions<PresentationVotingCode>,
    ): Promise<PresentationVotingCode | null>;
    existsPresentationVotingCodeAsync(options: FindManyOptions<PresentationVotingCode>): Promise<boolean>;
}
