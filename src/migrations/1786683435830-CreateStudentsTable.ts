import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateStudentsTable1786683435830 implements MigrationInterface {


    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "students",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "student_name",
                        type: "varchar",
                        length: "100",
                    },
                    {
                        name: "class",
                        type: "varchar",
                        length: "20",
                    },
                    {
                        name: "section",
                        type: "varchar",
                        length: "10",
                    },
                    {
                        name: "roll_number",
                        type: "varchar",
                        length: "20",
                        isUnique: true,
                    },
                    {
                        name: "dob",
                        type: "date",
                    },
                    {
                        name: "gender",
                        type: "varchar",
                        length: "10",
                    },
                    {
                        name: "teacher_id",
                        type: "int",
                    },
                    {
                        name: "parent_id",
                        type: "int",
                    },
                    {
                        name: "status",
                        type: "varchar",
                        length: "20",
                        default: "'active'",
                    },
                ],
            }),
            true,
        );

        await queryRunner.createForeignKey(
            "students",
            new TableForeignKey({
                columnNames: ["teacher_id"],
                referencedTableName: "teachers",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            }),
        );

        await queryRunner.createForeignKey(
            "students",
            new TableForeignKey({
                columnNames: ["parent_id"],
                referencedTableName: "parents",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("students");

        if (table) {
            const teacherFk = table.foreignKeys.find(
                (fk) => fk.columnNames.indexOf("teacher_id") !== -1,
            );
            if (teacherFk) {
                await queryRunner.dropForeignKey("students", teacherFk);
            }

            const parentFk = table.foreignKeys.find(
                (fk) => fk.columnNames.indexOf("parent_id") !== -1,
            );
            if (parentFk) {
                await queryRunner.dropForeignKey("students", parentFk);
            }
        }

        await queryRunner.dropTable("students");
    }
}