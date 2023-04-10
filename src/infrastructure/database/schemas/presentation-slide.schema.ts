import { PresentationSlide } from "src/core/entities";
import { EntitySchema } from "typeorm";
import { IdentifierSchemaPart, TimeTrackingSchemaPart } from "./base.schema";

export const PresentationSlideSchema = new EntitySchema<PresentationSlide>({
    name: "PresentationSlide",
    tableName: "presentation_slides",
    target: PresentationSlide,
    columns: {
        ...IdentifierSchemaPart,
        ...TimeTrackingSchemaPart,
        presentationId: { name: "presentation_id", type: "integer" },
        presentationIdentifier: { name: "presentation_identifier", type: "uuid" },
        question: { type: "character varying", length: 120, nullable: true },
        questionDescription: { type: "character varying", length: 250, nullable: true, name: "question_description" },
        questionImageUrl: { type: "text", name: "question_image_url", nullable: true },
        questionVideoEmbedUrl: { type: "text", name: "question_video_embed_url", nullable: true },
        slideType: { type: "character varying", length: 40, name: "slide_type" },
        speakerNotes: { type: "text", name: "speaker_notes", nullable: true },
        isActive: { type: "boolean", name: "is_active", default: true },
        showResult: { type: "boolean", name: "show_result", default: true },
        hideInstructionBar: { type: "boolean", name: "hide_instruction_bar", default: false },
        extrasConfig: { type: "text", name: "extras_config", nullable: true },
        position: { type: "smallint" },
        textSize: { type: "int", name: "text_size", default: 32, nullable: false },
    },
    checks: [{ expression: `"presentation_id" > 0` }],
});
