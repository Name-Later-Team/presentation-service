import { Presentation } from "src/core/entities";
import { IGenericRepository } from "src/core/repositories";

export interface IPresentationRepository extends IGenericRepository<Presentation> {
    countByUserId(userId: string): Promise<number>;
    findAllByUserId(userId: string, options: { offset?: number; limit?: number }): Promise<Presentation[]>;
}
