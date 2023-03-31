import { PRESENTATION_SLIDE_TYPE } from "src/common/constants";

export interface PresentationIdentifierDto {
    identifier: number | string;
}

export interface CreatePresentationSlideDto {
    type: PRESENTATION_SLIDE_TYPE;
}
