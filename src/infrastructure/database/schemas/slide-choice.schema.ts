import { SlideChoice } from "src/core/entities";
import { EntitySchema } from "typeorm";
import { IdentifierSchemaPart } from "./base.schema";

export const SlideChoiceSchema = new EntitySchema<SlideChoice>({
    name: "SlideChoice",
    tableName: "slide_choices",
    target: SlideChoice,
    columns: {
        ...IdentifierSchemaPart,
        label: { type: "character varying", length: 150 },
        position: { type: "smallint" },
        slideId: { type: "integer", name: "slide_id" },
        type: { type: "character varying", length: 40 },
        isCorrectAnswer: { type: "boolean", name: "is_correct_answer", default: false },
        metadata: { type: "text" },
    },
    checks: [{ expression: `"position" > -1` }, { expression: `"slide_id" > 0` }],
});
