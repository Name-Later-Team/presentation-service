import { PRESENTATION_SLIDE_TYPE } from "src/common/constants";

export interface PresentationIdentifierDto {
    presentationIdentifier: number | string;
}

export interface CreatePresentationSlideDto {
    type: PRESENTATION_SLIDE_TYPE;
}

export interface FindOnePresentationSlideDto {
    presentationIdentifier: number | string;
    slideId: number;
}

export type DeleteOnePresentationSlideDTO = Pick<FindOnePresentationSlideDto, "presentationIdentifier" | "slideId">;
