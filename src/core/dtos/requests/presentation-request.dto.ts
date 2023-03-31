// defines presentaton request dtos

export interface CreatePresentationDto {
    name: string;
}

export interface FindAllPresentationsDto {
    page: number;
    limit: number;
    order?: Record<"id" | "createdAt" | "updatedAt" | "name" | "totalSlides", "ASC" | "DESC" | undefined>;
}

export interface FindOnePresentationDto {
    identifier: number | string;
}

export interface EditBasicInfoPresentationDto {
    closedForVoting: boolean;
    name: string;
}
