import { Entity, CreateDateColumn, PrimaryColumn, Column } from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity("users")
class User {
    @PrimaryColumn()
    id: string;

    @Column()
    email: string;

    @CreateDateColumn()
    created_at: Date;

    constructor() {             //esquema para atualização de dados, se já tiver id, não gera novo
        if(!this.id) {
            this.id = uuid();
        }
    }

}

export { User }