
import { MigrationInterface, QueryRunner,  Table, TableForeignKey } from "typeorm";

export class CreateAnnouncementsTable1787114365862 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "announcements",
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
                        name: "created_by",
                        type: "int",
                        isNullable: false,
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "now()",
                    },
                ],
            }),
            true,
        );

        await queryRunner.createForeignKey(
            "announcements",
            new TableForeignKey({
                columnNames: ["created_by"],
                referencedTableName: "users",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("announcements");

        if (table) {
            const createdByFk = table.foreignKeys.find(
                (fk) => fk.columnNames.indexOf("created_by") !== -1,
            );
            if (createdByFk) {
                await queryRunner.dropForeignKey("announcements", createdByFk);
            }
        }

        await queryRunner.dropTable("announcements");
    }
}