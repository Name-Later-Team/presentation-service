import { SlideVotingResult } from "src/core/entities";
import { EntitySchema } from "typeorm";
import { IdentifierSchemaPart } from "./base.schema";

export const SlideVotingResultSchema = new EntitySchema<SlideVotingResult>({
    name: "SlideVotingResult",
    tableName: "slide_voting_results",
    target: SlideVotingResult,
    columns: {
        ...IdentifierSchemaPart,
        slideId: { type: "integer", name: "slide_id" },
        userIdentifier: { type: "text", name: "user_identifier" },
        userDisplayName: { type: "character varying", length: 120, name: "user_display_name" },
        choiceId: { type: "integer", name: "choice_id" },
        votedAt: { type: "timestamp with time zone", createDate: true },
        presentNo: { type: "integer", name: "present_no" },
    },
    checks: [{ expression: `"slide_id" > 0` }, { expression: `"choice_id" > 0` }, { expression: `"present_no" > 0` }],
});
