import { Presentation } from "src/core/entities";
import { IGenericRepository } from "src/core/repositories";
import { FindManyOptions, FindOneOptions, FindOptionsWhere } from "typeorm";

export interface IPresentationRepository extends IGenericRepository<Presentation> {
    countPresentations(where: FindOptionsWhere<Presentation> | FindOptionsWhere<Presentation>[]): Promise<number>;
    findManyPresentations(options: FindManyOptions<Presentation>): Promise<Presentation[]>;
    findOnePresentation(options: FindOneOptions<Presentation>): Promise<Presentation | null>;
}
