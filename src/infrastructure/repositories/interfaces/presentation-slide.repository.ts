import { PresentationSlide } from "src/core/entities";
import { IGenericRepository } from "src/core/repositories";
import { FindManyOptions } from "typeorm";

export interface IPresentationSlideRepository extends IGenericRepository<PresentationSlide> {
    findMany(options: FindManyOptions<PresentationSlide>): Promise<PresentationSlide[]>;
}
