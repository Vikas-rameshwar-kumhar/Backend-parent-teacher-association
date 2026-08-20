
import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateRemarksTable1787199813936 implements MigrationInterface {
    
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "remarks",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "student_id",
                        type: "int",
                        isNullable: false,
                    },
                    {
                        name: "teacher_id",
                        type: "int",
                        isNullable: false,
                    },
                    {
                        name: "remark",
                        type: "text",
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
            "remarks",
            new TableForeignKey({
                columnNames: ["student_id"],
                referencedTableName: "students",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            }),
        );

        await queryRunner.createForeignKey(
            "remarks",
            new TableForeignKey({
                columnNames: ["teacher_id"],
                referencedTableName: "teachers",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("remarks");

        if (table) {
            const studentFk = table.foreignKeys.find(
                (fk) => fk.columnNames.indexOf("student_id") !== -1,
            );
            if (studentFk) {
                await queryRunner.dropForeignKey("remarks", studentFk);
            }

            const teacherFk = table.foreignKeys.find(
                (fk) => fk.columnNames.indexOf("teacher_id") !== -1,
            );
            if (teacherFk) {
                await queryRunner.dropForeignKey("remarks", teacherFk);
            }
        }

        await queryRunner.dropTable("remarks");
    }
}