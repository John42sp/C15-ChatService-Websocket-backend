import { PrimaryColumn, Column, JoinColumn, ManyToOne, UpdateDateColumn, CreateDateColumn, Entity } from "typeorm";
import { v4 as uuid } from 'uuid';
import { User } from "./User";

@Entity("connections")
class Connection {
    @PrimaryColumn()
    id: string;

    @Column()
    admin_id: string;

    @Column()
    socket_id: string;

    @JoinColumn({ name: "user_id"}) //visuaiza no insomnia lista com todos users, não visualiza no banco
    @ManyToOne(() => User)
    user: User;

    @Column() 
    user_id: string; //em cada conecção visualisa no banco apenas este user_id inserido pelo joincolumn acima

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    constructor() {             //esquema para atualização de dados, se já tiver id, não gera novo
        if(!this.id) {
            this.id = uuid();
        }
    }



}

export { Connection };