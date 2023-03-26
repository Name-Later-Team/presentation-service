import { IdentifierEntityPart } from "./base.entity";

export class SlideVotingResult extends IdentifierEntityPart {
    slideId: number;
    userIdentifier: string;
    userDisplayName: string;
    choiceId: number;
    votedAt: Date;
    presentNo: number;
}
