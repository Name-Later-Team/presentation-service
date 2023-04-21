import { IGenericRepository } from "src/core/repositories";
import { ObjectLiteral, Repository } from "typeorm";

// https://medium.com/@niteshsinghal85/reducing-code-with-generic-repository-pattern-in-asp-net-core-api-ba611f7c4ab2

/**
 * @description This class is an implementation of core genereic repository
 */
export abstract class GenericRepository<T extends ObjectLiteral> implements IGenericRepository<T> {
    constructor(protected readonly _repository: Repository<T>) {}

    getManyRecordAsync(limit: number, offset: number): Promise<T[]> {
        return this._repository.find({ skip: offset, take: limit });
    }

    getRecordByIdAsync(id: number): Promise<T | null> {
        return this._repository.createQueryBuilder().where({ id }).getOne();
    }

    saveRecordAsync(entity: Partial<T>): Promise<T> {
        return this._repository.save(entity as T);
    }

    updateRecordByIdAsync(id: number, entity: Partial<T>) {
        return this._repository.update(id, entity);
    }

    deleteRecordByIdAsync(id: number) {
        return this._repository.delete(id);
    }

    executeRawQueryAsync(query: string, parameters?: any[]) {
        return this._repository.query(query, parameters);
    }
}
