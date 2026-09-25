import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateTeacherAddressesTable1790158616223 implements MigrationInterface {


    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "teacher_addresses",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "teacher_id",
                        type: "int",
                        isNullable: false,
                        isUnique: true,
                    },
                    {
                        name: "address",
                        type: "varchar",
                        length: "255",
                        isNullable: false,
                    },
                    {
                        name: "pin_code",
                        type: "int",
                        isNullable: false,
                    },
                ],
            }),
            true,
        );

        await queryRunner.createForeignKey(
            "teacher_addresses",
            new TableForeignKey({
                columnNames: ["teacher_id"],
                referencedTableName: "teachers",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("teacher_addresses");

        if (table) {
            const fk = table.foreignKeys.find(
                (fk) => fk.columnNames.indexOf("teacher_id") !== -1,
            );
            if (fk) {
                await queryRunner.dropForeignKey("teacher_addresses", fk);
            }
        }

        await queryRunner.dropTable("teacher_addresses");
    }
}
