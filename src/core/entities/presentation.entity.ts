import { IdentifierTimeTrackingEntityPart } from "./base.entity";

export class PresentationPace {
    mode: string;
    active_slide_id: number;
    state: string;
    /**
     * @author Le Hoang Anh
     * @deprecated replace by `sessionNo` in the `PresentationSlide` class
     */
    counter: number;
}

export class Presentation extends IdentifierTimeTrackingEntityPart {
    name: string;
    /**
     * @type uuid
     */
    identifier: string;
    /**
     * @description creator id | uuid
     */
    ownerIdentifier: string;
    ownerDisplayName: string;
    pace: PresentationPace;
    closedForVoting: boolean;
    totalSlides: number;
}
