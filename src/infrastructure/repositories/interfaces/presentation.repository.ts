import { Presentation } from "src/core/entities";
import { IGenericRepository } from "src/core/repositories";
import { FindOneOptions } from "typeorm";

export interface IPresentationRepository extends IGenericRepository<Presentation> {
    countByUserId(userId: string): Promise<number>;
    findAllByUserId(userId: string, options: { offset?: number; limit?: number }): Promise<Presentation[]>;
    findOne(options: FindOneOptions<Presentation>): Promise<Presentation | null>;
}
