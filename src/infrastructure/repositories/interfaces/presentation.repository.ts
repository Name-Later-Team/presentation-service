import { Presentation } from "src/core/entities";
import { IGenericRepository } from "src/core/repositories";
import { FindManyOptions, FindOneOptions, FindOptionsWhere } from "typeorm";

export interface IPresentationRepository extends IGenericRepository<Presentation> {
    countBy(where: FindOptionsWhere<Presentation> | FindOptionsWhere<Presentation>[]): Promise<number>;
    findMany(options: FindManyOptions<Presentation>): Promise<Presentation[]>;
    findOne(options: FindOneOptions<Presentation>): Promise<Presentation | null>;
}
