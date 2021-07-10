import { Entity, CreateDateColumn, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { User } from './User';

@Entity("messages")
class Message {
    @PrimaryColumn()
    id: string;

    @Column()
    admin_id: string;   

    @Column()
    text: string;

    @JoinColumn({ name: 'user_id'}) //user_id here will be the next column just below
    @ManyToOne(() => User)
    user: User;   //user indicado nas relations

    @Column()
    user_id: string;

    @CreateDateColumn()
    created_at: Date;

    constructor() {             //esquema para atualização de dados, se já tiver id, não gera novo
        if(!this.id) {
            this.id = uuid();
        }
    }

}

export { Message }