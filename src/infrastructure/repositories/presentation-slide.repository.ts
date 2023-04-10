import { InjectDataSource } from "@nestjs/typeorm";
import { PresentationSlide } from "src/core/entities";
import { DataSource, FindManyOptions, FindOneOptions, FindOptionsWhere } from "typeorm";
import { PresentationSlideSchema } from "../database/schemas";
import { GenericRepository } from "./generic.repository";
import { IPresentationSlideRepository } from "./interfaces";

export const PRESENTATION_SLIDE_REPO_TOKEN = Symbol("PresentationSlideRepository");

export class PresentationSlideRepository
    extends GenericRepository<PresentationSlide>
    implements IPresentationSlideRepository
{
    constructor(@InjectDataSource() private readonly _dataSource: DataSource) {
        super(_dataSource.getRepository(PresentationSlideSchema));
    }

    findManyPresentationSlidesAsync(options: FindManyOptions<PresentationSlide>): Promise<PresentationSlide[]> {
        return this._repository.find(options);
    }

    countPresentationSlidesAsync(where: FindOptionsWhere<PresentationSlide> | FindOptionsWhere<PresentationSlide>[]) {
        return this._repository.countBy(where);
    }

    findOnePresentationSlideAsync(options: FindOneOptions<PresentationSlide>) {
        return this._repository.findOne(options);
    }
}
