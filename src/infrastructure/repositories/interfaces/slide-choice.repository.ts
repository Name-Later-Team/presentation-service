import { SlideChoice } from "src/core/entities";
import { IGenericRepository } from "src/core/repositories";

export interface ISlideChoiceRepository extends IGenericRepository<SlideChoice> {
    saveManyRecordAsync(entityList: Partial<SlideChoice>[]): Promise<any>;
}
