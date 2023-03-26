import { InjectDataSource } from "@nestjs/typeorm";
import { PresentationSlide } from "src/core/entities";
import { IPresentationSlideRepository } from "src/core/repositories";
import { DataSource } from "typeorm";
import { PresentationSlideSchema } from "../database/schemas";
import { GenericRepository } from "./generic.repository";

export const PRESENTATION_SLIDE_REPO_TOKEN = Symbol("PresentationRepository");

export class PresentationSlideRepository
    extends GenericRepository<PresentationSlide>
    implements IPresentationSlideRepository
{
    constructor(@InjectDataSource() private readonly _dataSource: DataSource) {
        super(_dataSource.getRepository(PresentationSlideSchema));
    }
}
