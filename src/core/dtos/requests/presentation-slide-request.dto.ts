import { PRESENTATION_SLIDE_TYPE } from "src/common/constants";
import { SlideChoice } from "src/core/entities";

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

export interface EditPresentationSlideChoiceDto {
    id: number;
    label: string;
    position: number;
    type: string;
    isCorrectAnswer: boolean;
    metadata: string;
}

export interface EditPresentationSlideDto {
    presentationId: number;
    presentationIdentifier: string;
    question: string;
    questionDescription: string;
    questionImageUrl: string | null;
    questionVideoEmbedUrl: string | null;
    slideType: string;
    speakerNotes: string | null;
    isActive: boolean;
    showResult: boolean;
    hideInstructionBar: boolean;
    extrasConfig: string | object | null;
    position: number;
    textSize: number;
    choices: EditPresentationSlideChoiceDto[];
}
