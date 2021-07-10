import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateMessages1621000485056 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "messages",
            columns: [
                {
                    name: "id",    //a menssagem em si
                    type: "uuid",
                    isPrimary: true
                },
                {
                    name: "admin_id", //representando o atendimento ao usuário
                    type: "uuid",
                    isNullable: true  //pode ser que usuárioainda não esteja em atendimento                
                },
                {
                    name: "user_id",  //quem é o usuário
                    type: "uuid"                  
                },
                {
                    name: "text",  
                    type: "varchar"                  
                },
                {
                    name: "created_at",
                    type: "timestamp",
                    default: "now()"
                },

            ],
            foreignKeys: [
                {
                    name: "FKUser",
                    referencedTableName: "users",
                    referencedColumnNames: ["id"],
                    columnNames:["user_id"],
                    onDelete: "SET NULL",
                    onUpdate: "SET NULL"
                }
            ]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("messages")
    }

}
