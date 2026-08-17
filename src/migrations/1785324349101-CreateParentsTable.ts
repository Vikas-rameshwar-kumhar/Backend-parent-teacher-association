// import { MigrationInterface, QueryRunner } from "typeorm";
import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateParentsTable1785324349101 implements MigrationInterface {


    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "parents",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "occupation",
                        type: "varchar",
                        length: "100",
                    },
                    {
                        name: "address",
                        type: "varchar",
                        length: "255",
                    },
                    {
                        name: "relation",
                        type: "varchar",
                        length: "20",
                    },
                    {
                        name: "user_id",
                        type: "int",
                        isUnique: true,
                    },
                ],
            }),
            true,
        );

        await queryRunner.createForeignKey(
            "parents",
            new TableForeignKey({
                columnNames: ["user_id"],
                referencedTableName: "users",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("parents");
        if (table) {

            const foreignKey = table.foreignKeys.find(
                (fk) => fk.columnNames.indexOf("user_id") !== -1,
            );
        
            if (foreignKey) {
            
                await queryRunner.dropForeignKey("parents", foreignKey);
            }
        }
        await queryRunner.dropTable("parents");
    }
}
