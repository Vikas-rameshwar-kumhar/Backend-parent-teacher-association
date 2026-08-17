

import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateTheTeachersTable1785240406195 implements MigrationInterface {


    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "teachers",
                columns:[
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "employee_code",
                        type: "varchar",
                        length: "20",
                        isUnique: true,
                    },
                    {
                        name: "subject",
                        type: "varchar",
                        length: "100",
                    },
                    {
                        name: "qualification",
                        type: "varchar",
                        length: "150",
                    },
                    {
                        name: "experience",
                        type: "int",
                        default: "0",
                    },
                    {
                        name: "user_id",
                        type: "int",
                        isUnique: true,
                    }
                ]
            }),
            true,
        );

        await queryRunner.createForeignKey(
            "teachers",
            new TableForeignKey({
                columnNames: ["user_id"],
                referencedTableName: "users",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            }),
            
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("teachers");

        if (table) {
            const foreignKey = table.foreignKeys.find(
                (fk) => fk.columnNames.indexOf("user_id") !== -1,
            );
            if (foreignKey) {
                await queryRunner.dropForeignKey("teachers", foreignKey);
            }
        }

        await queryRunner.dropTable("teachers");
    }
}




