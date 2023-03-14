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
		seriesId: {
			type: "uuid",
			name: "series_id",
			default: () => "gen_random_uuid()",
		},
		voteKey: { name: "vote_key", type: "text" },
		ownerId: { name: "owner_id", type: "integer" },

		ownerDisplayName: { name: "owner_display_name", type: "character varying", length: 120 },

		pace: { name: "pace", type: "text" },

		closedForVoting: { name: "closed_for_voting", type: "boolean", default: false },

		slideCount: { name: "slide_count", type: "integer", default: 0 },
	},
});
