import { IdentifierEntityPart } from "./base.entity";

export class SlideChoice extends IdentifierEntityPart {
    label: string;
    position: number;
    slideId: number;
    type: string;
    isCorrectAnswer: boolean;
    metadata: string;
}
