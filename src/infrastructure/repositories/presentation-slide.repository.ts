import { InjectDataSource } from "@nestjs/typeorm";
import { PresentationSlide } from "src/core/entities";
import { DataSource, FindManyOptions } from "typeorm";
import { PresentationSlideSchema } from "../database/schemas";
import { GenericRepository } from "./generic.repository";
import { IPresentationSlideRepository } from "./interfaces";

export const PRESENTATION_SLIDE_REPO_TOKEN = Symbol("PresentationRepository");

export class PresentationSlideRepository
    extends GenericRepository<PresentationSlide>
    implements IPresentationSlideRepository
{
    constructor(@InjectDataSource() private readonly _dataSource: DataSource) {
        super(_dataSource.getRepository(PresentationSlideSchema));
    }

    findMany(options: FindManyOptions<PresentationSlide>): Promise<PresentationSlide[]> {
        return this._repository.find(options);
    }
}