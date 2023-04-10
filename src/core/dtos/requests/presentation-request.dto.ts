// defines presentaton request dtos

import { PresentPresentationActionEnum } from "src/core/types";

export interface CreatePresentationDto {
    name: string;
}

export interface FindAllPresentationsDto {
    page: number;
    limit: number;
    order?: Record<"createdAt" | "updatedAt" | "name" | "totalSlides", "ASC" | "DESC" | undefined>;
}

export interface FindOnePresentationDto {
    identifier: number | string;
}

export interface EditBasicInfoPresentationDto {
    closedForVoting: boolean;
    name: string;
}

export interface PresentPresentationSlideDto {
    slideId: number | null;
    action: PresentPresentationActionEnum;
}
