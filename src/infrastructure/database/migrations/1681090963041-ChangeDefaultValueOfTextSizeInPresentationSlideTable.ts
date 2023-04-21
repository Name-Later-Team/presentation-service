import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class ChangeDefaultValueOfTextSizeInPresentationSlideTable1681090963041 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.changeColumn(
            "presentation_slides",
            "text_size",
            new TableColumn({
                name: "text_size",
                type: "int",
                default: 32,
                isNullable: false,
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.changeColumn(
            "presentation_slides",
            "text_size",
            new TableColumn({
                name: "text_size",
                type: "int",
                default: 12,
                isNullable: false,
            }),
        );
    }
}
