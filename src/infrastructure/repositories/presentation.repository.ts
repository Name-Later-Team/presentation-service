import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { Presentation } from "src/core/entities";
import { IPresentationRepository } from "src/core/repositories";
import { DataSource } from "typeorm";
import { PresentationSchema } from "../database/schemas";
import { GenericRepository } from "./generic.repository";

export const PRESENTATION_REPOSITORY_TOKEN = Symbol("PresentationRepository");

@Injectable()
export class PresentationRepository extends GenericRepository<Presentation> implements IPresentationRepository {
	constructor(
		@InjectDataSource()
		private readonly _dataSource: DataSource,
	) {
		super(_dataSource.getRepository(PresentationSchema));
	}
}
