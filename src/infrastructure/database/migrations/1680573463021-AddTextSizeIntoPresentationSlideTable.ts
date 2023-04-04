import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddTextSizeIntoPresentationSlideTable1680573463021 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "presentation_slides",
            new TableColumn({
                name: "text_size",
                type: "int",
                default: 12,
                isNullable: false,
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("presentation_slides", "text_size");
    }
}
