import { InjectDataSource } from "@nestjs/typeorm";
import { PresentationVotingCode } from "src/core/entities";
import { DataSource } from "typeorm";
import { PresentationVotingCodeSchema } from "../database/schemas";
import { GenericRepository } from "./generic.repository";
import { IPresentationVotingCodeRepository } from "./interfaces";

export const PRESENTATION_VOTING_CODE_REPO_TOKEN = Symbol("PresentationVotingCodeRepository");

export class PresentationVotingCodeRepository
    extends GenericRepository<PresentationVotingCode>
    implements IPresentationVotingCodeRepository
{
    constructor(@InjectDataSource() private readonly _dataSource: DataSource) {
        super(_dataSource.getRepository(PresentationVotingCodeSchema));
    }
}
