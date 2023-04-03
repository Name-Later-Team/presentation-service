import { PresentationSlide } from "src/core/entities";
import { IGenericRepository } from "src/core/repositories";
import { FindManyOptions, FindOptionsWhere } from "typeorm";

export interface IPresentationSlideRepository extends IGenericRepository<PresentationSlide> {
    findManyPresentationSlidesAsync(options: FindManyOptions<PresentationSlide>): Promise<PresentationSlide[]>;
    countPresentationSlidesAsync(
        where: FindOptionsWhere<PresentationSlide> | FindOptionsWhere<PresentationSlide>[],
    ): Promise<number>;
}
