import { IdentifierTimeTrackingEntityPart } from "./base.entity";

export class PresentationSlide extends IdentifierTimeTrackingEntityPart {
    presentationId: number;
    /**
     * @type uuid
     */
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
    extrasConfig: string | null;
    position: number;
    textSize: number;
    sessionNo: number;
}
