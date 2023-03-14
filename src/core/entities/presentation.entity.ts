import { IdentifierTimeTrackingEntityPart } from "./base.entity";

export type PresentationPaceScope = "public" | "group";

export class PresentationPace {
	mode: string;
	active: string;
	state: string;
	counter: number;
	scope: PresentationPaceScope;
	groupId: number | null;
}

export class Presentation extends IdentifierTimeTrackingEntityPart {
	name: string;

	seriesId: string;

	voteKey: string;

	ownerId: number;

	ownerDisplayName: string;

	pace: PresentationPace;

	closedForVoting: boolean;

	slideCount: number;
}
