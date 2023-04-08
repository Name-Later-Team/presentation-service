import { Presentation } from "src/core/entities";
import { EntitySchema } from "typeorm";
import { IdentifierSchemaPart, TimeTrackingSchemaPart } from "./base.schema";

export const PresentationSchema = new EntitySchema<Presentation>({
    name: "Presentation",
    target: Presentation,
    tableName: "presentations",
    columns: {
        ...IdentifierSchemaPart,
        ...TimeTrackingSchemaPart,
        name: {
            type: "character varying",
            length: 100,
        },
        identifier: {
            type: "uuid",
            default: () => "uuid_generate_v4()",
        },
        ownerIdentifier: { name: "owner_identifier", type: "character varying", length: 120 },
        ownerDisplayName: { name: "owner_display_name", type: "character varying", length: 120 },
        pace: { type: "json" },

        closedForVoting: { name: "closed_for_voting", type: "boolean", default: false },

        totalSlides: { name: "total_slides", type: "smallint", default: 0 },
    },
    checks: [{ expression: `"total_slides" > -1` }],
});
