import { networkInterfaces } from "os";
import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class CreateConnections1621119759645 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable( new Table({ 
            name:"connections",
            columns: [
                {
                    name: "id",
                    type: "uuid",
                    isPrimary: true
                },
                {
                    name: "admin_id",
                    type: "uuid",
                    isNullable: true
                },
                {
                    name: "user_id",
                    type: "uuid"             
                },
                {
                    name: "socket_id",
                    type: "varchar"             //não sabemos o tipo , então definir como varchar
                },
                {
                    name: "created_at",
                    type: "timestamp",
                    default: "now()"             
                },
                {
                    name: "updated_at",  //para por exemplo, quando um admin for inserido nesse registro
                    type: "timestamp",
                    default: "now()"             
                },

            ],
            foreignKeys: [
                {
                    name: "FKConnectionUser",
                    referencedTableName: "users",
                    referencedColumnNames: ["id"],
                    columnNames:["user_id"],
                    onDelete: "SET NULL",
                    onUpdate: "SET NULL"
                }
            ]
        }));

        // await queryRunner.createForeignKey(
        //     "connections",
        //     new TableForeignKey({
        //         name: "FKConnectionUser",
        //             referencedTableName: "users",
        //             referencedColumnNames: ["id"],
        //             columnNames:["user_id"],
        //             onDelete: "SET NULL",
        //             onUpdate: "SET NULL"
        //     })
        // )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.dropForeignKey("connections", "FKConnectionUser");
        await queryRunner.dropTable("connections");
    }

}
