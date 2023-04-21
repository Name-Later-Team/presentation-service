import { PresentationSlide } from "src/core/entities";
import { IGenericRepository } from "src/core/repositories";
import { DeleteResult, FindManyOptions, FindOneOptions, FindOptionsWhere } from "typeorm";

export interface IPresentationSlideRepository extends IGenericRepository<PresentationSlide> {
    findManyPresentationSlidesAsync(options: FindManyOptions<PresentationSlide>): Promise<PresentationSlide[]>;
    countPresentationSlidesAsync(
        where: FindOptionsWhere<PresentationSlide> | FindOptionsWhere<PresentationSlide>[],
    ): Promise<number>;
    findOnePresentationSlideAsync(options: FindOneOptions<PresentationSlide>): Promise<PresentationSlide | null>;
    deleteManyPresentationSlidesAsync(options: FindOptionsWhere<PresentationSlide>): Promise<DeleteResult>;
}
