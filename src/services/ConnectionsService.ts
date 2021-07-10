import { getCustomRepository, Repository } from 'typeorm';
import { Connection } from '../entities/Connection';
import { ConnectionsRepository } from '../repositories/ConnectiosRepository';

interface IConnectionCreate { //se admin_id não vier preenchido, message partiu do user, se não, do admin
    admin_id?: string;  //?: pode ser nulo = item pode vir preenchido ou não na conversa, sempre com user_id
    socket_id: string;
    user_id: string;  
    id?: string;  //opcional
}

class ConnectionsService {
    //criando repo como atributo geral da classe, não em cada metodo.  
    private connectionsRepository: Repository<Connection>

    constructor() {
        this.connectionsRepository = getCustomRepository(ConnectionsRepository)
    }

    async create( { admin_id, socket_id, user_id, id }: IConnectionCreate ) {
        //Validação de usuario existe
        
        // const messagesRepository = getCustomRepository(MessagesRepository);

        const connection =  this.connectionsRepository.create({
            admin_id,
            socket_id,
            user_id,
            id
        });
        // keyword this referenciará como atrib classe
        await this.connectionsRepository.save(connection);

        return connection;
    }
// verificar se coneccção do mesmo usuário já existe, pra não duplicar, criar nova, executado no client.ts
    async findByUserId(user_id: string) {
        const connection = await this.connectionsRepository.findOne({
            user_id
        })
        return connection;
    }

    async findAllWithoutAdmin() { //tipo de metodo que pegara todos, não usa parametros
        const connections = await this.connectionsRepository.find({
            where: { admin_id: null },
            relations: ["user"] //user do JoinColumn no entity.
        })
        return connections;

    }

    async findBySocketId(socket_id: string) {
        const connection = await this.connectionsRepository.findOne({
            socket_id
        })
        return connection;
    }

    async updateAdminID(user_id: string, admin_id: string) { //para atrelar admin_id na conecção
       
        await this.connectionsRepository.createQueryBuilder(). 
        update(Connection) //metodo update do typeorm, recrutando entitade Setting
        .set({admin_id})//quero setar admin_id onde user_id seja o user_id em questão(do params no admin.ts)
        .where("user_id = :user_id", {  
            user_id 
        })
        .execute();
    }

}

export { ConnectionsService }