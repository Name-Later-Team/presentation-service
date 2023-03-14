/**
 * @description Base repository interface, defines base operations that interact to the database entity
 */
export interface IGenericRepository<T> {
	getAllRecordsAsync(): Promise<T[]>;

	getRecordByIdAsync(id: string | number): Promise<T | null>;

	saveRecordAsync(entity: Partial<T>): Promise<T>;

	updateRecordByIdAsync(id: string | number, entity: Partial<T>): Promise<any>;

	deleteRecordByIdAsync(id: string | number): Promise<any>;
}
