import { EntitySchemaColumnOptions } from "typeorm";

export const IdentifierSchemaPart = {
	id: {
		type: Number,
		generated: true,
		primary: true,
	} as EntitySchemaColumnOptions,
};

export const TimeTrackingSchemaPart = {
	createdAt: {
		name: "created_at",
		type: "timestamp with time zone",
		createDate: true,
	} as EntitySchemaColumnOptions,
	updatedAt: {
		name: "updated_at",
		type: "timestamp with time zone",
		updateDate: true,
	} as EntitySchemaColumnOptions,
};
