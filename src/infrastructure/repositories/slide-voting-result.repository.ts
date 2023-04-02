import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { SlideVotingResult } from "src/core/entities";
import { DataSource } from "typeorm";
import { SlideVotingResultSchema } from "../database/schemas";
import { GenericRepository } from "./generic.repository";
import { ISlideVotingResultRepository } from "./interfaces";

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
}
