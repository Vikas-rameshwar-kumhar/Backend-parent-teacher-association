import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateMeetingsTable1786945085223 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "meetings",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "title",
                        type: "varchar",
                        length: "150",
                        isNullable: false,
                    },
                    {
                        name: "description",
                        type: "text",
                        isNullable: true,
                    },
                    {
                        name: "meeting_date",
                        type: "date",
                        isNullable: false,
                    },
                    {
                        name: "meeting_time",
                        type: "time",
                        isNullable: false,
                    },
                    {
                        name: "mode",
                        type: "varchar",
                        length: "20",
                        isNullable: false,
                    },
                    {
                        name: "status",
                        type: "varchar",
                        length: "20",
                        isNullable: false,
                        default: "'scheduled'",
                    },
                    {
                        name: "created_by",
                        type: "int",
                        isNullable: false,
                    },
                ],
            }),
            true,
        );

        await queryRunner.createForeignKey(
            "meetings",
            new TableForeignKey({
                columnNames: ["created_by"],
                referencedTableName: "users",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("meetings");

        if (table) {
            const createdByFk = table.foreignKeys.find(
                (fk) => fk.columnNames.indexOf("created_by") !== -1,
            );
            if (createdByFk) {
                await queryRunner.dropForeignKey("meetings", createdByFk);
            }
        }

        await queryRunner.dropTable("meetings");
    }
}