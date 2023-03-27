import { Presentation } from "../entities";
import { IGenericRepository } from "./generic.repository";

export interface IPresentationRepository extends IGenericRepository<Presentation> {
    countByUserId(userId: string): Promise<number>;
    findAllByUserId(userId: string, options: { offset?: number; limit?: number }): Promise<Presentation[]>;
}
