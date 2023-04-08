import { IGenericRepository } from "../repositories";

/**
 * @description Defines all basic methods of a domain service
 */
export abstract class BaseService<T> {
    constructor(private readonly _repository: IGenericRepository<T>) {}

    getManyRecordAsync(limit: number, offset: number): Promise<T[]> {
        return this._repository.getManyRecordAsync(limit, offset);
    }

    getRecordByIdAsync(id: number): Promise<T | null> {
        return this._repository.getRecordByIdAsync(id);
    }

    saveRecordAsync(entity: Partial<T>): Promise<T> {
        return this._repository.saveRecordAsync(entity);
    }

    updateRecordByIdAsync(id: number, entity: Partial<T>): Promise<any> {
        return this._repository.updateRecordByIdAsync(id, entity);
    }

    deleteRecordByIdAsync(id: number): Promise<any> {
        return this._repository.deleteRecordByIdAsync(id);
    }
}
