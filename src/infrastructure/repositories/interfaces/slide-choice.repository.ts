import { SlideChoice } from "src/core/entities";
import { IGenericRepository } from "src/core/repositories";
import { FindManyOptions } from "typeorm";

export interface ISlideChoiceRepository extends IGenericRepository<SlideChoice> {
    saveManyRecordAsync(entityList: Partial<SlideChoice>[]): Promise<any>;
    findManySlideChoicesAsync(options: FindManyOptions<SlideChoice>): Promise<SlideChoice[]>;
}
