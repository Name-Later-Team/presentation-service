/**
 * @description Base repository interface, defines base operations that interact to the database entity
 */
export interface IGenericRepository<T> {
    getManyRecordAsync(limit: number, offset: number): Promise<T[]>;

    getRecordByIdAsync(id: number): Promise<T | null>;

    saveRecordAsync(entity: Partial<T>): Promise<T>;

    updateRecordByIdAsync(id: number, entity: Partial<T>): Promise<any>;

    deleteRecordByIdAsync(id: number): Promise<any>;
}
