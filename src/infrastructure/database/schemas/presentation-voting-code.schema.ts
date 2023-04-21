import { PresentationVotingCode } from "src/core/entities";
import { EntitySchema } from "typeorm";
import { IdentifierSchemaPart } from "./base.schema";

export const PresentationVotingCodeSchema = new EntitySchema<PresentationVotingCode>({
    name: "PresentationVotingCode",
    tableName: "presentation_voting_codes",
    target: PresentationVotingCode,
    columns: {
        ...IdentifierSchemaPart,
        presentationIdentifier: { type: "uuid", name: "presentation_identifier" },
        code: { type: "character varying", length: 10 },
        isValid: { type: "boolean", name: "is_valid" },
        expiresAt: { type: "timestamp with time zone", default: true, name: "expires_at" },
    },
    checks: [{ expression: `"code" > 0` }],
});
