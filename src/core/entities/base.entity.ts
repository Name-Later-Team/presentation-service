export class IdentifierEntityPart {
	id: string | number;
}

export class TimeTrackingEntityPart {
	createdAt: Date;

	updatedAt: Date;
}

export class IdentifierTimeTrackingEntityPart extends IdentifierEntityPart {
	createdAt: Date;

	updatedAt: Date;
}
