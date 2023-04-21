import { IdentifierEntityPart } from "./base.entity";

export class PresentationVotingCode extends IdentifierEntityPart {
    /**
     * @type uuid
     */
    presentationIdentifier: string;
    code: string;
    isValid: boolean;
    expiresAt: Date;
}
