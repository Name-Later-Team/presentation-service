import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddSessionNoColumnIntoPresentationSlideTable1681576295077 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "presentation_slides",
            new TableColumn({
                name: "session_no",
                type: "int",
                default: 1,
                isNullable: false,
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("presentation_slides", "session_no");
    }
}
