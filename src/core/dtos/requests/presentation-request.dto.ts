// defines presentaton request dtos

export interface CreatePresentationDto {
    name: string;
}

export interface FindAllPresentationsDto {
    page: number;
    limit: number;
}
