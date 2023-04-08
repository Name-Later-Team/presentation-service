import { IdentifierTimeTrackingEntityPart } from "./base.entity";

export class PresentationSlide extends IdentifierTimeTrackingEntityPart {
    presentationId: number;
    /**
     * @type uuid
     */
    presentationIdentifier: string;
    question: string;
    questionDescription: string;
    questionImageUrl: string;
    questionVideoEmbedUrl: string;
    slideType: string;
    speakerNotes: string;
    isActive: boolean;
    showResult: boolean;
    hideInstructionBar: boolean;
    extrasConfig: string;
    position: number;
    textSize: number;
}
