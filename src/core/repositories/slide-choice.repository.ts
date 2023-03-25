import { SlideChoice } from "../entities";
import { IGenericRepository } from "./generic.repository";

export interface ISlideChoiceRepository extends IGenericRepository<SlideChoice> {
    saveManyRecordAsync(entityList: Partial<SlideChoice>[]): Promise<any>;
}
