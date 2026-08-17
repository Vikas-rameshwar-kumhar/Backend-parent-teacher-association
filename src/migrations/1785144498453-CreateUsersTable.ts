import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUsersTable1785144498453 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "users",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "name",
                        type: "varchar",
                        length: "100",
                        isNullable: false,
                    },
                    {
                        name: "email",
                        type: "varchar",
                        length: "150",
                        isNullable: false,
                        isUnique: true,
                    },
                    {
                        name: "phone",
                        type: "varchar",
                        length: "15",
                        isNullable: false,
                    },
                    {
                        name: "password",
                        type: "varchar",
                        length: "255",
                        isNullable: false,
                    },
                    {
                        name: "role",
                        type: "varchar",
                        length: "20",
                        isNullable: false,
                    },
                    {
                        name: "status",
                        type: "varchar",
                        length: "20",
                        isNullable: false,
                        default: "'active'",
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "now()",
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "now()",
                    },
                ],
            }),
            true, // ifNotExists
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("users");
    }
}