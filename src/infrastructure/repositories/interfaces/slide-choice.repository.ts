import { SlideChoice } from "src/core/entities";
import { IGenericRepository } from "src/core/repositories";
import { DeleteResult, FindManyOptions, FindOptionsWhere } from "typeorm";

export interface ISlideChoiceRepository extends IGenericRepository<SlideChoice> {
    saveManyRecordAsync(entityList: Partial<SlideChoice>[]): Promise<any>;
    findManySlideChoicesAsync(options: FindManyOptions<SlideChoice>): Promise<SlideChoice[]>;
    deleteManySlideChoicesAsync(options: FindOptionsWhere<SlideChoice>): Promise<DeleteResult>;
    countSlideChoicesAsync(where: FindOptionsWhere<SlideChoice> | FindOptionsWhere<SlideChoice>[]): Promise<number>;
}
